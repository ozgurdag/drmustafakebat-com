'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/longevity', label: 'Longevity' },
  { href: '/systems', label: 'Systems' },
  { href: '/neuroperformance', label: 'NeuroPerformance' },
  { href: '/makaleler', label: 'Makaleler' },
  { href: '/hakkimda', label: 'Hakkımda' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 bg-navy transition-shadow duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-[68px]">
          {/* Sol */}
          <div className="flex flex-col">
            <span className="text-gray-500 text-[9px] tracking-[3px] uppercase font-sans">
              İstanbul, Türkiye
            </span>
            <Link
              href="/iletisim"
              className="text-white text-[11px] font-bold tracking-wider font-sans hover:text-gold transition-colors"
            >
              İLETİŞİM <span className="text-gold">→</span>
            </Link>
          </div>

          {/* Orta: Logo */}
          <Link href="/" className="text-center absolute left-1/2 -translate-x-1/2">
            <div className="text-white text-[13px] tracking-[3px] uppercase font-sans font-bold">
              Dr. Mustafa Kebat
            </div>
            <div className="text-gold text-[9px] tracking-[2px] uppercase font-sans">
              Hekim · İSG Uzmanı · Araştırmacı
            </div>
          </Link>

          {/* Sağ: desktop linkler + hamburger */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-5">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 text-[11px] tracking-wider uppercase font-sans hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white text-[11px] tracking-[2px] uppercase font-sans flex items-center gap-2"
              aria-label="Menü"
            >
              {menuOpen ? '✕' : '≡'} MENÜ
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobil Menü */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-navy border-t border-gray-800"
          >
            <div className="flex flex-col py-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-8 py-3 text-gray-300 text-[13px] tracking-wider uppercase font-sans hover:text-gold hover:bg-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/iletisim"
                onClick={() => setMenuOpen(false)}
                className="mx-6 mt-4 py-3 text-center bg-gold text-navy text-[11px] font-bold tracking-wider uppercase"
              >
                İLETİŞİM →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
