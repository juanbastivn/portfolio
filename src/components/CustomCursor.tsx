// CustomCursor.tsx
import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

interface Ripple {
  id: number
  x: number
  y: number
}

function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleId = useRef(0)

  useEffect(() => {
    let ringX = 0, ringY = 0
    let curX  = 0, curY  = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      curX = e.clientX
      curY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${curX}px, ${curY}px)`
      }
    }

    const tick = () => {
      ringX += (curX - ringX) * 0.12
      ringY += (curY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    const onClick = (e: MouseEvent) => {
      const id = rippleId.current++
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id))
      }, 700)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
      {ripples.map(r => (
        <div
          key={r.id}
          className={styles.ripple}
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </>
  )
}

export default CustomCursor
