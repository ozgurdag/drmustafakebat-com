const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'content', 'articles')

const categoryMap = {
  'beslenme': 'genel_tip',
  'saglik': 'kurumsal_saglik',
  'isg': 'is_sagligi',
  'acil': 'is_sagligi',
  'kimyasal': 'is_sagligi',
  'mevzuat': 'is_sagligi',
  'systems': 'kurumsal_saglik',
  'longevity': 'longevity',
  'neuroperformance': 'neuroperformance'
}

// Create new dirs
const newDirs = ['longevity', 'kurumsal_saglik', 'neuroperformance', 'is_sagligi', 'genel_tip', 'spor', 'dusunce_yazilarim']
newDirs.forEach(d => {
  const p = path.join(dir, d)
  if (!fs.existsSync(p)) fs.mkdirSync(p)
})

// Read old dirs
const allDirs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory())
const oldDirs = allDirs.filter(f => !newDirs.includes(f) && categoryMap[f])

oldDirs.forEach(oldDir => {
  const targetCategory = categoryMap[oldDir]
  const oldPath = path.join(dir, oldDir)
  const targetPath = path.join(dir, targetCategory)
  
  const files = fs.readdirSync(oldPath).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
  
  files.forEach(file => {
    const filePath = path.join(oldPath, file)
    let content = fs.readFileSync(filePath, 'utf8')
    
    // Replace category in frontmatter
    content = content.replace(/category:\s*['"]?([a-zA-Z0-9_-]+)['"]?/, `category: '${targetCategory}'`)
    
    // Write to new path
    fs.writeFileSync(path.join(targetPath, file), content)
  })
})

console.log('Categories remapped successfully.')
