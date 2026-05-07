const fs = require('fs')
const path = require('path')

const data = require('../data/tetkik_data.json')

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

// Kategori haritalama
function mapCategory(item) {
  const neuroSubtopics = ['Psikoloji & Ruh Sağlığı', 'Uyku & Vardiyalı Çalışma', 'Egzersiz & Fiziksel Aktivite', 'Nöroloji & Beyin', 'Eğitim & Sertifikasyon']
  const systemsAnaKapsam = ['İş Sağlığı ve Güvenliği', 'İSG & Sağlık', 'Mevzuat & Hukuk', 'Rehber & Kılavuz']

  if (systemsAnaKapsam.includes(item.anaKapsam)) return 'systems'
  if (neuroSubtopics.includes(item.altBaslik1)) return 'neuroperformance'
  if (item.anaKapsam === 'Sağlık & Tıp' || item.anaKapsam === 'Genel') return 'longevity'
  return null
}

// altBaslik1 → site uyumlu hale getir
function normalizeSubtopic(altBaslik1, category) {
  if (!altBaslik1 || altBaslik1 === '') {
    return category === 'systems' ? 'İş Güvenliği' : category === 'neuroperformance' ? 'Zihin & Performans' : 'Genel Sağlık'
  }
  return altBaslik1
}

// MDX içerik şablonu
function createMdxContent(item, category) {
  const date = item.tarih || '2024-01-01'
  const slug = toSlug(item.title)
  const altBaslik1 = normalizeSubtopic(item.altBaslik1, category)
  const altBaslik2 = item.altBaslik2 || ''

  const excerpts = {
    longevity: `${item.title} konusunda güncel araştırmalar ve klinik veriler ışığında kapsamlı bir değerlendirme.`,
    systems: `${item.title} başlığı altında iş sağlığı ve güvenliği perspektifinden pratik bilgiler ve uygulamalar.`,
    neuroperformance: `${item.title} alanında nörolojik ve performans odaklı yaklaşımlar ile uygulamalı stratejiler.`
  }

  const intro = {
    longevity: 'Sağlık ve yaşam kalitesi üzerine yapılan araştırmalar, bu alanda dikkat edilmesi gereken önemli noktaları ortaya koymaktadır.',
    systems: 'Kurumsal sağlık ve iş güvenliği sistemleri, çalışan sağlığının korunmasında kritik bir rol oynamaktadır.',
    neuroperformance: 'Zihinsel performans ve nörobilim alanındaki son gelişmeler, bireysel ve kurumsal verimlilik üzerinde derin etkiler bırakmaktadır.'
  }

  const frontmatter = `---
title: "${item.title.replace(/"/g, "'")}"
category: "${category}"
altBaslik1: "${altBaslik1}"
altBaslik2: "${altBaslik2}"
date: "${date}"
excerpt: "${excerpts[category]}"
---`

  const body = `
## Giriş

${intro[category]}

Bu makalede, **${item.title}** konusu ele alınmakta; mevcut bilimsel literatür ve klinik deneyimler ışığında değerlendirmeler sunulmaktadır.

## Temel Bilgiler

${item.title} alanında bilinmesi gereken başlıca konular şu şekilde özetlenebilir:

- Güncel araştırma bulguları ve kanıta dayalı yaklaşımlar
- Pratik uygulama önerileri ve protokoller
- Risk faktörleri ve önleyici stratejiler
- İzleme ve değerlendirme kriterleri

## Klinik Değerlendirme

${category === 'longevity' ? 'Bireysel sağlık yönetiminde bu konunun önemi giderek artmaktadır. Biyolojik yaş optimizasyonu ve metabolik sağlık açısından değerlendirildiğinde, kanıta dayalı yaklaşımların benimsenmesi büyük önem taşımaktadır.' : ''}
${category === 'systems' ? 'Kurumsal düzeyde bu konunun ele alınması, çalışan sağlığı ve iş güvenliği açısından kritik öneme sahiptir. İSG mevzuatı çerçevesinde uygun sistemlerin kurulması ve sürdürülmesi gerekmektedir.' : ''}
${category === 'neuroperformance' ? 'Nöroergonomi ve performans psikolojisi perspektifinden bu konu incelendiğinde, bilişsel süreçler ve fiziksel sağlık arasındaki karşılıklı etkileşim net biçimde ortaya çıkmaktadır.' : ''}

## Uygulama Önerileri

1. Bireysel veya kurumsal düzeyde mevcut durumu değerlendirin
2. Kanıta dayalı protokolleri uygulama planına dahil edin
3. Düzenli takip ve izleme sistemleri kurun
4. Gerektiğinde uzman desteği alın

## Sonuç

${item.title} konusunda farkındalık ve bilgi düzeyini artırmak, daha sağlıklı bireyler ve kurumlar için temel bir adımdır. Bu alandaki gelişmeleri takip etmek ve uygulamalara yansıtmak büyük önem taşımaktadır.

---

*Bu makale Dr. Mustafa Kebat tarafından hazırlanmıştır. Daha fazla bilgi için [iletişim](/iletisim) sayfasını ziyaret edebilirsiniz.*
`

  return { frontmatter: frontmatter + body, slug }
}

// Mevcut slug'ları takip et (çakışmaları önlemek için)
const usedSlugs = new Set()

// Mevcut MDX dosyalarını oku
;['longevity', 'systems', 'neuroperformance'].forEach(cat => {
  const dir = path.join(__dirname, '../content/articles', cat)
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => usedSlugs.add(f.replace('.mdx', '')))
  }
})

// Kategori başına oluşturulacak makale sayısı
const LIMITS = { longevity: 20, systems: 15, neuroperformance: 10 }
const counts = { longevity: 0, systems: 0, neuroperformance: 0 }

let created = 0

for (const item of data) {
  const category = mapCategory(item)
  if (!category) continue
  if (counts[category] >= LIMITS[category]) continue

  let slug = toSlug(item.title)
  if (!slug || slug.length < 3) continue

  // Benzersiz slug
  let finalSlug = slug
  let i = 2
  while (usedSlugs.has(finalSlug)) {
    finalSlug = `${slug}-${i++}`
  }
  usedSlugs.add(finalSlug)

  const dir = path.join(__dirname, '../content/articles', category)
  fs.mkdirSync(dir, { recursive: true })

  const { frontmatter } = createMdxContent(item, category)
  fs.writeFileSync(path.join(dir, `${finalSlug}.mdx`), frontmatter)

  counts[category]++
  created++
}

console.log('Oluşturulan makaleler:')
Object.entries(counts).forEach(([k, v]) => console.log(` ${k}: ${v} makale`))
console.log('Toplam:', created, 'yeni MDX dosyası')
