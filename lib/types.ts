export type ArticleCategory =
  | 'longevity'
  | 'beslenme'
  | 'saglik'
  | 'neuroperformance'
  | 'isg'
  | 'acil'
  | 'mevzuat'
  | 'kimyasal'

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
  beslenme: 'Beslenme & Metabolizma',
  saglik: 'Genel Sağlık',
  neuroperformance: 'NeuroPerformance: Zihin ve Hareket',
  isg: 'İş Sağlığı & Güvenliği',
  acil: 'Acil & İlk Yardım',
  mevzuat: 'Mevzuat & Eğitim',
  kimyasal: 'Kimyasal & Çevre',
}

export const CATEGORY_SHORT: Record<ArticleCategory, string> = {
  longevity: 'Longevity',
  beslenme: 'Beslenme & Metabolizma',
  saglik: 'Genel Sağlık',
  neuroperformance: 'NeuroPerformance',
  isg: 'İş Sağlığı & Güvenliği',
  acil: 'Acil & İlk Yardım',
  mevzuat: 'Mevzuat & Eğitim',
  kimyasal: 'Kimyasal & Çevre',
}

export const CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  longevity: 'Doğal antiaging, yaşlanma yönetimi',
  beslenme: 'Vitaminler, beslenme, metabolizma, kan tahlilleri',
  saglik: 'Genel sağlık, kardiyovasküler, enfeksiyon, onkoloji',
  neuroperformance: 'Zihin, performans, egzersiz, psikoloji',
  isg: 'İş sağlığı, güvenlik, ekipman, iş kazaları',
  acil: 'Acil durum protokolleri, ilk yardım',
  mevzuat: 'Yasal düzenlemeler, eğitim, sertifikasyon',
  kimyasal: 'Kimyasal riskler, toksikoloji',
}

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  longevity: 'bg-emerald-700',
  beslenme: 'bg-lime-700',
  saglik: 'bg-teal-700',
  neuroperformance: 'bg-purple-700',
  isg: 'bg-blue-700',
  acil: 'bg-red-700',
  mevzuat: 'bg-slate-700',
  kimyasal: 'bg-orange-700',
}

export const ALL_CATEGORIES: ArticleCategory[] = [
  'longevity',
  'beslenme',
  'saglik',
  'neuroperformance',
  'isg',
  'acil',
  'mevzuat',
  'kimyasal',
]
