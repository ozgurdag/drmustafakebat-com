#!/usr/bin/env node
/**
 * Fetches real article content from tetkik.com.tr and writes MDX files.
 * Usage: node scripts/fetch-articles.js
 */

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
  // Remove scripts, styles, nav, header, footer areas
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '')

  // Extract post-content div
  const contentMatch = html.match(/<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*post-tags/i)
  if (!contentMatch) return null

  let content = contentMatch[1]

  // Convert headings
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${stripTags(t).trim()}\n\n`)
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${stripTags(t).trim()}\n\n`)
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n\n#### ${stripTags(t).trim()}\n\n`)

  // Convert strong/em
  content = content.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
  content = content.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
  content = content.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
  content = content.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')

  // Convert lists
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${stripTags(t).trim()}\n`)
  content = content.replace(/<\/ul>/gi, '\n')
  content = content.replace(/<\/ol>/gi, '\n')

  // Convert paragraphs
  content = content.replace(/<\/p>/gi, '\n\n')
  content = content.replace(/<br\s*\/?>/gi, '\n')

  // Strip remaining tags
  content = stripTags(content)

  // Decode HTML entities
  content = decodeEntities(content)

  // Clean up excessive whitespace
  content = content.replace(/\n{4,}/g, '\n\n').trim()

  return content
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '')
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/g, '')
}

function extractTitle(html) {
  const m = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
  if (m) return decodeEntities(stripTags(m[1])).trim()
  const m2 = html.match(/<title>([\s\S]*?)<\/title>/i)
  if (m2) return decodeEntities(m2[1]).replace(/ [-|].*$/, '').trim()
  return null
}

function extractImage(html) {
  // OG image is most reliable
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
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function processArticle(url, category, altBaslik1) {
  console.log(`Fetching: ${url}`)
  try {
    const html = await fetchUrl(url)
    const title = extractTitle(html)
    const content = extractText(html)
    const image = extractImage(html)
    const excerpt = extractExcerpt(html)

    if (!title || !content || content.length < 100) {
      console.log(`  SKIP: insufficient content`)
      return null
    }

    const slug = slugify(title).substring(0, 60)
    const date = url.match(/(\d{4})\/(\d{2})\/(\d{2})/)?.[0]?.replace(/\//g, '-') || '2024-01-01'

    const frontmatter = `---
title: "${title.replace(/"/g, "'")}"
category: "${category}"
altBaslik1: "${altBaslik1}"
date: "${date}"
excerpt: "${(excerpt || title).replace(/"/g, "'").substring(0, 150)}"
image: "${image || ''}"
source: "${url}"
---

