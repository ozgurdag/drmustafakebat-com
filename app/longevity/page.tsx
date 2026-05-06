import { Metadata } from 'next'
import { getArticlesByCategory, getSubtopics } from '@/lib/articles'
import CategoryPageClient from '@/components/CategoryPageClient'

export const metadata: Metadata = {
  title: 'Longevity | Dr. Mustafa Kebat',
  description: 'Bireysel sağlık ve yaşlanma yönetimi hakkında makaleler.',
}

export default function LongevityPage() {
  const articles = getArticlesByCategory('longevity')
  const subtopics = getSubtopics('longevity')
  return (
    <CategoryPageClient
      category="longevity"
      articles={articles}
      subtopics={subtopics}
      categoryNumber="01"
    />
  )
}
