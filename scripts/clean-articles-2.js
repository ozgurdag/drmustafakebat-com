const fs = require('fs')
const path = require('path')

function walkDir(dir) {
  const files = []
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f)
    if (fs.statSync(full).isDirectory()) files.push(...walkDir(full))
    else if (f.endsWith('.mdx')) files.push(full)
  }
  return files
}

const contentDir = path.join(__dirname, '..', 'content', 'articles')
const files = walkDir(contentDir)

let updated = 0

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8')
  const original = content

  // Remove **Tetkik OSGB İş Sağlığı ve Eğitim Koordinatörü** and everything after it
  content = content.replace(/\n\*\*Tetkik OSGB İş Sağlığı ve Eğitim Koordinatörü\*\*[\s\S]*$/, '')

  // Remove trailing star lines (⭐️⭐️...)
  content = content.replace(/(\n+[⭐️ \t]*)+$/, '')

  // Remove trailing Doğal Yaşayın / Doğal Beslenin / Aklınıza Mukayet Olun headings
  content = content.replace(/(\n+#{1,4}\s*(Doğal Yaşayın|Doğal Beslenin|Aklınıza Mukayet Olun))+$/g, '')

  // Remove trailing star lines again (in case they came back)
  content = content.replace(/(\n+[⭐️ \t]*)+$/, '')

  content = content.trimEnd() + '\n'

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8')
    updated++
  }
}

console.log(`Done. ${updated} / ${files.length} files updated.`)
