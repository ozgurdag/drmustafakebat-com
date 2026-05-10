import { Metadata } from 'next'
import { getArticlesByCategory } from '@/lib/articles'
import NeuroperformancePageContent from '@/components/NeuroperformancePageContent'

export const metadata: Metadata = {
  title: 'NeuroPerformance: Zihin ve Hareket Optimizasyonu | Dr. Mustafa Kebat',
  description: 'Nöro-görsel antrenman, propriyoseptif gelişim ve bilişsel yük yönetimi ile sinir sistemi optimizasyonu.',
}

export default function NeuroperformancePage() {
  const recentArticles = getArticlesByCategory('neuroperformance').slice(0, 6)
  return <NeuroperformancePageContent recentArticles={recentArticles} />
}
