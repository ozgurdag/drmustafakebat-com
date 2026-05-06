import MakalelerClient from '@/components/MakalelerClient'
import { getAllArticles } from '@/lib/articles'

export const metadata = {
  title: 'Makaleler | Dr. Mustafa Kebat',
  description: "Longevity, İSG ve NeuroPerformance alanlarında 1.000'den fazla makale.",
}

export default function MakalelerPage() {
  const articles = getAllArticles()
  return <MakalelerClient articles={articles} />
}
