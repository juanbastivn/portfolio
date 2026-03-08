// GamesView.tsx
import { useState, useRef, useEffect } from 'react'
import styles from './GamesView.module.css'

export interface Game {
  id: string
  label: string
  // Receives canvas + 2D context. Return a cleanup fn (stop loops, remove listeners).
  run: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Add your games here. Each entry gets a button in the selector.
// ─────────────────────────────────────────────────────────────────────────────
const GAMES: Game[] = [
  {
    id: 'demo',
    label: 'Demo',
    run: (_canvas, ctx) => {
      ctx.clearRect(0, 0, _canvas.width, _canvas.height)
      ctx.fillStyle = '#75ffba'
      ctx.font = 'bold 1.8rem monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = '#43ffa1'
      ctx.shadowBlur = 18
      ctx.fillText('Tu juego aquí', _canvas.width / 2, _canvas.height / 2)
      return () => {}
    },
  },
  // { id: 'snake', label: 'Snake', run: (canvas, ctx) => { /* ... */ return () => {} } },
]
// ─────────────────────────────────────────────────────────────────────────────

function GamesView({ onBack }: { onBack: () => void }) {
  const [selectedGame, setSelectedGame] = useState<Game>(GAMES[0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const cleanup = selectedGame.run(canvas, ctx)
    return cleanup
  }, [selectedGame])

  return (
    <div className={styles.games}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <h2 className={styles.title}>Games</h2>
      </div>
      <div className={styles.separator} />
      <div className={styles.selector}>
        {GAMES.map(game => (
          <button
            key={game.id}
            className={`${styles.gameBtn} ${selectedGame.id === game.id ? styles.gameBtnActive : ''} glow-border`}
            onClick={() => setSelectedGame(game)}
          >
            {game.label}
          </button>
        ))}
      </div>
      <div className={styles.canvasWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} width={800} height={460} />
      </div>
    </div>
  )
}

export default GamesView
