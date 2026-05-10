#!/usr/bin/env node
/**
 * Renames altBaslik1 values in MDX frontmatter across all articles.
 * Run: node scripts/relabel-subtopics.js
 */

const fs = require('fs')
const path = require('path')

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles')

const RENAMES = [
  { from: 'Bitkisel & Doğal Sağlık', to: 'Doğal Antiaging' },
  { from: 'Cilt & Estetik', to: 'Kozmetik Dermatoloji' },
  { from: 'Genel Sağlık & Tıp', to: 'Genel Sağlık' },
]

function walkDir(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) results.push(...walkDir(full))
    else if (full.endsWith('.mdx')) results.push(full)
  }
  return results
}

let total = 0
const counts = {}
RENAMES.forEach(r => { counts[r.from] = 0 })

const files = walkDir(ARTICLES_DIR)
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  let updated = content
  for (const { from, to } of RENAMES) {
    const pattern = new RegExp(`(altBaslik1:\\s*['"]?)${escapeRegex(from)}(['"]?)`, 'g')
    if (pattern.test(updated)) {
      updated = updated.replace(
        new RegExp(`(altBaslik1:\\s*['"]?)${escapeRegex(from)}(['"]?)`, 'g'),
        `$1${to}$2`
      )
      counts[from]++
      total++
    }
  }
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8')
  }
}

console.log('Relabeling complete:')
RENAMES.forEach(({ from, to }) => {
  console.log(`  "${from}" → "${to}": ${counts[from]} files`)
})
console.log(`Total files updated: ${total}`)

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
