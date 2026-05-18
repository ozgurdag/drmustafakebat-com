'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import BiyolojikAnalizor from './BiyolojikAnalizor'
import Link from 'next/link'
import ArticleGrid from './ArticleGrid'
import { ArticleMeta } from '@/lib/types'

const instruments = [
  {
    icon: '⚡',
    title: 'Hücresel Yaş ve Epigenetik Takip',
    desc: 'DNA metilasyon yaşınızı (Horvath Saati) analiz ederek hücresel yaşlanma hızınızı kronolojik yaşınızın gerisine çekiyoruz.',
  },
  {
    icon: '🔥',
    title: 'Mitokondriyal Biyogenez',
    desc: "Hücrelerimizin enerji jeneratörleri olan mitokondrileri özel egzersiz, takviye (NAD+, CoQ10) ve sirkadiyen protokolleriyle onarıyoruz.",
  },
  {
    icon: '🧠',
    title: 'Nöro-Protektif Yaşam Yönetimi',
    desc: 'Beyin sağlığı ve bilişsel rezervi korumak, hafıza gerilemesini engellemek için özelleştirilmiş beslenme ve nörotropik sirkadiyen tasarımı.',
  },
  {
    icon: '🌙',
    title: 'Sirkadiyen Ritim & Hormon Akışı',
    desc: 'Melatonin, kortizol gibi yaşamsal hormonların sirkadiyen salınım pencerelerini biyolojik saatinize uyumlandırarak derin uykuyu restore ediyoruz.',
  },
  {
    icon: '❤️',
    title: 'Kardiyometabolik Sağlık Yönetimi',
    desc: 'Zone 2 dayanıklılık egzersizleri ve glukoz takibi (CGM) odaklı beslenme planlarıyla damar yaşını gençleştiriyor, insülin direncini çözüyoruz.',
  },
  {
    icon: '🔄',
    title: 'Otofaji & Hücresel Temizlik',
    desc: 'Aralıklı oruç kombinasyonları ve senolitik moleküllerla yıpranmış yaşlı hücrelerin (senesen hücreler) elenip yeni hücre gelişimini tetikliyoruz.',
  },
]

const stats = [
  { value: '%-20', label: 'Biyolojik Yaş İndirme' },
  { value: '%250+', label: 'Mitokondriyal Hücre Gücü' },
  { value: '3000+', label: 'Kişiselleştirilmiş Reçete' },
]

const serviceCards = [
  {
    icon: '🔬',
    title: 'Biyolojik Yaş Analizi',
    desc: 'Telomer uzunluğu ve DNA metilasyon profillemesiyle gerçek hücresel yaşınızı ölçün. Kronolojik yaşınızla biyolojik yaşınız arasındaki farkı kapatmak için kişiselleştirilmiş müdahale protokolü.',
  },
  {
    icon: '⚡',
    title: 'Hormonal ve Metabolik Optimizasyon',
    desc: 'Testosteron, östrojen, kortizol ve büyüme hormonunu fizyolojik sınırlar içinde optimize edin. İnsülin duyarlılığı ve tiroid fonksiyonu dahil tam metabolik panel ile müdahale.',
  },
  {
    icon: '💊',
    title: 'Kişiselleştirilmiş Suplement Protokolü',
    desc: 'NMN, Resveratrol, Quercetin gibi kanıt destekli longevity moleküllerinden oluşan kişiye özel, doz-optimize suplement programı. Etkileşim analizi ve biyomarker takibiyle güvenli uygulama.',
  },
]

interface LongevityPageContentProps {
  recentArticles?: ArticleMeta[]
}

