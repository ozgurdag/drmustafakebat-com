import { Metadata } from 'next'
import LongevityPageContent from '@/components/LongevityPageContent'

export const metadata: Metadata = {
  title: 'Longevity | Dr. Mustafa Kebat',
  description: 'Biyolojik yaşlanmayı yavaşlatmak ve hücresel sağlığı optimize etmek için bilimsel protokoller.',
}

export default function LongevityPage() {
  return <LongevityPageContent />
}
