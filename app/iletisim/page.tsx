import { Metadata } from 'next'
import IletisimPageContent from '@/components/IletisimPageContent'

export const metadata: Metadata = {
  title: 'Randevu Al | Dr. Mustafa Kebat',
  description: 'Longevity, Corporate Bio-Integrity ve NeuroPerformance danışmanlığı için randevu alın.',
}

export default function IletisimPage() {
  return <IletisimPageContent />
}
