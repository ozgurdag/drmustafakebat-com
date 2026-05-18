import Breadcrumb from '@/components/Breadcrumb'
import HakkimdaStats from '@/components/HakkimdaStats'

export const metadata = {
  title: 'Hakkımda | Dr. Mustafa Kebat',
  description: 'Dr. Mustafa Kebat hakkında bilgi: tıp eğitimi, longevity danışmanlığı ve araştırmacı kimliği.',
}

const credentials = [
  {
    icon: '🎓',
    title: 'Tıp Fakültesi',
    description:
      'İstanbul Üniversitesi Tıp Fakültesi mezunu. Temel tıp bilimleri ve klinik uygulamalarda kapsamlı eğitim.',
  },
  {
    icon: '🏥',
    title: 'İş Yeri Hekimliği',
    description:
      'Çalışma ve Sosyal Güvenlik Bakanlığı onaylı İş Yeri Hekimi. 30+ yıllık kurumsal ve bireysel sağlık yönetimi deneyimi.',
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
            Hekim – Kişisel ve Kurumsal Longevity Danışmanı – Araştırmacı
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">Dr. Mustafa Kebat</h1>
          <p className="text-white/70 font-sans text-lg max-w-2xl leading-relaxed">
            İnsan sağlığını bütüncül bir perspektifle ele alarak longevity, kurumsal iş sağlığı
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
              <p>Merhaba, ben Dr. Mustafa Kebat.</p>
              <p>
                1994 yılında tıp diplomamı alsam da halen devam eden tıbbi eğitimimde;
                kaç yıl yaşadığınızdan çok, nasıl yaşadığınızla ne kadar sağlıklı ve
                mutlu olduğunuzla ilgileniyorum.
              </p>
              <p>
                Zamanımı ve enerjimi özellikle insan – çalışan odaklı üç ana başlıkta
                harcıyorum: Longevity, Kurumsal İş Sağlığı ve Nöroergonomi.
              </p>
              <p>
                Longevity yaklaşımım; yaşam – çalışma koşullarınız özelinde biyolojik
                yaşınızın yönetimini, metabolik sağlığınızı, inflamasyonunuzun kontrolünü
                ve sağlıklı yaş alma sürecinizi size – kişiye özel planlıyorum. Bir diğer
                bakış açısı ile uzun yaşamanın bedelini hafifletmenizi – ya da uzun yaşam
                arzunuzun sağlıklı gerçekleşmesini sağlıyorum. Lakin pek tabi ki ömrünüze
                ömür katamıyorum.
              </p>
              <p>
                Kurumsal iş sağlığı tarafında ise firmanın bakış açısını ve yapılanmasını
                mevzuata uygunluktan sürdürülebilir longevity hedefli sağlık kültürüne
                dönüşümü için sistem kurulumlarını yapıyor eğitimlerini veriyorum.
              </p>
              <p>
                Nöroergonomi, en keyif aldığım bölüm. Beynin çalışma ortamıyla ilişkisi,
                dikkat performansı, bilişsel yük, stres ve karar süreçleri yönetimi,
                dikkatin tünelleşmesi gibi o kadar çok konusu olan nöroergonomi bitmesini
                istemediğiniz tatil gibi zevkli.
              </p>
              <p>
                Firmalarımla da bireysel danışanlarımla da çalışırken bilimsel yolu
                önemsiyorum lakin öncelikle insan tarafını kazanarak…
              </p>
              <p className="font-serif text-lg text-navy italic mt-4">
                Değerli dostlar,<br />
                Hastalıklarla değil, yaşamın kendisiyle ilgileniyorum.<br />
                Tempolu karmaşayı değil, sürdürülebilir sadeliği seviyorum.<br />
                Daha sağlıklı, daha üretken, daha dengeli ve mümkün olan en uzun yaşam için…<br />
                Bilimin rehberliğinde eğitimime devam ediyorum.
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

      {/* Animated Stats bar */}
      <HakkimdaStats />
    </div>
  )
}
