// GamesView.tsx
import { useState, useRef, useEffect } from 'react'
import { run as runTetris } from '../games/tetris'
import styles from './GamesView.module.css'
import RoundedCard from './RoundedCard'

export interface Game {
  id: string
  label: string
  // Receives canvas + 2D context. Return a cleanup fn (stop loops, remove listeners).
  run: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, onScore?: (score: number) => void) => () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Add your games here. Each entry gets a button in the selector.
// ─────────────────────────────────────────────────────────────────────────────
const GAMES: Game[] = [
  {
    id: 'tetris',
    label: 'Tetris',
    run: runTetris
  },
  // { id: 'snake', label: 'Snake', run: (canvas, ctx) => { /* ... */ return () => {} } },
]
// ─────────────────────────────────────────────────────────────────────────────

function GamesView({ onBack, onScore, initialScore = 0 }: { onBack: () => void, onScore?: (score: number) => void, initialScore?: number }) {
  const [selectedGame, setSelectedGame] = useState<Game>(GAMES[0])
  const [score, setScore] = useState(initialScore)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const cleanup = selectedGame.run(canvas, ctx, (s) => {
      setScore(s)
      onScore?.(s)
    })
    return cleanup
  }, [selectedGame])

  return (
    <div className={styles.games}>
      <div className={styles.header}>
        <button className={`${styles.gameBtn} glow-border`} onClick={onBack}>← Volver</button>
        <p className={"text-xl"}>Juegos</p>
        <RoundedCard label={`Puntaje: ${score}`} />
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
      <div className={styles.separator} />
      <div className={styles.canvasWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} width={800} height={460} />
      </div>
    </div>
  )
}

export default GamesView
