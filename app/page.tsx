import Hero from '@/components/Hero'
import CredentialBar from '@/components/CredentialBar'
import ServiceBlock from '@/components/ServiceBlock'
import DoctorSection from '@/components/DoctorSection'
import NewsletterForm from '@/components/NewsletterForm'
import ArticleGrid from '@/components/ArticleGrid'
import { getRecentArticles } from '@/lib/articles'

export default function Home() {
  const recentArticles = getRecentArticles(6)

  return (
    <>
      <Hero />
      <CredentialBar />

      {/* About strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Yaklaşım</p>
        <h2 className="font-serif text-4xl md:text-5xl font-normal text-navy mb-5 leading-tight">
          Bireyden kuruma.<br />Biyolojiden sisteme.
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed font-sans max-w-2xl">
          Dr. Mustafa Kebat, 30 yılı aşan saha deneyimi ile Longevity, Nöroergonomi, Kurumsal Sağlık Risk Yönetimi ve İnsan/Çalışan Performansı alanlarında hizmet veren, iş sağlığı sistemlerini geleceğin bilimsel yaklaşımıyla yeniden yorumlayan hekim ve kurumsal danışmandır.
        </p>
      </div>

      <ServiceBlock
        number="01"
        eyebrow="ODAK Alanı 01"
        title="Longevity: Bireysel Sağlık ve Yaşlanma Yönetimi"
        description="Zihinsel ve metabolik kapasiteyi mümkün olan en uzun süre koruyarak sağlıklı yaşam yıllarını artırmayı hedefleyen bilimsel bir yaklaşımdır. Dr. Mustafa Kebat, bireyin biyolojik özelliklerini, yaşam tarzını, çalışma koşullarını ve nörofizyolojik performansını birlikte değerlendirerek kanıta dayalı kişiselleştirilmiş stratejiler geliştirmektedir."
        items={[
          'Biyolojik Yaş ve Sağlık Rezervi Değerlendirmesi',
          'Metabolik Sağlık ve Hastalık Risk Yönetimi',
          'Bilişsel Performans ve Beyin Sağlığının Korunması',
          'Beslenme, Mikronütrisyon ve Bilimsel Takviye Stratejileri',
          'Kardiyovasküler Dayanıklılık ve Sağlıklı Yaşlanma Planlaması',
          'Uyku, Stres Yönetimi ve Otonom Sinir Sistemi Optimizasyonu',
          'Kas-İskelet Sistemi, Hareket Kalitesi ve Fonksiyonel Kapasite Yönetimi',
          'Bağışıklık Sisteminin Desteklenmesi ve İnflamasyon Kontrolü',
          'Hormonal Dengenin Yaşlanma Süreciyle Birlikte Değerlendirilmesi'
        ]}
        href="/longevity"
        ctaLabel="Longevity (Yaşlanma Yönetimi)"
        gradientClass="bg-gradient-to-br from-[#1a3a28] via-[#2d5a3d] to-[#4a7c59]"
        icon="🌿"
        photo="/photo-longevity.jpg"
      />

      <ServiceBlock
        number="02"
        eyebrow="ODAK Alanı 02"
        title="Corporate Bio-Integrity"
        description="Kurumsal risk ve sağlık yönetimi. KVS erken uyarı sistemlerinden biometric veri auditine, çalışan biyogüvenliğinden wellness danışmanlığına tam kapsamlı hizmet."
        items={[
          'Kardiyovasküler Erken Uyarı Sistemi',
          'Biometric Data Audit & Raporlama',
          'Çalışan Sağlığı İzleme Sistemleri',
          'Institutional Wellness Consulting',
          'Mevzuat Uyumluluk Denetimleri',
        ]}
        href="/systems"
        ctaLabel="Corporate Bio-Integrity"
        reversed
        gradientClass="bg-gradient-to-br from-[#0d1f3a] via-[#1a3a6a] to-[#2d5a8a]"
        icon="⚙️"
        photo="/photo-systems.jpg"
      />

      <ServiceBlock
        number="03"
        eyebrow="ODAK Alanı 03"
        title="NeuroPerformance: Zihin ve Hareket Optimizasyonu"
        description="Nöro-görsel antrenman, propriyoseptif gelişim ve bilişsel yük yönetimi. Sporcu, yönetici ve yaşlı bireyler için sinir sistemi optimizasyon protokolleri."
        items={[
          'Nöroergonomi ve İş Tasarımı',
          'Bilişsel Yük ve Karar Verme',
          'Stres Yönetimi Eğitimleri',
          'Hareket ve Postür Analizi',
          'Zihinsel Dayanıklılık Programları',
        ]}
        href="/neuroperformance"
        ctaLabel="NeuroPerformance"
        gradientClass="bg-gradient-to-br from-[#1a1030] via-[#2d1a50] to-[#4a2d7a]"
        icon="🧠"
        photo="/photo-neuro.jpg"
      />

      <DoctorSection />
      <NewsletterForm />

      {recentArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="flex justify-between items-baseline mb-10 border-b border-gray-200 pb-4">
            <div>
              <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-1">Son Yayınlar</p>
              <h2 className="font-serif text-3xl font-normal text-navy">Düşünceler ve Makaleler</h2>
            </div>
            <a href="/makaleler" className="text-[11px] tracking-[1px] uppercase font-sans text-gold hover:underline">
              Tümü →
            </a>
          </div>
          <ArticleGrid articles={recentArticles} />
        </section>
      )}
    </>
  )
}
