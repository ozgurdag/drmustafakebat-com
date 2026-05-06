import ArticleCard from './ArticleCard'
import { ArticleMeta } from '@/lib/types'

interface ArticleGridProps {
  articles: ArticleMeta[]
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, i) => (
        <ArticleCard key={article.slug} article={article} index={i} />
      ))}
    </div>
  )
}
