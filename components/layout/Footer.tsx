import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-[color:var(--color-line)]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <p className="font-display text-xl font-bold text-[color:var(--color-ink)]">머니핏</p>
          <p className="mt-2 text-[13px] text-[color:var(--color-sub)] leading-relaxed max-w-xs">
            2026년 최신 기준으로 정확하게 — 연봉, 퇴직금, 대출, 적금, 전월세를 1초 안에.
            광고 없이 결과부터 보여드립니다.
          </p>
          <p className="mt-4 text-[11px] font-mono text-[color:var(--color-muted)]">
            © {year} Moneyfit · 한국 재테크 계산기
          </p>
        </div>

        {/* Calculators */}
        <div>
          <p className="text-[12px] font-semibold tracking-wider uppercase text-[color:var(--color-muted)] mb-3">계산기</p>
          <ul className="space-y-1.5 text-[14px]">
            {[
              { href: '/salary', label: '연봉 실수령액' },
              { href: '/severance', label: '퇴직금' },
              { href: '/mortgage', label: '대출 이자' },
              { href: '/savings', label: '적금 이자' },
              { href: '/jeonse', label: '전월세 전환' },
              { href: '/lotto', label: '로또 번호' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="inline-reset text-[color:var(--color-sub)] hover:text-[color:var(--color-ink)] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <p className="text-[12px] font-semibold tracking-wider uppercase text-[color:var(--color-muted)] mb-3">안내</p>
          <ul className="space-y-1.5 text-[14px] text-[color:var(--color-sub)]">
            <li>산식은 국세청·근로복지공단·금융감독원 공표 기준</li>
            <li>입력값은 브라우저에만 저장되며 서버로 전송되지 않습니다.</li>
            <li>결과는 참고용이며 법적 효력은 없습니다.</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
