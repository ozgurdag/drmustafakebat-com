const { spawnSync } = require('child_process')

if (!process.env.TINA_CLIENT_ID || !process.env.TINA_TOKEN) {
  console.log('Skipping Tina build (TINA_CLIENT_ID or TINA_TOKEN not set)')
  process.exit(0)
}

console.log('Starting Tina build...')

const result = spawnSync('npx', ['tinacms', 'build'], {
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, TINA_SKIP_CONFIG_CHECK: 'true' },
})

const stdout = result.stdout ? result.stdout.toString() : ''
const stderr = result.stderr ? result.stderr.toString() : ''
const combined = stdout + stderr

// Print all output so CI logs show what happened
if (stdout) process.stdout.write(stdout)
if (stderr) process.stderr.write(stderr)

if (result.error) {
  console.error('Spawn error:', result.error.message)
  process.exit(1)
}

if (result.status !== 0) {
  // If the only issues are NON_BREAKING schema additions, treat as success.
  // Tina Cloud will re-index these automatically on next access.
  const hasBreakingError = combined
    .split('\n')
    .filter(line => line.includes('Reason:'))
    .some(line => !line.includes('[NON_BREAKING'))

  if (!hasBreakingError && combined.includes('[NON_BREAKING')) {
    console.log('Tina build: only non-breaking schema changes detected, continuing...')
    process.exit(0)
  }

  console.error('tinacms build exited with status:', result.status)
  process.exit(result.status || 1)
}

console.log('Tina build completed successfully.')
