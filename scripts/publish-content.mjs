import { spawnSync } from 'node:child_process'

const run = (command, args, capture = false) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  })

  if (result.status !== 0) process.exit(result.status ?? 1)
  return capture ? result.stdout.trim() : ''
}

const status = run('git', ['status', '--porcelain'], true)
const unrelatedChanges = status
  .split('\n')
  .filter(Boolean)
  .filter((line) => {
    const path = line.slice(3)
    return !path.startsWith('public/content/') && !path.startsWith('public/uploads/')
  })

if (unrelatedChanges.length > 0) {
  console.error('Hay cambios de código pendientes. Haz commit de ellos antes de publicar contenido:')
  unrelatedChanges.forEach((line) => console.error(`  ${line}`))
  process.exit(1)
}

const message = process.argv.slice(2).join(' ').trim() || 'actualiza el portfolio'

run('npm', ['run', 'build'])
run('git', ['diff', '--check', '--', 'public/content', 'public/uploads'])
run('git', ['add', '-A', '--', 'public/content', 'public/uploads'])

const hasChanges = spawnSync('git', ['diff', '--cached', '--quiet']).status !== 0
if (!hasChanges) {
  console.log('No hay cambios de contenido para publicar.')
  process.exit(0)
}

run('git', ['commit', '-m', `content: ${message}`])
run('git', ['push'])
