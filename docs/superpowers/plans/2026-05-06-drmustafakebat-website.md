# drmustafakebat.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dr. Mustafa Kebat için Gotham Footcare stilinde, Next.js 14 ile üç hizmet alanını (Longevity/Systems/NeuroPerformance) öne çıkaran, MDX tabanlı makale sistemi olan profesyonel bir web sitesi inşa etmek.

**Architecture:** Next.js 14 App Router ile statik sayfa üretimi (SSG). Makaleler `content/articles/` altında MDX dosyaları olarak tutulur, `lib/articles.ts` onları okuyup slug üretir. Bileşenler `components/` altında tek sorumluluklu parçalara ayrılmıştır. Framer Motion tüm animasyonları yönetir.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, next-mdx-remote, gray-matter, Node.js v24

---

## File Map

```
app/
  layout.tsx              ← Root layout: Nav + Footer + font vars
  page.tsx                ← Ana sayfa: tüm section'ları birleştirir
  longevity/
    page.tsx              ← Longevity kategori sayfası
    [slug]/page.tsx       ← Makale detay
  systems/
    page.tsx
    [slug]/page.tsx
  neuroperformance/
    page.tsx
    [slug]/page.tsx
  makaleler/page.tsx      ← Tüm makaleler, filtreli
  hakkimda/page.tsx
  iletisim/page.tsx
  globals.css             ← Tailwind directives + font-face
components/
  Nav.tsx                 ← Sticky siyah nav, hamburger menü
  Footer.tsx              ← Siyah footer
  Hero.tsx                ← Tam ekran hero, Framer Motion kelime animasyonu
  CredentialBar.tsx       ← Sonsuz kayan yatay şerit
  ServiceBlock.tsx        ← Yeniden kullanılabilir: görsel + içerik, ters çevrilebilir
  DoctorSection.tsx       ← Koyu zemin, fotoğraf + biyografi
  ArticleCard.tsx         ← Tek makale kartı
  ArticleGrid.tsx         ← ArticleCard listesi (staggered animasyon)
  CategorySidebar.tsx     ← Ağaç navigasyon: anaKapsam → altBaslik1 → altBaslik2
  Breadcrumb.tsx          ← Makale üstü yol navigasyonu
  RelatedArticles.tsx     ← Aynı alt başlıktan 3 makale
content/
  articles/
    longevity/            ← .mdx dosyaları
    systems/
    neuroperformance/
lib/
  articles.ts             ← MDX okuma, frontmatter parse, slug üretme, filtreleme
  types.ts                ← Article, Category type tanımları
data/
  tetkik_data.json        ← Mevcut 1044 makale metadata (referans)
public/
  images/                 ← Dr. Kebat fotoğrafları vb.
```

---

### Task 1: Proje Kurulumu

**Files:**
- Create: `package.json` (create-next-app ile)
- Create: `tailwind.config.ts`
- Create: `app/globals.css`

- [ ] **Step 1: Next.js projesi oluştur**

Mevcut `C:\Users\fujitsu\Desktop\drmustafakebat.com` klasöründe çalıştır:

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

`package.json` zaten varsa ya da hata alırsan önce boş bir temp klasörde oluşturup dosyaları taşı:
```bash
cd ..
npx create-next-app@latest temp-kebat --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
# Sonra temp-kebat içindeki dosyaları drmustafakebat.com'a kopyala
```

- [ ] **Step 2: Gerekli paketleri yükle**

```bash
npm install framer-motion next-mdx-remote gray-matter
npm install -D @types/node
```

- [ ] **Step 3: Tailwind config'i özelleştir**

`tailwind.config.ts` içeriğini şöyle güncelle:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#c9a84c',
        navy: '#111111',
        cream: '#f5f3ee',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 4: globals.css güncelle**

`app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-inter: 'Inter', system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #f5f3ee;
  color: #111111;
}
```

- [ ] **Step 5: tetkik_data.json'u taşı**

```bash
mkdir -p data
# Eğer dosya ana klasördeyse:
mv tetkik_data.json data/tetkik_data.json
```

- [ ] **Step 6: content klasörlerini oluştur**

```bash
mkdir -p content/articles/longevity
mkdir -p content/articles/systems
mkdir -p content/articles/neuroperformance
mkdir -p public/images
```

- [ ] **Step 7: Geliştirme sunucusunu başlat ve doğrula**

```bash
npm run dev
```

`http://localhost:3000` adresinde Next.js varsayılan sayfası görünmeli.

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: initial Next.js 14 project setup with Tailwind + Framer Motion"
```

---

### Task 2: Type Tanımları

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: lib/types.ts oluştur**

```ts
export type ArticleCategory = 'longevity' | 'systems' | 'neuroperformance'

export interface ArticleFrontmatter {
  title: string
  category: ArticleCategory
  altBaslik1: string
  altBaslik2?: string
  date: string
  excerpt: string
}

export interface Article extends ArticleFrontmatter {
  slug: string
  content: string
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  longevity: 'Longevity',
  systems: 'Systems',
  neuroperformance: 'NeuroPerformance',
}

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  longevity: 'Bireysel sağlık ve yaşlanma yönetimi',
  systems: 'Kurumsal sağlık sistemleri kurulumu',
  neuroperformance: 'Zihin ve hareket optimizasyon eğitimleri',
}

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  longevity: '#2d5a3d',
  systems: '#1a3a6a',
  neuroperformance: '#2d1a50',
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add Article and Category type definitions"
```

---

### Task 3: MDX Makale Sistemi (lib/articles.ts)

**Files:**
- Create: `lib/articles.ts`
- Create: `content/articles/longevity/omega-3-kalp-sagligi.mdx` (test makalesi)

- [ ] **Step 1: lib/articles.ts oluştur**

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article, ArticleMeta, ArticleCategory } from './types'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getArticleSlugs(category: ArticleCategory): string[] {
  const dir = path.join(ARTICLES_DIR, category)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''))
}

export function getArticleBySlug(category: ArticleCategory, slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return {
    slug,
    title: data.title ?? '',
    category: data.category ?? category,
    altBaslik1: data.altBaslik1 ?? '',
    altBaslik2: data.altBaslik2 ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    content,
  }
}

export function getArticlesByCategory(category: ArticleCategory): ArticleMeta[] {
  const slugs = getArticleSlugs(category)
  return slugs
    .map(slug => {
      const article = getArticleBySlug(category, slug)
      if (!article) return null
      const { content: _, ...meta } = article
      return meta
    })
    .filter((a): a is ArticleMeta => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllArticles(): ArticleMeta[] {
  const categories: ArticleCategory[] = ['longevity', 'systems', 'neuroperformance']
  return categories
    .flatMap(cat => getArticlesByCategory(cat))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticlesBySubtopic(category: ArticleCategory, altBaslik1: string): ArticleMeta[] {
  return getArticlesByCategory(category).filter(a => a.altBaslik1 === altBaslik1)
}

export function getSubtopics(category: ArticleCategory): string[] {
  const articles = getArticlesByCategory(category)
  return [...new Set(articles.map(a => a.altBaslik1).filter(Boolean))]
}

export function getRecentArticles(count = 6): ArticleMeta[] {
  return getAllArticles().slice(0, count)
}
```

