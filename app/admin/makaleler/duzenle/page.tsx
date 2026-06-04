'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArticleCategory, ALL_CATEGORIES, CATEGORY_LABELS } from '@/lib/types'
import { getArticleFile, createOrUpdateFile, buildMdxContent, ArticleFileData } from '@/lib/github-api'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, ArrowLeft, Eye, Edit3, Image as ImageIcon } from 'lucide-react'

const ALT_BASLIK_OPTIONS: Record<ArticleCategory, string[]> = {
  longevity: ['Longevity', 'Bilişsel Longevity', 'İş Sağlığı ve Longevity', 'Longevity Biyobelirteçleri', 'Mesleki Longevity', 'Metabolik Longevity', 'Yönetici Longevity'],
  beslenme: ['Kan Tahlilleri & Biyokimya', 'Vitaminler & Mineraller', 'Beslenme & Diyet', 'Sindirim Sistemi', 'Diyabet & İnsülin Direnci', 'İlaçlar & Farmakoloji'],
  saglik: ['Kurumsal Sağlık', 'Kurumsal Sağlık Mimarisi', 'Çalışan Sağlığı ve Verimliliği Programları', 'Yönetici Sağlık Programları', 'Endüstriyel Sağlık Risk Yönetimi', 'Psikolojik Sağlık programları', 'Yorgunluk Riski Yönetimi', 'Yüksek Güvenilirlik İşgücü Programları', 'Ergonomik Sağlık Sistemleri'],
  neuroperformance: ['Nöroergonomi', 'Biyofilik Tasarım ve Çevresel Nöroergonomi', 'İnterosepsiyon ile Duygu Regülasyonu', 'Zihinsel Yorgunluk', 'İnsan Hatası Mühendisliği', 'Nörobilişsel Güvenlik', 'Vardiyalı Çalışma Nörobilimi', 'Propriosepsiyon ve İş Güvenliği', 'Endüstriyel Nöroergonomi', 'Nöroadaptif Çalışma Sistemleri'],
}

type PublishMode = 'publish' | 'draft' | 'scheduled'

function getPublishMode(status: 'published' | 'draft', date: string): PublishMode {
  if (status === 'draft') return 'draft'
  if (date && new Date(date) > new Date()) return 'scheduled'
  return 'publish'
}

function EditArticleInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') ?? ''
  const category = (searchParams.get('category') as ArticleCategory) ?? ALL_CATEGORIES[0]

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [publishMode, setPublishMode] = useState<PublishMode>('publish')
  const [sha, setSha] = useState('')
  const [originalCategory, setOriginalCategory] = useState<ArticleCategory>(category)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    category: category,
    altBaslik1: '',
    altBaslik2: '',
    date: '',
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

  useEffect(() => {
    if (!slug) return

    getArticleFile(category, slug)
      .then((data) => {
        if (!data) { alert('Makale bulunamadı!'); router.push('/admin/makaleler'); return }
        const { sha: fileSha, slug: _slug, ...rest } = data
        setSha(fileSha)
        setOriginalCategory(data.category)
        setFormData(rest)
        setPublishMode(getPublishMode(data.status, data.date))
      })
      .catch((e) => { alert('Yüklenemedi: ' + e.message); router.push('/admin/makaleler') })
      .finally(() => setLoading(false))
  }, [slug, category, router])

  const handlePublishModeChange = (mode: PublishMode) => {
    setPublishMode(mode)
    if (mode === 'publish') {
      setFormData(f => ({ ...f, status: 'published', date: f.date || new Date().toISOString().split('T')[0] }))
    } else if (mode === 'draft') {
      setFormData(f => ({ ...f, status: 'draft' }))
    } else {
      setFormData(f => ({ ...f, status: 'published' }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const mdx = buildMdxContent(formData)
      const newPath = `content/articles/${formData.category}/${slug}.mdx`
      const oldPath = `content/articles/${originalCategory}/${slug}.mdx`

      if (formData.category !== originalCategory) {
        const { deleteFile } = await import('@/lib/github-api')
        await createOrUpdateFile(newPath, mdx, undefined, `chore: move ${slug} to ${formData.category}`)
        await deleteFile(oldPath, sha, `chore: remove ${slug} from ${originalCategory}`)
      } else {
        await createOrUpdateFile(oldPath, mdx, sha, `chore: update ${slug}`)
      }
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
    setFormData(f => ({ ...f, content: v.slice(0, s) + before + v.slice(s, e) + after + v.slice(e) }))
  }

  if (loading) return <div className="p-10 text-center font-sans text-gray-400">Yükleniyor...</div>

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
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="Makale Başlığı"
              value={formData.title}
              onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
              className="w-full text-3xl font-serif text-navy placeholder:text-gray-100 border-none outline-none mb-2"
            />
            <p className="text-[10px] text-gray-300 font-sans mb-6 font-mono">{slug}.mdx</p>

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
              placeholder="İçerik..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish Mode */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="font-serif text-navy border-b border-gray-50 pb-3 text-base">Yayın Durumu</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" checked={publishMode === 'publish'} onChange={() => handlePublishModeChange('publish')} className="accent-emerald-500 w-4 h-4" />
              <div>
                <span className="font-sans text-sm font-bold text-navy">🟢 Yayında</span>
                <p className="text-[10px] text-gray-400 font-sans">Sitede görünür</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="mode" checked={publishMode === 'draft'} onChange={() => handlePublishModeChange('draft')} className="accent-yellow-500 w-4 h-4" />
              <div>
                <span className="font-sans text-sm font-bold text-navy">🟡 Taslak</span>
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
                onChange={(e) => setFormData(f => ({ ...f, category: e.target.value as ArticleCategory, altBaslik1: '' }))}
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
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2">Tarih</label>
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

      {/* Preview */}
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

export default function EditArticlePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-sans text-gray-400">Yükleniyor...</div>}>
      <EditArticleInner />
    </Suspense>
  )
}
