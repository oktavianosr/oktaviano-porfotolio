import { useState } from 'react'
import '@/styles/global.css'
import { GuestGate } from './components/GuestGate'
import { VisitorData } from './types'


function App() {
  const [count, setCount] = useState(0)

  const {hasVisited, isLoading, saveVisitor} = useVisitor()

  //Handler setelah submit berhasil
  const handleEnter = (data: VisitorData): void => {
    saveVisitor(data)
  }

  return (  
    <>Hai</>
    <GuestGate onEnter={handleEnter}/>
  )
}

export default App
