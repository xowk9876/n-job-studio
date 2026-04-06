'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/salary',    label: '연봉 계산기' },
  { href: '/mortgage',  label: '대출 계산기' },
  { href: '/severance', label: '퇴직금 계산기' },
  { href: '/savings',   label: '적금 계산기' },
  { href: '/jeonse',    label: '전월세 계산기' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderColor: 'rgba(255,255,255,0.14)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.05), 0 4px 32px rgba(0,0,0,0.22)',
      }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 로고 — Sixshop 스타일 그라데이션 */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/45 transition-all duration-300 group-hover:scale-105">
            <Calculator className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-white">머니핏</span>{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              계산기
            </span>
          </span>
        </Link>

        {/* 데스크톱 내비게이션 — hover 언더라인 슬라이드 */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-blue-300 bg-blue-500/15 active'
                    : 'text-white/55 hover:text-white hover:bg-white/08'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="md:hidden p-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="메뉴"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 모바일 드롭다운 — 슬라이드 다운 */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
