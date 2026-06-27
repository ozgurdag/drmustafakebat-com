'use client'

import { motion } from 'framer-motion'

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
    <section className="relative flex items-center justify-center overflow-hidden" style={{ height: '90vh', minHeight: '600px', background: 'linear-gradient(135deg, #0a1220 0%, #1a2840 40%, #0d1a2e 100%)' }}>
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/85 z-[1]" />

      {/* Decorative SAĞLIK text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[200px] font-black text-white/[0.03] font-sans leading-none whitespace-nowrap" style={{ letterSpacing: '-10px' }}>
          SAĞLIK
        </span>
      </div>

      <div className="relative z-[2] text-center px-5 max-w-4xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gold text-[10px] tracking-[4px] uppercase font-sans mb-4"
        >
          İnsan Performansı Hekimliği
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="font-serif font-normal leading-[1.0] text-white mb-5"
          style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
        >
          <motion.span variants={wordVariant} className="block">
            Sağlığı
          </motion.span>
          <motion.span variants={wordVariant} className="block">
            <em className="not-italic text-gold" style={{ fontStyle: 'italic' }}>Sistematik</em>
          </motion.span>
          <motion.span variants={wordVariant} className="block">
            Düşünmek.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="font-sans tracking-[1px] mb-7"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}
        >
          Uzun Yaşam · Sistemler · NöroPerformans
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 border border-gold text-gold font-sans uppercase font-sans"
          style={{ padding: '8px 20px', fontSize: '10px', letterSpacing: '2px' }}
        >
          ★ &nbsp; 1.000+ Makale · 30+ Yıl Deneyim
        </motion.div>
      </div>
    </section>
  )
}
