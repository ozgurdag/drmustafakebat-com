'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const credentials = [
  'Tıp Doktoru (MD)',
  'A Sınıfı İSG Uzmanı',
  'İşyeri Hekimi',
  'Longevity Danışmanı',
  '1.000+ Makale',
]

export default function DoctorSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-navy flex flex-col md:flex-row min-h-[420px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="flex-none md:w-[45%] min-h-[280px] bg-gradient-to-br from-[#1a2a1a] via-[#2a3a2a] to-[#3d5a3d] flex items-center justify-center"
      >
        {/* Fotoğraf eklendiğinde: <Image src="/images/dr-kebat.jpg" alt="Dr. Mustafa Kebat" fill className="object-cover" /> */}
        <span className="text-[80px] opacity-60">👨‍⚕️</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12"
      >
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Hakkımda</p>
        <h2 className="font-serif text-4xl font-normal text-white mb-5">Dr. Mustafa Kebat</h2>
        <p className="text-gray-400 text-sm leading-relaxed font-sans mb-6 max-w-xl">
          Tıp doktoru ve A sınıfı iş güvenliği uzmanı. Klinik tıp, iş sağlığı ve güvenliği ile
          insan performansı alanlarını bütünleştiren özgün bir uzmanlık profili. 1.000&apos;den fazla
          makale ve kurumsal danışmanlık deneyimiyle bireylere ve kurumlara hizmet vermektedir.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {credentials.map((cred, i) => (
            <span
              key={i}
              className="border border-gold/30 text-gold text-[10px] tracking-wider px-3 py-1.5 font-sans"
            >
              {cred}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
