import type { Metadata } from 'next'
import Script from 'next/script'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '퇴직금 계산기 — 2026년 근로기준법 제34조 기준',
  description: '입사일·퇴직일·월급·상여금을 입력하면 근로기준법 제34조에 따른 퇴직금을 정확히 계산합니다. 1일 평균임금 자동 산출, 근속 연수별 퇴직금 분석.',
  keywords: ['퇴직금 계산기', '퇴직금 얼마', '퇴직금 계산 방법', '2026 퇴직금', '근로기준법 퇴직금', '평균임금 계산', '1일 평균임금', '퇴직금 세금', '근속 연수'],
  authors: [{ name: '머니핏 계산기' }],
  category: 'finance',
  openGraph: {
    title: '퇴직금 계산기 — 근로기준법 기준 자동 산출',
    description: '입사일·퇴직일·월급 입력 → 1일 평균임금·퇴직금 자동 계산. 근로기준법 제34조 기준.',
    url: `${SITE}/severance`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/severance/opengraph-image`, width: 1200, height: 630, alt: '머니핏 — 퇴직금 계산기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '퇴직금 계산기 — 근로기준법 기준',
    description: '입사일·퇴직일·월급 입력 → 1일 평균임금·퇴직금 자동 계산.',
    images: [{ url: `${SITE}/severance/opengraph-image`, alt: '퇴직금 계산기' }],
  },
  alternates: { canonical: `${SITE}/severance` },
  robots: { index: true, follow: true },
}

function SeveranceBreadcrumb() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE },
      { '@type': 'ListItem', position: 2, name: '퇴직금 계산기', item: `${SITE}/severance` },
    ],
  }
  return (
    <Script
      id="severance-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}

export default function SeveranceLayout({ children }: { children: React.ReactNode }) {
  return <><SeveranceBreadcrumb />{children}</>
}
