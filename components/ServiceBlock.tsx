'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ServiceBlockProps {
  number: string
  eyebrow: string
  title: string
  description: string
  items: string[]
  href: string
  reversed?: boolean
  gradientClass: string
  icon: string
}

export default function ServiceBlock({
  number,
  eyebrow,
  title,
  description,
  items,
  href,
  reversed = false,
  gradientClass,
  icon,
}: ServiceBlockProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[480px]`}
    >
      {/* Görsel */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className={`flex-1 ${gradientClass} flex items-center justify-center relative min-h-[280px] md:min-h-0`}
      >
        <span className="absolute top-6 left-7 text-[80px] font-black text-white/[0.05] font-serif leading-none select-none">
          {number}
        </span>
        <span className="text-[72px] relative z-10">{icon}</span>
      </motion.div>

      {/* İçerik */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.1 }}
        className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12 bg-white"
      >
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">{eyebrow}</p>
        <h2 className="font-serif text-4xl font-normal text-navy mb-4">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed font-sans mb-6">{description}</p>
        <ul className="space-y-2.5 mb-8">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-[13px] font-sans text-gray-700">
              <span className="w-5 h-px bg-gold flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-sans font-bold text-navy border-b-2 border-gold pb-0.5 w-fit hover:text-gold transition-colors"
        >
          Makaleleri Keşfet →
        </Link>
      </motion.div>
    </section>
  )
}
