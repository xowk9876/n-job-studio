'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/salary',    label: '연봉' },
  { href: '/severance', label: '퇴직금' },
  { href: '/mortgage',  label: '대출' },
  { href: '/savings',   label: '적금' },
  { href: '/jeonse',    label: '전월세' },
  { href: '/lotto',     label: '로또' },
]

/** Mobile-only bottom tab bar for quick calculator switching */
export default function MobileBottomNav() {
  const pathname = usePathname()
  if (pathname === '/') return null
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-[#0b1220]/85 border-t border-[color:var(--line)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch overflow-x-auto no-scrollbar">
        {nav.map(n => {
          const active = pathname === n.href
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`inline-reset flex-1 min-w-[64px] flex flex-col items-center justify-center py-2.5 text-[11.5px] font-medium transition-colors ${
                active ? 'text-[color:var(--brand)]' : 'text-[color:var(--muted)]'
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full mb-1 transition-all ${
                  active ? 'bg-[color:var(--brand)] w-4' : 'bg-transparent'
                }`}
              />
              {n.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
