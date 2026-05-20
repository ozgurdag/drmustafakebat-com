import { Metadata } from 'next'
import MakalelerClient from '@/components/MakalelerClient'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Kimyasal & Çevre: Toksikoloji ve Güvenlik | Dr. Mustafa Kebat',
  description: 'Kimyasal risk yönetimi, çevre sağlığı ve endüstriyel toksikoloji analizleri.',
}

export default function KimyasalPage() {
  const articles = getArticlesByCategory('kimyasal')
  return <MakalelerClient articles={articles} />
}
