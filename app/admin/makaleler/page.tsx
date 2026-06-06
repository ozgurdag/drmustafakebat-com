'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getArticlesMeta, deleteFile, AllArticlesMeta } from '@/lib/github-api'
import { ArticleCategory, ALL_CATEGORIES, CATEGORY_SHORT } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'

function statusBadge(article: AllArticlesMeta) {
  if (article.status === 'draft') {
    return <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-md">🟡 Taslak</span>
  }
  if (article.date && new Date(article.date) > new Date()) {
    return <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">🕐 Zamanlanmış</span>
  }
  return <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">🟢 Yayında</span>
}

function AdminArticlesInner() {
  const searchParams = useSearchParams()
  const initialCat = (searchParams.get('category') as ArticleCategory) || ALL_CATEGORIES[0]

  const [selectedCat, setSelectedCat] = useState<ArticleCategory>(initialCat)
  const [articles, setArticles] = useState<AllArticlesMeta[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AllArticlesMeta | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setArticles([])
    getArticlesMeta(selectedCat)
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedCat])

  useEffect(() => {
    if (loading || filtered.length === 0) return
    const highlight = searchParams.get('highlight')
    if (highlight) {
      setTimeout(() => {
        const el = document.getElementById(`row-${highlight}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.add('bg-gold/15', 'transition-all', 'duration-1000')
          setTimeout(() => {
            el.classList.remove('bg-gold/15')
          }, 2500)
        }
      }, 200)
    }
  }, [loading, filtered, searchParams])

  const filtered = useMemo(() => {
    if (!search.trim()) return articles
    const q = search.toLowerCase()
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q) ||
      a.altBaslik1.toLowerCase().includes(q)
    )
  }, [articles, search])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteFile(
        `content/articles/${deleteTarget.category}/${deleteTarget.slug}.mdx`,
        deleteTarget.sha,
        `chore: delete ${deleteTarget.slug}`
      )
      setArticles(prev => prev.filter(a => a.slug !== deleteTarget.slug))
      setDeleteTarget(null)
    } catch (e) {
      alert('Silme işlemi sırasında hata oluştu: ' + (e instanceof Error ? e.message : e))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif text-navy">Makale Yönetimi</h1>
          <p className="text-gray-400 font-sans text-sm mt-1">
            {loading ? 'Yükleniyor...' : `${articles.length} makale`}
          </p>
        </div>
        <Link
          href="/admin/makaleler/yeni"
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-sans text-sm font-bold hover:bg-gold hover:text-navy transition-all"
        >
          <Plus size={16} /> Yeni Makale
        </Link>
      </div>

      {/* Category tabs + search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-navy text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {CATEGORY_SHORT[cat]}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Başlık veya slug ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[2px] font-sans">
            <tr>
              <th className="px-6 py-4">Başlık / Slug</th>
              <th className="px-6 py-4">Alt Başlık</th>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-sans">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-5">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-300 font-sans">
                  Makale bulunamadı.
                </td>
              </tr>
            ) : filtered.map((article) => (
              <tr key={article.slug} id={`row-${article.slug}`} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-navy line-clamp-1">{article.title || article.slug}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">{article.slug}</p>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">{article.altBaslik1 || '—'}</td>
                <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">{article.date || '—'}</td>
                <td className="px-6 py-4">{statusBadge(article)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/makaleler/duzenle?slug=${article.slug}&category=${article.category}`}
                      className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-colors"
                      title="Düzenle"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(article)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white max-w-sm w-full p-8 rounded-3xl shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-serif text-navy mb-2">Makaleyi Sil?</h3>
              <p className="text-gray-400 text-sm font-sans mb-1 font-bold">{deleteTarget.title || deleteTarget.slug}</p>
              <p className="text-gray-300 text-xs font-sans mb-8">Bu işlem geri alınamaz.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl border border-gray-100 font-sans text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-sans text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-60"
                >
                  {deleting ? 'Siliniyor...' : 'Evet, Sil'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminArticlesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-sans text-gray-400">Yükleniyor...</div>}>
      <AdminArticlesInner />
    </Suspense>
  )
}
