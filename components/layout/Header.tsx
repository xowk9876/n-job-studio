import Link from 'next/link'

const nav = [
  { href: '/salary',    label: '연봉' },
  { href: '/severance', label: '퇴직금' },
  { href: '/mortgage',  label: '대출' },
  { href: '/savings',   label: '적금' },
  { href: '/jeonse',    label: '전월세' },
  { href: '/lotto',     label: '로또' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#06070b]/60 border-b border-[color:var(--line)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="inline-reset flex items-center gap-2.5 group">
          <span
            aria-hidden
            className="relative inline-flex items-center justify-center w-7 h-7 rounded-md text-[12px] font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #6ea8ff 0%, #a78bfa 100%)',
              boxShadow: '0 0 12px rgba(110,168,255,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            M
          </span>
          <span className="font-semibold text-[15px] tracking-tight text-white group-hover:text-gradient transition-colors">
            머니핏
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5" aria-label="주요 계산기">
          {nav.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="inline-reset px-3 py-1.5 rounded-md text-[13.5px] text-[color:var(--sub)] hover:text-white hover:bg-white/5 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/salary"
          className="inline-reset hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12.5px] font-medium text-[color:var(--brand)] bg-[color:var(--brand-soft)] border border-[rgba(110,168,255,0.22)] hover:bg-[rgba(110,168,255,0.22)] transition-colors"
        >
          실수령액 확인 <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  )
}
