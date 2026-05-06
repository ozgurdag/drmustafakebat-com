'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CategorySidebarProps {
  subtopics: string[]
  activeSubtopic?: string | null
  onSubtopicChange?: (subtopic: string | null) => void
}

export default function CategorySidebar({
  subtopics,
  activeSubtopic,
  onSubtopicChange,
}: CategorySidebarProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleSubtopicClick = (subtopic: string | null) => {
    onSubtopicChange?.(subtopic)
  }

  return (
    <div className="bg-white rounded-lg border border-navy/10 p-5">
      <p className="text-[10px] uppercase tracking-[3px] text-gold font-sans mb-4">
        Konular
      </p>

      {/* Tümü */}
      <button
        onClick={() => handleSubtopicClick(null)}
        className={`w-full text-left text-sm font-sans py-2 px-3 rounded transition-colors mb-1 ${
          !activeSubtopic
            ? 'border-l-2 border-gold text-gold bg-gold/5'
            : 'text-navy/60 hover:text-navy border-l-2 border-transparent'
        }`}
      >
        Tümü
      </button>

      {/* Subtopics */}
      {subtopics.map((subtopic) => {
        const isActive = activeSubtopic === subtopic
        const isExpanded = expanded === subtopic

        return (
          <div key={subtopic} className="mb-1">
            <button
              onClick={() => {
                handleSubtopicClick(subtopic)
                setExpanded(isExpanded ? null : subtopic)
              }}
              className={`w-full text-left text-sm font-sans py-2 px-3 rounded transition-colors flex items-center justify-between ${
                isActive
                  ? 'border-l-2 border-gold text-gold bg-gold/5'
                  : 'text-navy/60 hover:text-navy border-l-2 border-transparent'
              }`}
            >
              <span>{subtopic}</span>
              <span className="text-xs opacity-50">{isExpanded ? '−' : '+'}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-5 py-1">
                    <p className="text-xs text-navy/40 font-sans italic py-1">
                      Bu konudaki tüm makaleler
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {subtopics.length === 0 && (
        <p className="text-xs text-navy/30 font-sans py-2 px-3 italic">
          Henüz konu eklenmedi.
        </p>
      )}
    </div>
  )
}
