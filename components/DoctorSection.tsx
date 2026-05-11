'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const credentials = [
  'Tıp Doktoru (MD)',
  'Longevity Danışmanı',
  'Kurumsal Sağlık Danışmanlığı',
  'Biyolojik Yaş Optimizasyonu',
  '1.000+ Makale',
]

export default function DoctorSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })

  return (
    <section ref={ref} className="flex flex-col md:flex-row" style={{ background: '#2d3142', minHeight: '500px' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="flex-none md:w-[45%] min-h-[280px] flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a2a1a, #2a3a2a, #3d5a3d)' }}
      >
        {/* Fotoğraf eklendiğinde: <Image src="/images/dr-kebat.jpg" alt="Dr. Mustafa Kebat" fill className="object-cover" /> */}
        <span className="text-[80px] opacity-60">👨‍⚕️</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="flex-1 flex flex-col justify-center"
        style={{ padding: '60px 48px' }}
      >
        <p className="font-sans uppercase mb-3" style={{ color: '#c9a84c', fontSize: '10px', letterSpacing: '3px' }}>Hakkımda</p>
        <h2 className="font-serif font-normal text-white mb-5" style={{ fontSize: '40px' }}>Dr. Mustafa Kebat</h2>
        <p className="font-sans mb-6 max-w-xl" style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.8' }}>
          Tıp doktoru ve Longevity danışmanı. Bireysel sağlık optimizasyonundan kurumsal sağlık
          yönetimine uzanan bütünleşik bir uzmanlık anlayışı. 1.000&apos;den fazla makale ve
          kapsamlı danışmanlık deneyimiyle bireylere ve kurumlara özel protokoller sunmaktadır.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {credentials.map((cred, i) => (
            <span
              key={i}
              className="font-sans"
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#c9a84c',
                fontSize: '10px',
                letterSpacing: '1px',
                padding: '6px 12px',
              }}
            >
              {cred}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
