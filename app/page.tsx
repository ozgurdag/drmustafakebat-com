import Hero from '@/components/Hero'
import CredentialBar from '@/components/CredentialBar'
import ServiceBlock from '@/components/ServiceBlock'
import DoctorSection from '@/components/DoctorSection'
import ArticleGrid from '@/components/ArticleGrid'
import BiyolojikAnalizor from '@/components/BiyolojikAnalizor'
import { getRecentArticles } from '@/lib/articles'

export default function Home() {
  const recentArticles = getRecentArticles(6)

  return (
    <>
      <Hero />
      <CredentialBar />

      {/* About strip */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <p className="text-gold text-[10px] tracking-[3px] uppercase font-sans mb-3">Yaklaşım</p>
        <h2 className="font-serif text-4xl md:text-5xl font-normal text-navy mb-5 leading-tight">
          Bireyden kuruma.<br />Biyolojiden sisteme.
        </h2>
        <p className="text-gray-500 text-[15px] leading-relaxed font-sans max-w-2xl">
          Dr. Mustafa Kebat, bireysel sağlık yönetiminden kurumsal iş güvenliği sistemlerine uzanan
          bütünleşik bir uzmanlık anlayışı geliştirmiştir. 1.000&apos;den fazla makale ve yıllarca
          süren klinik ve saha deneyimiyle; yaşlanma yönetimi, zihinsel performans ve iş güvenliği
          sistemleri konularında danışmanlık ve eğitim hizmetleri sunmaktadır.
        </p>
      </div>

      <ServiceBlock
        number="01"
        eyebrow="Uzmanlık Alanı 01"
        title="Longevity"
        description="Bireysel sağlık ve yaşlanma yönetimi. Biyolojik yaş optimizasyonu, metabolik sağlık ve yaşam kalitesi için kanıta dayalı protokoller."
        items={[
          'Biyolojik Yaş Değerlendirmesi',
          'Beslenme ve Takviye Stratejileri',
          'Kardiyovasküler Sağlık Optimizasyonu',
          'Bağışıklık Sistemi Güçlendirme',
          'Hormonal Denge ve Yaşlanma',
        ]}
        href="/longevity"
        gradientClass="bg-gradient-to-br from-[#1a3a28] via-[#2d5a3d] to-[#4a7c59]"
        icon="🌿"
        photo="/photo-longevity.jpg"
      />

      <ServiceBlock
        number="02"
        eyebrow="Uzmanlık Alanı 02"
        title="Systems"
        description="Kurumsal sağlık sistemleri kurulumu. İSG mevzuatı uyumundan risk yönetimine, eğitim tasarımından sertifikasyona kadar tam kapsamlı danışmanlık."
        items={[
          'İSG Risk Analizi ve Değerlendirmesi',
          'Yangın ve Deprem Acil Durum Planları',
          'Çalışan Sağlığı İzleme Sistemleri',
          'İSG Eğitim Programı Tasarımı',
          'Mevzuat Uyumluluk Denetimleri',
        ]}
        href="/systems"
        reversed
        gradientClass="bg-gradient-to-br from-[#0d1f3a] via-[#1a3a6a] to-[#2d5a8a]"
        icon="⚙️"
        photo="/photo-systems.jpg"
      />

      <ServiceBlock
        number="03"
        eyebrow="Uzmanlık Alanı 03"
        title="NeuroPerformance"
        description="Zihin ve hareket optimizasyon eğitimleri. Nöroergonomi, bilişsel performans ve stres yönetimi üzerine kurumsal ve bireysel eğitim programları."
        items={[
          'Nöroergonomi ve İş Tasarımı',
          'Bilişsel Yük ve Karar Verme',
          'Stres Yönetimi Eğitimleri',
          'Hareket ve Postür Analizi',
          'Zihinsel Dayanıklılık Programları',
        ]}
        href="/neuroperformance"
        gradientClass="bg-gradient-to-br from-[#1a1030] via-[#2d1a50] to-[#4a2d7a]"
        icon="🧠"
        photo="/photo-neuro.jpg"
      />

      {/* Biyolojik Yaş Analizörü */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #0d1117 0%, #090A0C 100%)' }}>
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-[10px] text-[#C5A880] tracking-[3px] uppercase font-sans mb-3">Longevity Modülü</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white mb-4">
            Biyolojik Yaşınızı Keşfedin
          </h2>
          <p className="text-gray-400 text-sm font-sans leading-relaxed">
            Hücresel parametrelerinizi girin, Dr. Kebat&apos;ın bilimsel protokollerine dayalı kişisel Longevity raporunuzu alın.
          </p>
        </div>
        <BiyolojikAnalizor />
      </section>

      <DoctorSection />

      {recentArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
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
