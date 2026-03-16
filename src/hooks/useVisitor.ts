// Kunci yang dipakai untuk menyimpan data di localStorage

import { StoredVisitor } from "@/types"
import { useEffect, useState } from "react"

// Menggunakan konstanta agar tidak ada typo saat dipakai berulang
const STORAGE_KEY = 'portofolio_visitor' as const

// ================================
// Return type dari hook ini
// Mendefinisikan tipe return value secara eksplisit adalalh
// best practice - membuat penggunaan hook lebih jelas
// ============================

interface UseVisitorReturn {
    visitor: StoredVisitor | null
    isLoading: boolean
    hasVisited: boolean
    saveVisitor: (data: Omit<StoredVisitor, 'visitedAt'>) => void
    clearVisitor: () => void
}

// ============================
// HOOK DEFINITION
// ============================

export function useVisitor(): UseVisitorReturn {
    //state untuk menyimpan data visitor
    // Tipe: storedVisitor | null
    // - storedVisitor -> surah pernah visit
    // - null -> belum pernah visit
    const [visitor, setVisitor] = useState<StoredVisitor | null>(null)

    //State untnuk menandai sedang membaca localStorage
    // Mencegah "flash" halaman utama sebelum cek selesai
    const [isLoading, setIsLoading] = useState<boolean>(true)

    //useEffect dengan dependency array kosong [] = jalankan sekali saat mount
    // mirip componentDidMount di class component
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)

            if (stored !== null) {
                // Data dimeukan - parse JSON dan masukkan ke state
                // JSON.parse mengembalikan tipe 'any', jadi kita cast ke storedVsitor
                const parsedData = JSON.parse(stored) as StoredVisitor
                setVisitor(parsedData) 
            }
        } catch (error) {
            // LocalStorage bisa gagal di beberapa kondisi:
            // - Browser mode private/incognito di beberapa browser
            // - localStorage penuh
            // - Data Korup (tidak valid JSON)
            // jika gagal, anggap belum pernah visit (visitor nnull)
            console.warn('Could not read visitor data from LocalStorage', error)
        } finally {
            // Selalu set isloadig ke false, berhasil atau tidak
            // finally selalu dieksekusi setelah try/catch
            setIsLoading(false)
        }
    }, [])
}
