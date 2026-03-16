//Props Type
// Mendefinisikan apa yang harus diberikan oleh parent component

import type { VisitorData, FormStatus } from "@/types";
import { useEffect, useRef, useState } from "react";


interface GuestGateProps {
    // Callback function yang dipanggil setelah visitor berhasil submit
    // Parent (App.tsx) yang memutuskan apa yang    terjadi  setelahnya
    onEnter: (data: VisitorData) => void    
}

// ===================================
// BOOT MESSAGES
// Pesan-pesan loading ala terminal yang muncul saat pertama load

const BOOT_MESSAGES: readonly string[] = [
    'INITIALIZING SYSTEM...',
    'LOADING PORTOFOLIO V1.0...',
    'CHECKING VISITOR DATABASE...',
    'ESTABLISHING CONNECTION...',
    'READY.',
] as const // "as const" membuat array ini menjadi readonly tuple - nilainya tidak bisa diubah

// =======================================
// Component
// =======================================

export function GuestGate({ onEnter }: GuestGateProps) {
    // STATE
    const [name, setName]           = useState<string>('');
    const [email, setEmail]         = useState<string>('');
    const [status, setStatus]       = useState<FormStatus>('idle');
    const [errorMsg, setErrorMsg]   = useState<string>('');

    // Boot sequence state
    const [bootLines, setBootLines]         = useState<string[]>([]); // array string
    const [bootComplete, setBootComplete]   = useState<boolean>(false);
    const [showForm, setShowForm]           = useState<boolean>(false);

    // ref untuk focues otomatis ke input name
    const nameInputRef = useRef<HTMLInputElement>(null)

    // ---- Boot Squence effect ----
    // Menampilkan BOOT_MESSAGES satu persatu dengan delay
    useEffect(() => {
        let currentIndex = 0;

        const interval = setInterval(()=> {
            if (currentIndex <BOOT_MESSAGES.length) {
                //tambahkan pesan berikutnya ke array
                // kita gunakan functional update untuk menghindari stale closure
                setBootLines(prev => [...prev, BOOT_MESSAGES[currentIndex]])
                currentIndex++;
            } else {
                // Semua pesan sudah ditampilkan
                clearInterval(interval);
                setBootComplete(true);

                //tampilkan form setelah delay singkat
                setTimeout(() => {
                    setShowForm(true)
                }, 400)
            }
        }, 300)
        return () => clearInterval(interval);
    }, [])

    // ---- Focus effect ----
    // Focus ke input name saat form muncul
    useEffect(() => {
        if (showForm && nameInputRef.current) {
            //sedikit delay agar animasi selesai dulu
            setTimeout(() => {
                nameInputRef.current?.focus()
            }, 300)
        }
    }, [showForm])

    // ----- form submission handler -----
    const handleSubmit = async (): Promise<void> => {
        // Validasi client-side sebelum kirim ke API
        if (name.trim() === '') {
            setErrorMsg('[ ERROR ] NAME FIELD CANNOT BE EMPTY')
            return
        }

        if (email !== '' && !isValidEmail(email)) {
            setErrorMsg('[ ERROR ] INVALID EMAIL FORMAT')
            return
        }

        // Bersihkan error dan set status loading
        setErrorMsg('');
        setStatus('loading');

        try {
            // Kirim ke serverless function
            const response = await fetch('/api/submit-visitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim() || undefined,
                }),
            })

            const data = await response.json() as { success: boolean; message: string}

            if (!data.success) {
                throw new Error(data.message)
            }

            // Sukses!
            setStatus("success");

            // Callback parent setelah animasi singkat
            setTimeout(()=>{
                onEnter({
                    name: name.trim(),
                    email: email.trim() || undefined,
                })
            }, 1200) // delay untuk animasi exit
        } catch (error) {
            setStatus('error');
            setErrorMsg('[ ERROR ] CONNECTION FAILEED. PLEASE TRY AGAIN.');
            console.error('GuestGate Submission Error:', error);

            // Reset status setelah beberapa detik
            setTimeout(() => setStatus('idle'), 3000)
        }
    }

    //handle enter key
    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter' && status === 'idle') {
            handleSubmit()
        }
    }

    return (
        <div 
            className={`guestgate ${showForm ? 'guestgate--ready' : ''} ${status === 'success' ? 'guestgate--exit' : }`}
            style={styles.wrapper}
            >
                {/** Background scanlines */}
                <div className="scanlines" style={styles.scanlines} />

                {/** Window Chrome */}
                <div style={styles.window} className="flicker">
                    {/**Title Bar */}
                    <div className="titlebar">
                        <span className="titlebar_title">
                            
                        </span>
                    </div>

                
            </div>
    )
    

}