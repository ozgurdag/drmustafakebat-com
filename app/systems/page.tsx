import { Metadata } from 'next'
import { getArticlesByCategory } from '@/lib/articles'
import SystemsPageContent from '@/components/SystemsPageContent'

export const metadata: Metadata = {
  title: 'Corporate Bio-Integrity: Kurumsal Risk ve Sağlık Yönetimi | Dr. Mustafa Kebat',
  description: 'Kardiyovasküler erken uyarı, biometric data audit ve institutional wellness consulting ile kurumsal sağlık yönetimi.',
}

export default function SystemsPage() {
  const recentArticles = getArticlesByCategory('isg').slice(0, 3)
    .concat(getArticlesByCategory('acil').slice(0, 2))
    .concat(getArticlesByCategory('mevzuat').slice(0, 1))
  const sleepArticles = getArticlesByCategory('neuroperformance')
    .filter(a => a.altBaslik1 === 'Uyku & Vardiyalı Çalışma' || a.altBaslik1 === 'Uyku & Biyolojik Ritim')
    .slice(0, 6)
  return <SystemsPageContent recentArticles={recentArticles} sleepArticles={sleepArticles} />
}
