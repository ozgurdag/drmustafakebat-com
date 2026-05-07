import Link from 'next/link'

const footerLinks = [
  { href: '/longevity', label: 'Longevity' },
  { href: '/systems', label: 'Systems' },
  { href: '/neuroperformance', label: 'NeuroPerformance' },
  { href: '/makaleler', label: 'Makaleler' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#111', padding: '32px' }} className="flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-serif text-white" style={{ fontSize: '13px', letterSpacing: '2px' }}>
        Dr. Mustafa Kebat
      </span>
      <div className="flex flex-wrap justify-center" style={{ gap: '24px' }}>
        {footerLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="font-sans hover:text-gold transition-colors"
            style={{ color: '#666', fontSize: '11px', letterSpacing: '1px' }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <span className="font-sans" style={{ color: '#444', fontSize: '10px' }}>
        © 2025 drmustafakebat.com
      </span>
    </footer>
  )
}
