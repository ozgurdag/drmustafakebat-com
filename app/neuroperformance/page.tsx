import { Metadata } from 'next'
import { getArticlesByCategory, getSubtopics } from '@/lib/articles'
import CategoryPageClient from '@/components/CategoryPageClient'

export const metadata: Metadata = {
  title: 'NeuroPerformance | Dr. Mustafa Kebat',
  description: 'Zihin ve hareket optimizasyon eğitimleri hakkında makaleler.',
}

export default function NeuroperformancePage() {
  const articles = getArticlesByCategory('neuroperformance')
  const subtopics = getSubtopics('neuroperformance')
  return (
    <CategoryPageClient
      category="neuroperformance"
      articles={articles}
      subtopics={subtopics}
      categoryNumber="03"
    />
  )
}
