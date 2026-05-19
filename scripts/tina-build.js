const { spawnSync } = require('child_process')

console.log('Running tinacms build...')

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

console.log('tinacms build completed successfully.')
