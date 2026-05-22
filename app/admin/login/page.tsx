'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyToken } from '@/lib/github-api'
import { KeyRound, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return
    setLoading(true)
    setError('')
    try {
      await verifyToken(token.trim())
      sessionStorage.setItem('gh_pat', token.trim())
      router.push('/admin')
    } catch {
      setError('Geçersiz token. GitHub Personal Access Token\'ınızı kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-gold text-[10px] tracking-[4px] uppercase font-sans mb-3">Dr. Mustafa Kebat</p>
          <h1 className="font-serif text-3xl text-navy">Yönetim Paneli</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-navy/5 p-3 rounded-xl">
              <KeyRound size={20} className="text-navy" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-navy text-sm">GitHub Token ile Giriş</h2>
              <p className="font-sans text-gray-400 text-xs">Personal Access Token (repo yetkisi gerekli)</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-sans font-mono outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-sans bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-xl font-sans text-sm font-bold hover:bg-gold hover:text-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={16} />
              {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-300 text-xs font-sans mt-6">
          Token güvenli şekilde yalnızca bu oturumda saklanır.
        </p>
      </div>
    </div>
  )
}
