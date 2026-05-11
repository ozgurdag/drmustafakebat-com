const { execFileSync } = require('child_process')

if (process.env.TINA_CLIENT_ID && process.env.TINA_TOKEN) {
  execFileSync('npx', ['tinacms', 'build'], { stdio: 'inherit' })
} else {
  console.log('Skipping Tina build (no credentials configured)')
}
