'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LayoutDashboard, FileText, Globe, LogOut } from 'lucide-react'
import { checkAdminSession, adminLogout } from '@/lib/github-api'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Makaleler', href: '/admin/makaleler', icon: FileText },
  { label: 'Siteyi Gör', href: '/', icon: Globe },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'
    if (isLoginPage) { setAuthorized(true); return }

    checkAdminSession().then(ok => {
      if (ok) {
        setAuthorized(true)
      } else {
        setAuthorized(false)
        router.push('/admin/login')
      }
    })
  }, [pathname, router])

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'
  if (isLoginPage) return <>{children}</>

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (authorized === false) return null

  const handleLogout = async () => {
    await adminLogout()
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[#f5f3ee]">
      <aside className="w-60 bg-navy text-white flex flex-col fixed inset-y-0 shadow-2xl z-30">
        <div className="p-7 border-b border-white/5">
          <h2 className="text-lg font-serif tracking-widest text-gold uppercase">Dr. Kebat</h2>
          <p className="text-[10px] text-white/40 tracking-[2px] mt-1 font-sans">YÖNETİM PANELİ</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-sans text-sm ${
                  isActive ? 'bg-gold text-navy font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-sans text-sm"
          >
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-60 p-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {children}
        </motion.div>
      </main>
    </div>
  )
}
