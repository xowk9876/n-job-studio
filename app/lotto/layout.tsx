import type { Metadata } from 'next'
import Script from 'next/script'
import { SITE_URL, jsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '로또 번호 생성기 — 최신 당첨번호·1~5등 안내',
  description:
    '동행복권 최신 추첨 회차·당첨번호(6+보너스)를 자동 표시하고, 6/45 번호를 생성합니다. 1등~5등 일치 조건, 당첨금 수령·세금(200만 원 이하 비과세) 안내. 당첨을 보장하지 않는 오락용 도구입니다.',
  keywords: [
    '로또 번호 생성기',
    '로또 최신 당첨번호',
    '로또 당첨번호 조회',
    '로또 6/45',
    '로또 당첨 등위',
    '로또 당첨금 수령',
    '로또 세금',
    '동행복권',
  ],
  authors: [{ name: '머니핏 계산기' }],
  category: 'entertainment',
  openGraph: {
    title: '로또 번호 생성기 — 최신 당첨번호·등위 안내',
    description: '최신 추첨 당첨번호 자동 표시 + 6/45 번호 생성. 1~5등 조건·수령·세금 안내.',
    url: `${SITE_URL}/lotto`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE_URL}/lotto/opengraph-image`, width: 1200, height: 630, alt: '머니핏 — 로또 번호 생성기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '로또 번호 생성기 — 최신 당첨번호',
    description: '동행복권 최신 당첨번호 + 번호 생성. 1~5등·수령·세금 안내.',
    images: [{ url: `${SITE_URL}/lotto/opengraph-image`, alt: '로또 번호 생성기' }],
  },
  alternates: { canonical: `${SITE_URL}/lotto` },
  robots: { index: true, follow: true },
}

function LottoBreadcrumb() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '로또 번호 생성기', item: `${SITE_URL}/lotto` },
    ],
  }
  return (
    <Script
      id="lotto-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
    />
  )
}

export default function LottoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LottoBreadcrumb />
      {children}
    </>
  )
}
