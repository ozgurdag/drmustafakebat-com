'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { adminLogout } from '@/lib/github-api'

export default function AdminSessionWatcher() {
  const pathname = usePathname()
  const prevPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    // If we transition from /admin to a non-/admin path, logout the session.
    if (prevPathnameRef.current) {
      const wasAdmin = prevPathnameRef.current.startsWith('/admin')
      const isAdminNow = pathname ? pathname.startsWith('/admin') : false

      if (wasAdmin && !isAdminNow) {
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('admin_active')
        }
        adminLogout().catch(err => console.error('Logout error:', err))
      }
    }

    prevPathnameRef.current = pathname
  }, [pathname])

  return null
}
