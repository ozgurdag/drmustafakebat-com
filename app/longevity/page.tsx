import { Metadata } from 'next'
import LongevityPageContent from '@/components/LongevityPageContent'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Longevity: Bireysel Sağlık ve Yaşlanma Yönetimi | Dr. Mustafa Kebat',
  description: 'Biyolojik yaş analizi, hormonal optimizasyon ve kişiselleştirilmiş longevity protokolleriyle hücresel gençleşme.',
}

export default function LongevityPage() {
  const recentArticles = getArticlesByCategory('longevity').slice(0, 6)
  return <LongevityPageContent recentArticles={recentArticles} />
}
