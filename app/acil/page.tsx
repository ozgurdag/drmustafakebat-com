import { Metadata } from 'next'
import MakalelerClient from '@/components/MakalelerClient'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Acil & İlk Yardım: Hayat Kurtaran Müdahaleler | Dr. Mustafa Kebat',
  description: 'Acil durum protokolleri, ilk yardım eğitimleri ve saha müdahale rehberleri.',
}

export default function AcilPage() {
  const articles = getArticlesByCategory('acil')
  return <MakalelerClient articles={articles} />
}
