'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArticleMeta, ArticleCategory } from '@/lib/types'
import ArticleGrid from '@/components/ArticleGrid'

interface MakalelerClientProps {
  articles: ArticleMeta[]
}

type FilterCategory = ArticleCategory | 'all'

const CATEGORY_DISPLAY: Record<FilterCategory, string> = {
  all: 'Tümü',
  longevity: 'Sağlık & Tıp',
  systems: 'İSG & Güvenlik',
  neuroperformance: 'NeuroPerformance',
}

const MAIN_CATEGORIES: FilterCategory[] = ['all', 'longevity', 'systems', 'neuroperformance']

export default function MakalelerClient({ articles }: MakalelerClientProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null)

  const subtopics: string[] = activeCategory === 'all'
    ? []
    : [...new Set(
        articles
          .filter(a => a.category === activeCategory)
          .map(a => a.altBaslik1)
          .filter((v): v is string => Boolean(v))
      )].sort()

  const filteredArticles = articles.filter(a => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false
    if (activeSubtopic && a.altBaslik1 !== activeSubtopic) return false
    return true
  })

  const countFor = (key: FilterCategory) =>
    key === 'all' ? articles.length : articles.filter(a => a.category === key).length

  const handleCategoryClick = (key: FilterCategory) => {
    setActiveCategory(key)
    setActiveSubtopic(null)
  }

  const handleBack = () => {
    if (activeSubtopic) {
      setActiveSubtopic(null)
    } else {
      setActiveCategory('all')
    }
  }

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
            Sağlık, İSG ve NeuroPerformance alanlarında güncel araştırmalar, klinik
            değerlendirmeler ve pratik rehberler.
          </p>
          <p className="mt-4 text-sm font-sans text-navy/40">{articles.length} makale</p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-navy/10 sticky top-[68px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">

          {/* Geri tuşu */}
          <AnimatePresence>
            {(activeCategory !== 'all' || activeSubtopic) && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-sans text-navy/50 hover:text-navy mb-3 transition-colors"
              >
                ← {activeSubtopic
                  ? CATEGORY_DISPLAY[activeCategory]
                  : 'Tüm Kategoriler'}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Ana kategoriler */}
          <div className="flex flex-wrap gap-2">
            {MAIN_CATEGORIES.map((key) => {
              const isActive = activeCategory === key && !activeSubtopic
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryClick(key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium border transition-colors ${
                    isActive
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-navy border-navy/30 hover:border-navy hover:bg-navy/5'
                  }`}
                >
                  {CATEGORY_DISPLAY[key]} ({countFor(key)})
                </button>
              )
            })}
          </div>

          {/* Alt başlıklar */}
          <AnimatePresence>
            {subtopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-navy/10 overflow-hidden"
              >
                <button
                  onClick={() => setActiveSubtopic(null)}
                  className={`px-3 py-1 rounded-full text-xs font-sans border transition-colors ${
                    !activeSubtopic
                      ? 'bg-gold text-white border-gold'
                      : 'bg-white text-navy/60 border-navy/20 hover:border-gold hover:text-gold'
                  }`}
                >
                  Tümü
                </button>
                {subtopics.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubtopic(sub)}
                    className={`px-3 py-1 rounded-full text-xs font-sans border transition-colors ${
                      activeSubtopic === sub
                        ? 'bg-gold text-white border-gold'
                        : 'bg-white text-navy/60 border-navy/20 hover:border-gold hover:text-gold'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Başlık şeridi */}
      {(activeCategory !== 'all' || activeSubtopic) && (
        <div className="bg-cream border-b border-navy/10 py-3">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <p className="text-xs font-sans text-navy/40 uppercase tracking-widest">
              {activeSubtopic
                ? `${CATEGORY_DISPLAY[activeCategory]} › ${activeSubtopic}`
                : CATEGORY_DISPLAY[activeCategory]}
              <span className="ml-2 text-gold">— {filteredArticles.length} makale</span>
            </p>
          </div>
        </div>
      )}

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-24 text-navy/40 font-sans">
            <p className="text-lg">Bu kategoride henüz makale bulunmamaktadır.</p>
          </div>
        ) : (
          <motion.div
            key={activeCategory + (activeSubtopic ?? '')}
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
