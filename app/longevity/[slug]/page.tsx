import { getSlugsFromCategories, findArticleBySlug } from '@/lib/articles'
import ArticlePageTemplate from '@/components/ArticlePageTemplate'
import type { Metadata } from 'next'
import type { ArticleCategory } from '@/lib/types'

const LONGEVITY_CATEGORIES: ArticleCategory[] = ['longevity']

export async function generateStaticParams() {
  return getSlugsFromCategories(LONGEVITY_CATEGORIES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = findArticleBySlug(slug, LONGEVITY_CATEGORIES)
  if (!article) return { title: 'Dr. Mustafa Kebat' }
  return { title: `${article.title} | Dr. Mustafa Kebat`, description: article.excerpt }
}

export default async function LongevityArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = findArticleBySlug(slug, LONGEVITY_CATEGORIES)
  if (!article) return null
  return <ArticlePageTemplate category={article.category} slug={slug} />
}
