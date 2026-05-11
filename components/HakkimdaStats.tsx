'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { value: '1.000+', label: 'Makale' },
  { value: '30+', label: 'Yıl Deneyim' },
  { value: 'İş Yeri', label: 'Hekimi & Araştırmacı' },
]

export default function HakkimdaStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-80px' })

  return (
    <section className="bg-navy py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-around gap-10 text-center text-white">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-serif text-5xl text-gold">{s.value}</p>
              <p className="font-sans text-sm uppercase tracking-widest text-white/60 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
