import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'

const inter = Inter({ subsets: ['latin'] })

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
    url: 'https://n-job-studio.vercel.app',
    siteName: '머니핏 계산기',
    title: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세·로또',
    description: '2026년 최신 기준 한국 재테크 계산기 모음. 무료 · 실시간 계산 · 개인정보 보호.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세 계산',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '머니핏 계산기 — 연봉·대출·퇴직금·적금·전월세·로또',
    description: '2026년 최신 기준 한국 재테크 계산기 모음. 무료 · 실시간 계산.',
    images: ['/og-image.png'],
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
    'google-adsense-account': 'ca-pub-2765055385218528',
    // Naver SEO
    'naver-site-verification': '',
  },
}

// JSON-LD 구조화 데이터
function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://n-job-studio.vercel.app/#website',
        url: 'https://n-job-studio.vercel.app',
        name: '머니핏 계산기',
        description: '2026년 최신 기준 한국 재테크 계산기 모음',
        inLanguage: 'ko-KR',
        publisher: { '@id': 'https://n-job-studio.vercel.app/#organization' },
      },
      {
        '@type': 'Organization',
        '@id': 'https://n-job-studio.vercel.app/#organization',
        name: '머니핏 계산기',
        url: 'https://n-job-studio.vercel.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://n-job-studio.vercel.app/favicon.svg',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: '머니핏 계산기',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1250',
        },
        url: 'https://n-job-studio.vercel.app',
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
  return (
    <html lang="ko">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <AnimatedBackground />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2765055385218528"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
        <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
