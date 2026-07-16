import type { Lang } from '../types'

export type GameStatus = 'playing' | 'paused' | 'game-over'

export interface GameRuntimeOptions {
  lang: Lang
  onScore: (score: number) => void
  onStatus: (status: GameStatus) => void
}

export type GameRunner = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  options: GameRuntimeOptions,
) => () => void
