'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/github-api'
import { LogIn, Lock, User } from 'lucide-react'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m} dakika ${s} saniye` : `${s} saniye`
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lockedFor, setLockedFor] = useState(0)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  // Countdown timer when locked
  useEffect(() => {
    if (lockedFor <= 0) return
    const t = setInterval(() => {
      setLockedFor(prev => {
        if (prev <= 1) { clearInterval(t); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [lockedFor])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lockedFor > 0) return
    setLoading(true)
    setError('')
    setRemainingAttempts(null)
    try {
      const result = await adminLogin(username.trim(), password)
      if (result.ok) {
        router.push('/admin')
      } else if (result.error === 'too_many_attempts') {
        setLockedFor(result.remaining_seconds ?? 900)
        setError('')
      } else if (result.error === 'invalid_credentials') {
        const rem = result.remaining_attempts ?? 0
        setRemainingAttempts(rem)
        setError(rem > 0
          ? `Kullanıcı adı veya şifre hatalı. ${rem} deneme hakkınız kaldı.`
          : 'Kullanıcı adı veya şifre hatalı.')
      } else {
        setError('Giriş yapılamadı.')
      }
    } catch {
      setError('Sunucuya bağlanılamadı.')
    } finally {
      setLoading(false)
    }
  }

  const isLocked = lockedFor > 0

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-gold text-[10px] tracking-[4px] uppercase font-sans mb-3">Dr. Mustafa Kebat</p>
          <h1 className="font-serif text-3xl text-navy">Yönetim Paneli</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="bg-navy/5 p-3 rounded-xl">
              <Lock size={18} className="text-navy" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-navy text-sm">Güvenli Giriş</h2>
              <p className="font-sans text-gray-400 text-xs">3 hatalı denemede 15 dakika kilitleme</p>
            </div>
          </div>

          {isLocked ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Lock size={24} className="text-red-400" />
              </div>
              <p className="font-sans font-bold text-navy">Hesap Kilitlendi</p>
              <p className="font-sans text-gray-400 text-sm">
                {formatTime(lockedFor)} sonra tekrar deneyebilirsiniz.
              </p>
              <p className="font-mono text-3xl font-bold text-red-400">{formatTime(lockedFor)}</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                    autoFocus
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-sans bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-xl font-sans text-sm font-bold hover:bg-gold hover:text-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn size={16} />
                {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
