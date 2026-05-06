import Breadcrumb from '@/components/Breadcrumb'

export const metadata = {
  title: 'Hakkımda | Dr. Mustafa Kebat',
  description:
    'Dr. Mustafa Kebat hakkında bilgi: tıp eğitimi, İSG uzmanlığı ve araştırmacı kimliği.',
}

const credentials = [
  {
    icon: '🎓',
    title: 'Tıp Fakültesi',
    description:
      'İstanbul Üniversitesi Tıp Fakültesi mezunu. Temel tıp bilimleri ve klinik uygulamalarda kapsamlı eğitim.',
  },
  {
    icon: '🛡️',
    title: 'A Sınıfı İSG Uzmanlığı',
    description:
      'Çalışma ve Sosyal Güvenlik Bakanlığı onaylı A Sınıfı İş Sağlığı ve Güvenliği Uzmanı. Kurumsal sağlık sistemleri kurulumu.',
  },
  {
    icon: '✍️',
    title: 'Araştırmacı & Yazar',
    description:
      '1.000\'den fazla makale ile longevity, iş sağlığı ve nöroergonomi alanlarında aktif araştırmacı ve köşe yazarı.',
  },
]

export default function HakkimdaPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="bg-navy text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="[&_a]:text-white/60 [&_a:hover]:text-gold [&_.text-navy\/40]:text-white/40 [&_.text-navy\/50]:text-white/60 [&_.text-gold]:text-gold">
            <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Hakkımda' }]} />
          </div>
          <p className="mt-2 text-xs font-sans text-gold uppercase tracking-widest mb-6">
            Hekim · İSG Uzmanı · Araştırmacı
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">Dr. Mustafa Kebat</h1>
          <p className="text-white/70 font-sans text-lg max-w-2xl leading-relaxed">
            İnsan sağlığını bütüncül bir perspektifle ele alarak longevity, kurumsal iş güvenliği
            ve nöroergonomi alanlarında bilimsel içerik üretiyorum.
          </p>
        </div>
      </section>

      {/* Bio section */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Photo placeholder */}
            <div className="aspect-square bg-navy/10 rounded-2xl flex items-center justify-center text-6xl">
              👨‍⚕️
            </div>
            {/* Biography */}
            <div className="font-sans text-navy/80 leading-relaxed space-y-5">
              <h2 className="font-serif text-3xl text-navy mb-6">Biyografi</h2>
              <p>
                Dr. Mustafa Kebat, tıp eğitiminin ardından iş sağlığı ve güvenliği alanına yöneldi.
                15 yılı aşkın mesleki deneyimi boyunca hem bireysel hem de kurumsal düzeyde sağlık
                yönetimine katkı sağladı.
              </p>
              <p>
                A Sınıfı İSG Uzmanı olarak pek çok büyük ölçekli firmada iş güvenliği sistemleri
                kurdu, risk değerlendirme süreçlerini yönetti ve çalışan sağlığını artırmaya yönelik
                programlar tasarladı.
              </p>
              <p>
                Longevity tıbbı alanında bireylerin biyolojik yaşlanma süreçlerini yönetebilmelerine
                rehberlik etmekte; NeuroPerformance çerçevesinde zihin-beden bütünleşmesini temel
                alan eğitimler geliştirmektedir.
              </p>
              <p>
                Tetkik.blog üzerinden 1.000'den fazla makale yayımlamış olan Dr. Kebat, bilimsel
                araştırmaları hekimden hastaya, yöneticiden çalışana anlaşılır biçimde aktarmayı
                öncelikli görev sayar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-3xl md:text-4xl text-navy text-center mb-12">
            Uzmanlık Alanları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((cred) => (
              <div
                key={cred.title}
                className="bg-cream rounded-2xl p-8 border border-navy/10 flex flex-col gap-4"
              >
                <span className="text-4xl">{cred.icon}</span>
                <h3 className="font-serif text-xl text-navy">{cred.title}</h3>
                <p className="font-sans text-sm text-navy/70 leading-relaxed">
                  {cred.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-around gap-10 text-center text-white">
            <div>
              <p className="font-serif text-5xl text-gold">1.000+</p>
              <p className="font-sans text-sm uppercase tracking-widest text-white/60 mt-2">
                Makale
              </p>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/20" />
            <div>
              <p className="font-serif text-5xl text-gold">15+</p>
              <p className="font-sans text-sm uppercase tracking-widest text-white/60 mt-2">
                Yıl Deneyim
              </p>
            </div>
            <div className="hidden md:block h-12 w-px bg-white/20" />
            <div>
              <p className="font-serif text-5xl text-gold">A Sınıfı</p>
              <p className="font-sans text-sm uppercase tracking-widest text-white/60 mt-2">
                İSG Uzmanı
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
