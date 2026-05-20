import { Metadata } from 'next'
import MakalelerClient from '@/components/MakalelerClient'
import { getArticlesByCategory } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Mevzuat & Eğitim: Yasal Uyum ve Gelişim | Dr. Mustafa Kebat',
  description: 'İSG mevzuatı, yasal düzenlemeler ve kurumsal eğitim sertifikasyon süreçleri.',
}

export default function MevzuatPage() {
  const articles = getArticlesByCategory('mevzuat')
  return <MakalelerClient articles={articles} />
}
