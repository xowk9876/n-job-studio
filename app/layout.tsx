import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PaperBackground from '@/components/layout/AnimatedBackground'

const SITE_URL = 'https://n-job-studio.vercel.app'

export const viewport: Viewport = {
  themeColor: '#06070b',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: '머니핏 계산기',
  title: {
    default: '머니핏 계산기 — 2026년 연봉·대출·퇴직금·적금·전월세·로또',
    template: '%s | 머니핏 계산기',
  },
  description:
    '2026년 최신 세율·법령 기준. 연봉 실수령액, 주택담보대출 이자, 퇴직금, 적금 복리 이자, 전월세 전환, 로또 번호까지 무료로. 광고 팝업 없이 결과부터 보여주는 한국 재테크 계산기 — 머니핏 계산기.',
  keywords: [
    '머니핏', '머니핏 계산기',
    '연봉 실수령액 계산기', '연봉 세후 계산', '2026 연봉 계산기', '세후 월급 계산',
    '주담대 이자 계산기', '주택담보대출 계산기', '원리금균등 계산', '원금균등 계산', 'DSR 계산',
    '퇴직금 계산기', '근로기준법 퇴직금', '평균임금 계산',
    '적금 이자 계산기', '예금 이자 계산기', '복리 계산기', '이자소득세 15.4%',
    '전월세 전환 계산기', '전세 월세 전환율',
    '로또 번호 생성기', '로또 자동 추천',
    '2026 4대보험 요율', '건강보험료 계산', '국민연금 계산', '고용보험', '장기요양보험료', '자녀세액공제',
  ],
  authors: [{ name: '머니핏 계산기', url: SITE_URL }],
  creator: '머니핏 계산기',
  publisher: '머니핏 계산기',
  alternates: { canonical: SITE_URL, languages: { 'ko-KR': SITE_URL } },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: '머니핏 계산기',
    title: '머니핏 계산기 — 2026년 한국 재테크 계산기',
    description: '2026년 최신 세율·법령으로 정확하게. 연봉·대출·퇴직금·적금·전월세·로또 무료 계산.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '머니핏 계산기 — 2026년 한국 재테크 계산기',
    description: '2026년 최신 세율·법령으로 정확하게. 연봉·대출·퇴직금·적금·전월세·로또 무료 계산.',
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
  verification: {
    google: 'nCoNcuMFFK-0Pu8G3aVSRSeEH4jXNT6ZjRAFURfpmfY',
    other: {
      'naver-site-verification': 'c2a79ddedc551ab5b59880ec8987955d4b2240d5',
    },
  },
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2765055385218528',
  },
}

function StructuredData() {
  const calcs = [
    { name: '연봉 실수령액 계산기', path: '/salary',    desc: '2026년 4대보험·소득세 공제 후 실수령액' },
    { name: '대출 이자 계산기',     path: '/mortgage',  desc: '원리금균등·원금균등·만기일시 상환' },
    { name: '퇴직금 계산기',        path: '/severance', desc: '근로기준법 평균임금 기준 퇴직금' },
    { name: '적금·예금 계산기',     path: '/savings',   desc: '단리·복리 + 이자소득세 15.4%' },
    { name: '전월세 전환 계산기',   path: '/jeonse',    desc: '전세↔월세 상호 전환율 계산' },
    { name: '로또 번호 생성기',     path: '/lotto',     desc: '랜덤 조합 + 추첨 회차·시각' },
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
        description: '2026년 최신 세율·법령 기준 한국 재테크 계산기',
        inLanguage: 'ko-KR',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: '머니핏 계산기',
        alternateName: '머니핏',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
        sameAs: ['https://www.instagram.com/tae_system/'],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'bhd03014@gmail.com',
          contactType: 'customer support',
          availableLanguage: ['Korean'],
        },
      },
      {
        '@type': 'ItemList',
        name: '재테크 계산기 목록',
        itemListElement: calcs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          description: c.desc,
          url: `${SITE_URL}${c.path}`,
        })),
      },
    ],
  }
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
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
