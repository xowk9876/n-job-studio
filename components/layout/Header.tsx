'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV = [
  { href: '/salary',    label: '연봉' },
  { href: '/severance', label: '퇴직금' },
  { href: '/mortgage',  label: '대출' },
  { href: '/savings',   label: '적금' },
  { href: '/jeonse',    label: '전월세' },
  { href: '/lotto',     label: '로또' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={[
        'sticky top-0 z-40 transition-colors',
        scrolled
          ? 'bg-[color:var(--color-paper)]/92 backdrop-blur-md border-b border-[color:var(--color-line)]'
          : 'bg-transparent'
      ].join(' ')}
    >
      <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 group inline-reset" aria-label="머니핏 홈">
          <span className="font-display text-[22px] font-bold tracking-tight text-[color:var(--color-ink)]">
            머니핏
          </span>
          <span className="text-[11px] font-mono text-[color:var(--color-sub)] hidden sm:inline">
            Moneyfit · est. 2026
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="주요 계산기">
          {NAV.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'inline-reset px-3 py-1.5 text-[14px] font-medium rounded-md transition-colors',
                  active
                    ? 'text-[color:var(--color-ink)] bg-[color:var(--color-paper-2)]'
                    : 'text-[color:var(--color-sub)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-2)]/60'
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-3 -mr-2 rounded-md text-[color:var(--color-ink)]"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open
              ? <><path d="M6 6l12 12"/><path d="M6 18L18 6"/></>
              : <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-nav" className="md:hidden border-t border-[color:var(--color-line)] bg-[color:var(--color-paper)]">
          <div className="max-w-5xl mx-auto px-5 py-2 grid grid-cols-3 gap-1">
            {NAV.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'inline-reset text-center py-3 rounded-md text-[14px] font-medium',
                    active
                      ? 'bg-[color:var(--color-ink)] text-[color:var(--color-paper)]'
                      : 'text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-2)]'
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
