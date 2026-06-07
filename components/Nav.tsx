'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navLinks = [
  { href: '/longevity', label: 'Longevity' },
  { href: '/systems', label: 'Kurumsal Sağlık' },
  { href: '/neuroperformance', label: 'Nöroergonomi' },
  { href: '/makaleler', label: 'Makaleler' },
  { href: '/hakkimda', label: 'Hakkımda' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="fixed top-0 left-0 right-0 z-50 h-[90px] flex items-center px-8 gap-8 bg-cover bg-center bg-navy"
        style={{ backgroundImage: "url('/images/nav-banner.jpg')" }}
      >
        {/* Left — Dr. Mustafa Kebat */}
        <div className="hidden lg:block flex-shrink-0">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <div className="text-white text-[18px] tracking-[3px] uppercase font-sans font-medium">Dr. Mustafa Kebat</div>
            <div className="text-gold text-[10px] tracking-[1.5px] font-sans mt-0.5">Kurumsal Sağlık ve Longevity Danışmanı</div>
          </Link>
        </div>

        {/* Nav links — center */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-gold transition-colors group">
              <span className="block text-white text-[13px] font-sans tracking-[1px] group-hover:text-gold transition-colors">
                {label}
              </span>
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
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <div className="text-white text-[15px] tracking-[2px] uppercase font-sans font-medium text-center">Dr. Mustafa Kebat</div>
            <div className="text-gold text-[9px] tracking-[0.5px] font-sans text-center mt-0.5">Kurumsal Sağlık ve Longevity Danışmanı</div>
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
            className="fixed top-[90px] left-0 right-0 z-40 bg-navy border-t border-white/10 py-6 px-8 flex flex-col gap-4"
          >
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="text-white hover:text-gold transition-colors">
                <span className="block text-sm font-sans tracking-[2px] uppercase">{label}</span>
              </Link>
            ))}
            <Link href="/iletisim" onClick={() => setMenuOpen(false)} className="text-white text-sm font-sans tracking-[2px] uppercase hover:text-gold transition-colors">İletişim</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
