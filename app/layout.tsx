import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PaperBackground from '@/components/layout/AnimatedBackground'
import { DEFAULT_OG_IMAGE, SEO_UPDATED_AT, SITE_NAME, SITE_URL, guideItems, jsonLd, RSS_FEED_URL } from '@/lib/seo'
import { buildGoogleAlternates, buildNaverMeta, buildSiteVerifications, formatPageTitle } from '@/lib/seo-platform'

export const viewport: Viewport = {
  themeColor: '#06070b',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: '머니핏 계산기',
  title: {
    default: '머니핏 계산기 — 2026년 연봉 실수령액·대출 이자·퇴직금·적금·전월세·로또 계산기',
    template: '%s | 머니핏 계산기',
  },
  description:
    '2026년 최신 세율·4대보험 요율·법령 기준으로 정확하게 계산합니다. 연봉 실수령액, 주택담보대출 이자(DSR), 퇴직금, 적금·예금 복리 이자(ISA 비교), 전월세 전환율, 로또 번호 생성까지. 가입 없이 무료로 바로 사용하는 한국 재테크 계산기.',
  keywords: [
    '머니핏', '머니핏 계산기', '재테크 계산기', '무료 계산기',
    '연봉 실수령액 계산기', '연봉 세후 계산', '2026 연봉 계산기', '세후 월급 계산', '실수령액',
    '주담대 이자 계산기', '주택담보대출 계산기', '원리금균등 상환', '원금균등 상환', 'DSR 계산기', '대출 이자 비교',
    '퇴직금 계산기', '근로기준법 퇴직금', '평균임금 계산', '퇴직금 세금',
    '적금 이자 계산기', '예금 이자 계산기', '복리 계산기', '이자소득세 15.4%', 'ISA 비과세',
    '전월세 전환 계산기', '전세 월세 전환율', '법정 전환율',
    '로또 번호 생성기', '로또 자동 추천', '로또 당첨 등위',
    '2026 4대보험 요율', '건강보험료 계산', '국민연금 계산', '고용보험', '장기요양보험료', '자녀세액공제',
    '2026 세율', '소득세 계산', '재테크', '부업 계산기',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'finance',
  alternates: buildGoogleAlternates(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: '머니핏 계산기 — 2026년 한국 재테크 필수 계산기 6종',
    description: '연봉 실수령액·대출 이자·퇴직금·적금·전월세·로또 — 2026년 최신 세율 기준, 가입 없이 무료. 결과부터 바로 보여주는 계산기.',
    images: [{
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: '머니핏 계산기 — 2026년 한국 재테크 계산기 메인 이미지',
      type: 'image/png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '머니핏 계산기 — 2026년 재테크 필수 계산기 6종',
    description: '연봉·대출·퇴직금·적금·전월세·로또 — 2026년 최신 세율, 무료. 바로 결과 확인.',
    images: [{
      url: DEFAULT_OG_IMAGE,
      alt: '머니핏 계산기 소셜 미리보기 이미지',
    }],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: buildSiteVerifications(),
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2765055385218528',
    ...buildNaverMeta(
      formatPageTitle('2026년 연봉 실수령액·대출·퇴직금·적금·전월세·로또 계산기'),
      '2026년 최신 세율·4대보험 요율·법령 기준으로 정확하게 계산합니다. 연봉 실수령액, 주택담보대출 이자(DSR), 퇴직금, 적금·예금 복리 이자(ISA 비교), 전월세 전환율, 로또 번호 생성까지.',
    ),
  },
}

function StructuredData() {
  const calcs = [
    { name: '연봉 실수령액 계산기', path: '/salary',    desc: '2026년 4대보험(국민연금·건강보험·고용보험·장기요양)과 근로소득세를 공제한 실수령액 계산', category: 'FinanceApplication', keywords: '연봉 계산기, 세후 월급, 4대보험' },
    { name: '주택담보대출 이자 계산기', path: '/mortgage', desc: '원리금균등·원금균등·만기일시 3가지 상환 방식 비교 및 월 납입금·총 이자 계산', category: 'FinanceApplication', keywords: '대출 계산기, 주담대, DSR' },
    { name: '퇴직금 계산기',        path: '/severance', desc: '근로기준법 제34조 기준 평균임금 산출 및 퇴직금 자동 계산', category: 'FinanceApplication', keywords: '퇴직금 계산, 평균임금' },
    { name: '적금·예금 이자 계산기', path: '/savings',   desc: '단리·복리 이자소득세 15.4% 차감 후 세후 만기 수령액 계산, ISA 비과세 비교', category: 'FinanceApplication', keywords: '적금 이자, 복리 계산기, ISA' },
    { name: '전월세 전환 계산기',   path: '/jeonse',    desc: '주택임대차보호법 법정 전환율(기준금리+2%) 기반 전세↔월세 양방향 환산', category: 'FinanceApplication', keywords: '전월세 전환, 전환율 계산' },
    { name: '로또 번호 생성기',     path: '/lotto',     desc: '동행복권 최신 회차 당첨번호 조회, 6/45 번호 생성, 1~5등 당첨 등위·수령·세금 안내', category: 'GameApplication', keywords: '로또 번호, 로또 당첨번호, 로또 등위, 당첨금 수령' },
  ]
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: '머니핏 계산기',
        alternateName: ['머니핏', 'Moneyfit', 'Moneyfit Calculator'],
        description: '2026년 최신 세율·법령 기준 한국 재테크 계산기. 연봉 실수령액, 대출 이자, 퇴직금, 적금, 전월세, 로또까지 무료.',
        inLanguage: 'ko-KR',
        publisher: { '@id': `${SITE_URL}/#organization` },
        datePublished: '2025-12-01',
        dateModified: SEO_UPDATED_AT,
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: '머니핏 계산기',
        alternateName: '머니핏',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
        },
        sameAs: ['https://www.instagram.com/tae_system/'],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'bhd03014@gmail.com',
          contactType: 'customer support',
          availableLanguage: ['Korean'],
        },
        foundingDate: '2025',
        knowsAbout: [
          '한국 소득세법', '4대보험 요율', '근로기준법',
          '주택임대차보호법', '금융 계산', '재테크',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
        ],
      },
      ...calcs.map((c) => ({
        '@type': 'WebApplication',
        '@id': `${SITE_URL}${c.path}/#app`,
        name: c.name,
        url: `${SITE_URL}${c.path}`,
        description: c.desc,
        applicationCategory: c.category,
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
        author: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'ko-KR',
        keywords: c.keywords,
        datePublished: '2025-12-01',
        dateModified: SEO_UPDATED_AT,
      })),
      {
        '@type': 'ItemList',
        name: '재테크 계산기 목록',
        numberOfItems: calcs.length,
        itemListElement: calcs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          description: c.desc,
          url: `${SITE_URL}${c.path}`,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#guide-list`,
        name: '재테크 실전 가이드',
        numberOfItems: guideItems.length,
        itemListElement: guideItems.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: g.title,
          description: g.description,
          url: `${SITE_URL}/guide/${g.slug}`,
        })),
      },
    ],
  }
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2765055385218528'
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
        <link rel="alternate" hrefLang="ko-KR" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="alternate" type="application/rss+xml" title="네이버 서치어드바이저 RSS" href={RSS_FEED_URL} />
        <link rel="alternate" type="application/rss+xml" title="Google Discover·RSS 리더" href={RSS_FEED_URL} />
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <StructuredData />
      </head>
      <body className="app-shell">
        <PaperBackground />
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="relative z-10 min-h-[70vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
