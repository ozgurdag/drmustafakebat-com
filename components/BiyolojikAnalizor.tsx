'use client'

import { useState } from 'react'
import { ClipboardList, Loader2, Award } from 'lucide-react'

interface Answers {
  age: number
  sleepHours: number
  nutritionType: string
  stressLevel: number
  exerciseWeekly: number
  fastingFrequency: string
  primaryGoal: string
}

export default function BiyolojikAnalizor() {
  const [answers, setAnswers] = useState<Answers>({
    age: 40,
    sleepHours: 7,
    nutritionType: 'akdeniz',
    stressLevel: 5,
    exerciseWeekly: 3,
    fastingFrequency: 'ara_sira',
    primaryGoal: '',
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setReport(null)

    setTimeout(() => {
      const bioAge = Math.round(
        answers.age *
          (1 +
            (answers.stressLevel - 5) * 0.02 -
            (answers.sleepHours >= 7 ? 0.04 : 0) -
            (answers.exerciseWeekly >= 3 ? 0.05 : 0))
      )
      const diff = answers.age - bioAge
      const diffText = diff > 0 ? `${diff} yıl daha genç` : diff < 0 ? `${Math.abs(diff)} yıl daha yaşlı` : 'kronolojik yaşınızla eşit'

      setReport(`### Dr. Mustafa Kebat Longevity & Hücresel Sağlık Analizi

#### 1. Biyolojik Durum Değerlendirmesi
Kronolojik yaşınız **${answers.age}** iken, hücresel dinamiğinize göre tahmini biyolojik yaşınız **${bioAge}** olarak hesaplanmıştır — bu ${diffText} anlamına geliyor.

**Mitokondriyal Durum:** ${answers.exerciseWeekly >= 3 ? 'Düzenli egzersiziniz mitokondriyal gençliği aktif tutuyor. ATP sentezi optimize durumda.' : 'Hareketsiz süreler hücresel ATP üretimini sınırlıyor. Haftada 3 gün aerobik aktivite önerilen minimum düzeydir.'}

**Stres & Kortizol:** ${answers.stressLevel > 6 ? 'Yüksek stres seviyeniz kromatin yapısında telomer kısalmasını tetikliyor. Adaptojenik protokol başlatmanız önerilir.' : answers.stressLevel > 3 ? 'Hücresel stres toleransınız makul sınırlarda. Nefes egzersizleriyle daha da optimize edilebilir.' : 'Düşük stres skorunuz epigenetik yaşlanma hızını yavaşlatıyor. Koruyun.'}

**Uyku Kalitesi:** ${answers.sleepHours >= 8 ? 'Optimum sirkadiyen ritim. Growth hormone ve melatonin sekresyonu pik seviyede.' : answers.sleepHours >= 7 ? 'Yeterli uyku süresi. Uyku kalitesini artırmak için mavi ışık maruziyetini azaltın.' : 'Uyku borcu hücresel onarım süreçlerini sekteye uğratıyor. Öncelikli müdahale alanı.'}

#### 2. Dr. Kebat Sirkadiyen Tavsiye Reçetesi

1. **Otofaji Protokolü:** Hücre temizliği için haftada en az 2 gün 16 saatlik aralıklı oruç (16:8) uygulayın.
2. **Sirkadiyen Uyku:** Gece 23:00'ten önce uykuya geçerek melatonin hormonunun antioksidan gücünden faydalanın.
3. **Hücresel Beslenme:** ${answers.nutritionType === 'akdeniz' ? 'Mevcut Akdeniz beslenmenizi Resveratrol, CoQ10 ve NMN supplementleriyle güçlendirin.' : 'İşlenmiş gıdaları kademeli olarak Akdeniz tipi beslenmeyle değiştirin. Zeytinyağı, yağlı balık ve polifenol kaynakları öncelikli hedef.'}
4. **Hareket Protokolü:** ${answers.exerciseWeekly >= 4 ? 'Egzersiz rutininizi Zone 2 kardiyo + direnç antrenmanı kombinasyonuyla çeşitlendirin.' : 'Haftada minimum 150 dk orta yoğunluklu aerobik aktivite + 2 gün direnç antrenmanı başlatın.'}
5. **Stres Nöromodülasyonu:** Günlük 10 dakika diyafram nefesi + haftada 2 gün soğuk duş ile otonomik sinir sistemi dengesini optimize edin.

#### 3. Öncelikli Biyobelirteç Takibi
- hs-CRP (inflamasyon markörü) — hedef: <1 mg/L
- HbA1c (metabolik sağlık) — hedef: <5.4%
- Ferritin, D Vitamini, Omega-3 İndeksi
- Telomere uzunluğu (yıllık takip)

---
*Bu analiz Dr. Mustafa Kebat'ın Longevity protokollerine dayalı olup tıbbi teşhis niteliği taşımaz. Kişiselleştirilmiş konsültasyon için iletişime geçin.*`)
      setIsAnalyzing(false)
    }, 2200)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-[#1e2235] rounded-3xl border border-[rgba(201,168,76,0.2)] shadow-2xl text-gray-200">
      <div className="text-center mb-8">
        <span className="text-[10px] text-[#c9a84c] tracking-widest uppercase font-sans font-bold">
          Klinik Tarama Modülü
        </span>
        <h3 className="text-2xl font-serif text-white font-medium mt-1">
          Biyolojik Yaş &amp; Hücresel Sağlık Analizi
        </h3>
        <p className="text-xs text-gray-400 mt-2 font-sans">
          Biyolojik parametrelerinizi girerek kişisel Longevity profilinizi anında çıkarın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-sans font-semibold">
              Kronolojik Yaş
            </label>
            <input
              type="number"
              min={18} max={100}
              value={answers.age}
              onChange={e => setAnswers({ ...answers, age: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-[#090A0C] border border-[rgba(201,168,76,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a84c] font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-sans font-semibold">
              Günlük Ortalama Uyku
            </label>
            <select
              value={answers.sleepHours}
              onChange={e => setAnswers({ ...answers, sleepHours: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-[#090A0C] border border-[rgba(201,168,76,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a84c] font-sans"
            >
              <option value="5">5 saat veya altı (Riskli)</option>
              <option value="7">7 saat (Yeterli)</option>
              <option value="8">8 saat (Optimum Sirkadiyen)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-sans font-semibold">
              Beslenme Tipi
            </label>
            <select
              value={answers.nutritionType}
              onChange={e => setAnswers({ ...answers, nutritionType: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#090A0C] border border-[rgba(201,168,76,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a84c] font-sans"
            >
              <option value="akdeniz">Akdeniz Beslenmesi</option>
              <option value="standart">Standart Batı Tipi</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-sans font-semibold">
              Haftalık Egzersiz (gün)
            </label>
            <select
              value={answers.exerciseWeekly}
              onChange={e => setAnswers({ ...answers, exerciseWeekly: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-[#090A0C] border border-[rgba(201,168,76,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a84c] font-sans"
            >
              <option value="0">Hiç (Sedanter)</option>
              <option value="2">1-2 gün</option>
              <option value="3">3-4 gün (Önerilen)</option>
              <option value="5">5+ gün (Aktif)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-sans font-semibold">
            Stres Yoğunluğu — {answers.stressLevel}/10
          </label>
          <input
            type="range" min="1" max="10"
            value={answers.stressLevel}
            onChange={e => setAnswers({ ...answers, stressLevel: Number(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#c9a84c]"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-sans mt-1">
            <span>Düşük</span><span>Orta</span><span>Yüksek</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full py-4 bg-gradient-to-r from-[#c9a84c] to-[#8a6f2e] text-[#090A0C] font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all font-sans disabled:opacity-60"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sirtuin ve Teşhis Yolları Hesaplanıyor...</span>
            </>
          ) : (
            <>
              <ClipboardList className="w-4 h-4" />
              <span>Analiz Raporumu Hazırla</span>
            </>
          )}
        </button>
      </form>

      {report && (
        <div className="mt-8 border-t border-[rgba(201,168,76,0.15)] pt-6">
          <div className="flex items-center gap-2 text-[#c9a84c] mb-4">
            <Award className="w-5 h-5" />
            <h4 className="font-serif text-lg">Dr. Mustafa Kebat Kişisel Raporu</h4>
          </div>
          <div className="bg-[#090a0c] p-6 rounded-2xl border border-[rgba(201,168,76,0.1)] text-xs text-gray-300 leading-relaxed font-sans">
            {report.split('\n').map((line, i) => {
              if (line.startsWith('### ')) return <h3 key={i} className="text-base font-serif text-white mb-3 mt-0">{line.replace('### ', '')}</h3>
              if (line.startsWith('#### ')) return <h4 key={i} className="text-sm font-semibold text-[#c9a84c] mb-2 mt-4">{line.replace('#### ', '')}</h4>
              if (line.startsWith('---')) return <hr key={i} className="border-[rgba(201,168,76,0.15)] my-4" />
              if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) return <p key={i} className="text-gray-500 italic mt-3">{line.replace(/\*/g, '')}</p>
              if (/^\d+\./.test(line)) return <p key={i} className="ml-2 mb-1">{line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</p>
              if (line.startsWith('- ')) return <p key={i} className="ml-2 mb-1 text-gray-400">· {line.slice(2)}</p>
              if (line.trim() === '') return <div key={i} className="h-2" />
              return <p key={i} className="mb-2">{line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</p>
            })}
          </div>
        </div>
      )}
    </div>
  )
}
