'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import ArticleGrid from './ArticleGrid'
import { ArticleMeta } from '@/lib/types'

const serviceCards = [
  {
    icon: '👁️',
    title: 'Nöro-Görsel Antrenman',
    desc: 'Görsel işleme hızı, periferal farkındalık ve göz-el koordinasyonu geliştiren bilimsel protokoller. Sporcular için reaksiyon süresi optimizasyonu, yöneticiler için görsel dikkat yönetimi.',
  },
  {
    icon: '⚡',
    title: 'Propriyoseptif Gelişim',
    desc: 'Vücut pozisyon algısı ve denge sistemini güçlendiren özelleştirilmiş antrenman protokolleri. Sakatlık önleme, postürel stabilite ve atletik hareket kalitesi için nöromüsküler yeniden programlama.',
  },
  {
    icon: '🧠',
    title: 'Bilişsel Yük Yönetimi',
    desc: 'Yüksek baskı altında karar kalitesini korumak için bilişsel dayanıklılık protokolleri. Çalışma belleği kapasitesi, odak sürekliliği ve zihinsel yorgunluk yönetimi için kanıt destekli stratejiler.',
  },
]

const stats = [
  { value: '%40 ↑', label: 'Reaksiyon Hızı Artışı' },
  { value: '%60 ↓', label: 'Sakatlık Riski Azalması' },
  { value: '%85', label: 'Karar Kalitesi İyileşme' },
]

interface NeuroperformancePageContentProps {
  recentArticles?: ArticleMeta[]
}

export default function NeuroperformancePageContent({ recentArticles = [] }: NeuroperformancePageContentProps) {
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: false, margin: '-80px' })

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-5 inline-flex items-center gap-2 border border-gold/30 px-3 py-1.5"
            >
              ✦ Nöro-Beden Performans Sistemi
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-serif font-normal leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(32px, 4.5vw, 58px)' }}
            >
              Sinir Sisteminizi<br />
              <em className="text-gold" style={{ fontStyle: 'italic' }}>Elit Seviyeye</em><br />
              Taşıyın.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/60 font-sans text-[15px] leading-relaxed mb-8 max-w-lg"
            >
              Nöroloji ve hareket biliminin kesişiminde geliştirilen protokollerle beyin-beden bütünleşmenizi optimize edin. Sporcu performansından yönetici etkinliğine, sakatlık önlemeden yaşlılık dengesine kapsamlı nöro-performans çözümleri.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 border border-gold text-gold px-6 py-3 text-[11px] tracking-[2px] uppercase font-sans font-bold hover:bg-gold hover:text-navy transition-colors"
              >
                Değerlendirme Randevusu Al →
              </Link>
              <a
                href="#hizmetler"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-6 py-3 text-[11px] tracking-[2px] uppercase font-sans hover:border-white/50 hover:text-white transition-colors"
              >
                Protokolleri İncele
              </a>
            </motion.div>
          </div>

          {/* Stats kartı */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="border border-gold/20 bg-white/[0.03] p-8"
          >
            <p className="text-gold text-[9px] tracking-[3px] uppercase font-sans mb-5 flex items-center gap-2">
              <span className="text-gold">✦</span> NeuroPerformance Protokolü
              <span className="ml-auto border border-gold/30 text-gold/70 text-[8px] px-2 py-0.5 tracking-wider">Aktif Seans</span>
            </p>
            <ul className="space-y-3.5">
              {[
                'Görsel İşleme Eğitimi — Saha Odaklı Protokol',
                'Propriyosepsiyon — Denge ve Stabilite Sistemi',
                'Bilişsel Yük Yönetimi — Karar Dayanıklılığı',
                'Nöroplastisite Egzersizleri — Beyin Rezervi',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] font-sans text-white/70">
                  <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">Nöral Durum</p>
              <p className="text-sm font-sans text-white/80">Performans Optimizasyonu Aktif</p>
            </div>
          </motion.div>
        </div>

        {/* Stats şeridi */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-6xl mx-auto mt-16 pt-12 border-t border-white/10 grid grid-cols-3 gap-8"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
            >
              <div className="font-serif text-3xl md:text-4xl text-white font-light mb-1">{s.value}</div>
              <div className="text-[9px] text-white/40 uppercase tracking-[2px] font-sans">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Hizmet Kartları */}
      <section id="hizmetler" className="bg-white py-20 px-6 md:px-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Uygulama Protokolleri</p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy">NeuroPerformance Sistem Bileşenleri</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border border-gray-100 p-8 hover:border-gold/40 transition-colors group"
              >
                <div className="text-3xl mb-5">{card.icon}</div>
                <h3 className="font-serif text-[18px] text-navy mb-3 leading-snug">{card.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed font-sans">{card.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 bg-navy/5 border border-navy/10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-serif text-2xl text-navy font-light mb-1">Sporcu</div>
              <div className="text-[10px] text-navy/50 uppercase tracking-widest font-sans">Sahada daha az sakatlık, daha yüksek performans</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-navy font-light mb-1">Yönetici</div>
              <div className="text-[10px] text-navy/50 uppercase tracking-widest font-sans">Karar yorgunluğu olmadan sürekli netlik</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-navy font-light mb-1">Yaşlı Birey</div>
              <div className="text-[10px] text-navy/50 uppercase tracking-widest font-sans">Denge ve bağımsızlığı koruma</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 px-6 text-center border-t border-gray-100">
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Bir Sonraki Adım</p>
        <h2 className="font-serif text-3xl font-normal text-navy mb-5">Nöro-Performans Değerlendirmesi İçin Randevu Alın</h2>
        <p className="text-gray-500 font-sans text-sm mb-8 max-w-lg mx-auto">
          Dr. Kebat ile birebir görüşerek size özel NeuroPerformance protokolü ve antrenman planı oluşturun.
        </p>
        <Link
          href="/iletisim"
          className="inline-flex items-center gap-2 bg-navy text-white px-8 py-3.5 text-[11px] tracking-[2px] uppercase font-sans font-bold hover:bg-gold hover:text-navy transition-colors"
        >
          İletişime Geç →
        </Link>
      </section>

      {recentArticles.length > 0 && (
        <section className="bg-cream py-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-baseline mb-8 border-b border-navy/10 pb-4">
              <div>
                <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-1">İlgili Yayınlar</p>
                <h2 className="font-serif text-2xl font-normal text-navy">NeuroPerformance Makaleleri</h2>
              </div>
              <Link href="/makaleler" className="text-[11px] tracking-[1px] uppercase font-sans text-gold hover:underline">
                Tüm Makaleler →
              </Link>
            </div>
            <ArticleGrid articles={recentArticles} />
          </div>
        </section>
      )}
    </>
  )
}