`

    const mdx = frontmatter + content

    const dir = path.join(__dirname, '..', 'content', 'articles', category)
    fs.mkdirSync(dir, { recursive: true })
    const filePath = path.join(dir, `${slug}.mdx`)
    fs.writeFileSync(filePath, mdx, 'utf8')
    console.log(`  SAVED: ${slug}.mdx (${content.length} chars)`)
    return slug
  } catch (err) {
    console.log(`  ERROR: ${err.message}`)
    return null
  }
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  const articles = [
    // LONGEVITY articles
    { url: 'https://tetkik.com.tr/2024/09/09/glutatyon/', category: 'longevity', altBaslik1: 'Antioksidanlar' },
    { url: 'https://tetkik.com.tr/2024/07/25/fosfor-kalsiyum-magnezyum/', category: 'longevity', altBaslik1: 'Vitaminler & Mineraller' },
    { url: 'https://tetkik.com.tr/2024/07/31/ayni-yemek-nasil-hem-kilo-aldirir-hem-de-iyilestirir/', category: 'longevity', altBaslik1: 'Beslenme & Diyet' },
    { url: 'https://tetkik.com.tr/2024/09/08/fazla-d-vitamini-zehirler-mi/', category: 'longevity', altBaslik1: 'Vitaminler & Mineraller' },
    { url: 'https://tetkik.com.tr/2024/08/24/kan-sekeri/', category: 'longevity', altBaslik1: 'Kan Tahlilleri & Biyokimya' },
    { url: 'https://tetkik.com.tr/2024/09/18/kan-tahlili-degerlerinin-anlamlari/', category: 'longevity', altBaslik1: 'Kan Tahlilleri & Biyokimya' },
    { url: 'https://tetkik.com.tr/2024/09/19/kosmak-mi-tempolu-yurumek-mi/', category: 'longevity', altBaslik1: 'Egzersiz & Fiziksel Aktivite' },
    { url: 'https://tetkik.com.tr/2024/09/20/ne-zaman-diyet-yapsam/', category: 'longevity', altBaslik1: 'Beslenme & Diyet' },
    { url: 'https://tetkik.com.tr/2024/08/17/tansiyon-olcumunde-nelere-dikkat-edilmelidir/', category: 'longevity', altBaslik1: 'Kardiyovasküler' },
    { url: 'https://tetkik.com.tr/2024/09/11/ardic-yagi/', category: 'longevity', altBaslik1: 'Bitkisel & Doğal Sağlık' },
    { url: 'https://tetkik.com.tr/2024/09/10/siyanur-zehirlenmesi-ve-b12-iliskisi/', category: 'longevity', altBaslik1: 'Vitaminler & Mineraller' },
    { url: 'https://tetkik.com.tr/2024/08/23/c-vitamini/', category: 'longevity', altBaslik1: 'Vitaminler & Mineraller' },

    // NEUROPERFORMANCE articles
    { url: 'https://tetkik.com.tr/2024/08/29/isyerinde-tukenmislik-hissediyor-musunuz-isiniz-sagliginizi-etkiliyorsa-ne-yapabileceginizi-ogrenin/', category: 'neuroperformance', altBaslik1: 'Tükenmişlik & Stres' },
    { url: 'https://tetkik.com.tr/2024/09/04/calisan-sagliginda-uykunun-yeri/', category: 'neuroperformance', altBaslik1: 'Uyku & Biyolojik Ritim' },
    { url: 'https://tetkik.com.tr/2024/09/05/calisan-yorgunlugu/', category: 'neuroperformance', altBaslik1: 'Uyku & Biyolojik Ritim' },
    { url: 'https://tetkik.com.tr/2024/09/12/sirkadiyen-ritm-ve-calisan-sagligi/', category: 'neuroperformance', altBaslik1: 'Uyku & Biyolojik Ritim' },
    { url: 'https://tetkik.com.tr/2024/09/15/vardiyali-calisma-uyku-ve-biyolojik-saat-yonetimi/', category: 'neuroperformance', altBaslik1: 'Uyku & Biyolojik Ritim' },
    { url: 'https://tetkik.com.tr/2025/01/15/calisanlarda-psikolojik-faktorlerin-propriyosepsiyon-uzerindeki-etkileri/', category: 'neuroperformance', altBaslik1: 'Nöroloji & Beyin' },
    { url: 'https://tetkik.com.tr/2025/02/14/stresiniz-mi-artti-vagal-masaj-yapin-kendinize/', category: 'neuroperformance', altBaslik1: 'Tükenmişlik & Stres' },
    { url: 'https://tetkik.com.tr/2025/02/15/stresin-calisanin-propriyosepsiyonunu-etkileme-mekanizmalari/', category: 'neuroperformance', altBaslik1: 'Nöroloji & Beyin' },
    { url: 'https://tetkik.com.tr/2025/03/15/anksiyete-bozuklugunun-calisanin-propriyosepsiyonuna-etkisi/', category: 'neuroperformance', altBaslik1: 'Tükenmişlik & Stres' },
    { url: 'https://tetkik.com.tr/2025/03/29/uyku-sorununuza-muz-cayi/', category: 'neuroperformance', altBaslik1: 'Uyku & Biyolojik Ritim' },

    // SYSTEMS articles
    { url: 'https://tetkik.com.tr/2024/08/31/isle-ilgili-kalp-hastaliklari/', category: 'systems', altBaslik1: 'Kurumsal Sağlık' },
    { url: 'https://tetkik.com.tr/2024/08/08/calisanin-isyerinde-kalp-krizi-sebepli-olumunde-isverenin-ceza-alacagi-kusurlari/', category: 'systems', altBaslik1: 'Kurumsal Sağlık' },
    { url: 'https://tetkik.com.tr/2024/09/05/calisanin-isyerinde-kalp-krizi-sebepli-olumunde-isyeri-hekiminin-ceza-alacagi-kusurlari/', category: 'systems', altBaslik1: 'Kurumsal Sağlık' },
  ]

  // Also fetch more systems articles
  const data = require('../data/tetkik_data.json')
  const isgArticles = data
    .filter(d => d.anaKapsam === 'İş Sağlığı ve Güvenliği' && d.url)
    .slice(0, 10)
    .map(d => ({ url: d.url, category: 'systems', altBaslik1: d.altBaslik1 || 'Kurumsal Sağlık' }))

  const allArticles = [...articles, ...isgArticles]

  for (const article of allArticles) {
    await processArticle(article.url, article.category, article.altBaslik1)
    await delay(1500) // be polite to the server
  }

  console.log('\nDone!')
}

main().catch(console.error)
