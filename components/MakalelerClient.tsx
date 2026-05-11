'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArticleMeta, ArticleCategory, VirtualCategory, VIRTUAL_FILTER_MAP } from '@/lib/types'
import ArticleGrid from '@/components/ArticleGrid'

interface MakalelerClientProps {
  articles: ArticleMeta[]
}

type FilterCategory = ArticleCategory | 'all'
type ActiveFilter = { type: 'category'; value: FilterCategory } | { type: 'virtual'; value: VirtualCategory }

const CATEGORY_DISPLAY: Record<FilterCategory, string> = {
  all: 'Tümü',
  longevity: 'Longevity',
  systems: 'Corporate Bio-Integrity',
  neuroperformance: 'NeuroPerformance',
}

const MAIN_CATEGORIES: FilterCategory[] = ['all', 'longevity', 'systems', 'neuroperformance']
const VIRTUAL_CATEGORIES: VirtualCategory[] = ['genel-saglik', 'teknik-isg', 'mevzuat']

export default function MakalelerClient({ articles }: MakalelerClientProps) {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({ type: 'category', value: 'all' })
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const isCategory = activeFilter.type === 'category'
  const activeCatValue = isCategory ? (activeFilter as { type: 'category'; value: FilterCategory }).value : 'all'
  const activeVirtValue = !isCategory ? (activeFilter as { type: 'virtual'; value: VirtualCategory }).value : null

  const subtopics: string[] = (isCategory && activeCatValue !== 'all')
    ? [...new Set(
        articles
          .filter(a => a.category === activeCatValue)
          .map(a => a.altBaslik1)
          .filter((v): v is string => Boolean(v))
      )].sort()
    : []

  const filteredArticles = articles.filter(a => {
    if (!isCategory && activeVirtValue) {
      const map = VIRTUAL_FILTER_MAP[activeVirtValue]
      return a.altBaslik1 === map.altBaslik1
    }
    if (activeCatValue !== 'all' && a.category !== activeCatValue) return false
    if (activeSubtopic && a.altBaslik1 !== activeSubtopic) return false
    return true
  })

  const searchedArticles = searchQuery.trim()
    ? filteredArticles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredArticles

  const countFor = (key: FilterCategory) =>
    key === 'all' ? articles.length : articles.filter(a => a.category === key).length

  const countForVirtual = (key: VirtualCategory) => {
    const map = VIRTUAL_FILTER_MAP[key]
    return articles.filter(a => a.altBaslik1 === map.altBaslik1).length
  }

  const handleCategoryClick = (key: FilterCategory) => {
    setActiveFilter({ type: 'category', value: key })
    setActiveSubtopic(null)
  }

  const handleVirtualClick = (key: VirtualCategory) => {
    setActiveFilter({ type: 'virtual', value: key })
    setActiveSubtopic(null)
  }

  const handleBack = () => {
    if (activeSubtopic) {
      setActiveSubtopic(null)
    } else {
      setActiveFilter({ type: 'category', value: 'all' })
    }
  }

  const activeLabel = !isCategory && activeVirtValue
    ? VIRTUAL_FILTER_MAP[activeVirtValue].label
    : CATEGORY_DISPLAY[activeCatValue]

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
            Longevity, Corporate Bio-Integrity ve NeuroPerformance alanlarında güncel araştırmalar, klinik
            değerlendirmeler ve pratik rehberler.
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
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">

          {/* Geri tuşu */}
          <AnimatePresence>
            {(activeCatValue !== 'all' || activeSubtopic || !isCategory) && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-sans text-navy/50 hover:text-navy mb-3 transition-colors"
              >
                ← {activeSubtopic ? activeLabel : 'Tüm Kategoriler'}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Ana kategoriler — birinci satır */}
          <div className="flex flex-wrap gap-2">
            {MAIN_CATEGORIES.map((key) => {
              const isActive = isCategory && activeCatValue === key && !activeSubtopic
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

          {/* Sanal kategoriler — ikinci satır */}
          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-navy/5">
            {VIRTUAL_CATEGORIES.map((key) => {
              const isActive = !isCategory && activeVirtValue === key
              const { label } = VIRTUAL_FILTER_MAP[key]
              return (
                <button
                  key={key}
                  onClick={() => handleVirtualClick(key)}
                  className={`px-3 py-1 rounded-full text-xs font-sans border transition-colors ${
                    isActive
                      ? 'bg-gold/90 text-white border-gold'
                      : 'bg-white text-navy/50 border-navy/20 hover:border-gold/60 hover:text-gold'
                  }`}
                >
                  {label} ({countForVirtual(key)})
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
      {(activeCatValue !== 'all' || activeSubtopic || !isCategory) && (
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
              {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : 'Bu kategoride henüz makale bulunmamaktadır.'}
            </p>
          </div>
        ) : (
          <motion.div
            key={JSON.stringify(activeFilter) + (activeSubtopic ?? '') + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleGrid articles={searchedArticles} />
          </motion.div>
        )}
      </section>
    </div>
  )
}
