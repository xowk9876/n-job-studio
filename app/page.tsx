import Link from 'next/link'
import { Wallet, Briefcase, Landmark, PiggyBank, KeyRound, Ticket } from 'lucide-react'

const calculators = [
  {
    href: '/salary',
    label: '연봉 실수령액',
    desc: '4대보험·근로소득세를 공제한 매월 실수령액을 확인합니다.',
    tag: '가장 많이 씀',
    color: '#60a5fa',
    Icon: Wallet,
  },
  {
    href: '/severance',
    label: '퇴직금',
    desc: '근로기준법 제34조 평균임금 기준으로 정확하게 계산합니다.',
    tag: '평균임금',
    color: '#a78bfa',
    Icon: Briefcase,
  },
  {
    href: '/mortgage',
    label: '대출 이자',
    desc: '원리금균등·원금균등·만기일시 3가지 상환 방식 비교.',
    tag: '3가지 방식',
    color: '#5eead4',
    Icon: Landmark,
  },
  {
    href: '/savings',
    label: '적금 · 예금',
    desc: '단리·복리 선택 + 이자소득세 15.4% 차감 후 실수령액.',
    tag: '세후 금액',
    color: '#34d399',
    Icon: PiggyBank,
  },
  {
    href: '/jeonse',
    label: '전월세 전환',
    desc: '전세↔월세 법정 전환율 기반 양방향 환산.',
    tag: '양방향',
    color: '#fbbf24',
    Icon: KeyRound,
  },
  {
    href: '/lotto',
    label: '로또 번호',
    desc: '1~45 중복 없는 무작위 조합 + 이번 회차 추첨 정보.',
    tag: '오락용',
    color: '#f472b6',
    Icon: Ticket,
  },
]

