const fs = require('fs')
const path = require('path')

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles')

function walkDir(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) results.push(...walkDir(full))
    else if (full.endsWith('.mdx')) results.push(full)
  }
  return results
}

const files = walkDir(ARTICLES_DIR)
let updatedCount = 0

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8')
  let content = original

  // Blok 1: Google Review bloğu — "Sayın okuyucu," ile başlayıp g.page URL + takip eden satır
  content = content.replace(
    /\n+Sayın okuyucu,[\s\S]*?https:\/\/g\.page\/r\/CTHRtq[^\n]*\n+[^\n]*\n*/g,
    '\n'
  )

  // Blok 2: Dr. attribution + Sınırlı Sorumluluk Beyanı — "**Dr Mustafa KEBAT**" satırından EOF
  content = content.replace(/\n+\*\*Dr Mustafa KEBAT\*\*[\s\S]*$/, '\n')

  // Fallback: disclaimer varsa ama Dr satırı yoksa
  content = content.replace(/\n+\*\*Sınırlı Sorumluluk Beyanı:\*\*[\s\S]*$/, '\n')

  // Sondaki fazladan boşlukları temizle
  content = content.trimEnd() + '\n'

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8')
    updatedCount++
  }
}

console.log(`Tamamlandı: ${updatedCount} / ${files.length} dosya güncellendi.`)
