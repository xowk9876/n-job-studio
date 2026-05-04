import Link from 'next/link'

const calculators = [
  {
    href: '/salary',
    label: '연봉 실수령액',
    desc: '2026년 4대보험·소득세 자동 공제',
    tag: 'HOT',
    color: '#6ea8ff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
    color: '#a78bfa',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    href: '/mortgage',
    label: '대출 이자',
    desc: '원리금균등 · 원금균등 · 만기일시',
    color: '#5eead4',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5 12 3l9 6.5" />
        <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
        <path d="M10 20v-5h4v5" />
      </svg>
    ),
  },
  {
    href: '/savings',
    label: '적금 · 예금',
    desc: '단리 · 복리 + 이자소득세 15.4%',
    color: '#34d399',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    href: '/jeonse',
    label: '전월세 전환',
    desc: '전세↔월세 법정 전환율',
    color: '#fbbf24',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h10M7 7l3-3M7 7l3 3" />
        <path d="M17 17H7M17 17l-3 3M17 17l-3-3" />
      </svg>
    ),
  },
  {
    href: '/lotto',
    label: '로또 번호',
    desc: '랜덤 조합 + 추첨 회차',
    color: '#f472b6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h.01M12 8h.01M16 12h.01M12 16h.01M10 10h.01M14 14h.01" />
      </svg>
    ),
  },
]

const stats = [
  { num: '2026', label: '최신 세율 반영', desc: '근로소득세 · 4대보험 요율 자동 업데이트' },
  { num: '0.2s', label: '즉시 계산', desc: '입력 순간 결과 표시, 로딩 없음' },
  { num: '100%', label: '무료 · 비로그인', desc: '가입 · 결제 · 인증 전부 없음' },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-24">
      {/* HERO */}
      <section className="relative text-center max-w-3xl mx-auto">
        <div className="mf-rise inline-flex">
          <span className="chip chip-dot"><span>실시간 2026년 세율 가동 중</span></span>
        </div>

        <h1 className="mf-rise mf-rise-d1 font-display text-[38px] sm:text-[48px] md:text-[64px] leading-[1.08] font-bold tracking-[-0.03em] text-white mt-6">
          숫자로 증명되는
          <br />
          <span className="text-gradient">가장 정확한 계산기</span>
        </h1>

        <p className="mf-rise mf-rise-d2 mt-6 text-[15.5px] md:text-[17.5px] text-[color:var(--sub)] leading-relaxed">
          연봉 실수령액부터 전월세 전환까지.
          <br className="md:hidden" />
          {' '}한국 실무 기준으로 깔끔하게, 광고 팝업 없이 결과부터.
        </p>

        <div className="mf-rise mf-rise-d3 mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/salary" className="btn-primary inline-reset">
            연봉 실수령액 계산
            <span aria-hidden>→</span>
          </Link>
          <Link href="/mortgage" className="btn-ghost inline-reset">대출 이자 계산</Link>
        </div>

        {/* Decorative orbital ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-[1]"
          style={{
            width: 720, height: 720,
            background: 'radial-gradient(circle, rgba(110,168,255,0.18) 0%, transparent 55%)',
            filter: 'blur(40px)',
          }}
        />
      </section>

      {/* CALCULATOR GRID */}
      <section className="mt-20 md:mt-28" aria-label="계산기 목록">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[11px] text-[color:var(--muted)] tracking-[0.2em] mb-2">CALCULATORS · 06</p>
            <h2 className="font-display text-[24px] md:text-[30px] font-bold tracking-tight text-white">
              필요한 계산, 전부 여기.
            </h2>
          </div>
          <span className="hidden md:inline text-[12.5px] text-[color:var(--muted)] font-mono">all free · no signup</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`inline-reset card card-hover p-6 group relative overflow-hidden mf-rise mf-rise-d${Math.min(4, Math.floor(i/2)+1)}`}
            >
              {/* per-card accent glow */}
              <div
                aria-hidden
                className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${c.color} 0%, transparent 70%)`, filter: 'blur(40px)' }}
              />

              {c.tag && (
                <span className="absolute top-4 right-4 chip chip-brand text-[10.5px] !py-0.5 !px-2">{c.tag}</span>
              )}

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${c.color}22 0%, ${c.color}08 100%)`,
                  color: c.color,
                  border: `1px solid ${c.color}33`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px ${c.color}11`,
                }}
              >
                {c.icon}
              </div>

              <h3 className="font-display text-[18.5px] font-semibold text-white mb-1.5 tracking-tight">
                {c.label}
              </h3>
              <p className="text-[13px] text-[color:var(--sub)] leading-snug">{c.desc}</p>

              <div className="mt-5 flex items-center gap-1 text-[13px] font-medium text-[color:var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                계산하러 가기
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="mt-24 md:mt-32 grid md:grid-cols-3 gap-8 md:gap-12">
        {stats.map((s, i) => (
          <div key={s.label} className={`mf-rise mf-rise-d${i+1} relative`}>
            <p className="font-display text-[48px] md:text-[56px] font-bold tracking-[-0.04em] leading-none text-gradient">
              {s.num}
            </p>
            <h3 className="mt-4 text-[15.5px] font-semibold text-white">{s.label}</h3>
            <p className="mt-1.5 text-[13px] text-[color:var(--sub)] leading-relaxed">{s.desc}</p>
            {i < stats.length - 1 && (
              <div aria-hidden className="hidden md:block absolute top-4 -right-6 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-24 md:mt-32 relative overflow-hidden card p-8 md:p-14">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(110,168,255,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(167,139,250,0.15) 0%, transparent 45%)',
          }}
        />
        <div className="relative max-w-2xl">
          <span className="chip chip-brand mb-4">지금 바로 시작</span>
          <h2 className="font-display text-[26px] md:text-[38px] font-bold tracking-[-0.02em] text-white leading-[1.15]">
            연봉 계약서 받으셨나요?
            <br />
            <span className="text-gradient">실수령액부터 확인하세요.</span>
          </h2>
          <p className="mt-4 text-[14.5px] text-[color:var(--sub)] leading-relaxed">
            2026년 1월 개정된 근로소득세·4대보험 요율 전부 반영. 부양가족 공제, 자녀 세액공제까지 직접 입력 가능.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/salary" className="btn-primary inline-reset">
              실수령액 계산하기
              <span aria-hidden>→</span>
            </Link>
            <Link href="/severance" className="btn-ghost inline-reset">퇴직금 계산하기</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
