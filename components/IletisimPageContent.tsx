'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const services = [
  {
    icon: '🌿',
    title: 'Longevity Danışmanlığı',
    subtitle: 'Uzun Yaşam & Biyolojik Yaş',
    desc: 'Biyolojik yaş analizi, hormonal optimizasyon, metabolik sağlık ve kişiselleştirilmiş longevity protokolü için birebir görüşme.',
    items: ['Biyolojik Yaş Değerlendirmesi', 'Hormonal & Metabolik Panel', 'Kişisel Suplement Protokolü', 'Uzun Vadeli Takip Planı'],
    color: 'from-[#1a3a28] to-[#2d5a3d]',
    accent: '#4a7c59',
  },
  {
    icon: '⚙️',
    title: 'Corporate Bio-Integrity',
    subtitle: 'Kurumsal Sağlık Yönetimi',
    desc: 'Kardiyovasküler erken uyarı sistemleri, biometric veri audit ve kurumsal wellness danışmanlığı için kurumsal görüşme.',
    items: ['Kurumsal Risk Analizi', 'Çalışan Sağlığı Taraması', 'Wellness Program Tasarımı', 'Mevzuat Uyumluluk Denetimi'],
    color: 'from-[#0d1f3a] to-[#1a3a6a]',
    accent: '#2d5a8a',
  },
  {
    icon: '🧠',
    title: 'NeuroPerformance',
    subtitle: 'Zihin & Hareket Optimizasyonu',
    desc: 'Nöro-görsel antrenman, propriyoseptif gelişim ve bilişsel yük yönetimi için bireysel veya kurumsal değerlendirme.',
    items: ['Nöro-Görsel Antrenman', 'Bilişsel Yük Analizi', 'Hareket & Postür Değerlendirmesi', 'Performans Protokolü'],
    color: 'from-[#1a1030] to-[#2d1a50]',
    accent: '#4a2d7a',
  },
]

