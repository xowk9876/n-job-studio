'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const nav = [
  { href: '/salary',    label: '연봉' },
  { href: '/severance', label: '퇴직금' },
  { href: '/mortgage',  label: '대출' },
  { href: '/savings',   label: '적금' },
  { href: '/jeonse',    label: '전월세' },
  { href: '/lotto',     label: '로또' },
  { href: '/guide',     label: '가이드' },
]

export default function Header() {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const active = scrollRef.current?.querySelector<HTMLAnchorElement>('[data-active="true"]')
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b1220]/80 border-b border-[color:var(--line)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 h-12 flex items-center justify-center">
        <Link href="/" className="inline-reset flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6bafff 0%, #7071f3 100%)' }}
          >
            M
          </span>
          <span className="font-semibold text-[14.5px] tracking-tight text-white">머니핏 계산기</span>
        </Link>
      </div>

      <nav
        ref={scrollRef}
        aria-label="계산기 메뉴"
        className="max-w-5xl mx-auto px-3 md:px-6 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar h-11 border-t border-[color:var(--line)]"
      >
        {nav.map(n => {
          const active = pathname === n.href
          return (
            <Link
              key={n.href}
              href={n.href}
              data-active={active}
              className={`inline-reset shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                active
                  ? 'bg-[color:var(--brand-soft)] text-[color:var(--brand)] border border-[rgba(107,175,255,0.32)]'
                  : 'text-[color:var(--sub)] hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              {n.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
