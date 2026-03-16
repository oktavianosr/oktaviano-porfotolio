//Props Type
// Mendefinisikan apa yang harus diberikan oleh parent component

import type { VisitorData, FormStatus } from "@/types";
import { error } from "console";
import { useEffect, useRef, useState } from "react";
import { cursorTo } from "readline";


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
            className={`guestgate ${showForm ? 'guestgate--ready' : ''} ${status === 'success' ? 'guestgate--exit' : ''}`}
            style={styles.wrapper}
            >
                {/** Background scanlines */}
                <div className="scanlines" style={styles.scanlines} />

                {/** Window Chrome */}
                <div style={styles.window} className="flicker">
                    {/**Title Bar */}
                    <div className="titlebar">
                        <span className="titlebar__title">
                            PORTOFOLIO.exe - VISITOR ACCESS REQUIRED
                        </span>
                        <div className="titlebar__buttons">
                            <button className="titlebar__btn" aria-label="minimize">_</button>
                            <button className="titlebar__btn" aria-label="maximize">□</button>
                            <button className="titlebar__btn" aria-label="close">×</button>
                        </div>
                    </div>

                    {/** Window body */}
                    <div style={styles.body}>
                        {/** Boot Sequence */}
                        <div style={styles.bootSection} aria-live="polite">
                            {bootLines.map((line, index) => (
                                <div key={index} className="boot-line fade-in-up"
                                style={{
                                    ...styles.bootlline,
                                    color: line === 'READY.' ? 'var(--color-green)' : 'var(--text-secondary)',
                                }}
                                >
                                    {line === 'READY.' ? null : <span style={styles.prompt}>&gt;</span>}
                                    {line}

                                </div>
                            ))}

                            {/**Blinking Cursor saat boot belum selesai */}
                            {!bootComplete && (
                                <span className="blink" style={styles.cursor}>█</span>
                            )}
                        </div>

                        {/**Form - hanya muncul setelah boot selesai */}
                        {showForm && (
                            <div style={styles.formSection} className="fade-in-up">
                                {/**Judul Besar */}
                                <h1
                                    style={styles.title}
                                    className="glitch"
                                    data-text="WELCOME VISITOR"
                                >
                                    WELCOME VISITOR
                                </h1>
                                <p style={styles.subtitle}>&gt;&gt; identify yourself to enter &lt;&lt;</p>

                                {/**Form Fields */}
                                <div
                                    className="pixel-box"
                                    style={styles.formBox}
                                    onKeyDown={handleKeyDown}
                                >
                                    <span className="pixel-box__label">[ ACCESS REQUIRED ]</span>

                                    {/**Name Field */}
                                    <div className="field-group">
                                        <label htmlFor="visitor-name" className="field-label">
                                            &gt; YOUR NAME
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input-y2k"
                                            ref={nameInputRef}
                                            id="visitor-name"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value)
                                                setErrorMsg('')
                                            }}
                                            placeholder="type here..."
                                            maxLength={50}
                                            disabled={status === 'loading' || status === 'success'}
                                            autoComplete="off"
                                        />
                                    </div>

                                    {/**Email Field */}
                                    <div className="field-group">
                                        <label htmlFor="visitor-email" className="field-label">
                                                &gt; EMAIL
                                                <span className="field-label__optional">(optional)</span>
                                        </label>
                                        <input
                                         type="email" 
                                         className="input y2k" 
                                         id="visitor-email" 
                                         value={email}
                                         onChange={(e) => {
                                            setEmail(e.target.value)
                                            setErrorMsg('')
                                         }}
                                         placeholder="you@internet.net"
                                         maxLength={100}
                                         disabled={status === 'loading' || status === 'success'}
                                         autoComplete="email"
                                         />
                                    </div>

                                    {/**error Message */}
                                    {errorMsg && (
                                        <div className="error-msg fade-in-up" role="alert">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/**submit button */}
                                    <button
                                     className="btn-y2k btn-y2k--full"
                                     onClick={handleSubmit}
                                     disabled={status === 'loading' || status === 'success'}
                                     style={{
                                        marginTop: 'var(--space-md)',
                                        opacity: status === 'loading' ? 0.7 : 1,
                                     }}
                                    >
                                        {status === 'loading' && <span className="blink">█ </span>}
                                        {status === 'success' ? '[ ACCESS GRANTED]' : '[ ENTER SITE ]'}
                                    </button>

                                    {/**Loading Bar */}
                                    {status === 'loading' && (
                                        <div style={styles.loadingBarWrapper}>
                                            <div className="loading-bar"></div>
                                        </div>
                                    )}
                                </div>

                                {/** Visitor Counter Hardcoded Untuk estetika */}
                                <div style={styles.counter}>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                        ★ visitors since 01/01/2000:&nbsp;
                                    </span>
                                    <span style={{ color: 'var(--color-green)' }}>1,337</span>
                                    <span style={{ color: 'var(--text-muted)' }}> ★</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/** Status Bar */}
                    <div className="status-bar">
                        <span>■ RETRO.Y2K v2.0 — VISITOR PORTAL</span>
                        <span className="status-bar__online">● ONLINE</span>
                    </div>
            </div>
        </div>
    )
}

// HELPER FUNCTION

// REGEX EMAIL VALIDATION
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// INLINE STYLES

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-lg)',
        position: 'relative',
        overflow: 'hidden',
    },
    scanlines: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
    },
    window: {
        width: '100%',
        maxWidth: '480px',
        border: '1px solid var(--border-default)',
        position: 'relative',
        zIndex: 1,
    },
    body: {
        background: 'var(--bg-secondary)',
        padding: 'var(--space-xl)',
    },
    bootSection: {
        marginBottom: 'var(--space-lg)',
        minHeight: '100px',
    },
    bootLine: {
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
        lineHeight: '1.8',
        letterSpacing: '0.5px'
    },
    prompt: {
        color: 'var(--color-cyan)'
    },
    cursor: {
        color: 'var(--color-cyan)',
        fontSize: '14px',
    },
    formSection: {
        textAlign: 'center' as const,
    },
    title: {
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(28px, 8vw, 44px)',
        color: 'var(--color-cyan)',
        letterSpacing: '2px',
        lineHeight: '1',
        marginBottom: 'var(--space-sm)',
        textShadow: '2px 2px 0 #0066ff, 4px 4px 0 #003399',
    },
    subtitle: {
        fontFamily: 'var(--font-display)',
        fontSize: '16px',
        color: 'var(--font-display)',
        letterSpacing: '2px',
        lineHeight: '1',
        marginBottom: 'var(--space-sm)',
        textShadow: '2px 2px 0 #0066ff, 4px 4px 0 #003399',
    },
    formBox: {
        textAlign: 'left' as const,
        marginBottom: 'var(--space-lg)',
    },
    loadingBarWrapper: {
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        letterSpacing: '1px',
        textAlign: 'center' as const,
        marginTop: 'var(--space-md)',
    }
}