import { Metadata } from 'next'
import MakalelerClient from '@/components/MakalelerClient'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Beslenme & Metabolizma: Bilimsel Gıda Yönetimi | Dr. Mustafa Kebat',
  description: 'Vitaminler, genel_tip protokolleri, biyokimya analizi ve metabolik sağlık yönetimi.',
}

export default function BeslenmePage() {
  const articles = getArticlesByCategory('genel_tip')
  return <MakalelerClient articles={articles} />
}
