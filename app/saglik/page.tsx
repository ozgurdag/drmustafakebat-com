import { Metadata } from 'next'
import MakalelerClient from '@/components/MakalelerClient'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Genel Sağlık: Koruyucu Tıp ve Tanı | Dr. Mustafa Kebat',
  description: 'Kardiyovasküler sağlık, enfeksiyon yönetimi ve genel koruyucu hekimlik protokolleri.',
}

export default function SaglikPage() {
  const articles = getArticlesByCategory('saglik')
  return <MakalelerClient articles={articles} />
}
