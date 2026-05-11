import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article, ArticleMeta, ArticleCategory } from './types'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

export function getArticleSlugs(category: ArticleCategory): string[] {
  const dir = path.join(ARTICLES_DIR, category)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''))
}

const SUBTOPIC_MAP: Record<string, string> = {
  // Longevity
  'Vitamin ve Mineral': 'Vitaminler & Mineraller',
  'Kardiyovasküler': 'Kardiyovasküler Sağlık',
  'Diyabet & İnsülin Direnci': 'Hormonlar & Metabolizma',
  'Tiroid Hastalıkları': 'Hormonlar & Metabolizma',
  'Hormonlar & Endokrin': 'Hormonlar & Metabolizma',
  'Antioksidanlar': 'Hücresel Sağlık & Anti-Aging',
  'Doğal Antiaging': 'Hücresel Sağlık & Anti-Aging',
  'Yaşlılık & Kronik Hast.': 'Hücresel Sağlık & Anti-Aging',
  
  // Systems
  'İSG & Güvenlik': 'İSG & Risk Yönetimi',
  'İş Kazaları': 'İSG & Risk Yönetimi',
  'Risk & KKD': 'İSG & Risk Yönetimi',
  'Acil Durum & İlk Yardım': 'Acil Durum & Yangın',
  'Yangın Güvenliği': 'Acil Durum & Yangın',
  'Kurumsal Sağlık': 'Kurumsal Sağlık & Protokoller',
  'Kurumsal Protokoller': 'Kurumsal Sağlık & Protokoller',

  // NeuroPerformance
  'Bilişsel Performans': 'Nöroloji & Bilişsel Performans',
  'Nöroloji & Beyin': 'Nöroloji & Bilişsel Performans',
  'Psikoloji & Ruh Sağlığı': 'Ruh Sağlığı & Stres',
  'Tükenmişlik & Stres': 'Ruh Sağlığı & Stres',
  'Uyku & Vardiyalı Çalışma': 'Uyku & Biyolojik Ritim',
  'Fiziksel Performans': 'Performans & Egzersiz',
  'Egzersiz & Fiziksel Aktivite': 'Performans & Egzersiz',
}

function normalizeSubtopic(topic: string | undefined): string {
  if (!topic) return ''
  return SUBTOPIC_MAP[topic] || topic
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
    altBaslik1: normalizeSubtopic(data.altBaslik1),
    altBaslik2: data.altBaslik2 ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    image: data.image ?? '',
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
  return [...new Set(articles.map(a => a.altBaslik1).filter((v): v is string => Boolean(v)))]
}

export function getRecentArticles(count = 6): ArticleMeta[] {
  return getAllArticles().slice(0, count)
}
