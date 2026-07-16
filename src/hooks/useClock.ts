import { useEffect, useState } from 'react'

const formatTime = () => new Date().toLocaleTimeString('es-CL', { hour12: false })

export function useClock() {
  const [time, setTime] = useState(formatTime)

  useEffect(() => {
    const update = () => setTime(formatTime())
    const interval = window.setInterval(update, 1_000)
    return () => window.clearInterval(interval)
  }, [])

  return time
}
