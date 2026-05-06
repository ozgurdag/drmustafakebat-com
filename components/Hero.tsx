'use client'

import { motion } from 'framer-motion'

const words = ['Sağlığı', 'Sistematik', 'Düşünmek.']

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const wordVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Arka plan dekoratif metin */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[clamp(80px,20vw,240px)] font-black text-white/[0.03] font-serif leading-none tracking-tighter">
          SAĞLIK
        </span>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gold text-[10px] tracking-[4px] uppercase font-sans mb-5"
        >
          Hekim · İSG Uzmanı · Araştırmacı
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="font-serif font-normal leading-[1.05] text-white mb-5"
          style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="inline-block mr-[0.25em] last:mr-0"
            >
              {i === 1 ? <span className="text-gold">{word}</span> : word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-gray-400 text-sm font-sans tracking-wider mb-8"
        >
          Longevity · Systems · NeuroPerformance
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 border border-gold px-6 py-2.5 text-gold text-[10px] tracking-[2px] uppercase font-sans"
        >
          ★ &nbsp; 1.000+ Makale · 20 Yıl Deneyim
        </motion.div>
      </div>

      {/* Aşağı ok */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/50 text-2xl animate-bounce"
      >
        ↓
      </motion.div>
    </section>
  )
}
