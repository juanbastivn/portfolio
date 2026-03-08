// src/games/tetris.ts
const BLOCK = 30
const COLS  = 10
const ROWS  = 20
const W = BLOCK * COLS
const H = BLOCK * ROWS

const pieces = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
]

function drawBlock(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const x = col * BLOCK
  const y = row * BLOCK
  // base glass
  ctx.fillStyle = 'rgb(74, 255, 165)'
  ctx.fillRect(x + 1, y + 1, BLOCK - 2, BLOCK - 2)
  // borde interno
  ctx.strokeStyle = 'rgba(117, 255, 186, 0.8)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(x + 2, y + 2, BLOCK - 4, BLOCK - 4)
  // brillo superior
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.fillRect(x + 3, y + 3, BLOCK - 6, 7)
}

function checkCollision(piece: { shape: number[][], row: number, col: number }, board: number[][]) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const boardRow = piece.row + r
        const boardCol = piece.col + c
        if (boardRow >= ROWS || boardCol < 0 || boardCol >= COLS || board[boardRow]?.[boardCol]) {
          return true
        }
      }
    }
  }
  return false
}

export function run(
  canvas: HTMLCanvasElement,
  _ctx: CanvasRenderingContext2D,
  onScore?: (score: number) => void
): () => void {
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  let running = true
  let gameOver = false

  const board: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0))

  let piece = { shape: pieces[Math.floor(Math.random() * pieces.length)], row: 0, col: 3 }
  let score = 0
  let dropCounter = 0
  const dropInterval = 700
  let lastTime = 0

  const clearLines = () => {
    let linesCleared = 0
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every(cell => cell)) {
        board.splice(r, 1)
        board.unshift(Array(COLS).fill(0))
        linesCleared++
        r++
      }
    }
    if (linesCleared > 0) {
      score += ([0, 100, 300, 500, 800][linesCleared] ?? 800)
      onScore?.(score)
    }
  }

  const spawnPiece = () => {
    piece = { shape: pieces[Math.floor(Math.random() * pieces.length)], row: 0, col: 3 }
    if (checkCollision(piece, board)) gameOver = true
  }

  const update = (deltaTime: number) => {
    if (gameOver) return
    dropCounter += deltaTime
    if (dropCounter > dropInterval) {
      piece.row++
      if (checkCollision(piece, board)) {
        piece.row--
        piece.shape.forEach((row, r) => row.forEach((cell, c) => {
          if (cell) board[piece.row + r][piece.col + c] = 1
        }))
        clearLines()
        spawnPiece()
      }
      dropCounter = 0
    }
  }

  const draw = () => {
    
    ctx.clearRect(0, 0, W, H)
    // fondo glass
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.fillRect(0, 0, W, H)

    // grid sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 1
    for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * BLOCK, 0); ctx.lineTo(c * BLOCK, H); ctx.stroke() }
    for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * BLOCK); ctx.lineTo(W, r * BLOCK); ctx.stroke() }

    board.forEach((row, r) => row.forEach((cell, c) => {
      if (cell) drawBlock(ctx, c, r)
    }))

    if (!gameOver) {
      piece.shape.forEach((row, r) => row.forEach((cell, c) => {
        if (cell) drawBlock(ctx, piece.col + c, piece.row + r)
      }))
    }

    // game over overlay
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
      ctx.fillRect(0, 0, W, H)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#75ffba'
      ctx.font = 'bold 2rem monospace'
      ctx.shadowColor = '#43ffa1'
      ctx.shadowBlur = 20
      ctx.fillText('GAME OVER', W / 2, H / 2 - 20)
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.font = '1rem monospace'
      ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 16)
      ctx.fillStyle = 'rgba(117, 255, 186, 0.6)'
      ctx.font = '0.85rem monospace'
      ctx.fillText('Press R to restart', W / 2, H / 2 + 44)
    }
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'r' || e.key === 'R') {
      board.forEach(row => row.fill(0))
      score = 0
      gameOver = false
      onScore?.(0)
      spawnPiece()
      return
    }
    if (gameOver) return
    if (e.key === 'ArrowDown') {
      piece.row++
      if (checkCollision(piece, board)) piece.row--
    } else if (e.key === 'ArrowLeft') {
      piece.col--
      if (checkCollision(piece, board)) piece.col++
    } else if (e.key === 'ArrowRight') {
      piece.col++
      if (checkCollision(piece, board)) piece.col--
    } else if (e.key === 'ArrowUp') {
      const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse())
      const oldShape = piece.shape
      piece.shape = rotated
      if (checkCollision(piece, board)) piece.shape = oldShape
    }
  }
  document.addEventListener('keydown', onKey)

  const loop = (timestamp: number) => {
    if (!running) return
    const deltaTime = timestamp - lastTime
    lastTime = timestamp
    update(deltaTime)
    draw()
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  return () => { running = false; document.removeEventListener('keydown', onKey) }
}