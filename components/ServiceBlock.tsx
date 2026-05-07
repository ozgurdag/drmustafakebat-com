'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
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
  photo?: string
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
  photo,
}: ServiceBlockProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0])
  const imageY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  return (
    <section
      ref={ref}
      className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[520px] overflow-hidden`}
    >
      {/* Görsel */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? 80 : -80 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className={`flex-1 relative overflow-hidden min-h-[320px] md:min-h-0 ${!photo ? gradientClass : ''}`}
      >
        {photo ? (
          <>
            <motion.div
              style={{ scale: imageScale, y: imageY }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={photo}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            {/* Koyu overlay — okunabilirlik için */}
            <div className={`absolute inset-0 ${gradientClass} opacity-60`} />
          </>
        ) : null}

        {/* Numara */}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-6 left-7 text-[80px] font-black text-white/10 font-serif leading-none select-none z-10"
        >
          {number}
        </motion.span>

        {/* İkon */}
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute bottom-8 right-8 text-[56px] z-10"
        >
          {icon}
        </motion.span>

        {/* Altın çizgi aksesuarı */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ originX: reversed ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gold z-10"
        />
      </motion.div>

      {/* İçerik */}
      <motion.div
        initial={{ opacity: 0, x: reversed ? -80 : 80 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 }}
        className="flex-1 flex flex-col justify-center px-8 md:px-14 py-14 bg-white"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3"
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="font-serif text-4xl font-normal text-navy mb-4"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="text-gray-500 text-sm leading-relaxed font-sans mb-6"
        >
          {description}
        </motion.p>

        <ul className="space-y-2.5 mb-8">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
              className="flex items-center gap-3 text-[13px] font-sans text-gray-700"
            >
              <span className="w-5 h-px bg-gold flex-shrink-0" />
              {item}
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <Link
            href={href}
            className="group inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-sans font-bold text-navy border-b-2 border-gold pb-0.5 w-fit hover:text-gold transition-colors"
          >
            Makaleleri Keşfet
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
