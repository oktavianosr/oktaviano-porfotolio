import { useCallback, useEffect, useState } from "react"

interface CursorPosition {
    x: number
    y: number
}

export function PixelCursor() {
    const [position, setPosition]   = useState<CursorPosition>({x: -100, y: -100})
    const [isClicking, setIsClicking]   = useState<boolean>(false)
    const [isHovering, setIsHovering]   = useState<boolean>(false)

    // UseCallback memoisasi function agar tidak dibuat ulang setiap render
    // Berguna saat function dipakai sebagai event listener
    const handleMouseMove = useCallback((e: MouseEvent): void => {
        setPosition({ x: e.clientX, y: e.clientY })
    }, [])

    const handleMouseDown = useCallback((): void => {
        setIsClicking(true)
    }, [])

    const handleMouseUp = useCallback((): void => {
        setIsClicking(false)
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)

        // deteksi hover diatas elemen yang bisa di klik
        const handleMouseOver = (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            const isClickable = Boolean(
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]') ||
                target.closest('input') ||
                target.closest('textarea')
            )
            setIsHovering(isClickable)
        }

        window.addEventListener('mouseover', handleMouseOver)

        // Cleanup: hapus semua listener saat unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [handleMouseMove, handleMouseDown, handleMouseUp])

    const color = isClicking
        ? 'var(--color-yellow)' : isHovering ? 'var(--color-magenta)' : 'var(--color-cyan)'

    const size = isClicking ? 10 : 14

  return (
    <div
      aria-hidden="true"  // sembunyikan dari screen reader
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        pointerEvents: 'none',  // jangan ganggu click event di bawahnya
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        transition: 'width 100ms, height 100ms, color 100ms',
      }}
    >
      {/* SVG crosshair cursor */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Garis horizontal */}
        <line x1="0" y1="7" x2="5" y2="7" stroke={color} strokeWidth="1.5" />
        <line x1="9" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1.5" />
        {/* Garis vertikal */}
        <line x1="7" y1="0" x2="7" y2="5" stroke={color} strokeWidth="1.5" />
        <line x1="7" y1="9" x2="7" y2="14" stroke={color} strokeWidth="1.5" />
        {/* Titik tengah */}
        <rect x="6" y="6" width="2" height="2" fill={color} />
      </svg>
    </div>
  )
}