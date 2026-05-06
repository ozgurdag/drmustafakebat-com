'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArticleMeta, ArticleCategory, CATEGORY_LABELS } from '@/lib/types'
import ArticleGrid from '@/components/ArticleGrid'

interface MakalelerClientProps {
  articles: ArticleMeta[]
}

type FilterCategory = ArticleCategory | 'all'

const FILTER_BUTTONS: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'longevity', label: 'Longevity' },
  { key: 'systems', label: 'Systems' },
  { key: 'neuroperformance', label: 'NeuroPerformance' },
]

export default function MakalelerClient({ articles }: MakalelerClientProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')

  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  const countFor = (key: FilterCategory) =>
    key === 'all' ? articles.length : articles.filter((a) => a.category === key).length

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="bg-cream border-b border-navy/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="text-sm font-sans text-gold uppercase tracking-widest mb-4">
            Araştırmalar &amp; Yazılar
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-navy mb-4">Makaleler</h1>
          <p className="text-navy/60 font-sans text-lg max-w-2xl">
            Longevity, İSG ve NeuroPerformance alanlarında güncel araştırmalar, klinik
            değerlendirmeler ve pratik rehberler.
          </p>
          <p className="mt-4 text-sm font-sans text-navy/40">
            {articles.length} makale
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-navy/10 sticky top-[68px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-wrap gap-3">
          {FILTER_BUTTONS.map(({ key, label }) => {
            const isActive = activeCategory === key
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-5 py-2 rounded-full text-sm font-sans font-medium border transition-colors ${
                  isActive
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-navy border-navy hover:bg-navy/5'
                }`}
              >
                {label} ({countFor(key)})
              </button>
            )
          })}
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-24 text-navy/40 font-sans">
            <p className="text-lg">Bu kategoride henüz makale bulunmamaktadır.</p>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleGrid articles={filteredArticles} />
          </motion.div>
        )}
      </section>
    </div>
  )
}
