'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArticleMeta, ArticleCategory, ALL_CATEGORIES, CATEGORY_SHORT } from '@/lib/types'
import ArticleGrid from '@/components/ArticleGrid'
import NewsletterForm from '@/components/NewsletterForm'

interface MakalelerClientProps {
  articles: ArticleMeta[]
}

type FilterCategory = ArticleCategory | 'all'

const FILTER_LABELS: Record<FilterCategory, string> = {
  all: 'Tümü',
  longevity: 'Longevity',
  beslenme: 'İnsan Sürdürülebilirliği',
  saglik: 'Kurumsal Sağlık',
  neuroperformance: 'Nöroergonomi',
}

const MAIN_FILTERS: FilterCategory[] = ['all', ...ALL_CATEGORIES]

export default function MakalelerClient({ articles }: MakalelerClientProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayArticles, setDisplayArticles] = useState<ArticleMeta[]>(articles)

  useEffect(() => {
    setDisplayArticles([...articles].sort(() => Math.random() - 0.5))
  }, [articles])

  const subtopics: string[] =
    activeCategory !== 'all'
      ? [
          ...new Set(
            displayArticles
              .filter(a => a.category === activeCategory)
              .map(a => a.altBaslik1)
              .filter((v): v is string => Boolean(v))
          ),
        ].sort()
      : []

  const filteredArticles = displayArticles.filter(a => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false
    if (activeSubtopic && a.altBaslik1 !== activeSubtopic) return false
    return true
  })

  const searchedArticles = searchQuery.trim()
    ? filteredArticles.filter(
        a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredArticles

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

  const activeLabel =
    activeCategory !== 'all'
      ? FILTER_LABELS[activeCategory]
      : 'Tüm Kategoriler'

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-5 inline-flex items-center gap-2 border border-gold/30 px-3 py-1.5"
          >
            ✦ Araştırmalar & Yazılar
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-serif font-normal leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          >
            Makaleler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/60 font-sans text-[15px] leading-relaxed max-w-2xl"
          >
            Longevity, Beslenme, Genel Sağlık, NeuroPerformance ve İş Sağlığı alanlarında
            güncel araştırmalar, klinik değerlendirmeler ve pratik rehberler.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 text-[11px] font-sans text-white/30 tracking-widest uppercase"
          >
            {searchQuery ? `${searchedArticles.length} sonuç` : `${articles.length} makale`}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 relative max-w-lg"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Makale ara... (örn: omega-3, melatonin)"
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-sans text-sm px-4 py-3 pr-10 focus:outline-none focus:border-gold/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-navy/10 sticky top-[68px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3">

          {/* Geri tuşu */}
          <AnimatePresence>
            {(activeCategory !== 'all' || activeSubtopic) && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-sans text-navy/50 hover:text-navy mb-2 transition-colors"
              >
                ← {activeSubtopic ? activeLabel : 'Tüm Kategoriler'}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Ana kategoriler — yatay kaydırmalı */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {MAIN_FILTERS.map((key) => {
              const isActive = activeCategory === key && !activeSubtopic
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryClick(key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-navy border-navy/30 hover:border-navy hover:bg-navy/5'
                  }`}
                >
                  {FILTER_LABELS[key]} ({countFor(key)})
                </button>
              )
            })}
          </div>

          {/* Alt başlıklar — yatay kaydırmalı */}
          <AnimatePresence>
            {subtopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 overflow-x-auto pb-1 mt-2 pt-2 border-t border-navy/10 scrollbar-hide -mx-1 px-1"
              >
                <button
                  onClick={() => setActiveSubtopic(null)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-sans border transition-colors whitespace-nowrap ${
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
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-sans border transition-colors whitespace-nowrap ${
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
              {activeSubtopic ? `${activeLabel} › ${activeSubtopic}` : activeLabel}
              <span className="ml-2 text-gold">— {searchedArticles.length} makale</span>
            </p>
          </div>
        </div>
      )}

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {searchedArticles.length === 0 ? (
          <div className="text-center py-24 text-navy/40 font-sans">
            <p className="text-lg">
              {searchQuery
                ? `"${searchQuery}" için sonuç bulunamadı.`
                : 'Bu kategoride henüz makale bulunmamaktadır.'}
            </p>
          </div>
        ) : (
          <motion.div
            key={activeCategory + (activeSubtopic ?? '') + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleGrid articles={searchedArticles} />
          </motion.div>
        )}
      </section>
      <NewsletterForm />
    </div>
  )
}
