'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { listCategoryFiles, getLastDeployStatus, DeployStatus } from '@/lib/github-api'
import { ALL_CATEGORIES, CATEGORY_SHORT } from '@/lib/types'
import { FileText, Folders, RefreshCw, ExternalLink, Plus } from 'lucide-react'

interface CategoryCount {
  category: string
  label: string
  count: number
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<CategoryCount[]>([])
  const [total, setTotal] = useState(0)
  const [deploy, setDeploy] = useState<DeployStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('gh_pat')
    if (!token) return

    const load = async () => {
      try {
        const [catCounts, deployStatus] = await Promise.all([
          Promise.all(
            ALL_CATEGORIES.map(async (cat) => {
              const files = await listCategoryFiles(cat, token)
              return { category: cat, label: CATEGORY_SHORT[cat], count: files.length }
            })
          ),
          getLastDeployStatus(token),
        ])
        setCounts(catCounts)
        setTotal(catCounts.reduce((s, c) => s + c.count, 0))
        setDeploy(deployStatus)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const deployColor =
    deploy?.status === 'success' ? 'text-emerald-400' :
    deploy?.status === 'failure' ? 'text-red-400' :
    deploy?.status === 'in_progress' ? 'text-yellow-400' :
    'text-gray-400'

  const deployLabel =
    deploy?.status === 'success' ? '🟢 Başarılı' :
    deploy?.status === 'failure' ? '🔴 Hata' :
    deploy?.status === 'in_progress' ? '⏳ Devam Ediyor' :
    deploy?.status === 'queued' ? '⏳ Kuyrukta' :
    '⚪ Bilinmiyor'

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif text-navy">Hoş Geldiniz</h1>
          <p className="text-gray-400 font-sans text-sm mt-1">Sitenizin içerik durumu aşağıdadır.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://analytics.google.com/analytics/web/#/p430752402/reports/intelligenthome"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-gray-100 text-gray-500 px-4 py-2.5 rounded-xl font-sans text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            <ExternalLink size={13} /> Google Analytics
          </a>
          <Link
            href="/admin/makaleler/yeni"
            className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-sans text-sm font-bold hover:bg-gold hover:text-navy transition-all shadow-sm"
          >
            <Plus size={16} /> Yeni Makale
          </Link>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <FileText size={18} className="text-navy/40" />
            <p className="text-[10px] font-sans uppercase tracking-widest text-gray-400">Toplam Makale</p>
          </div>
          <p className="text-4xl font-serif text-navy">{loading ? '—' : total}</p>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <Folders size={18} className="text-navy/40" />
            <p className="text-[10px] font-sans uppercase tracking-widest text-gray-400">Kategori</p>
          </div>
          <p className="text-4xl font-serif text-navy">{ALL_CATEGORIES.length}</p>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw size={18} className="text-navy/40" />
            <p className="text-[10px] font-sans uppercase tracking-widest text-gray-400">Son Deploy</p>
          </div>
          <p className={`text-sm font-sans font-bold mt-1 ${deployColor}`}>{deployLabel}</p>
          {deploy?.created_at && (
            <p className="text-[10px] text-gray-300 font-sans mt-1">
              {new Date(deploy.created_at).toLocaleString('tr-TR')}
            </p>
          )}
          {deploy?.html_url && (
            <a href={deploy.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-gold hover:underline mt-1">
              <ExternalLink size={10} /> Detay
            </a>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-serif text-lg text-navy">Kategorilere Göre Makaleler</h3>
          <Link href="/admin/makaleler" className="text-gold text-sm font-sans hover:underline">
            Tümünü yönet →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-10 text-center text-gray-300 font-sans text-sm">Yükleniyor...</div>
          ) : counts.map((c) => (
            <div key={c.category} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <span className="font-sans text-sm text-navy">{c.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-serif text-xl text-navy">{c.count}</span>
                <Link
                  href={`/admin/makaleler?category=${c.category}`}
                  className="text-[10px] bg-gray-100 px-3 py-1 rounded-lg font-sans font-bold hover:bg-navy hover:text-white transition-all"
                >
                  GÖR
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
