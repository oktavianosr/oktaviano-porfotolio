// Vercel Serverless Function
// File ini berjalan di Node.js environment di server Vercel, bukan di Browser

import type { VercelRequest, VercelResponse } from '@vercel/node'

import type { SubmitVisitorRequest, SubmitVisitorResponse } from '../src/types'

//Type Untuk notion api reponse
// di definisikan disini karena hanya dipakai di file ini
interface NotionApiResponse {
    id: string
    object: string
}

//Helper Function: kirim data ke notion
async function addVisitorToNotion(data: SubmitVisitorRequest, userAgent?: string): Promise<NotionApiResponse> {
    //ambil environment variables
    // tanda ! di akhir = "non-null assertion" - kita yakin dan harus nilai ini ada
    //jika tidak ada, function akan throw error (yang kita catch di bawah )
    const apiKey = process.env.NOTION_API_KEY!
    const databaseId = process.env.NOTION_DATABASE_ID!

    //validasi environment variables
    if (!apiKey || !databaseId) {
        throw new Error('Missing NOTION_API_KEY or NOTION_DATABASE_ID env variable')
    }

    const emailProperty = data.email && data.email.trim() !== '' ? { Email: { email: data.email.trim()}} : {}

    // Bangun request body sesuai format Notion API
    // Schema database: Name (title), Email, User Agent, Visited At
    const notionBody = {
        parent: {
            database_id: databaseId
        },
        properties: {
            // Name adalah field title (wajib)
            Name: {
                title: [
                    {
                        text: {
                            content: data.name
                        }
                    }
                ]
            },
            // Email (opsional)
            ...emailProperty,
            // User Agent - info browser visitor
            User_Agent: {
                rich_text: [
                    {
                        text: {
                            content: userAgent || 'Unknown'
                        }
                    }
                ]
            },
            // Visited At - tanggal kunjungan
            Visited_At: {
                date: {
                    start: new Date().toISOString()
                }
            }
        }
    }

    // Kirim ke Notion API
    const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(notionBody)
    })

    if (!response.ok) {
        const error = await response.json() as { message?: string; code?: string}
        throw new Error(`Notion API error: ${error.message}`)
    }

    return response.json() as Promise<NotionApiResponse>
}

// MAIN handler - handler yang dipanggil oleh vercel saat ada request
export default async function handler(
    req: VercelRequest,
    res: VercelResponse
): Promise<void> {
    // hanya mengizinkan method POST
    if (req.method !== 'POST') {
        res.status(405).json({success: false, message: 'Method not allowed'} satisfies SubmitVisitorResponse)
        return
    }

    // Ambil Data dari request body
    // req.body sudah otomatis di parse oleh Vercel (JSON)
    const body = req.body as Partial<SubmitVisitorRequest>

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        res.status(400).json({
            success: false,
            message: 'Name is required',
        } satisfies SubmitVisitorResponse)
        return
    }

    // Validasi email jika ada: harus format email yang valid
    if (body.email !== undefined && body.email !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            res.status(400).json({
                success: false,
                message: 'Invalid email format',
            } satisfies SubmitVisitorResponse)
            return
        }
    }

    // Siapkan data yang sudah divalidasi dan dibersihkan
    const visitorData: SubmitVisitorRequest = {
        name: body.name.trim(),
        // Jika email kosong maka anggap tidak ada
        email: body.email && body.email.trim() !== '' ? body.email.trim() : undefined,
    }

    const userAgent = req.headers['user-agent'] as string | undefined

    try {
        // kirim ke notion
        await addVisitorToNotion(visitorData, userAgent)

        res.status(200).json({
            success: true,
            message: 'Welcome! Enjoy Reading the Portofolio.',
        } satisfies SubmitVisitorResponse)
    } catch (error) {
        // Ggagal - Log error di server, kembalikan pesan generik ke client
        // jangan expose detail error ke client(keamanan)
        console.error('Failed to save visitor to Notion:', error)

        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.',
        } satisfies SubmitVisitorResponse)
    }   
}

