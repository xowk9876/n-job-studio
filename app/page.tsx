import Link from 'next/link'

const calculators = [
  {
    href: '/salary',
    label: '연봉 실수령액',
    desc: '4대보험·소득세 공제 후 월 실수령액',
    color: '#60a5fa',
  },
  {
    href: '/severance',
    label: '퇴직금',
    desc: '근로기준법 평균임금 기준',
    color: '#a78bfa',
  },
  {
    href: '/mortgage',
    label: '대출 이자',
    desc: '원리금균등·원금균등·만기일시',
    color: '#5eead4',
  },
  {
    href: '/savings',
    label: '적금 · 예금',
    desc: '단리·복리 + 이자소득세 15.4%',
    color: '#34d399',
  },
  {
    href: '/jeonse',
    label: '전월세 전환',
    desc: '전세↔월세 법정 전환율',
    color: '#fbbf24',
  },
  {
    href: '/lotto',
    label: '로또 번호',
    desc: '무작위 번호 조합 + 회차 정보',
    color: '#f472b6',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-20">
      {/* HERO */}
      <section className="max-w-2xl">
        <p className="mf-rise font-mono text-[11px] tracking-[0.22em] text-[color:var(--muted)] mb-3">
          MONEYFIT · 2026
        </p>
        <h1 className="mf-rise mf-rise-d1 font-display text-[34px] sm:text-[42px] md:text-[52px] leading-[1.1] font-bold tracking-[-0.03em] text-white">
          한국 실무 기준 <br />
          <span className="text-gradient">금융 계산기</span>
        </h1>
        <p className="mf-rise mf-rise-d2 mt-5 text-[15px] md:text-[16.5px] text-[color:var(--sub)] leading-relaxed">
          연봉·퇴직금·대출·적금·전월세. 2026년 기준 세율과 법정 공식으로 계산합니다.
        </p>
        <div className="mf-rise mf-rise-d3 mt-7 flex flex-wrap gap-3">
          <Link href="/salary" className="btn-primary inline-reset">
            연봉 계산하기
            <span aria-hidden>→</span>
          </Link>
          <Link href="/mortgage" className="btn-ghost inline-reset">대출 이자 계산</Link>
        </div>
      </section>

      {/* CALCULATOR GRID */}
      <section className="mt-16 md:mt-24" aria-label="계산기 목록">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-[18px] md:text-[20px] font-semibold text-white">계산기 6종</h2>
          <span className="text-[12px] text-[color:var(--muted)]">무료 · 가입 불필요</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`inline-reset card card-hover p-5 group relative overflow-hidden mf-rise mf-rise-d${Math.min(4, Math.floor(i/2)+1)}`}
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${c.color} 0%, transparent 70%)`, filter: 'blur(36px)' }}
              />
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-[15px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${c.color}22 0%, ${c.color}08 100%)`,
                  color: c.color,
                  border: `1px solid ${c.color}33`,
                }}
              >
                {c.label.charAt(0)}
              </div>
              <h3 className="font-display text-[17px] font-semibold text-white mb-1 tracking-tight">
                {c.label}
              </h3>
              <p className="text-[13px] text-[color:var(--sub)] leading-snug">{c.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[12.5px] font-medium text-[color:var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity">
                계산하기
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="mt-16 md:mt-20 grid sm:grid-cols-3 gap-6 text-[13.5px] text-[color:var(--sub)]">
        <div>
          <p className="font-semibold text-white mb-1.5">2026년 기준</p>
          <p className="leading-relaxed">근로소득세 누진세율, 4대보험 요율(국민연금 4.75%·건강보험 3.595%·장기요양 13.14%·고용보험 0.9%), 최저임금 시급 10,320원을 반영했습니다.</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1.5">계산 방식</p>
          <p className="leading-relaxed">소득세법 간이세액표 알고리즘, 근로기준법 평균임금, 원리금균등·원금균등·만기일시 상환 공식을 그대로 사용합니다.</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1.5">개인정보</p>
          <p className="leading-relaxed">가입·로그인 없이 모든 계산은 브라우저에서만 처리됩니다. 입력값은 서버로 전송되지 않습니다.</p>
        </div>
      </section>
    </div>
  )
}
