'use client'

import { motion } from 'framer-motion'

const credentials = [
  'Tıp Doktoru (MD)',
  'Longevity Danışmanı',
  'Kurumsal Sağlık Danışmanlığı',
  '1.000+ Makale',
  'Nöroergonomi Eğitmeni',
  'Bireysel & Kurumsal Danışmanlık',
  'Karşıyaka / İzmir',
  'Biyolojik Yaş Optimizasyonu',
]

export default function CredentialBar() {
  const items = [...credentials, ...credentials, ...credentials]

  return (
    <div className="bg-cream border-y border-gray-200 py-4 overflow-hidden">
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-10 whitespace-nowrap"
      >
        {items.map((cred, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-[10px] tracking-[3px] uppercase text-gray-400 font-sans">
              {cred}
            </span>
            <span className="text-gold/40 text-xs">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
