import type { Metadata } from 'next'
import Link from 'next/link'
import { Wallet, Briefcase, Landmark, PiggyBank, KeyRound, Ticket, ArrowRight, Shield, Scale, Lock } from 'lucide-react'
import HomeGuideHub from '@/components/home/HomeGuideHub'
import { DEFAULT_OG_IMAGE, SEO_UPDATED_AT, SITE_NAME, SITE_URL } from '@/lib/seo'
import { buildGoogleAlternates, buildNaverMeta, formatPageTitle } from '@/lib/seo-platform'
import { calcSalary } from '@/lib/salary'

// 히어로 우측 미리보기 — 연봉 5,000만원·본인 1인·수당 0 기준 실제 calcSalary 결과(SSR 산출, Zero Hallucination)
const HERO_PREVIEW_ANNUAL = 50_000_000
const heroPreview = calcSalary({
  annualSalary: HERO_PREVIEW_ANNUAL,
  dependents: 1,
  children: 0,
  overtimeHours: 0,
  nightHours: 0,
  holidayHours: 0,
  mealAllowance: 0,
  transportAllowance: 0,
})
const fmtWon = (n: number) => n.toLocaleString('ko-KR')

const homeDescription =
  '2026년 최신 세율·4대보험 요율·법령 기준으로 정확하게 계산합니다. 연봉 실수령액, 주택담보대출, 퇴직금, 적금·ISA, 전월세, 로또까지 무료.'

export const metadata: Metadata = {
  alternates: buildGoogleAlternates(SITE_URL),
  openGraph: {
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'ko_KR',
    title: '머니핏 계산기 — 2026년 한국 재테크 필수 계산기 6종',
    description: homeDescription,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: '머니핏 계산기 메인' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '머니핏 계산기 — 2026년 재테크 필수 계산기 6종',
    description: '연봉·대출·퇴직금·적금·전월세·로또 — 무료 계산기.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: '머니핏 계산기' }],
  },
  other: {
    'article:modified_time': SEO_UPDATED_AT,
    ...buildNaverMeta(formatPageTitle('2026년 연봉·대출·퇴직금·적금·전월세·로또 계산기'), homeDescription),
  },
}

const calculators = [
  {
    href: '/salary',
    label: '연봉 실수령액',
    desc: '4대보험·근로소득세 공제 후 매월 실수령액',
    tag: '인기',
    color: '#6bafff',
    Icon: Wallet,
  },
  {
    href: '/severance',
    label: '퇴직금',
    desc: '근로기준법 평균임금 기준 산출',
    tag: '법정',
    color: '#b8a4fa',
    Icon: Briefcase,
  },
  {
    href: '/mortgage',
    label: '대출 이자',
    desc: '3가지 상환 방식·DSR 비교',
    tag: '대출',
    color: '#5eead4',
    Icon: Landmark,
  },
  {
    href: '/savings',
    label: '적금 · 예금',
    desc: '세후 이자·ISA 비교',
    tag: '절세',
    color: '#3ee0a5',
    Icon: PiggyBank,
  },
  {
    href: '/jeonse',
    label: '전월세 전환',
    desc: '법정 전환율 양방향 환산',
    tag: '부동산',
    color: '#fcc73e',
    Icon: KeyRound,
  },
  {
    href: '/lotto',
    label: '로또 번호',
    desc: '번호 생성·당첨 정보',
    tag: '오락',
    color: '#f590c0',
    Icon: Ticket,
  },
]

const trustItems = [
  {
    Icon: Shield,
    title: '정부 공식 기준',
    desc: '2026년 4대보험 요율·간이세액표·근로기준법을 반영합니다.',
    accent: '#6bafff',
  },
  {
    Icon: Scale,
    title: '법정 공식 구현',
    desc: '금융권 표준 상환·전월세 전환율 등 검증 가능한 공식을 사용합니다.',
    accent: '#929cf8',
  },
  {
    Icon: Lock,
    title: '브라우저 안에서 계산',
    desc: '가입 없이, 입력값은 서버로 전송하지 않습니다.',
    accent: '#3ee0a5',
  },
]

