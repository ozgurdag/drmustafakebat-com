#!/usr/bin/env node
/**
 * Deploy out/ directory to Netlify via Files API
 * Usage: node scripts/netlify-deploy.js
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const https = require('https')

const SITE_ID = '01697067-d426-4d1f-9d4f-9b7d6ed5f8a8'
const TOKEN = 'nfp_45QorMg4M6LsunW24LuRLAATm6xMDApN6336'
const OUT_DIR = path.join(__dirname, '..', 'out')

function sha1File(filePath) {
  const buf = fs.readFileSync(filePath)
  return crypto.createHash('sha1').update(buf).digest('hex')
}

function walkDir(dir, base = dir) {
  const entries = []
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) {
      entries.push(...walkDir(full, base))
    } else {
      entries.push(full)
    }
  }
  return entries
}

function netlifyRequest(method, path, body, isBuffer = false) {
  return new Promise((resolve, reject) => {
    const postData = isBuffer ? body : (body ? JSON.stringify(body) : null)
    const options = {
      hostname: 'api.netlify.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': isBuffer ? 'application/octet-stream' : 'application/json',
      },
      timeout: 120000,
    }
    if (postData) options.headers['Content-Length'] = postData.length

    const req = https.request(options, (res) => {
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

async function main() {
  console.log('Scanning out/ directory...')
  const files = walkDir(OUT_DIR)
  console.log(`Found ${files.length} files`)

  // Build file digest map
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
    if (i % 100 === 0) process.stdout.write(`  ${i}/${files.length}\r`)
  }
  console.log(`\nHashed ${files.length} files`)

  // Create deploy
  console.log('Creating Netlify deploy...')
  const createRes = await netlifyRequest('POST', `/api/v1/sites/${SITE_ID}/deploys`, {
    files: fileMap,
    async: false,
  })

  if (createRes.status !== 200 && createRes.status !== 201) {
    console.error('Failed to create deploy:', createRes.status, JSON.stringify(createRes.data).substring(0, 500))
    process.exit(1)
  }

  const deploy = createRes.data
  const deployId = deploy.id
  const required = deploy.required || []
  console.log(`Deploy ID: ${deployId}`)
  console.log(`Files to upload: ${required.length}`)

  if (required.length === 0) {
    console.log('No files to upload - deploy already has all files!')
  }

  // Upload required files
  let uploaded = 0, failed = 0
  for (const hash of required) {
    const filePath = hashToPath[hash]
    if (!filePath) {
      console.warn(`  WARN: No file found for hash ${hash}`)
      failed++
      continue
    }
    const rel = '/' + path.relative(OUT_DIR, filePath).replace(/\\/g, '/')
    const buf = fs.readFileSync(filePath)

    let attempts = 0
    let ok = false
    while (attempts < 3 && !ok) {
      try {
        const r = await netlifyRequest('PUT', `/api/v1/deploys/${deployId}/files${rel}`, buf, true)
        if (r.status === 200 || r.status === 201) {
          ok = true
        } else {
          console.warn(`  WARN [${r.status}]: ${rel}`)
          attempts++
          await new Promise(r => setTimeout(r, 1000))
        }
      } catch (e) {
        attempts++
        await new Promise(r => setTimeout(r, 2000))
      }
    }
    if (ok) {
      uploaded++
    } else {
      failed++
      console.error(`  FAIL: ${rel}`)
    }
    if (uploaded % 50 === 0) process.stdout.write(`  Uploaded: ${uploaded}/${required.length} (failed: ${failed})\r`)
  }

  console.log(`\nUploaded: ${uploaded}, Failed: ${failed}`)
  console.log(`\nDeploy URL: https://app.netlify.com/sites/drmustafakebat/deploys/${deployId}`)

  // Check deploy state
  const stateRes = await netlifyRequest('GET', `/api/v1/deploys/${deployId}`, null)
  console.log(`Deploy state: ${stateRes.data.state}`)
  if (stateRes.data.deploy_url) {
    console.log(`Preview URL: ${stateRes.data.deploy_url}`)
  }
  if (stateRes.data.ssl_url || stateRes.data.url) {
    console.log(`Site URL: ${stateRes.data.ssl_url || stateRes.data.url}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