export default function IletisimPageContent() {
  const cardsRef = useRef(null)
  const isCardsInView = useInView(cardsRef, { once: false, margin: '-60px' })
  const [selected, setSelected] = useState<number | null>(null)
  const [meetingType, setMeetingType] = useState<'online' | 'face-to-face' | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateTime: '',
    message: ''
  })
  const calendlyRef = useRef<HTMLDivElement>(null)

  const handleServiceSelect = (index: number) => {
    setSelected(selected === index ? null : index)
    setMeetingType(null)
    setFormSubmitted(false)
    setForm({
      name: '',
      email: '',
      phone: '',
      dateTime: '',
      message: ''
    })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '2250a1e7-04f0-44b9-b128-0113545fa6e3',
          subject: `Yüz Yüze Görüşme Talebi - ${services[selected!].title}`,
          from_name: 'Dr. Mustafa Kebat İletişim',
          'İsim Soyisim': form.name,
          Email: form.email,
          Telefon: form.phone,
          'Tercih Edilen Zaman': form.dateTime || 'Belirtilmedi',
          'Seçilen Hizmet': services[selected!].title,
          Mesaj: form.message || 'Belirtilmedi'
        })
      })

      if (response.ok) {
        setFormSubmitted(true)
      } else {
        alert('Form gönderilirken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.')
      }
    } catch (err) {
      alert('Sistemsel bir bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (selected === null || meetingType !== 'online' || !calendlyRef.current) return
    const el = calendlyRef.current
    el.innerHTML = ''
    
    let attempts = 0
    const maxAttempts = 30
    const initCalendly = () => {
      if (typeof (window as any).Calendly !== 'undefined') {
        ;(window as any).Calendly.initInlineWidget({ 
          url: 'https://calendly.com/drmustafakebat/neuroperformance', 
          parentElement: el, 
          prefill: {}, 
          utm: {} 
        })
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(initCalendly, 100)
      } else {
        el.innerHTML = `
          <div class="p-8 text-center bg-white rounded-2xl shadow-sm border border-navy/10">
            <p class="text-navy/70 mb-4">Otomatik takvim yüklenemedi. Doğrudan randevu almak için aşağıdaki butonu kullanabilirsiniz.</p>
            <a href="https://calendly.com/drmustafakebat/neuroperformance" target="_blank" class="inline-block bg-gold text-navy px-6 py-3 rounded-lg font-sans font-semibold hover:bg-gold/80 transition">
              Takvimi Yeni Sekmede Aç
            </a>
          </div>
        `
      }
    }
    initCalendly()
  }, [selected, meetingType])

  const inputBase =
    'w-full rounded-lg border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-white focus:ring-2 focus:ring-gold focus:outline-none transition'

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-5 inline-flex items-center gap-2 border border-gold/30 px-3 py-1.5"
          >
            ✦ Randevu & Danışmanlık
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-serif font-normal leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(32px, 4.5vw, 58px)' }}
          >
            Uzman Görüşmesi<br />
            <em className="text-gold" style={{ fontStyle: 'italic' }}>Planlayın.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/60 font-sans text-[15px] leading-relaxed max-w-xl"
          >
            Longevity, Corporate Bio-Integrity ve NeuroPerformance alanlarından birini seçerek
            Dr. Kebat ile birebir görüşme planlayın. Otomatik takvim ile uygun zamanı belirleyin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-6 text-[11px] font-sans text-white/50 uppercase tracking-[2px]"
          >
            <span className="flex items-center gap-2"><span className="text-gold">✓</span> Ücretsiz İlk Görüşme</span>
            <span className="flex items-center gap-2"><span className="text-gold">✓</span> Online veya Yüz Yüze</span>
            <span className="flex items-center gap-2"><span className="text-gold">✓</span> Karşıyaka / İzmir</span>
          </motion.div>
        </div>
      </section>

      {/* 3 Hizmet Kartı */}
      <section className="bg-white py-20 px-6 md:px-12" ref={cardsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Randevu Türü Seçin</p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy">Hangi Konuda Görüşmek İstersiniz?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isCardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                onClick={() => handleServiceSelect(i)}
                className={`border-2 p-8 cursor-pointer transition-all duration-300 rounded-2xl ${
                  selected === i
                    ? 'border-gold bg-navy text-white shadow-xl scale-[1.02]'
                    : 'border-gray-100 hover:border-gold/40 hover:shadow-md bg-white'
                }`}
              >
                <div className="text-3xl mb-4">{svc.icon}</div>
                <h3 className={`font-serif text-[18px] mb-1 leading-snug ${selected === i ? 'text-white' : 'text-navy'}`}>
                  {svc.title}
                </h3>
                <p className={`text-[10px] uppercase tracking-[2px] font-sans mb-4 ${selected === i ? 'text-gold' : 'text-gold/80'}`}>
                  {svc.subtitle}
                </p>
                <p className={`text-[13px] leading-relaxed font-sans mb-5 ${selected === i ? 'text-white/70' : 'text-gray-500'}`}>
                  {svc.desc}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {svc.items.map((item, j) => (
                    <li key={j} className={`flex items-start gap-2 text-[12px] font-sans ${selected === i ? 'text-white/70' : 'text-navy/60'}`}>
                      <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className={`text-[11px] tracking-[2px] uppercase font-sans font-bold border-b-2 pb-0.5 w-fit transition-colors ${
                  selected === i ? 'text-gold border-gold' : 'text-navy border-navy/30'
                }`}>
                  {selected === i ? '✓ Seçildi' : 'Seç →'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Randevu Formu / Takvim */}
      <section className="bg-cream py-16 px-6 md:px-12 border-t border-navy/10">
        <div className="max-w-4xl mx-auto">
          {selected !== null ? (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              <div className="text-center">
                <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-2">
                  {services[selected].icon} {services[selected].title}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy">
                  Görüşme Yöntemi Seçin
                </h2>
              </div>

              {/* Görüşme Türü Seçim Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div
                  onClick={() => {
                    setMeetingType('online')
                    setFormSubmitted(false)
                  }}
                  className={`border-2 p-6 cursor-pointer transition-all duration-300 rounded-xl flex flex-col items-center text-center gap-2 ${
                    meetingType === 'online'
                      ? 'border-gold bg-navy text-white shadow-md'
                      : 'border-navy/10 hover:border-gold/40 bg-white text-navy'
                  }`}
                >
                  <span className="text-3xl">🎥</span>
                  <h4 className="font-serif text-[16px] font-medium">Çevrimiçi Görüşme</h4>
                  <p className="text-[12px] opacity-70">Zoom üzerinden online randevu planlayın.</p>
                </div>
                <div
                  onClick={() => {
                    setMeetingType('face-to-face')
                    setFormSubmitted(false)
                  }}
                  className={`border-2 p-6 cursor-pointer transition-all duration-300 rounded-xl flex flex-col items-center text-center gap-2 ${
                    meetingType === 'face-to-face'
                      ? 'border-gold bg-navy text-white shadow-md'
                      : 'border-navy/10 hover:border-gold/40 bg-white text-navy'
                  }`}
                >
                  <span className="text-3xl">🤝</span>
                  <h4 className="font-serif text-[16px] font-medium">Yüz Yüze Görüşme</h4>
                  <p className="text-[12px] opacity-70">Karşıyaka kliniğimizde yüz yüze görüşme talep edin.</p>
                </div>
              </div>

              {/* Online Görüşme (Calendly) */}
              {meetingType === 'online' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    ref={calendlyRef}
                    className="calendly-inline-widget rounded-2xl overflow-hidden border border-navy/10"
                    data-url="https://calendly.com/drmustafakebat/neuroperformance"
                    style={{ minWidth: '320px', height: '700px' }}
                  />
                </motion.div>
              )}

              {/* Yüz Yüze Görüşme (E-posta Formu) */}
              {meetingType === 'face-to-face' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {formSubmitted ? (
                    <div className="bg-white rounded-2xl border border-navy/10 p-10 flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto shadow-sm">
                      <span className="text-5xl">✉️</span>
                      <h3 className="font-serif text-2xl text-navy">Talebiniz İletildi</h3>
                      <p className="font-sans text-navy/70 text-sm leading-relaxed">
                        Yüz yüze görüşme talebiniz başarıyla gönderildi. En kısa sürede sizinle e-posta veya telefon üzerinden iletişime geçeceğiz.
                      </p>
                      <button
                        onClick={() => {
                          setForm({ name: '', email: '', phone: '', dateTime: '', message: '' })
                          setFormSubmitted(false)
                        }}
                        className="mt-2 text-xs font-sans text-navy/50 underline hover:text-gold transition-colors"
                      >
                        Yeni bir talep oluştur
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-navy/10 p-8 md:p-10 space-y-6 max-w-2xl mx-auto shadow-sm">
                      <h3 className="font-serif text-xl md:text-2xl text-navy mb-4 border-b border-navy/5 pb-3">Yüz Yüze Görüşme Talep Formu</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">Ad Soyad *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleFormChange}
                            placeholder="Adınız Soyadınız"
                            className={inputBase}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">Telefon Numarası *</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={form.phone}
                            onChange={handleFormChange}
                            placeholder="05XX XXX XX XX"
                            className={inputBase}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">E-posta Adresi *</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleFormChange}
                            placeholder="ornek@eposta.com"
                            className={inputBase}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">Tercih Edilen Tarih ve Saat</label>
                          <input
                            type="text"
                            name="dateTime"
                            value={form.dateTime}
                            onChange={handleFormChange}
                            placeholder="Örn: Pazartesi öğleden sonra"
                            className={inputBase}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">Seçilen Hizmet</label>
                        <input
                          type="text"
                          readOnly
                          value={services[selected!].title}
                          className="w-full rounded-lg border border-navy/10 px-4 py-3 font-sans text-sm text-navy/60 bg-gray-50 focus:outline-none cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-sans font-semibold text-navy uppercase tracking-wider">Mesajınız</label>
                        <textarea
                          name="message"
                          rows={4}
                          value={form.message}
                          onChange={handleFormChange}
                          placeholder="Görüşmek istediğiniz detayları kısaca belirtebilirsiniz..."
                          className={`${inputBase} resize-none`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-navy text-white font-sans font-semibold text-sm py-3.5 rounded-lg transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-navy/90 hover:shadow-lg'}`}
                      >
                        {isSubmitting ? 'Gönderiliyor...' : 'Talebi Gönder'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-navy/40 font-sans text-sm">Yukarıdan bir hizmet seçerek randevu alabilirsiniz.</p>
            </div>
          )}
        </div>
      </section>

      {/* İletişim Bilgileri */}
      <section className="bg-navy py-14 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl mb-2">📍</div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">Konum</p>
            <p className="text-white/80 font-sans text-sm">Karşıyaka / İzmir</p>
          </div>
          <div>
            <div className="text-2xl mb-2">📞</div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">Telefon</p>
            <a href="tel:05305684275" className="text-gold font-sans text-sm hover:underline block">
              0530 568 42 75
            </a>
          </div>
          <div>
            <div className="text-2xl mb-2">✉️</div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">E-posta</p>
            <a href="mailto:info@drmustafakebat.com" className="text-gold font-sans text-sm hover:underline block">
              info@drmustafakebat.com
            </a>
          </div>
          <div>
            <div className="text-2xl mb-2">🕐</div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">Çalışma Saatleri</p>
            <p className="text-white/80 font-sans text-sm">Pzt–Cuma · 09:00–18:00</p>
          </div>
        </div>
      </section>
    </>
  )
}
