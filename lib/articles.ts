import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article, ArticleMeta, ArticleCategory, ALL_CATEGORIES } from './types'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

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
    category,
    altBaslik1: data.altBaslik1 ?? '',
    altBaslik2: data.altBaslik2 ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    image: data.image ?? '',
    status: data.status ?? 'published',
    content,
  }
}

export function getArticlesByCategory(category: ArticleCategory, includeDrafts = false): ArticleMeta[] {
  const slugs = getArticleSlugs(category)
  const now = new Date()
  
  return slugs
    .map(slug => {
      const article = getArticleBySlug(category, slug)
      if (!article) return null
      
      // Filter out drafts and scheduled posts for public view
      if (!includeDrafts) {
        if (article.status === 'draft') return null
        if (new Date(article.date) > now) return null
      }
      
      const { content: _, ...meta } = article
      return meta
    })
    .filter((a): a is ArticleMeta => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllArticles(includeDrafts = false): ArticleMeta[] {
  return ALL_CATEGORIES
    .flatMap(cat => getArticlesByCategory(cat, includeDrafts))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticlesBySubtopic(category: ArticleCategory, altBaslik1: string): ArticleMeta[] {
  return getArticlesByCategory(category).filter(a => a.altBaslik1 === altBaslik1)
}

export function getSubtopics(category: ArticleCategory): string[] {
  const articles = getArticlesByCategory(category)
  return [...new Set(articles.map(a => a.altBaslik1).filter((v): v is string => Boolean(v)))].sort()
}

export function getRecentArticles(count = 6): ArticleMeta[] {
  return getAllArticles().slice(0, count)
}

export function findArticleBySlug(slug: string, searchIn: ArticleCategory[]): Article | null {
  for (const cat of searchIn) {
    const article = getArticleBySlug(cat, slug)
    if (article) return article
  }
  return null
}

export function getSlugsFromCategories(categories: ArticleCategory[]): string[] {
  const seen = new Set<string>()
  const slugs: string[] = []
  for (const cat of categories) {
    for (const slug of getArticleSlugs(cat)) {
      if (!seen.has(slug)) {
        seen.add(slug)
        slugs.push(slug)
      }
    }
  }
  return slugs
}