export default function LongevityPageContent({ recentArticles = [] }: LongevityPageContentProps) {
  const instrumentsRef = useRef(null)
  const statsRef = useRef(null)
  const isInstrumentsInView = useInView(instrumentsRef, { once: false, margin: '-80px' })
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
              ✦ Bilimsel Hücresel Gençleşme
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-serif font-normal leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
            >
              Zamanın Akışını<br />
              <em className="text-gold" style={{ fontStyle: 'italic' }}>Hücrelerinizde</em> Yönetin.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/60 font-sans text-[15px] leading-relaxed mb-8 max-w-lg"
            >
              Sadece yaşlanmayı geciktirmekle kalmıyor, biyolojik yaşınızı geri alıyoruz. Dr. Mustafa Kebat liderliğinde hücresel temizlik, mitokondriyal sirkadiyen optimizasyon ve genomik analizlerle yaşam kalitesini ve enerjinizi zirveye ulaştırın.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#analizor"
                className="inline-flex items-center gap-2 border border-gold text-gold px-6 py-3 text-[11px] tracking-[2px] uppercase font-sans font-bold hover:bg-gold hover:text-navy transition-colors"
              >
                Yaş Analizini Başlat →
              </a>
              <a
                href="#metodoloji"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-6 py-3 text-[11px] tracking-[2px] uppercase font-sans hover:border-white/50 hover:text-white transition-colors"
              >
                Metodolojimizi Keşfedin
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
              <span className="text-gold">✦</span> Dr. Kebat Longevity Protokolü
              <span className="ml-auto border border-gold/30 text-gold/70 text-[8px] px-2 py-0.5 tracking-wider">Aktif Seans</span>
            </p>
            <ul className="space-y-3.5">
              {[
                'Epigenetik Yaş Ölçümü (Horvath Saati Entegrasyonu)',
                'Hormon ve Uyku Derinleştirici Sirkadiyen Ritim Modülasyonu',
                'Hücre Temizliği (Otofaji) & Mitokondriyal Rezervasyon',
                'İleri Düzey Yaşlanma Karşıtı Polifenol & Adaptogen Protokolü',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] font-sans text-white/70">
                  <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-sans mb-1">Sirkadiyen Durumu</p>
              <p className="text-sm font-sans text-white/80">Hücresel Yenilenme Aktif</p>
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

      {/* 3 Hizmet Kartı */}
      <section className="bg-white py-20 px-6 md:px-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Temel Hizmetler</p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy">Longevity Protokol Bileşenleri</h2>
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
              <div className="font-serif text-2xl text-navy font-light mb-1">60→40</div>
              <div className="text-[10px] text-navy/50 uppercase tracking-widest font-sans">Enerji Düzeyi Artışı</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-navy font-light mb-1">%85</div>
              <div className="text-[10px] text-navy/50 uppercase tracking-widest font-sans">Genetik Risk Azaltımı</div>
            </div>
            <div>
              <div className="font-serif text-2xl text-navy font-light mb-1">3×</div>
              <div className="text-[10px] text-navy/50 uppercase tracking-widest font-sans">Zihinsel Berraklık</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bilimsel Enstrümanlar */}
      <section id="metodoloji" className="bg-cream py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Tıbbi Yaklaşım Metodu</p>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-navy mb-5">
              Bilimsel Longevity Enstrümanlarımız
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mb-5" />
            <p className="text-gray-500 font-sans text-[15px] leading-relaxed max-w-2xl mx-auto">
              Dr. Mustafa Kebat kliniğinde uygulanan tüm biyosüreçler insan ömrünün sadece uzun değil, tamamen enerjik ve hastalıksız geçirilmesini hedefler.
            </p>
          </div>

          <div ref={instrumentsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instruments.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInstrumentsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white border border-gray-100 p-8 hover:border-gold/40 transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 group-hover:border-gold/50 transition-colors mb-5 text-xl">
                  {item.icon}
                </div>
                <h3 className="font-serif text-[17px] text-navy mb-3 leading-snug">{item.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Biyolojik Analizör */}
      <section id="analizor" className="bg-navy py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Kişiselleştirilmiş Biyomarker Analizörü</p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4">
              Biyolojik Yaşınızı &amp; Hücre Sağlığınızı Analiz Edin
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mb-5" />
            <p className="text-white/50 font-sans text-sm leading-relaxed max-w-xl mx-auto">
              Mevcut alışkanlıklarınızı ve biyometrik durumlarınızı aşağıdaki forma girin. Dr. Mustafa Kebat protokollerine dayalı bir hücresel değerlendirme ve takviye kılavuzunu anında üretelim.
            </p>
          </div>
          <BiyolojikAnalizor />
        </div>
      </section>

      {/* CTA bölümü */}
      <section className="bg-white py-16 px-6 text-center border-t border-gray-100">
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Bir Sonraki Adım</p>
        <h2 className="font-serif text-3xl font-normal text-navy mb-5">Kişisel Danışmanlık İçin İletişime Geçin</h2>
        <p className="text-gray-500 font-sans text-sm mb-8 max-w-lg mx-auto">
          Analizör sonuçlarınızı Dr. Kebat ile birebir değerlendirin, size özel Longevity protokolü oluşturun.
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
                <h2 className="font-serif text-2xl font-normal text-navy">Longevity ile İlgili Makaleler</h2>
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
