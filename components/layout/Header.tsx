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
        background: 'rgba(255,255,255,0.09)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(255,255,255,0.18)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.25)',
      }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            머니핏 <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">계산기</span>
          </span>
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          ))}
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

      {/* 모바일 드롭다운 */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
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
      )}
    </header>
  )
}
