import { getArticleSlugs, getArticleBySlug } from '@/lib/articles'
import ArticlePageTemplate from '@/components/ArticlePageTemplate'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getArticleSlugs('systems').map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug('systems', params.slug)
  if (!article) return { title: 'Dr. Mustafa Kebat' }
  return { title: `${article.title} | Dr. Mustafa Kebat`, description: article.excerpt }
}

export default function SystemsArticlePage({ params }: { params: { slug: string } }) {
  return <ArticlePageTemplate category="systems" slug={params.slug} />
}
