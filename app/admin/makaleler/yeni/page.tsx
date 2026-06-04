'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleCategory, ALL_CATEGORIES, CATEGORY_LABELS } from '@/lib/types'
import { createOrUpdateFile, buildMdxContent } from '@/lib/github-api'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, ArrowLeft, Eye, Edit3, Image as ImageIcon } from 'lucide-react'

const ALT_BASLIK_OPTIONS: Record<ArticleCategory, string[]> = {
  longevity: ['Longevity', 'Bilişsel Longevity', 'İş Sağlığı ve Longevity', 'Longevity Biyobelirteçleri', 'Mesleki Longevity', 'Metabolik Longevity', 'Yönetici Longevity'],
  beslenme: ['Kan Tahlilleri & Biyokimya', 'Vitaminler & Mineraller', 'Beslenme & Diyet', 'Sindirim Sistemi', 'Diyabet & İnsülin Direnci', 'İlaçlar & Farmakoloji'],
  saglik: ['Kurumsal Sağlık', 'Kurumsal Sağlık Mimarisi', 'Çalışan Sağlığı ve Verimliliği Programları', 'Yönetici Sağlık Programları', 'Endüstriyel Sağlık Risk Yönetimi', 'Psikolojik Sağlık programları', 'Yorgunluk Riski Yönetimi', 'Yüksek Güvenilirlik İşgücü Programları', 'Ergonomik Sağlık Sistemleri'],
  neuroperformance: ['Nöroergonomi', 'Biyofilik Tasarım ve Çevresel Nöroergonomi', 'İnterosepsiyon ile Duygu Regülasyonu', 'Zihinsel Yorgunluk', 'İnsan Hatası Mühendisliği', 'Nörobilişsel Güvenlik', 'Vardiyalı Çalışma Nörobilimi', 'Propriosepsiyon ve İş Güvenliği', 'Endüstriyel Nöroergonomi', 'Nöroadaptif Çalışma Sistemleri'],
}