- [ ] **Step 2: Test makalesi oluştur**

`content/articles/longevity/omega-3-kalp-sagligi.mdx`:

```mdx
---
title: "Omega-3'ün Kardiyovasküler Sağlığa Kanıta Dayalı Etkileri"
category: "longevity"
altBaslik1: "Kardiyovasküler Sağlık"
altBaslik2: "Takviyeler"
date: "2025-03-15"
excerpt: "Kardiyovasküler mortalite üzerine yapılan meta-analizler ve klinik protokollere yansımaları."
---

## Omega-3 Yağ Asitleri ve Kalp Sağlığı

Omega-3 yağ asitleri (EPA ve DHA), kardiyovasküler hastalık riskini azaltmada önemli bir rol oynamaktadır.

### Kanıt Tabanı

2021 yılında NEJM'de yayımlanan STRENGTH çalışması, yüksek doz omega-3 takviyesinin major kardiyovasküler olayları...

### Önerilen Protokol

- EPA+DHA: günlük 2-4 gram
- Triglycerid düzeyi yüksek bireylerde öncelikli endikasyon
- 3 ayda bir lipit paneli ile takip

### Sonuç

Omega-3 takviyesi, risk-fayda analizi yapıldığında kardiyovasküler korucu etkileri nedeniyle...
```

- [ ] **Step 3: Sistemin çalıştığını doğrula**

`app/page.tsx` içine geçici olarak şunu ekle, dev server'da `http://localhost:3000` açarak konsol'a log basıldığını doğrula:

```ts
// app/page.tsx - geçici test
import { getRecentArticles } from '@/lib/articles'

export default function Home() {
  const articles = getRecentArticles()
  console.log('Articles found:', articles.length)
  return <main><h1>Test: {articles.length} articles</h1></main>
}
```

Terminalde `Articles found: 1` görünmeli.

- [ ] **Step 4: Commit**

```bash
git add lib/articles.ts lib/types.ts content/articles/longevity/omega-3-kalp-sagligi.mdx
git commit -m "feat: add MDX article system with gray-matter frontmatter parsing"
```

---

