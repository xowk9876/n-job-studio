import Link from 'next/link'
import { Wallet, Briefcase, Landmark, PiggyBank, KeyRound, Ticket, ArrowRight } from 'lucide-react'

const calculators = [
  {
    href: '/salary',
    label: '연봉 실수령액',
    desc: '4대보험·근로소득세를 공제한 매월 실수령액을 확인합니다.',
    tag: '가장 많이 씀',
    color: '#6bafff',
    gradient: 'from-blue-500/10 to-blue-600/5',
    Icon: Wallet,
  },
  {
    href: '/severance',
    label: '퇴직금',
    desc: '근로기준법 제34조 평균임금 기준으로 정확하게 계산합니다.',
    tag: '평균임금',
    color: '#b8a4fa',
    gradient: 'from-violet-500/10 to-violet-600/5',
    Icon: Briefcase,
  },
  {
    href: '/mortgage',
    label: '대출 이자',
    desc: '원리금균등·원금균등·만기일시 3가지 상환 방식 비교.',
    tag: '3가지 방식',
    color: '#5eead4',
    gradient: 'from-teal-500/10 to-teal-600/5',
    Icon: Landmark,
  },
  {
    href: '/savings',
    label: '적금 · 예금',
    desc: '단리·복리 선택 + 이자소득세 15.4% 차감 후 실수령액.',
    tag: '세후 금액',
    color: '#3ee0a5',
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    Icon: PiggyBank,
  },
  {
    href: '/jeonse',
    label: '전월세 전환',
    desc: '전세↔월세 법정 전환율 기반 양방향 환산.',
    tag: '양방향',
    color: '#fcc73e',
    gradient: 'from-amber-500/10 to-amber-600/5',
    Icon: KeyRound,
  },
  {
    href: '/lotto',
    label: '로또 번호',
    desc: '1~45 중복 없는 무작위 조합 + 이번 회차 추첨 정보.',
    tag: '오락용',
    color: '#f590c0',
    gradient: 'from-pink-500/10 to-pink-600/5',
    Icon: Ticket,
  },
]

