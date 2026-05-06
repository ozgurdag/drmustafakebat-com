export type ArticleCategory = 'longevity' | 'systems' | 'neuroperformance'

export interface ArticleFrontmatter {
  title: string
  category: ArticleCategory
  altBaslik1?: string
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
  longevity: 'bg-emerald-700',
  systems: 'bg-blue-700',
  neuroperformance: 'bg-purple-700',
}
