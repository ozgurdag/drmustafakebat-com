export const dynamic = 'force-dynamic'

import MakalelerClient from '@/components/MakalelerClient'
import { getAllArticles } from '@/lib/articles'

export const metadata = {
  title: 'Makaleler | Dr. Mustafa Kebat',
  description: "Longevity, İSG ve NeuroPerformance alanlarında 1.000'den fazla makale.",
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export default function MakalelerPage() {
  const articles = getAllArticles()
  const shuffledArticles = shuffleArray(articles)
  return <MakalelerClient articles={shuffledArticles} />
}
