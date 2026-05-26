export type ArticleCategory =
  | 'longevity'
  | 'beslenme'
  | 'saglik'
  | 'neuroperformance'

export interface ArticleFrontmatter {
  title: string
  category: ArticleCategory
  altBaslik1?: string
  altBaslik2?: string
  date: string
  excerpt: string
  image?: string
  status?: 'published' | 'draft'
}

export interface Article extends ArticleFrontmatter {
  slug: string
  content: string
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  longevity: 'Longevity: Yaşlanma Yönetimi',
  beslenme: 'İnsan Sürdürülebilirliği',
  saglik: 'Kurumsal Sağlık',
  neuroperformance: 'Nöroergonomi',
}

export const CATEGORY_SHORT: Record<ArticleCategory, string> = {
  longevity: 'Longevity',
  beslenme: 'İnsan Sürdürülebilirliği',
  saglik: 'Kurumsal Sağlık',
  neuroperformance: 'Nöroergonomi',
}

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  longevity: 'Doğal antiaging, yaşlanma yönetimi',
  beslenme: 'Vitaminler, beslenme, metabolizma, kan tahlilleri',
  saglik: 'Kurumsal sağlık, çalışan sağlığı, iş sağlığı yönetimi',
  neuroperformance: 'Nöroergonomi, bilişsel performans, zihin ve çalışma ortamı',
}

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  longevity: 'bg-emerald-700',
  beslenme: 'bg-lime-700',
  saglik: 'bg-teal-700',
  neuroperformance: 'bg-purple-700',
}

export const ALL_CATEGORIES: ArticleCategory[] = [
  'longevity',
  'beslenme',
  'saglik',
  'neuroperformance',
]
