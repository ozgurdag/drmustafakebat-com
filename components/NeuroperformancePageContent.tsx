'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import ArticleGrid from './ArticleGrid'
import { ArticleMeta } from '@/lib/types'

const neuroItems = [
  {
    icon: '🧠',
    title: '1. Nöroergonomi Nedir?',
    desc: 'Nöroergonominin tanımı, amacı ve klasik ergonomiden farkları. Beyin temelli tasarımın çalışma yaşamındaki önemi.',
  },
  {
    icon: '🎯',
    title: '2. İnsan Beyni İş Yerinde Nasıl Çalışır?',
    desc: 'Dikkat, algı, bellek, karar verme ve öğrenme süreçlerinin iş performansı ve güvenliği üzerindeki etkileri.',
  },
  {
    icon: '⚠️',
    title: '3. Dikkat, Algı ve Hata Mekanizmaları',
    desc: 'İnsan hatasının nörobilimsel nedenleri. Dikkat tünelleşmesi, algı yanılmaları ve otomatikleşmenin riskleri.',
  },
  {
    icon: '🔋',
    title: '4. Beyin Yorgunluğu ve Zihinsel İş Yükü',
    desc: 'Mental yorgunluk belirtileri, iş yükü yönetimi, bilişsel tükenme sendromu ve performans üzerindeki etkileri.',
  },
  {
    icon: '👁️',
    title: '5. Görsel Tasarım ve Nöroergonomi',
    desc: 'Renk, ışık, kontrast, uyarı sistemleri ve görsel arayüz tasarımının beyin üzerindeki etkileri ve doğru uygulama ilkeleri.',
  },
  {
    icon: '🔊',
    title: '6. Gürültü, Stres ve Bilişsel Performans',
    desc: 'Gürültünün beyindeki etkileri, stres yanıtı, karar kalitesi ve hata oranları üzerindeki rolü.',
  },
  {
    icon: '🪑',
    title: '7. Nöroergonomik Çalışma İstasyonu Tasarımı',
    desc: 'Ofis, kontrol odası ve üretim alanlarında beyne uygun çalışma istasyonu tasarım prensipleri.',
  },
  {
    icon: '🌙',
    title: '8. Vardiyalar, Sirkadiyen Ritim ve Beyin Sağlığı',
    desc: 'Vardiyalı çalışmanın nörobiyolojik etkileri, uyku-uyanıklık döngüsü ve performansa yansımaları.',
  },
  {
    icon: '🏃',
    title: '9. Hareket, Beyin ve Performans',
    desc: 'Fiziksel aktivitenin bilişsel fonksiyonlar, yaratıcılık, dikkat ve öğrenme üzerindeki olumlu etkileri.',
  },
  {
    icon: '🛡️',
    title: '10. Nörobilişsel Güvenlik ve Davranış',
    desc: 'Nörobilişsel güvenlik kavramı, güvenli davranışın nörobilimsel temelleri ve eğitim yaklaşımları.',
  },
  {
    icon: '🤖',
    title: '11. Teknoloji, Otomasyon ve Beyin',
    desc: 'Yapay zeka, otomasyon, dijitalleşme ve insan beyni ilişkisi. Teknolojinin doğru kullanımı ve nöroergonomik riskler.',
  },
  {
    icon: '📊',
    title: '12. Ölçüm, Değerlendirme ve Nöroergonomik Analiz',
    desc: 'Nöroergonomik değerlendirme yöntemleri, dikkat ve bilişsel performans ölçümleri, analiz araçları ve uygulama süreçleri.',
  },
  {
    icon: '💡',
    title: '13. Geleceğin İş Yerleri ve Nöroergonomi',
    desc: 'İnsan merkezli, beyne uygun, sürdürülebilir ve dirençli iş yerlerinin geleceği. Trendler, yeni yaklaşımlar ve inovasyon.',
  }
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              NÖROERGONOMİ<br />
              <em className="text-gold" style={{ fontStyle: 'italic', fontSize: '0.6em', lineHeight: '1.2', display: 'block', marginTop: '10px' }}>BEYİNE UYGUN İŞ, GÜVENLİ, SAĞLIKLI VE SÜRDÜRÜLEBİLİR PERFORMANS</em>
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
          className="max-w-7xl mx-auto mt-16 pt-12 border-t border-white/10 grid grid-cols-3 gap-8"
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

      {/* 13 Maddelik Liste */}
      <section id="hizmetler" className="bg-[#0a1220] py-20 px-6 md:px-12 border-b border-navy/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Eğitim ve Protokoller</p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-white">Nöroergonomi Eğitim İçerikleri</h2>
          </div>
          <div className="flex flex-col gap-4">
            {neuroItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 5) * 0.1, duration: 0.4 }}
                className="flex items-center gap-6 bg-navy/40 border border-gold/20 p-5 rounded-lg hover:bg-navy/80 hover:border-gold/50 transition-colors group"
              >
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center border border-gold/30 rounded-full text-2xl bg-white/5 group-hover:bg-gold/10 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-white font-medium mb-1">{item.title}</h3>
                  <p className="text-white/60 text-sm font-sans leading-relaxed">{item.desc}</p>
                </div>
                <div className="hidden md:flex text-gold/40 group-hover:text-gold transition-colors">
                  →
                </div>
              </motion.div>
            ))}
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
          <div className="max-w-7xl mx-auto">
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
