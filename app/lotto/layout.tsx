import type { Metadata } from 'next'
import Script from 'next/script'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '로또 번호 생성기 — 무작위 번호 + 1~5등 당첨 확률 분석',
  description: '무작위 로또 6/45 번호를 생성하고 1등(8,145,060분의 1)부터 5등까지 실제 당첨 확률과 예상 당첨금을 분석합니다. 최신 추첨 회차 정보 포함.',
  keywords: ['로또 번호 생성기', '로또 번호 추천', '로또 당첨 확률', '로또 시뮬레이션', '로또 번호 뽑기', '로또 자동', '6/45 로또', '로또 당첨금', '로또 세금'],
  authors: [{ name: '머니핏 계산기' }],
  category: 'entertainment',
  openGraph: {
    title: '로또 번호 생성기 — 당첨 확률 분석',
    description: '무작위 6/45 번호 생성 + 1~5등 당첨 확률·예상 당첨금 분석.',
    url: `${SITE}/lotto`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/lotto/opengraph-image`, width: 1200, height: 630, alt: '머니핏 — 로또 번호 생성기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '로또 번호 생성기 — 당첨 확률 분석',
    description: '무작위 6/45 번호 생성 + 1~5등 당첨 확률 분석.',
    images: [{ url: `${SITE}/lotto/opengraph-image`, alt: '로또 번호 생성기' }],
  },
  alternates: { canonical: `${SITE}/lotto` },
  robots: { index: true, follow: true },
}

function LottoBreadcrumb() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE },
      { '@type': 'ListItem', position: 2, name: '로또 번호 생성기', item: `${SITE}/lotto` },
    ],
  }
  return (
    <Script
      id="lotto-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}

export default function LottoLayout({ children }: { children: React.ReactNode }) {
  return <><LottoBreadcrumb />{children}</>
}
