import { getArticleSlugs, getArticleBySlug } from '@/lib/articles'
import ArticlePageTemplate from '@/components/ArticlePageTemplate'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getArticleSlugs('longevity').map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug('longevity', params.slug)
  if (!article) return { title: 'Dr. Mustafa Kebat' }
  return { title: `${article.title} | Dr. Mustafa Kebat`, description: article.excerpt }
}

export default function LongevityArticlePage({ params }: { params: { slug: string } }) {
  return <ArticlePageTemplate category="longevity" slug={params.slug} />
}
