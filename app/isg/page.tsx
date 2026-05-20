import { Metadata } from 'next'
import MakalelerClient from '@/components/MakalelerClient'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'İş Sağlığı & Güvenliği: Endüstriyel Emniyet | Dr. Mustafa Kebat',
  description: 'İş güvenliği uzmanlığı, risk analizi, KKD yönetimi ve kurumsal emniyet sistemleri.',
}

export default function IsgPage() {
  const articles = getArticlesByCategory('isg')
  return <MakalelerClient articles={articles} />
}
