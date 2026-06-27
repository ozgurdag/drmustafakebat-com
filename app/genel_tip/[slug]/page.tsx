export const dynamicParams = false;
import { getArticleSlugs, getArticleBySlug } from '@/lib/articles'
import ArticlePageTemplate from '@/components/ArticlePageTemplate'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const slugs = getArticleSlugs('genel_tip')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug('genel_tip', slug)
  if (!article) return { title: 'Dr. Mustafa Kebat' }
  return { title: `${article.title} | Dr. Mustafa Kebat`, description: article.excerpt }
}

export default async function BeslenmeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug('genel_tip', slug)
  if (!article) return null
  return <ArticlePageTemplate category="genel_tip" slug={slug} />
}
