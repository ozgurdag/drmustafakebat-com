import { Metadata } from 'next'
import { getArticlesByCategory, getArticlesBySubtopic } from '@/lib/articles'
import SystemsPageContent from '@/components/SystemsPageContent'

export const metadata: Metadata = {
  title: 'Corporate Bio-Integrity: Kurumsal Risk ve Sağlık Yönetimi | Dr. Mustafa Kebat',
  description: 'Kardiyovasküler erken uyarı, biometric data audit ve institutional wellness consulting ile kurumsal sağlık yönetimi.',
}

export default function SystemsPage() {
  const recentArticles = getArticlesByCategory('systems').slice(0, 6)
  const sleepArticles = getArticlesBySubtopic('neuroperformance', 'Uyku & Vardiyalı Çalışma').slice(0, 6)
  return <SystemsPageContent recentArticles={recentArticles} sleepArticles={sleepArticles} />
}
