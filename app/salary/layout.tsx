import type { Metadata } from 'next'
import Script from 'next/script'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '연봉 실수령액 계산기 — 2026년 4대보험·소득세 최신 기준',
  description: '2026년 4대보험 요율(국민연금 근로자 4.75%, 건강보험 3.595%, 장기요양보료의 13.14%, 고용보험 0.9%)과 근로소득세 간이세액표 기준으로 연봉 실수령액을 계산합니다. 비과세 식대·자녀세액공제 반영.',
  keywords: ['연봉 계산기', '연봉 실수령액', '세후 월급 계산', '4대보험 계산', '2026 연봉 세후', '월급 실수령', '실수령액 계산기', '세전 세후', '국민연금', '건강보험료'],
  authors: [{ name: '머니핏 계산기' }],
  category: 'finance',
  openGraph: {
    title: '연봉 실수령액 계산기 — 2026년 최신 기준',
    description: '4대보험·근로소득세 공제 후 세후 월급을 정확히 계산. 비과세 식대·자녀세액공제 반영.',
    url: `${SITE}/salary`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/salary/opengraph-image`, width: 1200, height: 630, alt: '머니핏 — 2026년 연봉 실수령액 계산기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '연봉 실수령액 계산기 — 2026년 최신 기준',
    description: '4대보험·근로소득세 공제 후 세후 월급을 정확히 계산.',
    images: [{ url: `${SITE}/salary/opengraph-image`, alt: '연봉 실수령액 계산기' }],
  },
  alternates: { canonical: `${SITE}/salary` },
  robots: { index: true, follow: true },
}

function SalaryBreadcrumb() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE },
      { '@type': 'ListItem', position: 2, name: '연봉 실수령액 계산기', item: `${SITE}/salary` },
    ],
  }
  return (
    <Script
      id="salary-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}

export default function SalaryLayout({ children }: { children: React.ReactNode }) {
  return <><SalaryBreadcrumb />{children}</>
}
