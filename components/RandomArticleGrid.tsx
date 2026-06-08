'use client'

import { useState, useEffect } from 'react'
import ArticleCard from './ArticleCard'
import { ArticleMeta } from '@/lib/types'

interface RandomArticleGridProps {
  pool: ArticleMeta[]
  count?: number
}

export default function RandomArticleGrid({ pool, count = 6 }: RandomArticleGridProps) {
  const [randomArticles, setRandomArticles] = useState<ArticleMeta[]>([])

  useEffect(() => {
    // Pick 'count' random articles from the pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setRandomArticles(shuffled.slice(0, count))
  }, [pool, count])

  // Optionally, return a placeholder with the same height while waiting for client render
  // Or just render the first N articles to prevent layout shift
  const displayArticles = randomArticles.length > 0 ? randomArticles : pool.slice(0, count)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayArticles.map((article, i) => (
        <ArticleCard key={article.slug} article={article} index={i} />
      ))}
    </div>
  )
}
