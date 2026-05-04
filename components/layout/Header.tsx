'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const nav = [
  { href: '/salary',    label: '연봉',    short: '연봉',   icon: '₩' },
  { href: '/severance', label: '퇴직금',  short: '퇴직금', icon: '⊕' },
  { href: '/mortgage',  label: '대출',    short: '대출',   icon: '%' },
  { href: '/savings',   label: '적금',    short: '적금',   icon: '◎' },
  { href: '/jeonse',    label: '전월세',  short: '전월세', icon: '⇄' },
  { href: '/lotto',     label: '로또',    short: '로또',   icon: '★' },
]

export default function Header() {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (!scrollRef.current) return
    const active = scrollRef.current.querySelector<HTMLAnchorElement>('[data-active="true"]')
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b1220]/80 border-b border-[color:var(--line)]">
      {/* Top row: logo + CTA */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
        <Link href="/" className="inline-reset flex items-center gap-2 group">
          <span
            aria-hidden
            className="relative inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              boxShadow: '0 0 8px rgba(96,165,250,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            M
          </span>
          <span className="font-semibold text-[14px] tracking-tight text-white">머니핏</span>
          <span className="hidden sm:inline text-[11px] text-[color:var(--muted)] font-mono ml-1">· 2026</span>
        </Link>
        <span className="chip chip-dot text-[10.5px]"><span>LIVE</span></span>
      </div>

      {/* Nav row: horizontal scrolling pill tabs */}
      <nav
        ref={scrollRef}
        aria-label="주요 계산기"
        className="max-w-6xl mx-auto px-3 md:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar h-11 border-t border-[color:var(--line)]"
      >
        {nav.map(n => {
          const active = pathname === n.href
          return (
            <Link
              key={n.href}
              href={n.href}
              data-active={active}
              className={`inline-reset shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                active
                  ? 'bg-[color:var(--brand-soft)] text-[color:var(--brand)] border border-[rgba(96,165,250,0.35)] shadow-[0_0_0_1px_rgba(96,165,250,0.15),0_4px_14px_rgba(59,130,246,0.18)]'
                  : 'text-[color:var(--sub)] hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <span aria-hidden className="text-[13px] opacity-70">{n.icon}</span>
              <span>{n.short}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
