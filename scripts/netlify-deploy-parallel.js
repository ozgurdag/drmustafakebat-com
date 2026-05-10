#!/usr/bin/env node
/**
 * Deploy out/ to Netlify via Files API — parallel uploads
 * Usage: node scripts/netlify-deploy-parallel.js [deploy_id]
 * If deploy_id is provided, resumes an existing deploy.
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const https = require('https')

const SITE_ID = '01697067-d426-4d1f-9d4f-9b7d6ed5f8a8'
const TOKEN = 'nfp_45QorMg4M6LsunW24LuRLAATm6xMDApN6336'
const OUT_DIR = path.join(__dirname, '..', 'out')
const CONCURRENCY = 20

function sha1File(filePath) {
  return crypto.createHash('sha1').update(fs.readFileSync(filePath)).digest('hex')
}

function walkDir(dir, base = dir) {
  const entries = []
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) entries.push(...walkDir(full, base))
    else entries.push(full)
  }
  return entries
}

function apiRequest(method, apiPath, body, isBuffer = false) {
  return new Promise((resolve, reject) => {
    const postData = isBuffer ? body : (body ? JSON.stringify(body) : null)
    const opts = {
      hostname: 'api.netlify.com',
      path: apiPath,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': isBuffer ? 'application/octet-stream' : 'application/json',
      },
      timeout: 60000,
    }
    if (postData) opts.headers['Content-Length'] = postData.length

    const req = https.request(opts, (res) => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString()
        try { resolve({ status: res.statusCode, data: JSON.parse(text) }) }
        catch { resolve({ status: res.statusCode, data: text }) }
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
    if (postData) req.write(postData)
    req.end()
  })
}

async function uploadFile(deployId, filePath, rel, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const buf = fs.readFileSync(filePath)
      const r = await apiRequest('PUT', `/api/v1/deploys/${deployId}/files${rel}`, buf, true)
      if (r.status === 200 || r.status === 201) return true
      if (r.status === 422) return true // already uploaded
    } catch (e) {
      if (i === retries - 1) return false
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  return false
}

async function runPool(tasks, concurrency) {
  let idx = 0
  let done = 0, failed = 0
  const total = tasks.length

  async function worker() {
    while (idx < tasks.length) {
      const task = tasks[idx++]
      const ok = await task()
      if (ok) done++; else failed++
      if ((done + failed) % 50 === 0) {
        process.stdout.write(`  ${done + failed}/${total} (fail:${failed})\r`)
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker())
  await Promise.all(workers)
  return { done, failed }
}

async function main() {
  const existingDeployId = process.argv[2] || null

  console.log('Scanning out/ directory...')
  const files = walkDir(OUT_DIR)
  console.log(`Found ${files.length} files`)

  console.log('Computing SHA1 hashes...')
  const fileMap = {}
  const hashToPath = {}
  let i = 0
  for (const f of files) {
    const rel = '/' + path.relative(OUT_DIR, f).replace(/\\/g, '/')
    const hash = sha1File(f)
    fileMap[rel] = hash
    hashToPath[hash] = f
    i++
    if (i % 200 === 0) process.stdout.write(`  ${i}/${files.length}\r`)
  }
  console.log(`\nHashed ${files.length} files`)

  let deployId = existingDeployId
  let required = []

  if (existingDeployId) {
    console.log(`Resuming deploy: ${existingDeployId}`)
    // Get current deploy state to see what's still needed
    const stateRes = await apiRequest('GET', `/api/v1/deploys/${existingDeployId}`, null)
    required = stateRes.data.required || []
    console.log(`Files still required: ${required.length}`)
    if (required.length === 0) {
      console.log('Deploy already complete!')
      console.log(`Deploy state: ${stateRes.data.state}`)
      console.log(`URL: ${stateRes.data.ssl_url || stateRes.data.deploy_url}`)
      return
    }
  } else {
    console.log('Creating Netlify deploy...')
    const createRes = await apiRequest('POST', `/api/v1/sites/${SITE_ID}/deploys`, { files: fileMap })
    if (createRes.status !== 200 && createRes.status !== 201) {
      console.error('Failed:', createRes.status, JSON.stringify(createRes.data).substring(0, 300))
      process.exit(1)
    }
    deployId = createRes.data.id
    required = createRes.data.required || []
    console.log(`Deploy ID: ${deployId}`)
    console.log(`Files to upload: ${required.length}`)
  }

  if (required.length === 0) {
    console.log('Nothing to upload!')
  } else {
    const tasks = required.map(hash => {
      const filePath = hashToPath[hash]
      if (!filePath) return async () => { console.warn(`Missing file for hash ${hash}`); return false }
      const rel = '/' + path.relative(OUT_DIR, filePath).replace(/\\/g, '/')
      return () => uploadFile(deployId, filePath, rel)
    })

    console.log(`Uploading ${required.length} files with ${CONCURRENCY} parallel connections...`)
    const { done, failed } = await runPool(tasks, CONCURRENCY)
    console.log(`\nUploaded: ${done}, Failed: ${failed}`)
  }

  // Final state check
  const finalRes = await apiRequest('GET', `/api/v1/deploys/${deployId}`, null)
  const deploy = finalRes.data
  console.log(`\nDeploy state: ${deploy.state}`)
  if (deploy.ssl_url) console.log(`Site URL: ${deploy.ssl_url}`)
  else if (deploy.deploy_url) console.log(`Preview URL: ${deploy.deploy_url}`)
  console.log(`Deploy ID: ${deployId}`)
}

main().catch(e => { console.error(e); process.exit(1) })
