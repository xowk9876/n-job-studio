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
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[color:var(--line)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="inline-reset flex items-center gap-2 font-semibold text-[15px] tracking-tight">
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[color:var(--brand)] text-white text-[13px] font-bold"
          >
            M
          </span>
          <span className="text-[color:var(--ink)]">머니핏</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="주요 계산기">
          {nav.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="inline-reset px-3 py-1.5 rounded-md text-[14px] text-[color:var(--sub)] hover:text-[color:var(--ink)] hover:bg-[color:var(--bg-elev)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/salary"
          className="inline-reset hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md text-[13px] font-medium text-[color:var(--brand-strong)] bg-[color:var(--brand-soft)] hover:bg-[#dbe9ff] transition-colors"
        >
          실수령액 확인 →
        </Link>
      </div>
    </header>
  )
}
