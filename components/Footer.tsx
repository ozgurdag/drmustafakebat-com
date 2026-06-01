export default function Footer() {
  return (
    <footer style={{ background: '#224a3e', padding: '28px 32px' }} className="flex flex-col items-center gap-3 text-center">
      <span className="font-serif text-white" style={{ fontSize: '13px', letterSpacing: '2px' }}>
        Dr. Mustafa Kebat
      </span>
      <p className="font-sans" style={{ color: '#888', fontSize: '10px', lineHeight: '1.7', maxWidth: '620px' }}>
        Bu sitede paylaşılan bilgiler yalnızca genel bilgilendirme amaçlı olup tıbbi tavsiye niteliği taşımaz.
        Sağlık kararlarınız için lütfen bir uzmana danışınız.
      </p>
      <span className="font-sans" style={{ color: '#444', fontSize: '10px' }}>
        © 2025 drmustafakebat.com
      </span>
    </footer>
  )
}
