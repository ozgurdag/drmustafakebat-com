#!/usr/bin/env node
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = ''
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject)
      }
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

function extractText(html) {
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '')
  const contentMatch = html.match(/<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*post-tags/i)
  if (!contentMatch) return null
  let content = contentMatch[1]
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${stripTags(t).trim()}\n\n`)
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${stripTags(t).trim()}\n\n`)
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n\n#### ${stripTags(t).trim()}\n\n`)
  content = content.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
  content = content.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
  content = content.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
  content = content.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${stripTags(t).trim()}\n`)
  content = content.replace(/<\/[uo]l>/gi, '\n')
  content = content.replace(/<\/p>/gi, '\n\n')
  content = content.replace(/<br\s*\/?>/gi, '\n')
  content = stripTags(content)
  content = decodeEntities(content)
  content = content.replace(/\n{4,}/g, '\n\n').trim()
  return content
}

function stripTags(html) { return html.replace(/<[^>]+>/g, '') }

function decodeEntities(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, '')
}

function extractTitle(html) {
  const m = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
  if (m) return decodeEntities(stripTags(m[1])).trim()
  const m2 = html.match(/<title>([\s\S]*?)<\/title>/i)
  if (m2) return decodeEntities(m2[1]).replace(/ [-|].*$/, '').trim()
  return null
}

function extractImage(html) {
  const og = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
  if (og) return og[1]
  const img = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/i)
  if (img) return img[1]
  return null
}

function extractExcerpt(html) {
  const m = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
  if (m) return decodeEntities(m[1]).trim()
  return ''
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

async function processArticle(url, category, altBaslik1) {
  console.log(`Fetching: ${url}`)
  try {
    const html = await fetchUrl(url)
    const title = extractTitle(html)
    const content = extractText(html)
    const image = extractImage(html)
    const excerpt = extractExcerpt(html)
    if (!title || !content || content.length < 200) { console.log(`  SKIP`); return null }
    const slug = slugify(title).substring(0, 60)
    const date = url.match(/(\d{4})\/(\d{2})\/(\d{2})/)?.[0]?.replace(/\//g, '-') || '2024-01-01'
    const frontmatter = `---\ntitle: "${title.replace(/"/g, "'")}"\ncategory: "${category}"\naltBaslik1: "${altBaslik1}"\ndate: "${date}"\nexcerpt: "${(excerpt || title).replace(/"/g, "'").substring(0, 150)}"\nimage: "${image || ''}"\nsource: "${url}"\n---\n\n`
    const mdx = frontmatter + content
    const dir = path.join(__dirname, '..', 'content', 'articles', category)
    fs.mkdirSync(dir, { recursive: true })
    const filePath = path.join(dir, `${slug}.mdx`)
    if (fs.existsSync(filePath)) { console.log(`  EXISTS: ${slug}.mdx`); return slug }
    fs.writeFileSync(filePath, mdx, 'utf8')
    console.log(`  SAVED: ${slug}.mdx (${content.length} chars)`)
    return slug
  } catch (err) { console.log(`  ERROR: ${err.message}`); return null }
}

async function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  const more = [
    // More systems - neuroergonomics/corporate health
    { url: 'https://tetkik.com.tr/2025/04/25/is-yerinde-psikolojik-ve-norolojik-guvenlik/', category: 'systems', altBaslik1: 'Nöroergonomi' },
    { url: 'https://tetkik.com.tr/2025/05/05/is-yerinde-psikolojik-ve-norolojik-guvenlik-2/', category: 'systems', altBaslik1: 'Nöroergonomi' },
    { url: 'https://tetkik.com.tr/2024/09/17/reaktif-zaman-testi-uygulama-kilavuzu/', category: 'systems', altBaslik1: 'Kurumsal Protokoller' },
    { url: 'https://tetkik.com.tr/2025/05/01/is-sagligi-ve-guvenliginde-isco-nicin-onemli/', category: 'systems', altBaslik1: 'Kurumsal Protokoller' },
    { url: 'https://tetkik.com.tr/2025/05/06/25594/', category: 'systems', altBaslik1: 'Fiziksel Performans' },
    { url: 'https://tetkik.com.tr/2025/05/11/yuksekte-calisanlarda-kas-koordinasyonu-ve-motor-kontrol-mekanizmalarinin-onemi/', category: 'systems', altBaslik1: 'Fiziksel Performans' },
    { url: 'https://tetkik.com.tr/2024/10/03/calisanin-isyerinde-kalp-krizi-sebepli-olumunde-is-guvenligi-uzmaninin-ceza-alacagi-kusurlari/', category: 'systems', altBaslik1: 'Kurumsal Sağlık' },
    // More longevity
    { url: 'https://tetkik.com.tr/2025/04/04/biyosidal-urun-nedir/', category: 'longevity', altBaslik1: 'Kimyasal & Toksikoloji' },
    { url: 'https://tetkik.com.tr/2024/10/17/cimento-fabrikalarinda-toz-gurultuden-kalbe-giden-yol/', category: 'longevity', altBaslik1: 'Kardiyovasküler' },
    // More neuroperformance
    { url: 'https://tetkik.com.tr/2025/01/20/dalis-yapanlarda-orta-kulak-barotravmasi/', category: 'neuroperformance', altBaslik1: 'Nöroloji & Beyin' },
    { url: 'https://tetkik.com.tr/2025/02/17/dalis-yapanlarda-ic-kulak-barotravmasi/', category: 'neuroperformance', altBaslik1: 'Nöroloji & Beyin' },
    { url: 'https://tetkik.com.tr/2025/05/12/yuksekte-calisanlar-icin-kas-koordinasyonu-ve-motor-kontrolun-gelistirilmesi/', category: 'neuroperformance', altBaslik1: 'Fiziksel Performans' },
  ]

  for (const a of more) {
    await processArticle(a.url, a.category, a.altBaslik1)
    await delay(1500)
  }
  console.log('\nDone!')
}

main().catch(console.error)