const stats = [
  { n: '6종', l: '전문 계산기' },
  { n: '2026', l: '최신 세율' },
  { n: '0원', l: '완전 무료' },
]

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6 py-10 md:py-16">
      {/* HERO — 중앙정렬, 타이트하게 */}
      <section className="text-center">
        <p className="mf-rise font-mono text-[11px] tracking-[0.28em] text-[color:var(--muted)] mb-4">
          MONEYFIT · 2026
        </p>
        <h1 className="mf-rise mf-rise-d1 font-display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.08] font-bold tracking-[-0.035em] text-white">
          복잡한 세금 계산,
          <br />
          <span className="text-gradient">1분이면 끝납니다</span>
        </h1>
        <p className="mf-rise mf-rise-d2 mt-5 text-[14.5px] md:text-[16px] text-[color:var(--sub)] leading-relaxed max-w-xl mx-auto">
          2026년 최신 세율과 법정 공식 그대로. 연봉·퇴직금·대출·적금·전월세까지
          <br className="hidden sm:block" />
          가입 없이 지금 바로 계산해보세요.
        </p>

        {/* STATS */}
        <dl className="mf-rise mf-rise-d4 mt-10 md:mt-12 grid grid-cols-3 gap-2 max-w-md mx-auto">
          {stats.map(s => (
            <div
              key={s.l}
              className="py-3.5 rounded-xl border border-[color:var(--line)] bg-white/[0.02]"
            >
              <dt className="font-display text-[20px] md:text-[22px] font-bold text-white leading-none">
                {s.n}
              </dt>
              <dd className="mt-1.5 text-[11.5px] text-[color:var(--muted)] tracking-wide">
                {s.l}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CALCULATOR GRID */}
      <section className="mt-16 md:mt-20" aria-label="계산기 목록">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-[19px] md:text-[22px] font-semibold text-white tracking-tight">
              지금 필요한 계산기
            </h2>
            <p className="mt-1 text-[12.5px] text-[color:var(--muted)]">
              자주 쓰는 6종을 한 곳에 모았습니다.
            </p>
          </div>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {calculators.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`inline-reset card card-hover p-5 group relative overflow-hidden mf-rise mf-rise-d${Math.min(4, Math.floor(i / 2) + 1)}`}
            >
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${c.color} 0%, transparent 70%)`,
                  filter: 'blur(32px)',
                }}
              />
              <div className="flex items-start justify-between mb-3.5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${c.color}22 0%, ${c.color}08 100%)`,
                    color: c.color,
                    border: `1px solid ${c.color}33`,
                  }}
                >
                  <c.Icon size={18} strokeWidth={1.8} />
                </div>
                <span
                  className="text-[10.5px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: c.color,
                    background: `${c.color}14`,
                    border: `1px solid ${c.color}28`,
                  }}
                >
                  {c.tag}
                </span>
              </div>
              <h3 className="font-display text-[16.5px] font-semibold text-white mb-1 tracking-tight">
                {c.label}
              </h3>
              <p className="text-[12.5px] text-[color:var(--sub)] leading-relaxed">
                {c.desc}
              </p>
              <div className="mt-3.5 flex items-center gap-1 text-[12px] font-medium text-[color:var(--brand)] opacity-60 group-hover:opacity-100 transition-opacity">
                바로가기
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="mt-16 md:mt-20">
        <div className="rounded-2xl border border-[color:var(--line)] bg-white/[0.015] p-6 md:p-8">
          <p className="font-mono text-[10.5px] tracking-[0.24em] text-[color:var(--muted)] mb-3">
            WHY MONEYFIT
          </p>
          <div className="grid md:grid-cols-3 gap-5 md:gap-7 text-[13px] text-[color:var(--sub)]">
            <div>
              <p className="font-semibold text-white mb-1.5 text-[14px]">정부 공식 기준</p>
              <p className="leading-relaxed">
                국민연금 4.75%, 건강보험 3.595%, 장기요양 13.14%, 고용보험 0.9%. 2026년 고시
                요율을 그대로 반영합니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1.5 text-[14px]">법정 공식 그대로</p>
              <p className="leading-relaxed">
                소득세법 근로소득 간이세액표, 근로기준법 평균임금, 금융권 표준 상환 공식을
                그대로 구현했습니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1.5 text-[14px]">완전한 프라이버시</p>
              <p className="leading-relaxed">
                가입·로그인 없습니다. 모든 계산은 브라우저 안에서만 처리되고 입력값은 서버로
                전송되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="mt-16 md:mt-20" aria-label="재테크 가이드">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-display text-[19px] md:text-[22px] font-semibold text-white tracking-tight">
              재테크 가이드
            </h2>
            <p className="mt-1 text-[12.5px] text-[color:var(--muted)]">
              법령 근거로 풀어쓴 실전 가이드 — 계산 뒤에 뭘 해야 할지까지.
            </p>
          </div>
          <Link
            href="/guide"
            className="text-[12.5px] text-[color:var(--brand)] hover:underline inline-reset"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {[
            { href: '/guide/2026-salary-tax-guide', title: '2026년 연봉 실수령액 완전 가이드', tag: '세금', color: '#60a5fa' },
            { href: '/guide/dsr-stress-test-2026', title: '2026 스트레스 DSR 3단계 정리', tag: '대출', color: '#5eead4' },
            { href: '/guide/severance-calculation-guide', title: '퇴직금 계산 공식과 실전 예시', tag: '퇴직', color: '#a78bfa' },
            { href: '/guide/isa-vs-regular-savings', title: 'ISA vs 일반계좌 10년 시뮬레이션', tag: '투자', color: '#34d399' },
            { href: '/guide/jeonse-safety-2026', title: '2026 전세사기 방지 체크리스트', tag: '부동산', color: '#fbbf24' },
            { href: '/guide/lotto-tax-guide', title: '로또 당첨금 세금·수령 가이드', tag: '복권', color: '#f472b6' },
          ].map(g => (
            <Link key={g.href} href={g.href} className="inline-reset card card-hover p-4">
              <span
                className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-full mb-2.5"
                style={{
                  color: g.color,
                  background: `${g.color}14`,
                  border: `1px solid ${g.color}28`,
                }}
              >
                {g.tag}
              </span>
              <h3 className="font-display text-[14.5px] font-semibold text-white tracking-tight leading-snug">
                {g.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
