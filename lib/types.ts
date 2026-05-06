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
