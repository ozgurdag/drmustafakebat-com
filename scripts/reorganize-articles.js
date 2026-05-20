const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles')

const CATEGORY_MAP = {
  // longevity
  'Doğal Antiaging': 'longevity',
  'Yaşlılık & Kronik Hast.': 'longevity',
  'Antioksidanlar': 'longevity',

  // beslenme
  'Kan Tahlilleri & Biyokimya': 'beslenme',
  'Vitaminler & Mineraller': 'beslenme',
  'Vitamin ve Mineral': 'beslenme',
  'Beslenme & Diyet': 'beslenme',
  'Sindirim Sistemi': 'beslenme',
  'Diyabet & İnsülin Direnci': 'beslenme',
  'İlaçlar & Farmakoloji': 'beslenme',

  // saglik
  'Genel Sağlık': 'saglik',
  'Kardiyovasküler': 'saglik',
  'Kardiyovasküler Sağlık': 'saglik',
  'Enfeksiyon & Bağışıklık': 'saglik',
  'Kozmetik Dermatoloji': 'saglik',
  'Solunum Sistemi': 'saglik',
  'Kanser & Onkoloji': 'saglik',
  'Tiroid Hastalıkları': 'saglik',
  'Hormonlar & Endokrin': 'saglik',

  // neuroperformance
  'Egzersiz & Fiziksel Aktivite': 'neuroperformance',
  'Psikoloji & Ruh Sağlığı': 'neuroperformance',
  'Uyku & Biyolojik Ritim': 'neuroperformance',
  'Uyku & Vardiyalı Çalışma': 'neuroperformance',
  'Nöroloji & Beyin': 'neuroperformance',
  'Tükenmişlik & Stres': 'neuroperformance',
  'Fiziksel Performans': 'neuroperformance',
  'Nöroergonomi': 'neuroperformance',
  'Bilişsel Performans': 'neuroperformance',

  // isg
  'İSG & Güvenlik': 'isg',
  'Ekipman & Makine Güvenliği': 'isg',
  'İş Kazaları': 'isg',
  'Fiziksel Riskler & Ergonomi': 'isg',
  'Risk & KKD': 'isg',
  'Kurumsal Sağlık': 'isg',
  'Kurumsal Protokoller': 'isg',

  // acil
  'Acil Durum & İlk Yardım': 'acil',
  'Yangın Güvenliği': 'acil',

  // mevzuat
  'Mevzuat & Yaptırımlar': 'mevzuat',
  'Eğitim & Sertifikasyon': 'mevzuat',

  // kimyasal
  'Kimyasal & Toksikoloji': 'kimyasal',
}

const ALL_CATEGORIES = ['longevity', 'systems', 'neuroperformance', 'beslenme', 'saglik', 'isg', 'acil', 'mevzuat', 'kimyasal']

// Create new folders
for (const cat of ALL_CATEGORIES) {
  const dir = path.join(ARTICLES_DIR, cat)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created folder: ${cat}/`)
  }
}

// Collect all files from current 3 folders
const SOURCE_FOLDERS = ['longevity', 'systems', 'neuroperformance']
const allFiles = []

for (const folder of SOURCE_FOLDERS) {
  const dir = path.join(ARTICLES_DIR, folder)
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
  for (const file of files) {
    allFiles.push({ folder, file })
  }
}

console.log(`\nTotal files to process: ${allFiles.length}`)

// Track filenames in target folders to avoid conflicts
const usedNames = {}
for (const cat of ALL_CATEGORIES) usedNames[cat] = new Set()

const stats = {}
for (const cat of ALL_CATEGORIES) stats[cat] = 0

let unmapped = 0
const unmappedValues = {}

for (const { folder, file } of allFiles) {
  const srcPath = path.join(ARTICLES_DIR, folder, file)
  const raw = fs.readFileSync(srcPath, 'utf8')
  const { data } = matter(raw)
  const altBaslik1 = data.altBaslik1 ? data.altBaslik1.trim() : ''

  const targetCat = CATEGORY_MAP[altBaslik1] || 'saglik'

  if (!CATEGORY_MAP[altBaslik1]) {
    unmapped++
    unmappedValues[altBaslik1] = (unmappedValues[altBaslik1] || 0) + 1
  }

  // Handle filename conflicts
  let targetFile = file
  if (usedNames[targetCat].has(file)) {
    targetFile = `${folder}-${file}`
    // Still conflicts? Add counter
    let counter = 2
    while (usedNames[targetCat].has(targetFile)) {
      targetFile = `${folder}-${counter}-${file}`
      counter++
    }
  }
  usedNames[targetCat].add(targetFile)

  const destPath = path.join(ARTICLES_DIR, targetCat, targetFile)

  // Skip if already in correct folder with correct name
  if (srcPath === destPath) {
    stats[targetCat]++
    continue
  }

  fs.copyFileSync(srcPath, destPath)
  stats[targetCat]++
}

console.log('\n--- Results ---')
for (const cat of ALL_CATEGORIES) {
  console.log(`${cat}: ${stats[cat]} articles`)
}

if (unmapped > 0) {
  console.log(`\nUnmapped altBaslik1 values (sent to saglik): ${unmapped}`)
  for (const [val, count] of Object.entries(unmappedValues)) {
    console.log(`  "${val}": ${count}`)
  }
}

// Now delete old files from source folders (only if they were moved)
console.log('\nCleaning up source folders...')
for (const { folder, file } of allFiles) {
  const srcPath = path.join(ARTICLES_DIR, folder, file)
  const raw = fs.readFileSync(srcPath, 'utf8')
  const { data } = matter(raw)
  const altBaslik1 = data.altBaslik1 ? data.altBaslik1.trim() : ''
  const targetCat = CATEGORY_MAP[altBaslik1] || 'saglik'

  // If the file should be in a different folder, delete from source
  if (targetCat !== folder) {
    fs.unlinkSync(srcPath)
  }
}

console.log('\nReorganization complete!')
console.log('Old folders (longevity, systems, neuroperformance) now contain only their correct articles.')
