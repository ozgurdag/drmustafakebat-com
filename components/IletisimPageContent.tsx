'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'

const services = [
  {
    icon: '🌿',
    title: 'Longevity Danışmanlığı',
    subtitle: 'Uzun Yaşam & Biyolojik Yaş',
    desc: 'Biyolojik yaş analizi, hormonal optimizasyon, metabolik sağlık ve kişiselleştirilmiş longevity protokolü için birebir görüşme.',
    items: ['Biyolojik Yaş Değerlendirmesi', 'Hormonal & Metabolik Panel', 'Kişisel Suplement Protokolü', 'Uzun Vadeli Takip Planı'],
    color: 'from-[#1a3a28] to-[#2d5a3d]',
    accent: '#4a7c59',
    calendlyUrl: 'https://calendly.com/drmustafakebat/longevity',
  },
  {
    icon: '⚙️',
    title: 'Corporate Bio-Integrity',
    subtitle: 'Kurumsal Sağlık Yönetimi',
    desc: 'Kardiyovasküler erken uyarı sistemleri, biometric veri audit ve kurumsal wellness danışmanlığı için kurumsal görüşme.',
    items: ['Kurumsal Risk Analizi', 'Çalışan Sağlığı Taraması', 'Wellness Program Tasarımı', 'Mevzuat Uyumluluk Denetimi'],
    color: 'from-[#0d1f3a] to-[#1a3a6a]',
    accent: '#2d5a8a',
    calendlyUrl: 'https://calendly.com/drmustafakebat/corporate',
  },
  {
    icon: '🧠',
    title: 'NeuroPerformance',
    subtitle: 'Zihin & Hareket Optimizasyonu',
    desc: 'Nöro-görsel antrenman, propriyoseptif gelişim ve bilişsel yük yönetimi için bireysel veya kurumsal değerlendirme.',
    items: ['Nöro-Görsel Antrenman', 'Bilişsel Yük Analizi', 'Hareket & Postür Değerlendirmesi', 'Performans Protokolü'],
    color: 'from-[#1a1030] to-[#2d1a50]',
    accent: '#4a2d7a',
    calendlyUrl: 'https://calendly.com/drmustafakebat/neuroperformance',
  },
]

export default function IletisimPageContent() {
  const cardsRef = useRef(null)
  const isCardsInView = useInView(cardsRef, { once: false, margin: '-60px' })
  const [selected, setSelected] = useState<number | null>(null)
  const calendlyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selected === null || !calendlyRef.current) return
    const svc = services[selected]
    const el = calendlyRef.current
    el.innerHTML = ''
    
    let attempts = 0
    const maxAttempts = 30
    const initCalendly = () => {
      if (typeof (window as any).Calendly !== 'undefined') {
        ;(window as any).Calendly.initInlineWidget({ url: svc.calendlyUrl, parentElement: el, prefill: {}, utm: {} })
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(initCalendly, 100)
      } else {
        el.innerHTML = `
          <div class="p-8 text-center">
            <p class="text-navy/70 mb-4">Otomatik takvim yakında aktif olacak. Şimdilik aşağıdaki formu kullanarak tercih ettiğiniz zaman ve konuyu belirtin.</p>
            <a href="mailto:info@drmustafakebat.com?subject=Randevu%20Talebi%20-%20${encodeURIComponent(svc.title)}&body=Merhaba,%20${encodeURIComponent(svc.title)}%20alanında%20randevu%20almak%20istiyorum.%20Uygun%20olduğunuz%20zamanı%20belirtebilir%20misiniz?" class="inline-block bg-gold text-navy px-6 py-3 rounded-lg font-sans font-semibold hover:bg-gold/80 transition">
              Randevu Talep Et
            </a>
          </div>
        `
      }
    }
    initCalendly()
  }, [selected])

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
                onClick={() => setSelected(selected === i ? null : i)}
                className={`border-2 p-8 cursor-pointer transition-all duration-300 ${
                  selected === i
                    ? 'border-gold bg-navy text-white'
                    : 'border-gray-100 hover:border-gold/40 bg-white'
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
            >
              <div className="text-center mb-10">
                <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-2">
                  {services[selected].icon} {services[selected].title}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-navy">
                  Uygun Zamanı Seçin
                </h2>
              </div>

              <div
                ref={calendlyRef}
                className="calendly-inline-widget"
                data-url={services[selected].calendlyUrl}
                style={{ minWidth: '320px', height: '700px' }}
              />
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl mb-2">📍</div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">Konum</p>
            <p className="text-white/80 font-sans text-sm">Karşıyaka / İzmir</p>
          </div>
          <div>
            <div className="text-2xl mb-2">✉️</div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">E-posta</p>
            <a href="mailto:info@drmustafakebat.com" className="text-gold font-sans text-sm hover:underline">
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
