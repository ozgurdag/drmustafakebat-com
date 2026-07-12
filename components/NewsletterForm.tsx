'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    if (!kvkkAccepted) {
      setStatus('error')
      setErrorMessage('Lütfen bülten gönderim onayını (KVKK) işaretleyin.')
      return
    }
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Abonelik işlemi başarısız oldu. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage('Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.')
    }
  }

  if (status === 'success') {
    return (
      <section className="bg-navy py-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <span className="text-3xl">✨</span>
          <div>
            <h3 className="font-serif text-xl text-white font-light">Bültene Başarıyla Abone Oldunuz!</h3>
            <p className="font-sans text-white/60 text-sm mt-1">
              Dr. Mustafa Kebat&apos;ın güncel makaleleri artık e-posta kutunuza gelecek.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-navy py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Sol — Metin */}
        <div>
          <p className="text-gold text-[10px] tracking-[4px] uppercase font-sans mb-3">
            Sağlık &amp; Performans Bülteni
          </p>
          <h3 className="font-serif text-3xl md:text-4xl font-normal text-white leading-tight mb-3">
            30+ Yıllık Deneyimi<br />
            <em className="not-italic text-gold" style={{ fontStyle: 'italic' }}>Bülteninize Taşıyalım</em>
          </h3>
          <p className="font-sans text-white/60 text-sm leading-relaxed max-w-md">
            Longevity, kurumsal iş sağlığı ve nöroergonomi alanlarında Dr. Mustafa Kebat&apos;ın
            1.000&apos;den fazla makale birikimiyle hazırladığı güncel içerikleri ilk alan siz olun.
          </p>
        </div>

        {/* Sağ — Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="flex-1 border border-white/20 bg-white/10 text-white placeholder:text-white/40 font-sans text-sm px-4 py-3 focus:outline-none focus:border-gold/60 transition-colors"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="border border-gold text-gold font-sans text-[11px] tracking-[2px] uppercase px-6 py-3 hover:bg-gold hover:text-navy transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {status === 'loading' ? 'Kaydediliyor...' : 'Abone Ol'}
              </button>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="kvkk"
                type="checkbox"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-gold cursor-pointer"
                disabled={status === 'loading'}
              />
              <label htmlFor="kvkk" className="text-[10px] font-sans text-white/40 leading-normal cursor-pointer select-none">
                <a href="/iletisim" target="_blank" className="underline hover:text-gold transition-colors">
                  KVKK Aydınlatma Metni
                </a>{' '}
                kapsamında e-posta bülteni almayı ve kişisel verilerimin bu amaçla işlenmesini kabul ediyorum.
              </label>
            </div>

            {status === 'error' && (
              <p className="text-red-400 font-sans text-xs border border-red-400/30 bg-red-400/10 px-3 py-2">
                ⚠️ {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