type PublishMode = 'publish' | 'draft' | 'scheduled'

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function NewArticlePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [publishMode, setPublishMode] = useState<PublishMode>('publish')
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'longevity' as ArticleCategory,
    altBaslik1: '',
    altBaslik2: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    image: '',
    content: '',
    status: 'published' as 'published' | 'draft',
  })

  const triggerImageUpload = () => {
    document.getElementById('image-upload-input')?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Resim boyutu en fazla 5MB olabilir!')
      return
    }

    setUploading(true)
    const data = new FormData()
    data.append('image', file)

    try {
      const res = await fetch('/api/upload.php', {
        method: 'POST',
        body: data,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Yükleme hatası: ${res.status}`)
      }
      const result = await res.json()
      setFormData(f => ({ ...f, image: result.url }))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Resim yüklenemedi!')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: slugify(title) })
  }

  const handleCategoryChange = (cat: ArticleCategory) => {
    setFormData({ ...formData, category: cat, altBaslik1: '' })
  }

  const handlePublishModeChange = (mode: PublishMode) => {
    setPublishMode(mode)
    if (mode === 'publish') {
      setFormData(f => ({ ...f, status: 'published', date: new Date().toISOString().split('T')[0] }))
    } else if (mode === 'draft') {
      setFormData(f => ({ ...f, status: 'draft' }))
    } else {
      setFormData(f => ({ ...f, status: 'published' }))
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      alert('Başlık zorunludur!')
      return
    }
    setSaving(true)
    try {
      const mdx = buildMdxContent(formData)
      const path = `content/articles/${formData.category}/${formData.slug}.mdx`
      await createOrUpdateFile(path, mdx, undefined, `feat: add ${formData.slug}`)
      router.push('/admin/makaleler')
    } catch (e) {
      alert('Hata: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setSaving(false)
    }
  }

  const insertText = (before: string, after = '') => {
    const ta = document.getElementById('editor-textarea') as HTMLTextAreaElement
    if (!ta) return
    const { selectionStart: s, selectionEnd: e, value: v } = ta
    const newContent = v.slice(0, s) + before + v.slice(s, e) + after + v.slice(e)
    setFormData(f => ({ ...f, content: newContent }))
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-navy transition-colors font-sans text-sm">
          <ArrowLeft size={16} /> Geri
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all font-sans text-sm font-bold"
          >
            {preview ? <><Edit3 size={16} /> Düzenle</> : <><Eye size={16} /> Önizleme</>}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-navy text-white hover:bg-gold hover:text-navy transition-all font-sans text-sm font-bold shadow-sm disabled:opacity-60"
          >
            <Save size={16} /> {saving ? 'Kaydediliyor...' : 'KAYDET'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="Makale Başlığı"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-3xl font-serif text-navy placeholder:text-gray-100 border-none outline-none mb-2"
            />
            <p className="text-[10px] text-gray-300 font-sans mb-6 font-mono">
              {formData.slug || '...'}.mdx
            </p>

            <div className="flex gap-2 mb-4 p-2 bg-gray-50 rounded-xl text-sm font-sans">
              <button onClick={() => insertText('**', '**')} className="px-3 py-1.5 hover:bg-white rounded-lg transition-all font-bold">B</button>
              <button onClick={() => insertText('_', '_')} className="px-3 py-1.5 hover:bg-white rounded-lg transition-all italic">I</button>
              <button onClick={() => insertText('### ')} className="px-3 py-1.5 hover:bg-white rounded-lg transition-all">H3</button>
              <button onClick={() => insertText('## ')} className="px-3 py-1.5 hover:bg-white rounded-lg transition-all">H2</button>
              <button onClick={() => insertText('- ')} className="px-3 py-1.5 hover:bg-white rounded-lg transition-all">— Liste</button>
              <button onClick={() => insertText('[', '](url)')} className="px-3 py-1.5 hover:bg-white rounded-lg transition-all">Link</button>
            </div>

            <textarea
              id="editor-textarea"
              value={formData.content}
              onChange={(e) => setFormData(f => ({ ...f, content: e.target.value }))}
              className="w-full min-h-[560px] font-sans text-base text-gray-700 leading-relaxed outline-none border-none resize-none"
              placeholder="İçeriği buraya yazın..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish Mode */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="font-serif text-navy border-b border-gray-50 pb-3 text-base">Yayın Durumu</h4>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="mode" checked={publishMode === 'publish'} onChange={() => handlePublishModeChange('publish')} className="accent-emerald-500 w-4 h-4" />
              <div>
                <span className="font-sans text-sm font-bold text-navy">🟢 Hemen Yayınla</span>
                <p className="text-[10px] text-gray-400 font-sans">Bugünkü tarihle yayına girer</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" checked={publishMode === 'draft'} onChange={() => handlePublishModeChange('draft')} className="accent-yellow-500 w-4 h-4" />
              <div>
                <span className="font-sans text-sm font-bold text-navy">🟡 Taslak Kaydet</span>
                <p className="text-[10px] text-gray-400 font-sans">Sitede görünmez</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" checked={publishMode === 'scheduled'} onChange={() => handlePublishModeChange('scheduled')} className="accent-blue-500 w-4 h-4" />
              <div>
                <span className="font-sans text-sm font-bold text-navy">🕐 Zamanlanmış</span>
                <p className="text-[10px] text-gray-400 font-sans">İleri tarihte yayına girer</p>
              </div>
            </label>
          </div>

          {/* Metadata */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
            <h4 className="font-serif text-navy border-b border-gray-50 pb-3 text-base">Makale Künyesi</h4>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value as ArticleCategory)}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:ring-1 focus:ring-gold/30"
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">Alt Başlık</label>
              <select
                value={formData.altBaslik1}
                onChange={(e) => setFormData(f => ({ ...f, altBaslik1: e.target.value }))}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:ring-1 focus:ring-gold/30"
              >
                <option value="">— Seçin —</option>
                {ALT_BASLIK_OPTIONS[formData.category].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                {publishMode === 'scheduled' ? 'Yayın Tarihi' : 'Tarih'}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:ring-1 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">Özet</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(f => ({ ...f, excerpt: e.target.value }))}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:ring-1 focus:ring-gold/30 h-24 resize-none"
                placeholder="Kısa açıklama..."
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">Kapak Görseli URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData(f => ({ ...f, image: e.target.value }))}
                  placeholder="/images/uploads/..."
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:ring-1 focus:ring-gold/30"
                />
                <input
                  type="file"
                  id="image-upload-input"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={triggerImageUpload}
                  disabled={uploading}
                  className="bg-gray-100 p-2.5 rounded-xl hover:bg-gold/20 transition-colors disabled:opacity-50"
                  title="Görsel Yükle"
                >
                  <ImageIcon size={16} className={uploading ? 'animate-pulse text-gold' : ''} />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-sans mt-1">
                Önerilen: 16:9 oranında (örn. 1200x675 px), maksimum 2MB, WebP veya JPEG formatında.
              </p>
              {formData.image && (
                <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img
                    src={formData.image}
                    alt="Kapak Görseli Önizleme"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview overlay */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto py-20 px-6">
              <button
                onClick={() => setPreview(false)}
                className="fixed top-8 right-8 bg-navy text-white px-5 py-3 rounded-xl shadow-2xl hover:bg-gold hover:text-navy transition-all font-sans text-sm font-bold"
              >
                KAPAT
              </button>
              <p className="text-gold uppercase tracking-widest text-[10px] mb-4">Önizleme</p>
              <h1 className="text-5xl font-serif text-navy mb-10 leading-tight">{formData.title}</h1>
              <div className="prose prose-lg max-w-none font-serif text-gray-700">
                {formData.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
