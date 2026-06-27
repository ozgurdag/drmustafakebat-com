import { Metadata } from 'next'
import MakalelerClient from '@/components/MakalelerClient'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Beslenme & Metabolizma: Bilimsel Gıda Yönetimi | Dr. Mustafa Kebat',
  description: 'Vitaminler, spor protokolleri, biyokimya analizi ve metabolik sağlık yönetimi.',
}

export default function BeslenmePage() {
  const articles = getArticlesByCategory('spor')
  return <MakalelerClient articles={articles} />
}
