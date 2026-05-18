import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Dr. Mustafa Kebat | Hekim · Longevity Danışmanı · Araştırmacı',
    template: '%s | Dr. Mustafa Kebat',
  },
  description: 'Dr. Mustafa Kebat — 30+ yıllık deneyimle bireysel longevity yönetimi, kurumsal iş sağlığı ve nöroergonomi danışmanlığı.',
  keywords: ['longevity', 'biyolojik yaş', 'iş sağlığı', 'nöroergonomi', 'Dr Mustafa Kebat', 'İzmir hekim'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://drmustafakebat.com',
    siteName: 'Dr. Mustafa Kebat',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content="Dr. Mustafa Kebat" />
        <meta property="og:locale" content="tr_TR" />
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body className="bg-cream text-navy antialiased">
        <Nav />
        <main className="pt-[68px]">{children}</main>
        <Footer />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0F9V6TR9GJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0F9V6TR9GJ');
          `}
        </Script>
      </body>
    </html>
  )
}
