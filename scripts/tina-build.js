const { spawnSync } = require('child_process')

if (!process.env.TINA_CLIENT_ID || !process.env.TINA_TOKEN) {
  console.log('Skipping Tina build (TINA_CLIENT_ID or TINA_TOKEN not set)')
  process.exit(0)
}

console.log('Starting Tina build...')

const result = spawnSync('npx', ['tinacms', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
})

if (result.error) {
  console.error('Spawn error:', result.error.message)
  process.exit(1)
}

if (result.status !== 0) {
  console.error('tinacms build exited with status:', result.status)
  process.exit(result.status || 1)
}

console.log('Tina build completed successfully.')
