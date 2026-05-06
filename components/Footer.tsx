import Link from 'next/link'

const footerLinks = [
  { href: '/longevity', label: 'Longevity' },
  { href: '/systems', label: 'Systems' },
  { href: '/neuroperformance', label: 'NeuroPerformance' },
  { href: '/makaleler', label: 'Makaleler' },
  { href: '/hakkimda', label: 'Hakkımda' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-500 py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white text-[13px] tracking-[2px] uppercase font-sans">
          Dr. Mustafa Kebat
        </span>
        <div className="flex flex-wrap justify-center gap-5">
          {footerLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[1px] uppercase font-sans hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span className="text-[10px] font-sans">
          © {new Date().getFullYear()} drmustafakebat.com
        </span>
      </div>
    </footer>
  )
}
