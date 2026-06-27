const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'app')

const updates = [
  { folder: 'genel_tip', search: /beslenme/g, replace: 'genel_tip' },
  { folder: 'kurumsal_saglik', search: /saglik/g, replace: 'kurumsal_saglik' },
  { folder: 'is_sagligi', search: /beslenme/g, replace: 'is_sagligi' },
  { folder: 'spor', search: /beslenme/g, replace: 'spor' },
  { folder: 'dusunce_yazilarim', search: /beslenme/g, replace: 'dusunce_yazilarim' }
]

updates.forEach(u => {
  const pagePath = path.join(dir, u.folder, 'page.tsx')
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8')
    content = content.replace(u.search, u.replace)
    fs.writeFileSync(pagePath, content)
  }

  const slugPath = path.join(dir, u.folder, '[slug]', 'page.tsx')
  if (fs.existsSync(slugPath)) {
    let content = fs.readFileSync(slugPath, 'utf8')
    content = content.replace(u.search, u.replace)
    fs.writeFileSync(slugPath, content)
  }
})

const systemsPath = path.join(dir, 'systems', 'page.tsx')
if (fs.existsSync(systemsPath)) {
  let content = fs.readFileSync(systemsPath, 'utf8')
  content = content.replace(/'saglik'/g, "'kurumsal_saglik'")
  fs.writeFileSync(systemsPath, content)
}

console.log('Done replacing strings.')
