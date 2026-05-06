'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArticleCategory, ArticleMeta, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/lib/types'
import CategorySidebar from '@/components/CategorySidebar'
import ArticleGrid from '@/components/ArticleGrid'
import Breadcrumb from '@/components/Breadcrumb'

interface CategoryPageClientProps {
  category: ArticleCategory
  articles: ArticleMeta[]
  subtopics: string[]
  categoryNumber: string
  initialSubtopic?: string
}

export default function CategoryPageClient({
  category,
  articles,
  subtopics,
  categoryNumber,
  initialSubtopic,
}: CategoryPageClientProps) {
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(
    initialSubtopic ?? null
  )

  const filteredArticles = activeSubtopic
    ? articles.filter((a) => a.altBaslik1 === activeSubtopic)
    : articles

  return (
    <div>
      {/* Category Hero */}
      <section className="bg-navy py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] tracking-[3px] uppercase text-gold font-sans mb-4">
            {categoryNumber} · {CATEGORY_LABELS[category].toUpperCase()}
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light text-white mb-4">
            {CATEGORY_LABELS[category]}
          </h1>
          <p className="text-white/60 font-sans text-base mb-6 max-w-xl">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
          <div className="inline-flex items-center border border-gold/40 rounded px-3 py-1">
            <span className="text-gold text-xs font-sans tracking-wide">
              {articles.length} makale
            </span>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <Breadcrumb
          items={[
            { label: 'Ana Sayfa', href: '/' },
            { label: CATEGORY_LABELS[category] },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <CategorySidebar
                subtopics={subtopics}
                activeSubtopic={activeSubtopic}
                onSubtopicChange={setActiveSubtopic}
              />
            </div>
          </aside>

          {/* Article Grid */}
          <main className="lg:col-span-3">
            <motion.div
              key={activeSubtopic ?? 'all'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredArticles.length > 0 ? (
                <ArticleGrid articles={filteredArticles} />
              ) : (
                <div className="text-center py-16 text-navy/40">
                  <p className="text-lg font-sans">
                    Bu konuda henüz makale eklenmedi.
                  </p>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
