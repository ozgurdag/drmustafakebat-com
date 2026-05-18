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
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      <div className="bg-white/80 border border-gold/20 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm my-12 transition-all">
        <span className="text-4xl">✨</span>
        <h3 className="font-serif text-xl text-navy mt-4 font-light">Bültene Başarıyla Abone Oldunuz!</h3>
        <p className="font-sans text-navy/70 text-sm mt-2 max-w-md mx-auto leading-relaxed">
          Dr. Mustafa Kebat&apos;ın en güncel makaleleri ve sağlıklı yaşam bültenleri artık e-posta kutunuza gelecek. İlginiz için teşekkürler.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-navy/5 rounded-2xl p-8 md:p-10 max-w-2xl mx-auto shadow-sm my-12">
      <div className="text-center md:text-left mb-6">
        <span className="font-sans text-gold text-xs font-semibold tracking-wider uppercase">Sağlık ve Performans Bülteni</span>
        <h3 className="font-serif text-2xl text-navy mt-1 font-light">Bilgi ve Deneyimi Paylaşıyoruz</h3>
        <p className="font-sans text-navy/70 text-sm mt-2 leading-relaxed">
          Dr. Mustafa Kebat&apos;ın her hafta yayınladığı en güncel bilimsel makaleleri, longevity, nöroergonomi ve kurumsal sağlık rehberlerini ilk okuyan siz olun.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            className="flex-1 rounded-lg border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-cream/30 focus:ring-2 focus:ring-gold focus:border-transparent focus:outline-none transition-all placeholder:text-navy/40"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-navy hover:bg-navy/90 text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-sm"
          >
            {status === 'loading' ? 'Kaydediliyor...' : 'Abone Ol'}
          </button>
        </div>

        <div className="flex items-start gap-2.5">
          <input
            id="kvkk"
            type="checkbox"
            checked={kvkkAccepted}
            onChange={(e) => setKvkkAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-navy/20 text-gold focus:ring-gold accent-gold cursor-pointer"
            disabled={status === 'loading'}
          />
          <label htmlFor="kvkk" className="text-[11px] font-sans text-navy/60 leading-normal cursor-pointer select-none">
            <a href="/iletisim" target="_blank" className="underline hover:text-gold transition-colors">KVKK Aydınlatma Metni</a> kapsamında, Dr. Mustafa Kebat&apos;ın yayınladığı içeriklerle ilgili e-posta bülteni almayı ve kişisel verilerimin bu amaçla işlenmesini kabul ediyorum.
          </label>
        </div>

        {status === 'error' && (
          <p className="text-red-500 font-sans text-xs mt-2 text-center sm:text-left bg-red-50 border border-red-100 rounded-lg p-2.5">
            ⚠️ {errorMessage}
          </p>
        )}
      </form>
    </div>
  )
}
