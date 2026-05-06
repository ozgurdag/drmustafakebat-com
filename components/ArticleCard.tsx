'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArticleMeta, CATEGORY_LABELS } from '@/lib/types'

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
      className="border-b-2 border-navy pb-5 cursor-pointer group"
    >
      <Link href={`/${article.category}/${article.slug}`}>
        <p className="text-[9px] tracking-[2px] uppercase text-gold font-sans mb-2.5">
          {CATEGORY_LABELS[article.category]}
          {article.altBaslik1 && ` · ${article.altBaslik1}`}
        </p>
        <h3 className="font-serif text-[17px] leading-snug text-navy mb-2.5 group-hover:text-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed font-sans line-clamp-2">
          {article.excerpt}
        </p>
        <p className="text-[10px] text-gray-400 font-sans mt-3">
          {new Date(article.date).toLocaleDateString('tr-TR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </Link>
    </motion.article>
  )
}
