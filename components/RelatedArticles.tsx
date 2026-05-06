import { ArticleMeta } from '@/lib/types'
import ArticleCard from './ArticleCard'

interface RelatedArticlesProps {
  articles: ArticleMeta[]
  title?: string
}

export default function RelatedArticles({ articles, title = 'İlgili Makaleler' }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  const shown = articles.slice(0, 3)

  return (
    <section className="py-12 border-t border-navy/10">
      <p className="text-[9px] tracking-[2px] uppercase text-gold font-sans mb-1">Devamını Oku</p>
      <h2 className="font-serif text-2xl text-navy mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {shown.map((article, i) => (
          <ArticleCard key={article.slug} article={article} index={i} />
        ))}
      </div>
    </section>
  )
}
