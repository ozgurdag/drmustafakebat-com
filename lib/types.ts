export type ArticleCategory = 'longevity' | 'systems' | 'neuroperformance'

export interface ArticleFrontmatter {
  title: string
  category: ArticleCategory
  altBaslik1?: string
  altBaslik2?: string
  date: string
  excerpt: string
  image?: string
}

export interface Article extends ArticleFrontmatter {
  slug: string
  content: string
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  longevity: 'Longevity: Bireysel Sağlık ve Yaşlanma Yönetimi',
  systems: 'Corporate Bio-Integrity: Kurumsal Risk ve Sağlık Yönetimi',
  neuroperformance: 'NeuroPerformance: Zihin ve Hareket Optimizasyonu',
}

export const CATEGORY_SHORT: Record<ArticleCategory, string> = {
  longevity: 'Longevity',
  systems: 'Corporate Bio-Integrity',
  neuroperformance: 'NeuroPerformance',
}

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  longevity: 'Bireysel sağlık ve yaşlanma yönetimi',
  systems: 'Kurumsal risk ve sağlık yönetimi',
  neuroperformance: 'Zihin ve hareket optimizasyon eğitimleri',
}

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  longevity: 'bg-emerald-700',
  systems: 'bg-blue-700',
  neuroperformance: 'bg-purple-700',
}

export type VirtualCategory = 'genel-saglik' | 'teknik-isg' | 'mevzuat'

export const VIRTUAL_FILTER_MAP: Record<VirtualCategory, { label: string; altBaslik1: string }> = {
  'genel-saglik': { label: 'Genel Sağlık', altBaslik1: 'Genel Sağlık' },
  'teknik-isg':   { label: 'Teknik İSG',   altBaslik1: 'Ekipman & Makine Güvenliği' },
  'mevzuat':      { label: 'Mevzuat & Hukuk', altBaslik1: 'Mevzuat & Yaptırımlar' },
}
