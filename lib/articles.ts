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

export function getArticleBySlug(category: ArticleCategory, slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return {
    slug,
    title: data.title ?? '',
    category: data.category ?? category,
    altBaslik1: data.altBaslik1,
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
  return [...new Set(articles.map(a => a.altBaslik1).filter((v): v is string => Boolean(v)))]
}

export function getRecentArticles(count = 6): ArticleMeta[] {
  return getAllArticles().slice(0, count)
}
