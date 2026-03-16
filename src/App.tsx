import '@/styles/global.css'
import { GuestGate } from './components/GuestGate'
import { VisitorData } from './types'
import { useVisitor } from './hooks/useVisitor'
import { PixelCursor } from './components/PixelCursor'



function MainPortofolio() {
  return (
    <div style={{ padding: '40px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)'}}>
      <h1 style={{fontFamily: 'var(--font-display)', fontSize: '48px'}}>
        MAIN PORTOFOLIO
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '16px'}}>
        halaman utama 
      </p>
    </div>
  )
}


export default function App() {

  const {hasVisited, isLoading, saveVisitor} = useVisitor()

  //Handler setelah submit berhasil
  const handleEnter = (data: VisitorData): void => {
    saveVisitor(data)
  }

  return (
    <>
      <PixelCursor/>
      {isLoading ? (
        // tampilkan nothing saat masih cek localStorage
        // mencegah flash GuestGate untuk returning visitor
        null
      ):hasVisited ? (
        <MainPortofolio/>
      ): (
        <GuestGate onEnter={handleEnter}/>
      )}
    </>
  )
}
