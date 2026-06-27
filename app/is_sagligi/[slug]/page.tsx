export const dynamicParams = false;
import { getArticleSlugs, getArticleBySlug } from '@/lib/articles'
import ArticlePageTemplate from '@/components/ArticlePageTemplate'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const slugs = getArticleSlugs('is_sagligi')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug('is_sagligi', slug)
  if (!article) return { title: 'Dr. Mustafa Kebat' }
  return { title: `${article.title} | Dr. Mustafa Kebat`, description: article.excerpt }
}

export default async function BeslenmeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug('is_sagligi', slug)
  if (!article) return null
  return <ArticlePageTemplate category="is_sagligi" slug={slug} />
}