const stats = [
  { n: '6종', l: '전문 계산기', accent: '#6bafff' },
  { n: '2026', l: '최신 세율', accent: '#929cf8' },
  { n: '0원', l: '완전 무료', accent: '#3ee0a5' },
]

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-5 md:px-6 py-12 md:py-20">
      {/* HERO */}
      <section className="text-center">
        <div className="mf-rise inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-[color:var(--muted)]">
            MONEYFIT · 2026
          </span>
        </div>

        <h1 className="mf-rise mf-rise-d1 font-display text-[36px] sm:text-[48px] md:text-[58px] leading-[1.05] font-bold tracking-[-0.04em] text-white">
          복잡한 세금 계산,
          <br />
          <span className="text-gradient">1분이면 끝납니다</span>
        </h1>

        <p className="mf-rise mf-rise-d2 mt-6 text-[15px] md:text-[17px] text-[color:var(--sub)] leading-relaxed max-w-xl mx-auto">
          2026년 최신 세율과 법정 공식 그대로. 연봉·퇴직금·대출·적금·전월세까지
          <br className="hidden sm:block" />
          가입 없이 지금 바로 계산해보세요.
        </p>

        {/* CTA */}
        <div className="mf-rise mf-rise-d3 mt-8 flex justify-center gap-3">
          <Link href="/salary" className="inline-reset btn-primary">
            지금 계산하기 <ArrowRight size={16} />
          </Link>
        </div>

        {/* STATS */}
        <dl className="mf-rise mf-rise-d4 mt-14 grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {stats.map(s => (
            <div
              key={s.l}
              className="card-glow py-5 px-3 text-center"
            >
              <dt
                className="font-display text-[22px] md:text-[26px] font-bold leading-none"
                style={{ color: s.accent }}
              >
                {s.n}
              </dt>
              <dd className="mt-2 text-[11px] text-[color:var(--muted)] tracking-wide font-medium">
                {s.l}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CALCULATOR GRID */}
      <section className="mt-20 md:mt-28" aria-label="계산기 목록">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.24em] text-[color:var(--muted)] mb-1.5">CALCULATORS</p>
            <h2 className="font-display text-[20px] md:text-[24px] font-semibold text-white tracking-tight">
              지금 필요한 계산기
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`inline-reset card card-hover group relative overflow-hidden p-6 mf-rise mf-rise-d${Math.min(4, Math.floor(i / 2) + 1)}`}
            >
              {/* Glow orb */}
              <div
                aria-hidden
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${c.color} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                }}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${c.color}20 0%, ${c.color}08 100%)`,
                    color: c.color,
                    border: `1px solid ${c.color}25`,
                    boxShadow: `0 0 16px ${c.color}10`,
                  }}
                >
                  <c.Icon size={19} strokeWidth={1.7} />
                </div>
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
                  style={{
                    color: c.color,
                    background: `${c.color}10`,
                    border: `1px solid ${c.color}20`,
                  }}
                >
                  {c.tag}
                </span>
              </div>

              <h3 className="font-display text-[17px] font-semibold text-white mb-1.5 tracking-tight">
                {c.label}
              </h3>
              <p className="text-[12.5px] text-[color:var(--sub)] leading-relaxed">
                {c.desc}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--brand)] opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:gap-2.5">
                바로가기
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="mt-20 md:mt-28">
        <div className="card-glow p-8 md:p-10">
          <p className="font-mono text-[10px] tracking-[0.24em] text-[color:var(--muted)] mb-5">
            WHY MONEYFIT
          </p>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: '정부 공식 기준',
                desc: '국민연금 4.75%, 건강보험 3.595%, 장기요양 13.14%, 고용보험 0.9%. 2026년 고시 요율을 그대로 반영합니다.',
                accent: '#6bafff',
              },
              {
                title: '법정 공식 그대로',
                desc: '소득세법 근로소득 간이세액표, 근로기준법 평균임금, 금융권 표준 상환 공식을 그대로 구현했습니다.',
                accent: '#929cf8',
              },
              {
                title: '완전한 프라이버시',
                desc: '가입·로그인 없습니다. 모든 계산은 브라우저 안에서만 처리되고 입력값은 서버로 전송되지 않습니다.',
                accent: '#3ee0a5',
              },
            ].map(item => (
              <div key={item.title} className="text-[13px] text-[color:var(--sub)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-5 rounded-full" style={{ background: item.accent }} />
                  <p className="font-semibold text-white text-[14.5px]">{item.title}</p>
                </div>
                <p className="leading-relaxed pl-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="mt-20 md:mt-28" aria-label="가이드">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.24em] text-[color:var(--muted)] mb-1.5">GUIDES</p>
            <h2 className="font-display text-[20px] md:text-[24px] font-semibold text-white tracking-tight">
              계산 전에 읽으면 좋은 글
            </h2>
          </div>
          <Link
            href="/guide"
            className="text-[12.5px] text-[color:var(--brand)] hover:underline inline-reset flex items-center gap-1"
          >
            전체 보기 <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/guide/2026-salary-tax-guide', title: '2026 연봉 공제항목 총정리', tag: '세금', color: '#6bafff' },
            { href: '/guide/dsr-stress-test-2026', title: 'DSR 규제, 나는 얼마까지 빌릴 수 있나', tag: '대출', color: '#5eead4' },
            { href: '/guide/isa-vs-regular-savings', title: 'ISA vs 일반계좌 절세 효과 비교', tag: '절세', color: '#3ee0a5' },
            { href: '/guide/jeonse-safety-2026', title: '전세사기 예방 필수 체크리스트', tag: '부동산', color: '#fcc73e' },
            { href: '/guide/severance-calculation-guide', title: '퇴직금, 이렇게 계산됩니다', tag: '퇴직', color: '#b8a4fa' },
            { href: '/guide/lotto-tax-guide', title: '로또 당첨금 세금과 수령 절차', tag: '복권', color: '#f590c0' },
          ].map(g => (
            <Link key={g.href} href={g.href} className="inline-reset card card-hover p-5 group">
              <span
                className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3 tracking-wide"
                style={{
                  color: g.color,
                  background: `${g.color}10`,
                  border: `1px solid ${g.color}20`,
                }}
              >
                {g.tag}
              </span>
              <h3 className="font-display text-[14.5px] font-semibold text-white tracking-tight leading-snug group-hover:text-[color:var(--brand)] transition-colors">
                {g.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
