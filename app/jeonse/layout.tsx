import type { Metadata } from 'next'
import Script from 'next/script'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '전세↔월세 전환 계산기 — 2026년 법정 전환율(기준금리+2%)',
  description: '전세 보증금을 월세로, 월세를 전세 보증금으로 양방향 전환합니다. 주택임대차보호법 법정 상한 전환율(기준금리+2%) 자동 적용. 손익분기 전환율 분석.',
  keywords: ['전월세 전환 계산기', '전세 월세 전환', '전월세 전환율', '월세 계산기', '전세 계산기', '법정 전환율', '기준금리', '전세 보증금', '월세 환산', '임대차보호법'],
  authors: [{ name: '머니핏 계산기' }],
  category: 'finance',
  openGraph: {
    title: '전세↔월세 전환 계산기 — 법정 전환율 자동 적용',
    description: '법정 상한(기준금리+2%) 기준 전세↔월세 양방향 전환 + 손익분기 분석.',
    url: `${SITE}/jeonse`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/jeonse/opengraph-image`, width: 1200, height: 630, alt: '머니핏 — 전세↔월세 전환 계산기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '전세↔월세 전환 계산기 — 법정 전환율 자동 적용',
    description: '법정 상한 기준 전세↔월세 양방향 전환 + 손익분기 분석.',
    images: [{ url: `${SITE}/jeonse/opengraph-image`, alt: '전월세 전환 계산기' }],
  },
  alternates: { canonical: `${SITE}/jeonse` },
  robots: { index: true, follow: true },
}

function JeonseBreadcrumb() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE },
      { '@type': 'ListItem', position: 2, name: '전월세 전환 계산기', item: `${SITE}/jeonse` },
    ],
  }
  return (
    <Script
      id="jeonse-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}

export default function JeonseLayout({ children }: { children: React.ReactNode }) {
  return <><JeonseBreadcrumb />{children}</>
}
