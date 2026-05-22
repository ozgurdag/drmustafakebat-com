import matter from 'gray-matter'
import { ArticleCategory, ALL_CATEGORIES } from './types'

const PROXY = '/api/proxy.php'

async function proxy(action: string, options: {
  method?: 'GET' | 'POST'
  params?: Record<string, string>
  body?: unknown
} = {}): Promise<Response> {
  const params = new URLSearchParams({ action, ...(options.params ?? {}) })
  return fetch(`${PROXY}?${params}`, {
    method: options.body ? 'POST' : (options.method ?? 'GET'),
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginResult {
  ok?: boolean
  error?: 'invalid_credentials' | 'too_many_attempts' | string
  remaining_attempts?: number
  remaining_seconds?: number
}

export async function adminLogin(username: string, password: string): Promise<LoginResult> {
  const res = await proxy('login', { body: { username, password } })
  return res.json()
}

export async function adminLogout(): Promise<void> {
  await proxy('logout', { body: {} })
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await proxy('check')
    const data = await res.json()
    return data.ok === true
  } catch {
    return false
  }
}

// ─── Files ───────────────────────────────────────────────────────────────────

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
}

export async function listCategoryFiles(category: ArticleCategory): Promise<GitHubFile[]> {
  const res = await proxy('list_files', { params: { category } })
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
  slug: string
): Promise<ArticleFileData | null> {
  const path = `content/articles/${category}/${slug}.mdx`
  const res = await proxy('get_file', { params: { path } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Makale yüklenemedi: ${res.status}`)
  const data = await res.json()
  const bytes = Uint8Array.from(atob(data.content.replace(/\n/g, '')), c => c.charCodeAt(0))
  const decoded = new TextDecoder('utf-8').decode(bytes)
  const { data: fm, content } = matter(decoded)
  return {
    slug,
    category,
    sha: data.sha,
    title: fm.title ?? '',
    altBaslik1: fm.altBaslik1 ?? '',
    altBaslik2: fm.altBaslik2 ?? '',
    date: fm.date
      ? (typeof fm.date === 'string' ? fm.date.slice(0, 10) : new Date(fm.date).toISOString().slice(0, 10))
      : '',
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

export async function getArticlesMeta(category: ArticleCategory): Promise<AllArticlesMeta[]> {
  const files = await listCategoryFiles(category)
  const results = await Promise.all(
    files.map(async (f) => {
      const slug = f.name.replace(/\.mdx$/, '')
      const article = await getArticleFile(category, slug)
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

// ─── Write / Delete ──────────────────────────────────────────────────────────

export async function createOrUpdateFile(
  path: string,
  mdxContent: string,
  sha: string | undefined,
  message: string
): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(mdxContent)))
  const payload: Record<string, unknown> = { message, content: encoded, branch: 'main' }
  if (sha) payload.sha = sha
  const res = await proxy('put_file', { body: { path, payload } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Dosya kaydedilemedi: ${res.status} — ${(err as { message?: string }).message ?? ''}`)
  }
}

export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  const res = await proxy('delete_file', {
    body: { path, payload: { message, sha, branch: 'main' } },
  })
  if (!res.ok) throw new Error(`Dosya silinemedi: ${res.status}`)
}

// ─── Deploy status ───────────────────────────────────────────────────────────

export interface DeployStatus {
  status: 'success' | 'failure' | 'in_progress' | 'queued' | 'unknown'
  conclusion: string | null
  created_at: string | null
  html_url: string | null
}

export async function getLastDeployStatus(): Promise<DeployStatus> {
  try {
    const res = await proxy('get_runs')
    if (!res.ok) return { status: 'unknown', conclusion: null, created_at: null, html_url: null }
    const data = await res.json()
    const run = data.workflow_runs?.[0]
    if (!run) return { status: 'unknown', conclusion: null, created_at: null, html_url: null }
    return {
      status: run.status === 'completed'
        ? (run.conclusion === 'success' ? 'success' : 'failure')
        : run.status,
      conclusion: run.conclusion,
      created_at: run.created_at,
      html_url: run.html_url,
    }
  } catch {
    return { status: 'unknown', conclusion: null, created_at: null, html_url: null }
  }
}

// ─── MDX builder (pure, no API calls) ───────────────────────────────────────

export function buildMdxContent(data: Omit<ArticleFileData, 'sha' | 'slug' | 'category'>): string {
  const fm: Record<string, string> = {
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    status: data.status,
  }
  if (data.altBaslik1) fm.altBaslik1 = data.altBaslik1
  if (data.altBaslik2) fm.altBaslik2 = data.altBaslik2
  if (data.image) fm.image = data.image
  return matter.stringify(data.content, fm)
}
