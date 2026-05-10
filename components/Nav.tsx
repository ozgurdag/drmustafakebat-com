'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="fixed top-0 left-0 right-0 z-50 bg-navy h-[72px] flex items-center justify-between px-8"
      >
        {/* Left */}
        <div className="hidden lg:flex flex-col">
          <span className="text-[#999] text-[9px] tracking-[2px] uppercase font-sans">Karşıyaka / İzmir</span>
          <Link href="/iletisim" className="text-white text-[11px] font-bold tracking-[1px] font-sans hover:text-gold transition-colors">
            İLETİŞİM <span className="text-gold">→</span>
          </Link>
        </div>

        {/* Center logo */}
        <div className="text-center">
          <Link href="/">
            <div className="text-white text-[13px] tracking-[3px] uppercase font-sans">Dr. Mustafa Kebat</div>
            <div className="text-gold text-[9px] tracking-[2px] font-sans">Hekim · Longevity Danışmanı · Araştırmacı</div>
          </Link>
        </div>

        {/* Right */}
        <div className="hidden lg:flex flex-col items-end gap-0.5">
          <div className="flex gap-5 text-white text-[11px] font-sans tracking-[1px]">
              <Link href="/longevity" className="hover:text-gold transition-colors">Longevity</Link>
            <Link href="/systems" className="hover:text-gold transition-colors leading-tight text-center">Corporate<br />Bio-Integrity</Link>
            <Link href="/neuroperformance" className="hover:text-gold transition-colors leading-tight text-center">Neuro<br />Performance</Link>
            <Link href="/makaleler" className="hover:text-gold transition-colors">Makaleler</Link>
            <Link href="/hakkimda" className="hover:text-gold transition-colors">Hakkımda</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-[11px] font-sans tracking-[2px] self-end hover:text-gold transition-colors">
            ≡ MENÜ
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white text-2xl">≡</button>
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
            {([['Longevity','/longevity'],['Corporate Bio-Integrity','/systems'],['NeuroPerformance','/neuroperformance'],['Makaleler','/makaleler'],['Hakkımda','/hakkimda'],['İletişim','/iletisim']] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="text-white text-sm font-sans tracking-[2px] uppercase hover:text-gold transition-colors">{label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
