const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'app')
const categories = ['dusunce_yazilarim', 'genel_tip', 'is_sagligi', 'kurumsal_saglik', 'longevity', 'neuroperformance', 'spor']

categories.forEach(c => {
  const p = path.join(dir, c, '[slug]', 'page.tsx')
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8')
    if (!content.includes('dynamicParams')) {
      content = 'export const dynamicParams = false;\n' + content
      fs.writeFileSync(p, content)
    }
  }
})

console.log('Added dynamicParams = false')
