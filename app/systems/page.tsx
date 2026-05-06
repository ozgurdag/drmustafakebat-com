import { Metadata } from 'next'
import { getArticlesByCategory, getSubtopics } from '@/lib/articles'
import CategoryPageClient from '@/components/CategoryPageClient'

export const metadata: Metadata = {
  title: 'Systems | Dr. Mustafa Kebat',
  description: 'Kurumsal sağlık sistemleri kurulumu hakkında makaleler.',
}

export default function SystemsPage() {
  const articles = getArticlesByCategory('systems')
  const subtopics = getSubtopics('systems')
  return (
    <CategoryPageClient
      category="systems"
      articles={articles}
      subtopics={subtopics}
      categoryNumber="02"
    />
  )
}
