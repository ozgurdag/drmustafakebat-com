export type ArticleCategory =
  | 'longevity'
  | 'kurumsal_saglik'
  | 'neuroperformance'
  | 'is_sagligi'
  | 'genel_tip'
  | 'spor'
  | 'dusunce_yazilarim'

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
  longevity: 'Longevity',
  kurumsal_saglik: 'Kurumsal Sağlık',
  neuroperformance: 'Nöroergonomi',
  is_sagligi: 'İş Sağlığı',
  genel_tip: 'Genel Tıp',
  spor: 'Spor',
  dusunce_yazilarim: 'Düşünce Yazılarım',
}

export const CATEGORY_SHORT: Record<ArticleCategory, string> = {
  longevity: 'Longevity',
  kurumsal_saglik: 'Kurumsal Sağlık',
  neuroperformance: 'Nöroergonomi',
  is_sagligi: 'İş Sağlığı',
  genel_tip: 'Genel Tıp',
  spor: 'Spor',
  dusunce_yazilarim: 'Düşünce Yazılarım',
}

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  longevity: 'Doğal antiaging, yaşlanma yönetimi',
  kurumsal_saglik: 'Kurumsal sağlık, çalışan sağlığı, iş sağlığı yönetimi',
  neuroperformance: 'Nöroergonomi, bilişsel performans, zihin ve çalışma ortamı',
  is_sagligi: 'İş sağlığı ve güvenliği, meslek hastalıkları',
  genel_tip: 'Anatomi, insan, metabolizma, tıp bilimleri',
  spor: 'Spor, hareket, fiziksel performans',
  dusunce_yazilarim: 'Düşünce yazıları, vizyon, felsefe',
}

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  longevity: 'bg-emerald-700',
  kurumsal_saglik: 'bg-teal-700',
  neuroperformance: 'bg-purple-700',
  is_sagligi: 'bg-blue-700',
  genel_tip: 'bg-indigo-700',
  spor: 'bg-orange-700',
  dusunce_yazilarim: 'bg-slate-700',
}

export const ALL_CATEGORIES: ArticleCategory[] = [
  'longevity',
  'kurumsal_saglik',
  'neuroperformance',
  'is_sagligi',
  'genel_tip',
  'spor',
  'dusunce_yazilarim',
]

