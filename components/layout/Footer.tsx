import Link from 'next/link'

const calc = [
  { href: '/salary', label: '연봉 실수령액' },
  { href: '/severance', label: '퇴직금' },
  { href: '/mortgage', label: '대출 이자' },
  { href: '/savings', label: '적금 이자' },
  { href: '/jeonse', label: '전월세 전환' },
  { href: '/lotto', label: '로또 번호' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-20 border-t border-[color:var(--line)] bg-[color:var(--bg-subtle)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-6 h-6 rounded bg-[color:var(--brand)] text-white text-[11px] font-bold"
            >
              M
            </span>
            <span className="font-semibold text-[color:var(--ink)]">머니핏</span>
          </div>
          <p className="text-[13px] text-[color:var(--sub)] leading-relaxed max-w-md">
            2026년 최신 세율·공제 기준으로 정확하게. 광고 없이 결과부터 보여주는 한국 재테크 계산기.
          </p>
          <p className="text-[12px] text-[color:var(--muted)] mt-3">
            본 계산기는 정보 제공 목적이며, 실제 세액·이자는 정책 및 금융기관 상품에 따라 달라질 수 있습니다.
          </p>
        </div>

        <nav aria-label="사이트 내비게이션">
          <p className="text-[11px] font-semibold text-[color:var(--muted)] tracking-widest mb-3 uppercase">
            Calculators
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {calc.map(c => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-reset text-[13.5px] text-[color:var(--ink-2)] hover:text-[color:var(--brand-strong)] transition-colors"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[color:var(--line)]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[color:var(--muted)]">
          <span>© {year} 머니핏 · Made in Korea</span>
          <span>2026 세율 반영 · Open Source Friendly</span>
        </div>
      </div>
    </footer>
  )
}