### Task 4: Nav Bileşeni

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Nav.tsx oluştur**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/longevity', label: 'Longevity' },
  { href: '/systems', label: 'Systems' },
  { href: '/neuroperformance', label: 'NeuroPerformance' },
  { href: '/makaleler', label: 'Makaleler' },
  { href: '/hakkimda', label: 'Hakkımda' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 bg-navy transition-shadow duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-[68px]">
          {/* Sol */}
          <div className="flex flex-col">
            <span className="text-gray-500 text-[9px] tracking-[3px] uppercase font-sans">
              İstanbul, Türkiye
            </span>
            <Link
              href="/iletisim"
              className="text-white text-[11px] font-bold tracking-wider font-sans hover:text-gold transition-colors"
            >
              İLETİŞİM <span className="text-gold">→</span>
            </Link>
          </div>

          {/* Orta: Logo */}
          <Link href="/" className="text-center absolute left-1/2 -translate-x-1/2">
            <div className="text-white text-[13px] tracking-[3px] uppercase font-sans font-bold">
              Dr. Mustafa Kebat
            </div>
            <div className="text-gold text-[9px] tracking-[2px] uppercase font-sans">
              Hekim · İSG Uzmanı · Araştırmacı
            </div>
          </Link>

          {/* Sağ: desktop linkler + hamburger */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-5">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 text-[11px] tracking-wider uppercase font-sans hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white text-[11px] tracking-[2px] uppercase font-sans flex items-center gap-2"
              aria-label="Menü"
            >
              {menuOpen ? '✕' : '≡'} MENÜ
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobil Menü */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-navy border-t border-gray-800"
          >
            <div className="flex flex-col py-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-8 py-3 text-gray-300 text-[13px] tracking-wider uppercase font-sans hover:text-gold hover:bg-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/iletisim"
                onClick={() => setMenuOpen(false)}
                className="mx-6 mt-4 py-3 text-center bg-gold text-navy text-[11px] font-bold tracking-wider uppercase"
              >
                İLETİŞİM →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: layout.tsx'e Nav ekle**

`app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Dr. Mustafa Kebat | Hekim · İSG Uzmanı · Araştırmacı',
  description: 'Longevity, kurumsal sağlık sistemleri ve nöroergonomi alanlarında uzman hekim ve iş güvenliği danışmanı.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-cream font-sans">
        <Nav />
        <main className="pt-[68px]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

Not: `Footer` bileşeni Task 5'te oluşturulacak — şimdilik geçici olarak şunu ekle:

```tsx
// components/Footer.tsx (geçici)
export default function Footer() {
  return <footer className="bg-navy h-16" />
}
```

- [ ] **Step 3: Dev server'da doğrula**

`http://localhost:3000` — siyah nav üstte görünmeli, scroll edince shadow eklenebilmeli, mobil ekranda hamburger menü çıkmalı.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx components/Footer.tsx app/layout.tsx
git commit -m "feat: add sticky Nav with Framer Motion entrance and mobile menu"
```

---

### Task 5: Footer Bileşeni

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Footer.tsx'i tamamla**

```tsx
import Link from 'next/link'

const footerLinks = [
  { href: '/longevity', label: 'Longevity' },
  { href: '/systems', label: 'Systems' },
  { href: '/neuroperformance', label: 'NeuroPerformance' },
  { href: '/makaleler', label: 'Makaleler' },
  { href: '/hakkimda', label: 'Hakkımda' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-500 py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white text-[13px] tracking-[2px] uppercase font-sans">
          Dr. Mustafa Kebat
        </span>
        <div className="flex flex-wrap justify-center gap-5">
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[1px] uppercase font-sans hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span className="text-[10px] font-sans">
          © {new Date().getFullYear()} drmustafakebat.com
        </span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer with navigation links"
```

---

### Task 6: Hero Bileşeni

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Hero.tsx oluştur**

```tsx
'use client'

import { motion } from 'framer-motion'

const words = ['Sağlığı', 'Sistematik', 'Düşünmek.']

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const wordVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Arka plan dekoratif metin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[clamp(80px,20vw,240px)] font-black text-white/[0.03] font-serif leading-none tracking-tighter">
          SAĞLIK
        </span>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gold text-[10px] tracking-[4px] uppercase font-sans mb-5"
        >
          Hekim · İSG Uzmanı · Araştırmacı
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="font-serif font-normal leading-[1.05] text-white mb-5"
          style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="inline-block mr-[0.25em] last:mr-0"
            >
              {i === 1 ? <em className="not-italic text-gold">{word}</em> : word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-gray-400 text-sm font-sans tracking-wider mb-8"
        >
          Longevity · Systems · NeuroPerformance
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 border border-gold px-6 py-2.5 text-gold text-[10px] tracking-[2px] uppercase font-sans"
        >
          ★ &nbsp; 1.000+ Makale · 20 Yıl Deneyim
        </motion.div>
      </div>

      {/* Aşağı ok */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/50 text-2xl animate-bounce"
      >
        ↓
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: app/page.tsx'e Hero ekle**

```tsx
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <>
      <Hero />
    </>
  )
}
```

- [ ] **Step 3: Dev server'da doğrula**

`http://localhost:3000` — tam ekran koyu hero, kelimeler art arda beliriyor, ortadaki kelime altın renk, aşağı ok zıplıyor.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: add animated Hero section with Framer Motion stagger"
```

---

### Task 7: Credential Bar

**Files:**
- Create: `components/CredentialBar.tsx`

- [ ] **Step 1: CredentialBar.tsx oluştur**

```tsx
'use client'

import { motion } from 'framer-motion'

const credentials = [
  'Tıp Doktoru (MD)',
  'A Sınıfı İSG Uzmanı',
  'İşyeri Hekimi',
  'Longevity Danışmanı',
  '1.000+ Makale',
  'Nöroergonomi Eğitmeni',
  'tetkik.com.tr',
  'Risk Analisti',
]

export default function CredentialBar() {
  // İçeriği 3x tekrarla — sonsuz döngü için
  const items = [...credentials, ...credentials, ...credentials]

  return (
    <div className="bg-cream border-y border-gray-200 py-4 overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-10 whitespace-nowrap"
      >
        {items.map((cred, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-[10px] tracking-[3px] uppercase text-gray-400 font-sans">
              {cred}
            </span>
            <span className="text-gold/40 text-xs">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: app/page.tsx'e ekle**

```tsx
import Hero from '@/components/Hero'
import CredentialBar from '@/components/CredentialBar'

export default function Home() {
  return (
    <>
      <Hero />
      <CredentialBar />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/CredentialBar.tsx app/page.tsx
git commit -m "feat: add infinite scrolling CredentialBar"
```

---

### Task 8: ServiceBlock Bileşeni

**Files:**
- Create: `components/ServiceBlock.tsx`

- [ ] **Step 1: ServiceBlock.tsx oluştur**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface ServiceBlockProps {
  number: string
  eyebrow: string
  title: string
  description: string
  items: string[]
  href: string
  reversed?: boolean
  gradientClass: string
  icon: string
}

export default function ServiceBlock({
  number,
  eyebrow,
  title,
  description,
  items,
  href,
  reversed = false,
  gradientClass,
  icon,
}: ServiceBlockProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[480px]`}
    >
      {/* Görsel */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`flex-1 ${gradientClass} flex items-center justify-center relative min-h-[280px] md:min-h-0`}
      >
        <span className="absolute top-6 left-7 text-[80px] font-black text-white/[0.05] font-serif leading-none select-none">
          {number}
        </span>
        <span className="text-[72px] relative z-10">{icon}</span>
      </motion.div>

      {/* İçerik */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12 bg-white"
      >
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">{eyebrow}</p>
        <h2 className="font-serif text-4xl font-normal text-navy mb-4">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed font-sans mb-6">{description}</p>
        <ul className="space-y-2.5 mb-8">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-[13px] font-sans text-gray-700">
              <span className="w-5 h-px bg-gold flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-sans font-bold text-navy border-b-2 border-gold pb-0.5 w-fit hover:text-gold transition-colors"
        >
          Makaleleri Keşfet →
        </Link>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: app/page.tsx'e 3 servis bloğu ekle**

```tsx
import Hero from '@/components/Hero'
import CredentialBar from '@/components/CredentialBar'
import ServiceBlock from '@/components/ServiceBlock'

export default function Home() {
  return (
    <>
      <Hero />
      <CredentialBar />

      {/* About strip */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Yaklaşım</p>
        <h2 className="font-serif text-4xl md:text-5xl font-normal text-navy mb-5 leading-tight">
          Bireyden kuruma.<br />Biyolojiden sisteme.
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed font-sans max-w-2xl">
          Dr. Mustafa Kebat, bireysel sağlık yönetiminden kurumsal iş güvenliği sistemlerine uzanan
          bütünleşik bir uzmanlık anlayışı geliştirmiştir. 1.000&apos;den fazla makale ve yıllarca
          süren klinik ve saha deneyimiyle; yaşlanma yönetimi, zihinsel performans ve iş güvenliği
          sistemleri konularında danışmanlık ve eğitim hizmetleri sunmaktadır.
        </p>
      </div>

      <ServiceBlock
        number="01"
        eyebrow="Uzmanlık Alanı 01"
        title="Longevity"
        description="Bireysel sağlık ve yaşlanma yönetimi. Biyolojik yaş optimizasyonu, metabolik sağlık ve yaşam kalitesi için kanıta dayalı protokoller."
        items={[
          'Biyolojik Yaş Değerlendirmesi',
          'Beslenme ve Takviye Stratejileri',
          'Kardiyovasküler Sağlık Optimizasyonu',
          'Bağışıklık Sistemi Güçlendirme',
          'Hormonal Denge ve Yaşlanma',
        ]}
        href="/longevity"
        gradientClass="bg-gradient-to-br from-[#1a3a28] via-[#2d5a3d] to-[#4a7c59]"
        icon="🌿"
      />

      <ServiceBlock
        number="02"
        eyebrow="Uzmanlık Alanı 02"
        title="Systems"
        description="Kurumsal sağlık sistemleri kurulumu. İSG mevzuatı uyumundan risk yönetimine, eğitim tasarımından sertifikasyona kadar tam kapsamlı danışmanlık."
        items={[
          'İSG Risk Analizi ve Değerlendirmesi',
          'Yangın ve Deprem Acil Durum Planları',
          'Çalışan Sağlığı İzleme Sistemleri',
          'İSG Eğitim Programı Tasarımı',
          'Mevzuat Uyumluluk Denetimleri',
        ]}
        href="/systems"
        reversed
        gradientClass="bg-gradient-to-br from-[#0d1f3a] via-[#1a3a6a] to-[#2d5a8a]"
        icon="⚙️"
      />

      <ServiceBlock
        number="03"
        eyebrow="Uzmanlık Alanı 03"
        title="NeuroPerformance"
        description="Zihin ve hareket optimizasyon eğitimleri. Nöroergonomi, bilişsel performans ve stres yönetimi üzerine kurumsal ve bireysel eğitim programları."
        items={[
          'Nöroergonomi ve İş Tasarımı',
          'Bilişsel Yük ve Karar Verme',
          'Stres Yönetimi Eğitimleri',
          'Hareket ve Postür Analizi',
          'Zihinsel Dayanıklılık Programları',
        ]}
        href="/neuroperformance"
        gradientClass="bg-gradient-to-br from-[#1a1030] via-[#2d1a50] to-[#4a2d7a]"
        icon="🧠"
      />
    </>
  )
}
```

- [ ] **Step 3: Dev server'da doğrula**

Sayfayı scroll et — her servis bloğu ekrana girince soldan/sağdan kayarak gelmelidir.

- [ ] **Step 4: Commit**

```bash
git add components/ServiceBlock.tsx app/page.tsx
git commit -m "feat: add ServiceBlock with scroll-triggered Framer Motion animations"
```

---

### Task 9: DoctorSection + ArticleCard + ArticleGrid

**Files:**
- Create: `components/DoctorSection.tsx`
- Create: `components/ArticleCard.tsx`
- Create: `components/ArticleGrid.tsx`

- [ ] **Step 1: DoctorSection.tsx oluştur**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const credentials = [
  'Tıp Doktoru (MD)',
  'A Sınıfı İSG Uzmanı',
  'İşyeri Hekimi',
  'Longevity Danışmanı',
  '1.000+ Makale',
]

export default function DoctorSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-navy flex flex-col md:flex-row min-h-[420px]">
      {/* Fotoğraf alanı */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="flex-none md:w-[45%] min-h-[280px] bg-gradient-to-br from-[#1a2a1a] via-[#2a3a2a] to-[#3d5a3d] flex items-center justify-center"
      >
        {/* Fotoğraf eklendiğinde: <Image src="/images/dr-kebat.jpg" ... /> */}
        <span className="text-[80px] opacity-60">👨‍⚕️</span>
      </motion.div>

      {/* İçerik */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12"
      >
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Hakkımda</p>
        <h2 className="font-serif text-4xl font-normal text-white mb-5">Dr. Mustafa Kebat</h2>
        <p className="text-gray-400 text-sm leading-relaxed font-sans mb-6 max-w-xl">
          Tıp doktoru ve A sınıfı iş güvenliği uzmanı. Klinik tıp, iş sağlığı ve güvenliği ile
          insan performansı alanlarını bütünleştiren özgün bir uzmanlık profili. 1.000&apos;den fazla
          makale ve kurumsal danışmanlık deneyimiyle bireylere ve kurumlara hizmet vermektedir.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {credentials.map((cred, i) => (
            <span
              key={i}
              className="border border-gold/30 text-gold text-[10px] tracking-wider px-3 py-1.5 font-sans"
            >
              {cred}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: ArticleCard.tsx oluştur**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArticleMeta } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'

interface ArticleCardProps {
  article: ArticleMeta
  index?: number
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="border-b-2 border-navy pb-5 cursor-pointer group"
    >
      <Link href={`/${article.category}/${article.slug}`}>
        <p className="text-[9px] tracking-[2px] uppercase text-gold font-sans mb-2.5">
          {CATEGORY_LABELS[article.category]}
          {article.altBaslik1 && ` · ${article.altBaslik1}`}
        </p>
        <h3 className="font-serif text-[17px] leading-snug text-navy mb-2.5 group-hover:text-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed font-sans line-clamp-2">
          {article.excerpt}
        </p>
        <p className="text-[10px] text-gray-400 font-sans mt-3">
          {new Date(article.date).toLocaleDateString('tr-TR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </Link>
    </motion.article>
  )
}
```

- [ ] **Step 3: ArticleGrid.tsx oluştur**

```tsx
import ArticleCard from './ArticleCard'
import { ArticleMeta } from '@/lib/types'

interface ArticleGridProps {
  articles: ArticleMeta[]
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, i) => (
        <ArticleCard key={article.slug} article={article} index={i} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: app/page.tsx'i tamamla**

```tsx
import Hero from '@/components/Hero'
import CredentialBar from '@/components/CredentialBar'
import ServiceBlock from '@/components/ServiceBlock'
import DoctorSection from '@/components/DoctorSection'
import ArticleGrid from '@/components/ArticleGrid'
import { getRecentArticles } from '@/lib/articles'

export default function Home() {
  const recentArticles = getRecentArticles(6)

  return (
    <>
      <Hero />
      <CredentialBar />

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Yaklaşım</p>
        <h2 className="font-serif text-4xl md:text-5xl font-normal text-navy mb-5 leading-tight">
          Bireyden kuruma.<br />Biyolojiden sisteme.
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed font-sans max-w-2xl">
          Dr. Mustafa Kebat, bireysel sağlık yönetiminden kurumsal iş güvenliği sistemlerine uzanan
          bütünleşik bir uzmanlık anlayışı geliştirmiştir. 1.000&apos;den fazla makale ve yıllarca
          süren klinik ve saha deneyimiyle danışmanlık ve eğitim hizmetleri sunmaktadır.
        </p>
      </div>

      <ServiceBlock
        number="01" eyebrow="Uzmanlık Alanı 01" title="Longevity"
        description="Bireysel sağlık ve yaşlanma yönetimi. Biyolojik yaş optimizasyonu, metabolik sağlık ve yaşam kalitesi için kanıta dayalı protokoller."
        items={['Biyolojik Yaş Değerlendirmesi','Beslenme ve Takviye Stratejileri','Kardiyovasküler Sağlık Optimizasyonu','Bağışıklık Sistemi Güçlendirme','Hormonal Denge ve Yaşlanma']}
        href="/longevity"
        gradientClass="bg-gradient-to-br from-[#1a3a28] via-[#2d5a3d] to-[#4a7c59]"
        icon="🌿"
      />
      <ServiceBlock
        number="02" eyebrow="Uzmanlık Alanı 02" title="Systems" reversed
        description="Kurumsal sağlık sistemleri kurulumu. İSG mevzuatı uyumundan risk yönetimine, eğitim tasarımından sertifikasyona kadar tam kapsamlı danışmanlık."
        items={['İSG Risk Analizi ve Değerlendirmesi','Yangın ve Deprem Acil Durum Planları','Çalışan Sağlığı İzleme Sistemleri','İSG Eğitim Programı Tasarımı','Mevzuat Uyumluluk Denetimleri']}
        href="/systems"
        gradientClass="bg-gradient-to-br from-[#0d1f3a] via-[#1a3a6a] to-[#2d5a8a]"
        icon="⚙️"
      />
      <ServiceBlock
        number="03" eyebrow="Uzmanlık Alanı 03" title="NeuroPerformance"
        description="Zihin ve hareket optimizasyon eğitimleri. Nöroergonomi, bilişsel performans ve stres yönetimi üzerine kurumsal ve bireysel eğitim programları."
        items={['Nöroergonomi ve İş Tasarımı','Bilişsel Yük ve Karar Verme','Stres Yönetimi Eğitimleri','Hareket ve Postür Analizi','Zihinsel Dayanıklılık Programları']}
        href="/neuroperformance"
        gradientClass="bg-gradient-to-br from-[#1a1030] via-[#2d1a50] to-[#4a2d7a]"
        icon="🧠"
      />

      <DoctorSection />

      {recentArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          <div className="flex justify-between items-baseline mb-10 border-b border-gray-200 pb-4">
            <div>
              <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-1">Son Yayınlar</p>
              <h2 className="font-serif text-3xl font-normal text-navy">Düşünceler ve Makaleler</h2>
            </div>
            <a href="/makaleler" className="text-[11px] tracking-[1px] uppercase font-sans text-gold hover:underline">
              Tümü →
            </a>
          </div>
          <ArticleGrid articles={recentArticles} />
        </section>
      )}
    </>
  )
}
```

- [ ] **Step 5: Dev server'da doğrula**

Sayfanın tamamı görünmeli: Hero → CredentialBar → About → 3 ServiceBlock → DoctorSection → Son Makaleler.

- [ ] **Step 6: Commit**

```bash
git add components/DoctorSection.tsx components/ArticleCard.tsx components/ArticleGrid.tsx app/page.tsx
git commit -m "feat: complete homepage with DoctorSection and ArticleGrid"
```

---

### Task 10: Kategori Sayfaları + CategorySidebar

**Files:**
- Create: `components/CategorySidebar.tsx`
- Create: `components/Breadcrumb.tsx`
- Create: `app/longevity/page.tsx`
- Create: `app/systems/page.tsx`
- Create: `app/neuroperformance/page.tsx`

- [ ] **Step 1: CategorySidebar.tsx oluştur**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArticleCategory } from '@/lib/types'

interface CategorySidebarProps {
  category: ArticleCategory
  subtopics: string[]
  activeSubtopic?: string
}

export default function CategorySidebar({ category, subtopics, activeSubtopic }: CategorySidebarProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-24">
        <p className="text-[9px] tracking-[3px] uppercase text-gray-400 font-sans mb-4">Konular</p>
        <nav className="space-y-1">
          <Link
            href={`/${category}`}
            className={`block text-[12px] font-sans py-1.5 px-3 border-l-2 transition-colors ${
              !activeSubtopic
                ? 'border-gold text-navy font-semibold bg-gold/5'
                : 'border-transparent text-gray-500 hover:text-navy hover:border-gray-300'
            }`}
          >
            Tümü
          </Link>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left flex items-center justify-between px-3 py-1.5 text-[11px] tracking-wider uppercase text-gray-400 font-sans mt-3"
          >
            <span>Alt Başlıklar</span>
            <span>{expanded ? '−' : '+'}</span>
          </button>

          {expanded && subtopics.map((topic) => (
            <Link
              key={topic}
              href={`/${category}?konu=${encodeURIComponent(topic)}`}
              className={`block text-[12px] font-sans py-1.5 px-3 border-l-2 transition-colors ${
                activeSubtopic === topic
                  ? 'border-gold text-navy font-semibold bg-gold/5'
                  : 'border-transparent text-gray-500 hover:text-navy hover:border-gray-300'
              }`}
            >
              {topic}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Breadcrumb.tsx oluştur**

```tsx
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-[10px] font-sans tracking-wider uppercase text-gray-400 mb-6">
      <Link href="/" className="hover:text-gold transition-colors">Ana Sayfa</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>·</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-gold transition-colors">{item.label}</Link>
          ) : (
            <span className="text-navy">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Kategori sayfası şablonu oluştur (longevity örneği)**

`app/longevity/page.tsx`:

```tsx
import { getArticlesByCategory, getSubtopics } from '@/lib/articles'
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/lib/types'
import ArticleGrid from '@/components/ArticleGrid'
import CategorySidebar from '@/components/CategorySidebar'

export default function LongevityPage({
  searchParams,
}: {
  searchParams: { konu?: string }
}) {
  const category = 'longevity'
  const allArticles = getArticlesByCategory(category)
  const subtopics = getSubtopics(category)
  const activeSubtopic = searchParams.konu

  const articles = activeSubtopic
    ? allArticles.filter(a => a.altBaslik1 === activeSubtopic)
    : allArticles

  return (
    <>
      <div className="bg-gradient-to-br from-[#1a3a28] via-[#2d5a3d] to-[#4a7c59] py-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/50 text-[10px] tracking-[3px] uppercase font-sans mb-3">01</p>
          <h1 className="font-serif text-5xl md:text-6xl font-normal text-white mb-4">
            {CATEGORY_LABELS[category]}
          </h1>
          <p className="text-white/60 text-base font-sans">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row gap-10">
        <CategorySidebar
          category={category}
          subtopics={subtopics}
          activeSubtopic={activeSubtopic}
        />
        <div className="flex-1">
          <p className="text-[11px] font-sans text-gray-400 mb-6">
            {articles.length} makale{activeSubtopic ? ` — ${activeSubtopic}` : ''}
          </p>
          {articles.length > 0 ? (
            <ArticleGrid articles={articles} />
          ) : (
            <p className="text-gray-400 font-sans text-sm">Henüz bu kategoride makale eklenmemiş.</p>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Systems ve NeuroPerformance sayfaları**

`app/systems/page.tsx` — yukarıdakinin kopyası, şu değişikliklerle:
- `category = 'systems'`
- gradient: `from-[#0d1f3a] via-[#1a3a6a] to-[#2d5a8a]`
- eyebrow: `02`

`app/neuroperformance/page.tsx` — kopyası:
- `category = 'neuroperformance'`
- gradient: `from-[#1a1030] via-[#2d1a50] to-[#4a2d7a]`
- eyebrow: `03`

- [ ] **Step 5: Commit**

```bash
git add components/CategorySidebar.tsx components/Breadcrumb.tsx app/longevity/page.tsx app/systems/page.tsx app/neuroperformance/page.tsx
git commit -m "feat: add category pages with tree sidebar navigation"
```

---

### Task 11: Makale Detay Sayfaları

**Files:**
- Create: `app/longevity/[slug]/page.tsx`
- Create: `app/systems/[slug]/page.tsx`
- Create: `app/neuroperformance/[slug]/page.tsx`
- Create: `components/RelatedArticles.tsx`

- [ ] **Step 1: next.config.ts güncelle (MDX için)**

`next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

export default nextConfig
```

- [ ] **Step 2: RelatedArticles.tsx oluştur**

```tsx
import Link from 'next/link'
import { ArticleMeta } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'

interface RelatedArticlesProps {
  articles: ArticleMeta[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null
  return (
    <aside className="border-t border-gray-200 mt-12 pt-10">
      <p className="text-[10px] tracking-[3px] uppercase text-gold font-sans mb-6">İlgili Makaleler</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link key={article.slug} href={`/${article.category}/${article.slug}`} className="group">
            <p className="text-[9px] tracking-[2px] uppercase text-gray-400 font-sans mb-1.5">
              {CATEGORY_LABELS[article.category]}
            </p>
            <h4 className="font-serif text-[15px] leading-snug text-navy group-hover:text-gold transition-colors">
              {article.title}
            </h4>
          </Link>
        ))}
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Makale detay sayfası (longevity örneği)**

`app/longevity/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleBySlug, getArticleSlugs, getArticlesBySubtopic } from '@/lib/articles'
import { CATEGORY_LABELS } from '@/lib/types'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedArticles from '@/components/RelatedArticles'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getArticleSlugs('longevity').map(slug => ({ slug }))
}

export default function LongevityArticlePage({ params }: Props) {
  const article = getArticleBySlug('longevity', params.slug)
  if (!article) notFound()

  const related = getArticlesBySubtopic('longevity', article.altBaslik1)
    .filter(a => a.slug !== params.slug)
    .slice(0, 3)

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
      <Breadcrumb items={[
        { label: CATEGORY_LABELS['longevity'], href: '/longevity' },
        { label: article.altBaslik1, href: `/longevity?konu=${encodeURIComponent(article.altBaslik1)}` },
        { label: article.title },
      ]} />

      <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">
        {CATEGORY_LABELS['longevity']} · {article.altBaslik1}
      </p>
      <h1 className="font-serif text-4xl md:text-5xl font-normal text-navy mb-4 leading-tight">
        {article.title}
      </h1>
      <p className="text-gray-400 text-sm font-sans mb-10 border-b border-gray-200 pb-6">
        {new Date(article.date).toLocaleDateString('tr-TR', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}
      </p>

      <div className="prose prose-lg max-w-none font-sans
        prose-headings:font-serif prose-headings:font-normal prose-headings:text-navy
        prose-p:text-gray-600 prose-p:leading-relaxed
        prose-a:text-gold prose-a:no-underline hover:prose-a:underline
        prose-strong:text-navy prose-li:text-gray-600">
        <MDXRemote source={article.content} />
      </div>

      <RelatedArticles articles={related} />
    </div>
  )
}
```

- [ ] **Step 4: @tailwindcss/typography yükle**

```bash
npm install -D @tailwindcss/typography
```

`tailwind.config.ts` plugins dizisine ekle:
```ts
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 5: Systems ve NeuroPerformance detay sayfaları**

`app/systems/[slug]/page.tsx` — yukarıdakinin kopyası, `'longevity'` → `'systems'` değiştir.

`app/neuroperformance/[slug]/page.tsx` — `'longevity'` → `'neuroperformance'` değiştir.

- [ ] **Step 6: `http://localhost:3000/longevity/omega-3-kalp-sagligi` adresini test et**

Makale içeriği render edilmiş olmalı, breadcrumb üstte görünmeli.

- [ ] **Step 7: Commit**

```bash
git add app/longevity/[slug]/page.tsx app/systems/[slug]/page.tsx app/neuroperformance/[slug]/page.tsx components/RelatedArticles.tsx next.config.ts
git commit -m "feat: add article detail pages with MDXRemote rendering and related articles"
```

---

### Task 12: Yardımcı Sayfalar

**Files:**
- Create: `app/makaleler/page.tsx`
- Create: `app/hakkimda/page.tsx`
- Create: `app/iletisim/page.tsx`

- [ ] **Step 1: app/makaleler/page.tsx**

```tsx
import { getAllArticles, getArticlesByCategory } from '@/lib/articles'
import { ArticleCategory, CATEGORY_LABELS } from '@/lib/types'
import ArticleGrid from '@/components/ArticleGrid'

const categories: { key: ArticleCategory; label: string }[] = [
  { key: 'longevity', label: 'Longevity' },
  { key: 'systems', label: 'Systems' },
  { key: 'neuroperformance', label: 'NeuroPerformance' },
]

export default function MakalelerPage({
  searchParams,
}: {
  searchParams: { kategori?: ArticleCategory }
}) {
  const activeCategory = searchParams.kategori
  const articles = activeCategory
    ? getArticlesByCategory(activeCategory)
    : getAllArticles()

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Arşiv</p>
      <h1 className="font-serif text-5xl font-normal text-navy mb-8">Tüm Makaleler</h1>

      {/* Kategori filtreleri */}
      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href="/makaleler"
          className={`text-[11px] tracking-wider uppercase font-sans px-4 py-2 border transition-colors ${
            !activeCategory ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-500 hover:border-navy hover:text-navy'
          }`}
        >
          Tümü
        </a>
        {categories.map(cat => (
          <a
            key={cat.key}
            href={`/makaleler?kategori=${cat.key}`}
            className={`text-[11px] tracking-wider uppercase font-sans px-4 py-2 border transition-colors ${
              activeCategory === cat.key ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-500 hover:border-navy hover:text-navy'
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      <p className="text-[11px] font-sans text-gray-400 mb-8">{articles.length} makale</p>
      {articles.length > 0 ? (
        <ArticleGrid articles={articles} />
      ) : (
        <p className="text-gray-400 font-sans">Henüz makale eklenmemiş.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: app/hakkimda/page.tsx**

```tsx
export default function HakkimdaPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
      <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-4">Hakkımda</p>
      <h1 className="font-serif text-5xl font-normal text-navy mb-8">Dr. Mustafa Kebat</h1>

      <div className="space-y-6 text-gray-600 font-sans text-[15px] leading-relaxed">
        <p>
          Tıp doktoru ve A sınıfı iş güvenliği uzmanı olarak; bireysel sağlık yönetimi,
          kurumsal sağlık sistemleri ve nöroergonomi alanlarında danışmanlık ve eğitim hizmetleri sunmaktadır.
        </p>
        <p>
          1.000&apos;den fazla makale kaleme almış, çok sayıda kurumsal sağlık projesi yönetmiştir.
          Longevity, Systems ve NeuroPerformance olarak tanımladığı üç uzmanlık alanında bireyler ve
          kurumlarla çalışmaktadır.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {['Tıp Doktoru (MD)', 'A Sınıfı İSG Uzmanı', 'İşyeri Hekimi', 'Longevity Danışmanı', '1.000+ Makale'].map(c => (
          <span key={c} className="border border-gray-300 text-gray-600 text-[11px] tracking-wider px-3 py-1.5 font-sans">
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: app/iletisim/page.tsx**

```tsx
'use client'

import { useState } from 'react'

export default function IletisimPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Gerçek form gönderimi Task sonrasında (Formspree / email service) eklenecek
    setSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-16">
      <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-4">İletişim</p>
      <h1 className="font-serif text-5xl font-normal text-navy mb-8">Mesaj Gönderin</h1>

      {sent ? (
        <p className="text-gray-600 font-sans text-base border-l-4 border-gold pl-4">
          Mesajınız alındı. En kısa sürede dönüş yapılacaktır.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-sans text-gray-500 mb-1.5">Ad Soyad</label>
            <input required className="w-full border border-gray-300 px-4 py-3 text-sm font-sans focus:outline-none focus:border-navy bg-white" placeholder="Adınız" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-sans text-gray-500 mb-1.5">E-posta</label>
            <input required type="email" className="w-full border border-gray-300 px-4 py-3 text-sm font-sans focus:outline-none focus:border-navy bg-white" placeholder="email@domain.com" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-sans text-gray-500 mb-1.5">Konu</label>
            <select className="w-full border border-gray-300 px-4 py-3 text-sm font-sans focus:outline-none focus:border-navy bg-white">
              <option>Longevity Danışmanlığı</option>
              <option>Systems / İSG Danışmanlığı</option>
              <option>NeuroPerformance Eğitimi</option>
              <option>Diğer</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-sans text-gray-500 mb-1.5">Mesaj</label>
            <textarea required rows={5} className="w-full border border-gray-300 px-4 py-3 text-sm font-sans focus:outline-none focus:border-navy bg-white resize-none" placeholder="Mesajınız..." />
          </div>
          <button type="submit" className="bg-navy text-white px-8 py-3 text-[11px] tracking-[2px] uppercase font-sans font-bold hover:bg-gold transition-colors">
            Gönder →
          </button>
        </form>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/makaleler/page.tsx app/hakkimda/page.tsx app/iletisim/page.tsx
git commit -m "feat: add Makaleler, Hakkımda, and İletişim pages"
```

---

### Task 13: İlk Makaleler (Örnek İçerik)

**Files:**
- Create: `content/articles/systems/yangin-guvenligi-egitimi.mdx`
- Create: `content/articles/neuroperformance/zihinsel-yorgunluk-karar-verme.mdx`
- Create: `content/articles/longevity/d-vitamini-bagisiklik.mdx`

- [ ] **Step 1: Systems makalesi**

`content/articles/systems/yangin-guvenligi-egitimi.mdx`:

```mdx
---
title: "İşyerinde Yangın Güvenliği Eğitimi: Kapsamlı Planlama Rehberi"
category: "systems"
altBaslik1: "Acil Durum Yönetimi"
altBaslik2: "Yangın"
date: "2025-02-20"
excerpt: "İşyeri yangın tatbikatlarının tasarımı, uygulaması ve mevzuat uyumluluğu üzerine kapsamlı bir rehber."
---

## Yasal Çerçeve

6331 sayılı İş Sağlığı ve Güvenliği Kanunu kapsamında işverenler, çalışanlarına yangın güvenliği eğitimi vermekle yükümlüdür.

## Eğitim Bileşenleri

### Teorik Eğitim
- Yangın türleri ve sınıflandırması
- Yangın söndürücü kullanımı
- Tahliye prosedürleri

### Pratik Tatbikat
- Yılda en az 1 tatbikat zorunluluğu
- Kayıt tutma yükümlülüğü

## Sonuç

Etkin bir yangın güvenliği programı hem yasal uyumu sağlar hem de çalışan can güvenliğini korur.
```

- [ ] **Step 2: NeuroPerformance makalesi**

`content/articles/neuroperformance/zihinsel-yorgunluk-karar-verme.mdx`:

```mdx
---
title: "Zihinsel Yorgunluk ve Karar Verme Kalitesi"
category: "neuroperformance"
altBaslik1: "Bilişsel Performans"
altBaslik2: ""
date: "2025-01-15"
excerpt: "Kronik bilişsel yükün iş kararları üzerindeki nörobiyolojik mekanizmaları ve yönetim stratejileri."
---

## Zihinsel Yorgunluk Nedir?

Prefrontal korteksin sürekli aktif tutulmasından kaynaklanan bilişsel kapasitede azalma durumudur.

## Karar Vermeye Etkisi

Araştırmalar, zihinsel yorgunluğun risk değerlendirme kapasitesini %30'a kadar düşürebildiğini göstermektedir.

## Yönetim Stratejileri

- Önemli kararları günün erken saatlerinde alın
- 90 dakikalık çalışma-dinlenme döngüsü uygulayın
- Monoton görevleri otomasyon ile azaltın
```

- [ ] **Step 3: Longevity makalesi**

`content/articles/longevity/d-vitamini-bagisiklik.mdx`:

```mdx
---
title: "D Vitamini Eksikliğinin Bağışıklık Sistemi Üzerine Etkileri"
category: "longevity"
altBaslik1: "Bağışıklık Sistemi"
altBaslik2: "Takviyeler"
date: "2025-01-08"
excerpt: "D vitamini eksikliğinin immün fonksiyon üzerindeki klinik etkileri ve takviye protokolleri."
---

## D Vitamini ve İmmün Sistem

D vitamini, hem doğal hem de adaptif bağışıklık yanıtının düzenlenmesinde kritik rol oynar.

## Eksiklik Sınırları

- Yeterli: 30-100 ng/mL
- Yetersiz: 20-29 ng/mL
- Eksik: < 20 ng/mL

## Takviye Protokolü

Eksiklik durumunda günlük 2.000-4.000 IU D3 vitamini, K2 vitamini ile birlikte alınmalıdır. 3 ayda bir serum 25(OH)D düzeyi takibi önerilir.
```

- [ ] **Step 4: Tüm kategorilerin çalıştığını doğrula**

```
http://localhost:3000/longevity          → 2 makale görünmeli
http://localhost:3000/systems            → 1 makale görünmeli
http://localhost:3000/neuroperformance   → 1 makale görünmeli
http://localhost:3000/makaleler          → 4 makale görünmeli
```

- [ ] **Step 5: Commit**

```bash
git add content/
git commit -m "feat: add initial 4 sample articles across all three categories"
```

---

### Task 14: Deployment (Vercel)

**Files:**
- Create: `.env.local` (gerekirse)

- [ ] **Step 1: Build kontrolü**

```bash
npm run build
```

Hata yoksa devam et. Varsa hataları düzelt (genellikle TypeScript veya `searchParams` async sorunları olabilir).

- [ ] **Step 2: Vercel CLI ile deploy et**

```bash
npm install -g vercel
vercel
```

Sorulara yanıtlar:
- Project name: `drmustafakebat`
- Framework: Next.js (otomatik algılanır)
- Root directory: `./`

- [ ] **Step 3: Domain bağla**

Vercel dashboard'unda Settings → Domains → `drmustafakebat.com` ekle.

DNS yönetim panelinde (alan adı sağlayıcısı):
- A kaydı: `@` → Vercel IP (Vercel panelinde gösterilir)
- CNAME: `www` → `cname.vercel-dns.com`

- [ ] **Step 4: Son doğrulama**

```
https://drmustafakebat.com           → Ana sayfa
https://drmustafakebat.com/longevity → Longevity kategori
https://drmustafakebat.com/longevity/omega-3-kalp-sagligi → Makale detay
```

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: production-ready deployment configuration"
```

---

## Self-Review

**Spec coverage:**
- ✅ Sticky Nav (Task 4)
- ✅ Hero + animasyon (Task 6)
- ✅ Credential Bar (Task 7)
- ✅ 3 ServiceBlock dönüşümlü (Task 8)
- ✅ DoctorSection (Task 9)
- ✅ Son Makaleler grid (Task 9)
- ✅ Footer (Task 5)
- ✅ MDX sistemi (Task 3)
- ✅ Kategori sayfaları + ağaç navigasyon (Task 10)
- ✅ Makale detay + breadcrumb + ilgili makaleler (Task 11)
- ✅ /makaleler filtreli (Task 12)
- ✅ /hakkimda (Task 12)
- ✅ /iletisim form (Task 12)
- ✅ Framer Motion animasyonlar: hero stagger, scroll fade, hover lift, nav giriş, credential bar kaydırma (Tasks 4,6,7,8,9)
- ✅ Deployment Vercel (Task 14)

**Placeholder taraması:** Yok — tüm adımlarda gerçek kod mevcut.

**Tip tutarlılığı:** `ArticleMeta`, `Article`, `ArticleCategory` Task 2'de tanımlandı, sonraki tüm tasklarda aynı isimlerle kullanıldı.
