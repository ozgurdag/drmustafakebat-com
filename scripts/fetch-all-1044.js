#!/usr/bin/env node
/**
 * Fetches all 1044 articles from tetkik.com.tr, saves MDX files and downloads images locally.
 * Run: node scripts/fetch-all-1044.js
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// ─── Category mapping ───────────────────────────────────────────────────────
function mapCategory(anaKapsam) {
  if (!anaKapsam) return 'longevity'
  const k = anaKapsam.toLowerCase()
  if (k.includes('iş sağlığı') || k.includes('is sagligi') || k.includes('mevzuat') || k.includes('rehber')) return 'systems'
  if (k.includes('isg') || k.includes('haber') || k.includes('genel')) return 'systems'
  return 'longevity'
}

// Keep neuroperformance for existing articles already categorized as such
function mapCategoryFromData(d) {
  const existingNeuro = [
    'Psikoloji & Ruh Sağlığı', 'Uyku & Vardiyalı Çalışma',
    'Nöroloji', 'Egzersiz & Fiziksel Aktivite'
  ]
  if (d.anaKapsam === 'Sağlık & Tıp' && existingNeuro.includes(d.altBaslik1)) return 'neuroperformance'
  return mapCategory(d.anaKapsam)
}

// ─── HTTP helpers ───────────────────────────────────────────────────────────
function fetchUrl(url, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error('Too many redirects'))
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000,
    }, (res) => {
      let data = Buffer.alloc(0)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href
        return fetchUrl(loc, redirectCount + 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) { res.destroy(); return resolve(null) }
      res.on('data', chunk => { data = Buffer.concat([data, chunk]) })
      res.on('end', () => resolve(data.toString('utf8')))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (!url || url === '') return resolve(false)
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) { res.destroy(); return resolve(false) }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => {
        try {
          fs.writeFileSync(destPath, Buffer.concat(chunks))
          resolve(true)
        } catch (e) { resolve(false) }
      })
    })
    req.on('error', () => resolve(false))
    req.on('timeout', () => { req.destroy(); resolve(false) })
  })
}

// ─── HTML parsing ───────────────────────────────────────────────────────────
function stripTags(html) { return html.replace(/<[^>]+>/g, '') }

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, '')
}

function extractTitle(html) {
  const m = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
  if (m) return decodeEntities(stripTags(m[1])).trim()
  const og = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)
  if (og) return decodeEntities(og[1]).replace(/ [-–|].*$/, '').trim()
  const t = html.match(/<title>([\s\S]*?)<\/title>/i)
  if (t) return decodeEntities(t[1]).replace(/ [-–|].*$/, '').trim()
  return null
}

function extractImage(html) {
  const og = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
  if (og && og[1]) return og[1].split('?')[0]
  const img = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i)
  if (img) return img[1].split('?')[0]
  return ''
}

function extractExcerpt(html) {
  const m = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
  if (m) return decodeEntities(m[1]).trim()
  return ''
}

function extractContent(html) {
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '')

  const match = html.match(/<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div[^>]*class="[^"]*post-tags|<div[^>]*class="[^"]*post-footer)/i)
  if (!match) return null

  let c = match[1]
  c = c.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${stripTags(t).trim()}\n\n`)
  c = c.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${stripTags(t).trim()}\n\n`)
  c = c.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n\n#### ${stripTags(t).trim()}\n\n`)
  c = c.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
  c = c.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
  c = c.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
  c = c.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
  c = c.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${stripTags(t).trim()}\n`)
  c = c.replace(/<\/[uo]l>/gi, '\n')
  c = c.replace(/<\/p>/gi, '\n\n')
  c = c.replace(/<br\s*\/?>/gi, '\n')
  c = stripTags(c)
  c = decodeEntities(c)
  // Escape MDX-breaking characters
  c = c.replace(/<(?!\/?[a-zA-Z])/g, '&lt;')
  c = c.replace(/(?<![a-zA-Z"']>)>/g, (m, offset, str) => {
    const lineStart = str.lastIndexOf('\n', offset) + 1
    if (offset === lineStart) return m
    return '&gt;'
  })
  c = c.replace(/\n{4,}/g, '\n\n').trim()
  return c
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '')
    .substring(0, 70)
}

function getImageExt(url) {
  const m = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg'
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const data = require('../data/tetkik_data.json')
  const imgDir = path.join(__dirname, '..', 'public', 'images', 'articles')
  fs.mkdirSync(imgDir, { recursive: true })

  // Get existing slugs across all categories to skip
  const existingSlugs = new Set()
  for (const cat of ['longevity', 'systems', 'neuroperformance']) {
    const dir = path.join(__dirname, '..', 'content', 'articles', cat)
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).forEach(f => {
        existingSlugs.add(f.replace('.mdx', ''))
      })
    }
  }

  // Filter: only articles with URLs, skip already fetched
  const toFetch = data.filter(d => d.url && d.url.startsWith('http'))
  console.log(`Total in dataset: ${data.length}`)
  console.log(`With URLs: ${toFetch.length}`)
  console.log(`Already fetched: ${existingSlugs.size}`)

  let saved = 0, skipped = 0, failed = 0
  const logFile = path.join(__dirname, 'fetch-log.txt')
  const log = (msg) => { process.stdout.write(msg + '\n'); fs.appendFileSync(logFile, msg + '\n') }

  fs.writeFileSync(logFile, `=== Fetch started ${new Date().toISOString()} ===\n`)

  for (let i = 0; i < toFetch.length; i++) {
    const d = toFetch[i]
    const category = mapCategoryFromData(d)
    const contentDir = path.join(__dirname, '..', 'content', 'articles', category)
    fs.mkdirSync(contentDir, { recursive: true })

    // Generate slug from title first (faster check)
    const tentativeSlug = slugify(d.title || '')
    if (tentativeSlug && existingSlugs.has(tentativeSlug)) {
      skipped++
      continue
    }

    log(`[${i+1}/${toFetch.length}] ${d.title?.substring(0, 50)}`)

    try {
      const html = await fetchUrl(d.url)
      if (!html) { failed++; log('  SKIP: no response'); await delay(500); continue }

      const title = extractTitle(html) || d.title || ''
      if (!title) { failed++; log('  SKIP: no title'); continue }

      const slug = slugify(title)
      if (!slug) { failed++; log('  SKIP: empty slug'); continue }

      // Skip if this slug already exists
      const filePath = path.join(contentDir, `${slug}.mdx`)
      if (fs.existsSync(filePath) || existingSlugs.has(slug)) {
        skipped++
        log('  EXISTS')
        existingSlugs.add(slug)
        await delay(300)
        continue
      }

      const content = extractContent(html)
      if (!content || content.length < 100) { failed++; log('  SKIP: no content'); await delay(500); continue }

      const excerpt = extractExcerpt(html) || title
      const imgUrl = extractImage(html)
      const date = d.url.match(/(\d{4})\/(\d{2})\/(\d{2})/)?.[0]?.replace(/\//g, '-') || (d.tarih || '2024-01-01')
      const altBaslik1 = d.altBaslik1 || ''
      const altBaslik2 = d.altBaslik2 || ''

      // Download image
      let localImagePath = ''
      if (imgUrl) {
        const ext = getImageExt(imgUrl)
        const imgFileName = `${slug}.${ext}`
        const imgDest = path.join(imgDir, imgFileName)
        if (!fs.existsSync(imgDest)) {
          const ok = await downloadImage(imgUrl, imgDest)
          if (ok) {
            localImagePath = `/images/articles/${imgFileName}`
            log(`  IMG: ${imgFileName}`)
          }
        } else {
          localImagePath = `/images/articles/${imgFileName}`
        }
      }

      // Sanitize strings for frontmatter
      const safeTitle = title.replace(/"/g, "'").replace(/\n/g, ' ').substring(0, 200)
      const safeExcerpt = excerpt.replace(/"/g, "'").replace(/\n/g, ' ').substring(0, 200)

      const mdx = `---
title: "${safeTitle}"
category: "${category}"
altBaslik1: "${altBaslik1}"
altBaslik2: "${altBaslik2}"
date: "${date}"
excerpt: "${safeExcerpt}"
image: "${localImagePath}"
---

${content}
`
      fs.writeFileSync(filePath, mdx, 'utf8')
      existingSlugs.add(slug)
      saved++
      log(`  SAVED (${content.length} chars)`)
    } catch (err) {
      failed++
      log(`  ERROR: ${err.message}`)
    }

    // Polite delay
    await delay(i % 10 === 9 ? 3000 : 1200)
  }

  log(`\n=== Done: ${saved} saved, ${skipped} skipped, ${failed} failed ===`)
}

main().catch(console.error)
