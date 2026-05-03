import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

const SITE_URL = 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL('https://n-job-studio.vercel.app'),
  title: {
    default: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세·로또',
    template: '%s | 머니핏 계산기',
  },
  description: '2026년 최신 기준 연봉 실수령액, 주택담보대출 이자, 퇴직금, 적금 만기 이자, 전세월세 전환, 로또 번호 생성. 무료 한국 재테크 계산기 모음.',
  keywords: ['연봉 실수령액 계산기', '주담대 이자 계산기', '퇴직금 계산기', '적금 이자 계산기', '전월세 전환 계산기', '로또 번호 생성기', '2026 세금 계산기', '연봉 세후 계산', '퇴직금 얼마', '대출 이자 계산'],
  authors: [{ name: '머니핏 계산기', url: 'https://n-job-studio.vercel.app' }],
  creator: '머니핏 계산기',
  publisher: '머니핏 계산기',
  alternates: {
    canonical: 'https://n-job-studio.vercel.app',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: '머니핏 계산기',
    title: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세·로또',
    description: '2026년 최신 기준 한국 재테크 계산기 모음. 무료 · 실시간 계산 · 개인정보 보호.',
    // images: app/opengraph-image.tsx 가 자동으로 1200x630 동적 이미지를 생성
  },
  twitter: {
    card: 'summary_large_image',
    title: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세·로또',
    description: '2026년 최신 기준 한국 재테크 계산기 모음. 무료 · 실시간 계산.',
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
    },
  },
  verification: {
    google: 'nCoNcuMFFK-0Pu8G3aVSRSeEH4jXNT6ZjRAFURfpmfY',
  },
  other: {
    ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT
      ? { 'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT }
      : { 'google-adsense-account': 'ca-pub-2765055385218528' }),
    // Naver SEO
    'naver-site-verification': '',
  },
}

// JSON-LD 구조화 데이터
function StructuredData() {
  const calculators = [
    { name: '연봉 실수령액 계산기', path: '/salary',    desc: '2026년 4대보험·소득세 공제 후 실수령액' },
    { name: '대출 이자 계산기',     path: '/mortgage',  desc: '원리금균등·원금균등·만기일시 상환 시뮬레이션' },
    { name: '퇴직금 계산기',        path: '/severance', desc: '근로기준법 평균임금 기준 퇴직금 산정' },
    { name: '적금·예금 계산기',     path: '/savings',   desc: '단리·복리 + 이자소득세 15.4% 반영' },
    { name: '전월세 전환 계산기',   path: '/jeonse',    desc: '보증금·월세 전환율 계산' },
    { name: '로또 번호 생성기',     path: '/lotto',     desc: '랜덤 5조합 + 최근 당첨번호 분석' },
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: '머니핏 계산기',
        description: '2026년 최신 기준 한국 재테크 계산기 모음',
        inLanguage: 'ko-KR',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: '머니핏 계산기',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
      },
      {
        '@type': 'SoftwareApplication',
        name: '머니핏 계산기',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
        url: SITE_URL,
      },
      {
        '@type': 'ItemList',
        name: '재테크 계산기 목록',
        itemListElement: calculators.map((c, i) => ({
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-2765055385218528'
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* DNS prefetch + preconnect — AdSense TTFB 단축 */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
        <StructuredData />
      </head>
      <body className={inter.className}>
        <AnimatedBackground />
        {/* Google AdSense — env에 NEXT_PUBLIC_ADSENSE_CLIENT 설정 시에만 로드 */}
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
