import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleBySlug, getArticlesBySubtopic } from '@/lib/articles'
import { ArticleCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types'
import Breadcrumb from './Breadcrumb'
import RelatedArticles from './RelatedArticles'
import NewsletterForm from './NewsletterForm'

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

  // tetkik.com.tr ibaresi sadece Mayıs 2026'dan önceki yazılar için gösterilecek
  const isBeforeMay2026 = new Date(article.date) < new Date('2026-05-01')

  return (
    <>
      <div className="bg-navy py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
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

      {/* Featured image */}
      {article.image && (
        <div className="w-full max-h-[420px] overflow-hidden bg-navy/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            className="w-full object-cover max-h-[420px]"
          />
        </div>
      )}

      {/* Content area */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
          {/* Article Content */}
          <article className="min-w-0">
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

      <NewsletterForm />

      {/* Disclaimer & Source */}
      <div className="mt-12 pt-6 border-t border-navy/10">
        <div className="font-sans text-[11px] leading-relaxed text-navy/40 space-y-3">
          <p>
            <strong className="font-semibold text-navy/50">Sınırlı Sorumluluk Beyanı:</strong>{' '}
            Web sitemizin içeriği, ziyaretçiyi bilgilendirmeye yönelik hazırlanmıştır. Sitede yer alan bilgiler, hiçbir zaman bir hukuki tavsiye yerini alamaz. Web sitemizdeki yayınlardan yola çıkarak, işlerinizin yürütülmesi, belgelerinizin düzenlenmesi ya da mevcut işleyişinizin değiştirilmesi kesinlikte tavsiye edilmez. Web sitemizin içeriğinde yer alan bilgilere istinaden profesyonel hukuki yardım almadan hareket edilmesi durumunda meydana gelebilecek zararlardan firmamız sorumlu değildir. Sitemizde kanunların içeriğine aykırı ilan ve reklam yapma kastı bulunmamaktadır.
          </p>
          <p>
            Web sitemizin içeriği, ziyaretçiyi bilgilendirmeye yönelik hazırlanmıştır. Sitede yer alan bilgiler, hiçbir zaman bir hekim tedavisinin ya da konsültasyonunun yerini alamaz. Bu kaynaktan yola çıkarak, ilaç tedavisine başlanması ya da mevcut tedavinin değiştirilmesi kesinlikte tavsiye edilmez. Web sitemizin içeriği, asla kişisel teşhis ya da tedavi yönteminin seçimi için değerlendirilmemelidir. Sitede kanun içeriğine aykırı ilan ve reklam yapma kastı bulunmamaktadır.
          </p>
          {isBeforeMay2026 && (
            <p className="text-navy/35 italic">
              Dr. Mustafa Kebat&apos;a ait bu yazı {formattedDate} tarihinde{' '}
              <a
                href="https://tetkik.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-navy/60 transition-colors"
              >
                Tetkik.com.tr
              </a>{' '}
              adresinde yayınlanmıştır.
            </p>
          )}
        </div>
      </div>
      </div>

      {/* Related Articles */}
      <RelatedArticles articles={related} />
    </>
  )
}
