const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'content', 'articles')
const categories = ['dusunce_yazilarim', 'genel_tip', 'is_sagligi', 'kurumsal_saglik', 'longevity', 'neuroperformance', 'spor']

categories.forEach(c => {
  const p = path.join(dir, c, 'hazirlik-asamasinda.mdx')
  const content = `---
title: "İçerik Hazırlanıyor"
category: "${c}"
date: "2026-01-01"
status: "draft"
excerpt: "Bu kategoriye ait yazılar çok yakında eklenecektir."
---

Bu kategoriye ait makaleler hazırlanma aşamasındadır. Çok yakında burada okunabilir olacaktır.
`
  fs.writeFileSync(p, content)
})

console.log('Dummy files created.')
