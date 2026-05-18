'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navLinks = [
  { href: '/longevity', en: 'Longevity', tr: 'Uzun Yaşam' },
  { href: '/systems', en: 'Corporate Bio-Integrity', tr: 'Kurumsal Sağlık' },
  { href: '/neuroperformance', en: 'NeuroPerformance', tr: 'Zihin & Hareket' },
  { href: '/makaleler', en: 'Makaleler', tr: null },
  { href: '/hakkimda', en: 'Hakkımda', tr: null },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="fixed top-0 left-0 right-0 z-50 bg-navy h-[72px] flex items-center px-8 gap-8"
      >
        {/* Left — Dr. Mustafa Kebat */}
        <div className="hidden lg:block flex-shrink-0">
          <Link href="/">
            <div className="text-white text-[13px] tracking-[3px] uppercase font-sans">Dr. Mustafa Kebat</div>
            <div className="text-gold text-[9px] tracking-[2px] font-sans">Hekim · Longevity Danışmanı · Araştırmacı</div>
          </Link>
        </div>

        {/* Nav links — center */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map(({ href, en, tr }) => (
            <Link key={href} href={href} className="hover:text-gold transition-colors text-center group">
              <span className="block text-white text-[13px] font-sans tracking-[1px] group-hover:text-gold transition-colors">{en}</span>
              {tr && <span className="block text-white/35 text-[10px] font-sans tracking-[0.5px] mt-0.5 group-hover:text-gold/60 transition-colors">{tr}</span>}
            </Link>
          ))}
        </div>

        {/* Right — İletişim */}
        <div className="hidden lg:flex flex-col flex-shrink-0 items-end">
          <span className="text-[#999] text-[9px] tracking-[2px] uppercase font-sans">Karşıyaka / İzmir</span>
          <Link href="/iletisim" className="text-white text-[13px] font-bold tracking-[1px] font-sans hover:text-gold transition-colors">
            İLETİŞİM <span className="text-gold">→</span>
          </Link>
        </div>

        {/* Mobile: logo center + hamburger right */}
        <div className="flex lg:hidden flex-1 justify-center">
          <Link href="/">
            <div className="text-white text-[12px] tracking-[2px] uppercase font-sans">Dr. Mustafa Kebat</div>
            <div className="text-gold text-[8px] tracking-[1px] font-sans text-center">Hekim · Longevity Danışmanı</div>
          </Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white text-2xl flex-shrink-0">≡</button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-navy border-t border-white/10 py-6 px-8 flex flex-col gap-4"
          >
            {navLinks.map(({ href, en, tr }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="text-white hover:text-gold transition-colors">
                <span className="block text-sm font-sans tracking-[2px] uppercase">{en}</span>
                {tr && <span className="block text-white/40 text-[10px] font-sans tracking-[1px] mt-0.5">{tr}</span>}
              </Link>
            ))}
            <Link href="/iletisim" onClick={() => setMenuOpen(false)} className="text-white text-sm font-sans tracking-[2px] uppercase hover:text-gold transition-colors">İletişim</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
