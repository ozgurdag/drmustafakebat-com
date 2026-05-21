'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArticleMeta, CATEGORY_LABELS, CATEGORY_SHORT } from '@/lib/types'

interface ArticleCardProps {
  article: ArticleMeta
  index?: number
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="cursor-pointer group"
      style={{ borderBottom: '2px solid #111', paddingBottom: '20px' }}
    >
      <Link href={`/${article.category}/${article.slug}`}>
        <p className="font-sans uppercase mb-2.5" style={{ fontSize: '9px', color: '#c9a84c', letterSpacing: '2px' }}>
          {CATEGORY_LABELS[article.category]}
          {article.altBaslik1 && article.altBaslik1 !== CATEGORY_LABELS[article.category] && article.altBaslik1 !== CATEGORY_SHORT[article.category] && ` · ${article.altBaslik1}`}
        </p>
        <h3 className="font-serif mb-2.5 group-hover:text-gold transition-colors" style={{ fontSize: '16px', color: '#111', lineHeight: '1.4' }}>
          {article.title}
        </h3>
        <p className="font-sans leading-relaxed line-clamp-2" style={{ fontSize: '12px', color: '#888' }}>
          {article.excerpt}
        </p>
        <p className="font-sans mt-3" style={{ fontSize: '10px', color: '#bbb' }}>
          {new Date(article.date).toLocaleDateString('tr-TR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </Link>
    </motion.article>
  )
}
