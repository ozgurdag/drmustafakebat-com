import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Dr. Mustafa Kebat | Hekim · İSG Uzmanı · Araştırmacı',
  description: 'Longevity, kurumsal sağlık sistemleri ve nöroergonomi alanlarında uzman hekim ve iş güvenliği danışmanı.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="bg-cream text-navy antialiased">
        <Nav />
        <main className="pt-[68px]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
