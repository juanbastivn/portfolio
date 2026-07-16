// GamesView.tsx
import { useState, useRef, useEffect } from 'react'
import { run as runTetris } from '../games/tetris'
import type { GameRunner, GameStatus } from '../games/types'
import type { Lang } from '../types'
import styles from './GamesView.module.css'
import RoundedCard from './RoundedCard'

export interface Game {
  id: string
  label: string
  description: Record<Lang, string>
  run: GameRunner
}

// ─────────────────────────────────────────────────────────────────────────────
// Add your games here. Each entry gets a button in the selector.
// ─────────────────────────────────────────────────────────────────────────────
const GAMES: Game[] = [
  {
    id: 'tetris',
    label: 'Tetris',
    description: {
      es: 'Ordena las piezas, completa líneas y supera tu último puntaje.',
      en: 'Arrange the pieces, clear lines and beat your latest score.',
    },
    run: runTetris
  },
  // { id: 'snake', label: 'Snake', run: (canvas, ctx) => { /* ... */ return () => {} } },
]
// ─────────────────────────────────────────────────────────────────────────────

function GamesView({ onBack, onScore, lang = 'es' }: { onBack: () => void, onScore?: (score: number) => void, lang?: Lang }) {
  const [selectedGame, setSelectedGame] = useState<Game>(GAMES[0])
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<GameStatus>('playing')
  const [session, setSession] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onScoreRef = useRef(onScore)

  useEffect(() => {
    onScoreRef.current = onScore
  }, [onScore])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.focus({ preventScroll: true })
    const cleanup = selectedGame.run(canvas, ctx, {
      lang,
      onScore: (nextScore) => {
        setScore(nextScore)
        onScoreRef.current?.(nextScore)
      },
      onStatus: setStatus,
    })
    return cleanup
  }, [lang, selectedGame, session])

  const restart = () => {
    setScore(0)
    setStatus('playing')
    onScoreRef.current?.(0)
    setSession((current) => current + 1)
  }

  const statusLabel = {
    playing: lang === 'en' ? 'Playing' : 'Jugando',
    paused: lang === 'en' ? 'Paused' : 'Pausa',
    'game-over': 'Game over',
  }[status]

  return (
    <div className={styles.games}>
      <div className={styles.header}>
        <button className={`${styles.backBtn} glow-border`} onClick={onBack}>{lang === 'en' ? '← Back' : '← Volver'}</button>
        <h1 className={"text-xl"}>{lang === 'en' ? 'Games' : 'Juegos'}</h1>
        <RoundedCard label={`${lang === 'en' ? 'Score' : 'Puntaje'}: ${score}`} />
      </div>
      <div className={styles.separator} />
      {GAMES.length > 1 && (
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
      )}
      <div className={styles.gameStage}>
        <div className={styles.cabinet}>
          <div className={styles.screenLabel}>
            <span>{selectedGame.label}</span>
            <span className={`${styles.status} ${styles[status]}`}>
              <span className={styles.statusDot} />
              {statusLabel}
            </span>
          </div>
          <div className={styles.canvasWrapper}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              width={300}
              height={600}
              tabIndex={0}
              aria-label={lang === 'en' ? 'Tetris game board' : 'Tablero de Tetris'}
            />
          </div>
        </div>

        <aside className={styles.gameInfo}>
          <div>
            <p className={styles.eyebrow}>{lang === 'en' ? 'How to play' : 'Cómo jugar'}</p>
            <h2>{selectedGame.label}</h2>
            <p>{selectedGame.description[lang]}</p>
          </div>

          <dl className={styles.controls}>
            <div><dt><kbd>←</kbd><kbd>→</kbd></dt><dd>{lang === 'en' ? 'Move' : 'Mover'}</dd></div>
            <div><dt><kbd>↑</kbd></dt><dd>{lang === 'en' ? 'Rotate' : 'Girar'}</dd></div>
            <div><dt><kbd>↓</kbd></dt><dd>{lang === 'en' ? 'Lower' : 'Bajar'}</dd></div>
            <div><dt><kbd>Space</kbd></dt><dd>{lang === 'en' ? 'Drop' : 'Soltar'}</dd></div>
            <div><dt><kbd>P</kbd></dt><dd>{lang === 'en' ? 'Pause' : 'Pausa'}</dd></div>
          </dl>

          <button className={`${styles.restartBtn} glow-border`} onClick={restart}>
            {lang === 'en' ? 'Restart game' : 'Reiniciar partida'}
          </button>
        </aside>
      </div>
    </div>
  )
}

export default GamesView
