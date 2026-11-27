import type { Metadata } from 'next'
import Link from 'next/link'
import { Wallet, Briefcase, Landmark, PiggyBank, KeyRound, Ticket, BookOpen, ArrowRight } from 'lucide-react'
import HomeAppShortcut from '@/components/home/HomeAppShortcut'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, jsonLd } from '@/lib/seo'
import { buildGoogleAlternates } from '@/lib/seo-platform'
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

const homeTitle = '머니핏 계산기 | 연봉 실수령액·퇴직금·대출 이자'
const homeDescription = '세후 월급과 퇴직금, 주담대 월 상환액, 예금·적금 만기액, 전월세 전환액을 계산하세요. 로또 번호 생성기도 이용할 수 있어요.'
const homeUrl = `${SITE_URL}/`

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: buildGoogleAlternates(homeUrl),
  openGraph: {
    type: 'website', locale: 'ko_KR', url: homeUrl, siteName: SITE_NAME,
    title: homeTitle, description: homeDescription,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image', title: homeTitle, description: homeDescription,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
}

const calculators = [
  {
    href: '/salary',
    label: '연봉 실수령액 계산기',
    desc: '연봉과 비과세 수당으로 세후 월급 확인',
    color: '#6bafff',
    Icon: Wallet,
  },
  {
    href: '/severance',
    label: '퇴직금 계산기',
    desc: '근속기간과 임금으로 예상 세전 퇴직금 확인',
    color: '#b8a4fa',
    Icon: Briefcase,
  },
  {
    href: '/mortgage',
    label: '대출 이자 계산기',
    desc: '상환 방식별 월 상환액과 총이자 비교',
    color: '#5eead4',
    Icon: Landmark,
  },
  {
    href: '/savings',
    label: '예금·적금 이자 계산기',
    desc: '단리·월복리와 세후 만기 수령액 비교',
    color: '#3ee0a5',
    Icon: PiggyBank,
  },
  {
    href: '/jeonse',
    label: '전월세 전환 계산기',
    desc: '보증금을 바꿨을 때의 월세 차이 확인',
    color: '#fcc73e',
    Icon: KeyRound,
  },
  {
    href: '/lotto',
    label: '로또 번호 생성기',
    desc: '6/45 번호 생성과 회차별 당첨번호 조회',
    color: '#f590c0',
    Icon: Ticket,
  },
]

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite', '@id': `${homeUrl}#website`, url: homeUrl, name: SITE_NAME,
      alternateName: ['머니핏', 'Moneyfit', 'Moneyfit Calculator', new URL(homeUrl).hostname],
      inLanguage: 'ko-KR', description: homeDescription,
      publisher: { '@id': `${homeUrl}#organization` },
    },
    {
      '@type': 'CollectionPage', '@id': `${homeUrl}#home`, url: homeUrl, name: homeTitle,
      isPartOf: { '@id': `${homeUrl}#website` },
      mainEntity: {
        '@type': 'ItemList', name: '머니핏 계산기 목록',
        itemListElement: calculators.map((calc, index) => ({
          '@type': 'ListItem', position: index + 1, name: calc.label, url: SITE_URL + calc.href,
        })),
      },
    },
  ],
}

export default function HomePage() {
  return (
    <div className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData) }} />
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
              <span className="home-hero__title-line home-hero__title-line--accent">
                머니핏 계산기
              </span>
            </h1>

            <p className="home-hero__lead">
              월급과 대출, 저축을 가입 없이 계산하세요.
            </p>

            <div className="home-hero__cta">
              <Link href="/salary" className="inline-reset btn-hero-primary">
                <span>연봉 실수령액 계산하기</span>
                <ArrowRight size={18} />
              </Link>
              <a href="#install-app" className="home-app__hero-link">홈 화면에 추가</a>
            </div>
          </div>

          <aside className="home-hero__col-preview" aria-label="연봉 5,000만원 기준 월 실수령액 미리보기">
            <div className="home-hero__preview-card">
              <p className="home-hero__preview-header">
                월 실수령액 예시 · 연봉 5,000만원
              </p>
              <p className="home-hero__preview-amount tabular">
                {fmtWon(heroPreview.monthlyNet)}
                <span className="home-hero__preview-unit">원</span>
              </p>

              <p className="home-hero__preview-note">본인 1인 · 비과세 수당 없음</p>
            </div>
          </aside>
        </div>
      </section>

      {/* CALCULATORS */}
      <section id="calculators" className="home-section" aria-label="계산기 목록">
        <header className="section-header">
          <h2 className="section-title">계산기 목록</h2>
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
                <ArrowRight size={16} aria-hidden />
              </div>
              <h3 className="home-calc-card__label">{c.label}</h3>
              <p className="home-calc-card__desc">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <HomeAppShortcut />

      <nav className="home-section" aria-label="재테크 가이드">
        <Link href="/guide" className="home-guide-link inline-reset">
          <BookOpen size={20} aria-hidden />
          재테크 가이드 보기
          <ArrowRight size={16} aria-hidden />
        </Link>
      </nav>
    </div>
  )
}
