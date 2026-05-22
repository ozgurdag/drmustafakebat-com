import matter from 'gray-matter'
import { ArticleCategory, ALL_CATEGORIES } from './types'

const OWNER = 'ozgurdag'
const REPO = 'drmustafakebat-com'
const BRANCH = 'main'
const API_BASE = 'https://api.github.com'

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
}

export async function verifyToken(token: string): Promise<GitHubUser> {
  const res = await fetch(`${API_BASE}/user`, { headers: headers(token) })
  if (!res.ok) throw new Error('Geçersiz token')
  return res.json()
}

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
}

export async function listCategoryFiles(category: ArticleCategory, token: string): Promise<GitHubFile[]> {
  const res = await fetch(
    `${API_BASE}/repos/${OWNER}/${REPO}/contents/content/articles/${category}?ref=${BRANCH}`,
    { headers: headers(token) }
  )
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`Dosyalar listelenemedi: ${res.status}`)
  const data = await res.json()
  return (data as GitHubFile[]).filter((f) => f.name.endsWith('.mdx'))
}

export interface ArticleFileData {
  title: string
  category: ArticleCategory
  altBaslik1: string
  altBaslik2: string
  date: string
  excerpt: string
  image: string
  status: 'published' | 'draft'
  content: string
  sha: string
  slug: string
}

export async function getArticleFile(
  category: ArticleCategory,
  slug: string,
  token: string
): Promise<ArticleFileData | null> {
  const path = `content/articles/${category}/${slug}.mdx`
  const res = await fetch(
    `${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: headers(token) }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Makale yüklenemedi: ${res.status}`)
  const data = await res.json()
  const decoded = atob(data.content.replace(/\n/g, ''))
  const { data: fm, content } = matter(decoded)
  return {
    slug,
    category,
    sha: data.sha,
    title: fm.title ?? '',
    altBaslik1: fm.altBaslik1 ?? '',
    altBaslik2: fm.altBaslik2 ?? '',
    date: fm.date ? (typeof fm.date === 'string' ? fm.date.slice(0, 10) : new Date(fm.date).toISOString().slice(0, 10)) : '',
    excerpt: fm.excerpt ?? '',
    image: fm.image ?? '',
    status: fm.status ?? 'published',
    content: content.trim(),
  }
}

export interface AllArticlesMeta {
  slug: string
  category: ArticleCategory
  sha: string
  title: string
  altBaslik1: string
  date: string
  status: 'published' | 'draft'
}

export async function getAllArticlesMeta(token: string): Promise<AllArticlesMeta[]> {
  const results: AllArticlesMeta[] = []
  await Promise.all(
    ALL_CATEGORIES.map(async (cat) => {
      const files = await listCategoryFiles(cat, token)
      for (const f of files) {
        const slug = f.name.replace(/\.mdx$/, '')
        results.push({ slug, category: cat, sha: f.sha, title: slug, altBaslik1: '', date: '', status: 'published' })
      }
    })
  )
  return results
}

export async function getArticlesMeta(category: ArticleCategory, token: string): Promise<AllArticlesMeta[]> {
  const files = await listCategoryFiles(category, token)
  const results = await Promise.all(
    files.map(async (f) => {
      const slug = f.name.replace(/\.mdx$/, '')
      const article = await getArticleFile(category, slug, token)
      if (!article) return null
      return {
        slug,
        category,
        sha: f.sha,
        title: article.title,
        altBaslik1: article.altBaslik1,
        date: article.date,
        status: article.status,
      }
    })
  )
  return results.filter((a): a is AllArticlesMeta => a !== null)
}

function buildMdx(data: Omit<ArticleFileData, 'sha' | 'slug' | 'category'>, content: string): string {
  const fm: Record<string, string> = {
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    status: data.status,
  }
  if (data.altBaslik1) fm.altBaslik1 = data.altBaslik1
  if (data.altBaslik2) fm.altBaslik2 = data.altBaslik2
  if (data.image) fm.image = data.image

  return matter.stringify(content, fm)
}

export async function createOrUpdateFile(
  path: string,
  mdxContent: string,
  sha: string | undefined,
  message: string,
  token: string
): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(mdxContent)))
  const body: Record<string, unknown> = {
    message,
    content: encoded,
    branch: BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Dosya kaydedilemedi: ${res.status} — ${(err as { message?: string }).message ?? ''}`)
  }
}

export async function deleteFile(
  path: string,
  sha: string,
  message: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: headers(token),
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  })
  if (!res.ok) throw new Error(`Dosya silinemedi: ${res.status}`)
}

export interface DeployStatus {
  status: 'success' | 'failure' | 'in_progress' | 'queued' | 'unknown'
  conclusion: string | null
  created_at: string | null
  html_url: string | null
}

export async function getLastDeployStatus(token: string): Promise<DeployStatus> {
  const res = await fetch(
    `${API_BASE}/repos/${OWNER}/${REPO}/actions/runs?per_page=1&branch=${BRANCH}`,
    { headers: headers(token) }
  )
  if (!res.ok) return { status: 'unknown', conclusion: null, created_at: null, html_url: null }
  const data = await res.json()
  const run = data.workflow_runs?.[0]
  if (!run) return { status: 'unknown', conclusion: null, created_at: null, html_url: null }
  return {
    status: run.status === 'completed' ? (run.conclusion === 'success' ? 'success' : 'failure') : run.status,
    conclusion: run.conclusion,
    created_at: run.created_at,
    html_url: run.html_url,
  }
}

export function buildMdxContent(data: Omit<ArticleFileData, 'sha' | 'slug' | 'category'>): string {
  return buildMdx(data, data.content)
}
