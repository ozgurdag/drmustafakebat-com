import ContactForm from '@/components/ContactForm'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata = {
  title: 'İletişim | Dr. Mustafa Kebat',
  description: 'Dr. Mustafa Kebat ile iletişime geçin. Longevity, İSG ve NeuroPerformance konularında danışmanlık.',
}

export default function IletisimPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="bg-navy text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="[&_a]:text-white/60 [&_a:hover]:text-gold [&_.text-navy\/40]:text-white/40 [&_.text-navy\/50]:text-white/60 [&_.text-gold]:text-gold">
            <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'İletişim' }]} />
          </div>
          <p className="mt-2 text-xs font-sans text-gold uppercase tracking-widest mb-5">
            İletişim
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-5">İletişim</h1>
          <p className="text-white/70 font-sans text-lg max-w-xl leading-relaxed">
            Sorularınız, danışmanlık talepleriniz veya işbirliği önerileriniz için
            aşağıdaki formu kullanabilirsiniz.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Form — 3/5 */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Info card — 2/5 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
                <h2 className="font-serif text-2xl text-navy">İletişim Bilgileri</h2>

                <div className="space-y-6 font-sans text-sm text-navy/70">
                  <div className="flex gap-4">
                    <span className="text-2xl mt-0.5">📍</span>
                    <div>
                      <p className="font-semibold text-navy text-xs uppercase tracking-wider mb-1">Adres</p>
                      <p>Karşıyaka / İzmir</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-2xl mt-0.5">✉️</span>
                    <div>
                      <p className="font-semibold text-navy text-xs uppercase tracking-wider mb-1">E-posta</p>
                      <a
                        href="mailto:info@drmustafakebat.com"
                        className="text-gold hover:underline"
                      >
                        info@drmustafakebat.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-2xl mt-0.5">🕐</span>
                    <div>
                      <p className="font-semibold text-navy text-xs uppercase tracking-wider mb-1">Çalışma Saatleri</p>
                      <p>Pazartesi – Cuma<br />09:00 – 18:00</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy/10">
                    <p className="leading-relaxed text-navy/60 text-xs">
                      Mesajlarınıza genellikle 1–2 iş günü içinde yanıt veriyorum. Acil
                      durumlar için lütfen konu satırına &quot;ACİL&quot; yazınız.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
