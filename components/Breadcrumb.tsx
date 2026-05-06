import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-sans py-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.href ?? item.label} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-gold text-xs select-none">›</span>
            )}
            {isLast || !item.href ? (
              <span className="text-navy/40">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-navy/50 hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
