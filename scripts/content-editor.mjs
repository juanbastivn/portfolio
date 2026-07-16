import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const children = []
let stopping = false

const start = (name, script, env = {}) => {
  const child = spawn(npm, ['run', script], {
    env: { ...process.env, ...env },
    stdio: 'inherit',
  })

  child.on('exit', (code) => {
    if (stopping) return
    console.error(`\n${name} se detuvo inesperadamente.`)
    shutdown(code ?? 1)
  })

  children.push(child)
}

const shutdown = (exitCode = 0) => {
  if (stopping) return
  stopping = true
  children.forEach((child) => child.kill('SIGTERM'))
  setTimeout(() => process.exit(exitCode), 250)
}

process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())

start('Proxy de contenido', 'content:proxy', {
  MODE: 'fs',
  PORT: '8081',
  BIND_HOST: '127.0.0.1',
  ORIGIN: 'http://127.0.0.1:4174',
  GIT_REPO_DIRECTORY: process.cwd(),
})
start('Editor', 'content:ui')

setTimeout(() => {
  console.log('\nEditor listo en http://127.0.0.1:4174/admin/')
  console.log('Presiona Ctrl+C para cerrarlo.\n')
}, 1_000)
