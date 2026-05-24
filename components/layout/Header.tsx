'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/salary', label: '연봉' },
  { href: '/severance', label: '퇴직금' },
  { href: '/mortgage', label: '대출' },
  { href: '/savings', label: '적금' },
  { href: '/jeonse', label: '전월세' },
  { href: '/lotto', label: '로또' },
  { href: '/guide', label: '가이드' },
] as const

function isNavActive(pathname: string, href: string) {
  if (href === '/guide') return pathname === '/guide' || pathname.startsWith('/guide/')
  return pathname === href
}

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="site-header sticky top-0 z-40 backdrop-blur-xl bg-[#0b1220]/80 border-b border-[color:var(--line)]">
      <div className="site-header__brand max-w-5xl mx-auto px-4 md:px-6 h-11 md:h-12 flex items-center justify-center">
        <Link href="/" className="inline-reset flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6bafff 0%, #7071f3 100%)' }}
          >
            M
          </span>
          <span className="font-semibold text-[14px] md:text-[14.5px] tracking-tight text-white">머니핏 계산기</span>
        </Link>
      </div>

      <div className="site-header__nav-wrap">
        <nav aria-label="계산기 메뉴" className="site-header__nav max-w-5xl mx-auto">
          {nav.map((item) => {
            const active = isNavActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`site-header__nav-link inline-reset ${active ? 'is-active' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
