import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleBySlug, getArticlesBySubtopic } from '@/lib/articles'
import { ArticleCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types'
import Breadcrumb from './Breadcrumb'
import RelatedArticles from './RelatedArticles'

interface ArticlePageTemplateProps {
  category: ArticleCategory
  slug: string
}

export default function ArticlePageTemplate({ category, slug }: ArticlePageTemplateProps) {
  const article = getArticleBySlug(category, slug)

  if (!article) return null

  const related = article.altBaslik1
    ? getArticlesBySubtopic(category, article.altBaslik1).filter(a => a.slug !== slug).slice(0, 3)
    : []

  const formattedDate = new Date(article.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <div className="bg-navy py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Ana Sayfa', href: '/' },
              { label: CATEGORY_LABELS[category], href: `/${category}` },
              { label: article.title },
            ]}
          />
          <span className={`${CATEGORY_COLORS[category]} text-white text-xs px-2 py-1 rounded`}>
            {CATEGORY_LABELS[category]}
          </span>
          <h1 className="text-3xl lg:text-5xl font-serif font-light text-white mt-4 max-w-4xl">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-white/50 text-sm font-sans">{formattedDate}</span>
            {article.altBaslik1 && (
              <span className="text-xs text-gold border border-gold/40 px-2 py-0.5 rounded">
                {article.altBaslik1}
              </span>
            )}
          </div>
          <p className="text-white/60 mt-3 max-w-2xl text-sm leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Two-column content area */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* TOC Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded border border-navy/10 p-4">
              <p className="text-[9px] tracking-[2px] uppercase text-gold font-sans">İçindekiler</p>
              <p className="text-sm text-navy/40 mt-2">Dinamik içindekiler tablosu yakında</p>
            </div>
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-3 min-w-0">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
              <MDXRemote
                source={article.content}
                components={{
                  a: ({ href, children, ...props }: React.ComponentProps<'a'>) => {
                    const isExternal = href?.startsWith('http')
                    return (
                      <a
                        href={href}
                        {...props}
                        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {children}
                      </a>
                    )
                  }
                }}
              />
            </div>
          </article>
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={related} />
      </div>
    </>
  )
}