export default function HomePage() {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="home-hero mf-rise" aria-label="소개">
        <div className="home-hero__bg" aria-hidden>
          <div className="home-hero__grid" />
          <div className="home-hero__spotlight" />
          <div className="home-hero__orb home-hero__orb--blue" />
          <div className="home-hero__orb home-hero__orb--violet" />
          <div className="home-hero__orb home-hero__orb--mint" />
        </div>

        <div className="home-hero__panel home-hero__panel--split">
          <div className="home-hero__col-text">
            <h1 className="home-hero__title font-display">
              <span className="home-hero__title-line">복잡한 금융 계산</span>
              <span className="home-hero__title-line home-hero__title-line--accent">
                1분이면 끝
              </span>
            </h1>

            <p className="home-hero__lead">
              <span className="home-hero__lead-part">정부 고시·법정 공식 기준으로 정확하게.</span>
              <span className="home-hero__lead-part">가입 없이, 브라우저에서 바로 계산하세요.</span>
            </p>

            <div className="home-hero__cta">
              <Link href="/salary" className="inline-reset btn-hero-primary">
                <span>연봉 실수령액 계산하기</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <aside className="home-hero__col-preview" aria-label="연봉 5,000만원 기준 월 실수령액 미리보기">
            <div className="home-hero__preview-card">
              <p className="home-hero__preview-header">
                월 실수령액 · 연봉 5,000만원 기준
              </p>
              <p className="home-hero__preview-amount tabular">
                {fmtWon(heroPreview.monthlyNet)}
                <span className="home-hero__preview-unit">원</span>
              </p>

              <div className="home-hero__preview-stats">
                <div className="home-hero__preview-stat">
                  <span className="home-hero__preview-stat-label">세전 월급</span>
                  <span className="home-hero__preview-stat-value tabular">{fmtWon(heroPreview.monthlyGross)}원</span>
                </div>
                <div className="home-hero__preview-stat">
                  <span className="home-hero__preview-stat-label">연 실수령</span>
                  <span className="home-hero__preview-stat-value tabular">{fmtWon(heroPreview.annualNet)}원</span>
                </div>
                <div className="home-hero__preview-stat">
                  <span className="home-hero__preview-stat-label">총 공제</span>
                  <span className="home-hero__preview-stat-value home-hero__preview-stat-value--negative tabular">
                    −{fmtWon(heroPreview.totalDeduction)}원
                  </span>
                </div>
              </div>

              <div className="home-hero__preview-chips">
                <div className="home-hero__preview-chip">
                  <span className="home-hero__preview-chip-label">국민연금 4.75%</span>
                  <span className="home-hero__preview-chip-value tabular" style={{ color: '#3ee0a5' }}>
                    {fmtWon(heroPreview.pension)}원
                  </span>
                </div>
                <div className="home-hero__preview-chip">
                  <span className="home-hero__preview-chip-label">건강보험 3.595%</span>
                  <span className="home-hero__preview-chip-value tabular" style={{ color: '#6bafff' }}>
                    {fmtWon(heroPreview.health)}원
                  </span>
                </div>
                <div className="home-hero__preview-chip">
                  <span className="home-hero__preview-chip-label">근로소득세</span>
                  <span className="home-hero__preview-chip-value tabular" style={{ color: '#fcc73e' }}>
                    {fmtWon(heroPreview.incomeTax)}원
                  </span>
                </div>
                <div className="home-hero__preview-chip">
                  <span className="home-hero__preview-chip-label">총 공제</span>
                  <span className="home-hero__preview-chip-value tabular" style={{ color: '#ef7e7e' }}>
                    {fmtWon(heroPreview.totalDeduction)}원
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CALCULATORS */}
      <section id="calculators" className="home-section" aria-label="계산기 목록">
        <header className="section-header">
          <p className="section-label">CALCULATORS</p>
          <h2 className="section-title">지금 필요한 계산기</h2>
        </header>

        <div className="home-calc-grid">
          {calculators.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`home-calc-card card card-hover group mf-rise mf-rise-d${Math.min(4, Math.floor(i / 2) + 1)}`}
              style={{
                borderTop: `2px solid ${c.color}`,
                boxShadow: `0 0 0 1px ${c.color}40`,
              }}
            >
              <div
                aria-hidden
                className="home-calc-card__glow"
                style={{ background: `radial-gradient(circle, ${c.color}55 0%, transparent 70%)` }}
              />
              <div className="home-calc-card__top">
                <div
                  className="home-calc-card__icon"
                  style={{
                    color: c.color,
                    background: `linear-gradient(135deg, ${c.color}22 0%, ${c.color}08 100%)`,
                    border: `1px solid ${c.color}30`,
                  }}
                >
                  <c.Icon size={20} strokeWidth={1.7} />
                </div>
                <span
                  className="home-calc-card__tag"
                  style={{ color: c.color, background: `${c.color}12`, border: `1px solid ${c.color}25` }}
                >
                  {c.tag}
                </span>
              </div>
              <h3 className="home-calc-card__label">{c.label}</h3>
              <p className="home-calc-card__desc">{c.desc}</p>
              <span className="home-calc-card__link">
                계산하기
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="home-section" aria-label="서비스 신뢰">
        <header className="section-header">
          <p className="section-label">WHY MONEYFIT</p>
          <h2 className="section-title">믿고 쓰는 계산기</h2>
        </header>
        <div className="home-trust-grid">
          {trustItems.map((item) => (
            <div key={item.title} className="home-trust-card">
              <div className="home-trust-card__icon" style={{ color: item.accent }}>
                <item.Icon size={20} strokeWidth={1.7} />
              </div>
              <h3 className="home-trust-card__title">{item.title}</h3>
              <p className="home-trust-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <HomeGuideHub />
    </div>
  )
}
