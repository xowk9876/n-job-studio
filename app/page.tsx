import Link from 'next/link'

const calculators = [
  {
    href: '/salary',
    label: '연봉 실수령액',
    desc: '2026년 4대보험·소득세 자동 공제',
    hot: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M7 10h.01M17 14h.01" />
      </svg>
    ),
  },
  {
    href: '/severance',
    label: '퇴직금',
    desc: '근로기준법 평균임금 기준',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    href: '/mortgage',
    label: '대출 이자',
    desc: '원리금균등·원금균등·만기일시',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5 12 3l9 6.5" />
        <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
        <path d="M10 20v-5h4v5" />
      </svg>
    ),
  },
  {
    href: '/savings',
    label: '적금·예금',
    desc: '단리·복리 + 이자소득세 15.4%',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    href: '/jeonse',
    label: '전월세 전환',
    desc: '전세↔월세 법정 전환율',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h10M7 7l3-3M7 7l3 3" />
        <path d="M17 17H7M17 17l-3 3M17 17l-3-3" />
      </svg>
    ),
  },
  {
    href: '/lotto',
    label: '로또 번호',
    desc: '랜덤 조합 + 추첨 회차',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h.01M12 8h.01M16 12h.01M12 16h.01M10 10h.01M14 14h.01" />
      </svg>
    ),
  },
]

const features = [
  { num: '2026', label: '최신 세율 반영', desc: '매년 1월 국세청·근로복지공단 고시 기준으로 자동 업데이트' },
  { num: '0.2s', label: '결과 즉시 표시', desc: '입력하는 순간 바로 계산. 로딩·광고 팝업 없음' },
  { num: '100%', label: '무료 + 비로그인', desc: '가입·결제·인증 없음. 북마크만 해두면 끝' },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-20">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <span className="chip chip-brand mb-5">2026년 최신 세율 반영</span>
        <h1 className="font-display text-[34px] md:text-[52px] leading-[1.15] font-bold tracking-tight text-[color:var(--ink)]">
          숫자로 증명되는
          <br />
          <span className="text-[color:var(--brand)]">가장 정확한</span> 재테크 계산기
        </h1>
        <p className="mt-5 text-[15.5px] md:text-[17px] text-[color:var(--sub)] leading-relaxed">
          연봉 실수령액부터 전월세 전환까지.<br className="md:hidden" />
          한국 실무 기준으로 깔끔하게, 광고 없이 결과부터.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link href="/salary" className="btn-primary inline-reset">연봉 실수령액 계산</Link>
          <Link href="/mortgage" className="btn-ghost inline-reset">대출 이자 계산</Link>
        </div>
      </section>

      {/* Calculator grid */}
      <section className="mt-16 md:mt-24" aria-label="계산기 목록">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight">
            6가지 계산기
          </h2>
          <span className="text-[13px] text-[color:var(--muted)]">모두 무료 · 비로그인</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map(c => (
            <Link
              key={c.href}
              href={c.href}
              className="inline-reset card card-hover p-6 group relative"
            >
              {c.hot && (
                <span className="absolute top-4 right-4 chip chip-brand text-[10.5px] !py-0.5 !px-2">HOT</span>
              )}
              <div className="w-11 h-11 rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand)] flex items-center justify-center mb-4 group-hover:bg-[color:var(--brand)] group-hover:text-white transition-colors">
                {c.icon}
              </div>
              <h3 className="font-display text-[18px] font-semibold text-[color:var(--ink)] mb-1">
                {c.label}
              </h3>
              <p className="text-[13.5px] text-[color:var(--sub)] leading-snug">{c.desc}</p>
              <div className="mt-4 text-[13px] font-medium text-[color:var(--brand)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                계산하러 가기
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-20 md:mt-28">
        <div className="grid md:grid-cols-3 gap-6 md:gap-10">
          {features.map(f => (
            <div key={f.label} className="relative">
              <p className="font-display text-[40px] md:text-[48px] font-bold tracking-tight leading-none text-[color:var(--brand)]">
                {f.num}
              </p>
              <h3 className="mt-3 text-[16px] font-semibold text-[color:var(--ink)]">
                {f.label}
              </h3>
              <p className="mt-1 text-[13.5px] text-[color:var(--sub)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mt-20 md:mt-28 card p-8 md:p-12 bg-gradient-to-br from-[color:var(--brand-soft)] to-white border-[color:var(--brand-soft)]">
        <div className="max-w-2xl">
          <p className="chip chip-brand mb-3">지금 바로 시작</p>
          <h2 className="font-display text-[24px] md:text-[32px] font-bold tracking-tight text-[color:var(--ink)] leading-tight">
            연봉 계약서 받으셨나요?
            <br className="hidden md:block" />
            <span className="text-[color:var(--brand)]"> 실수령액부터 확인하세요.</span>
          </h2>
          <p className="mt-3 text-[14.5px] text-[color:var(--sub)] leading-relaxed">
            2026년 1월 개정된 근로소득세·4대보험 요율 전부 반영. 부양가족 공제, 자녀 세액공제까지
            직접 입력할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/salary" className="btn-primary inline-reset">실수령액 계산하기</Link>
            <Link href="/severance" className="btn-ghost inline-reset">퇴직금 계산하기</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
