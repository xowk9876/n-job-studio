import type { Metadata } from 'next'
import Script from 'next/script'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '주택담보대출 이자 계산기 — 원리금균등·원금균등·만기일시 비교',
  description: '대출 금액·금리·기간을 입력하면 원리금균등·원금균등·만기일시 3가지 상환 방식의 월 납입금과 총 이자를 한눈에 비교합니다. DSR 한도 자동 계산 포함.',
  keywords: ['주담대 계산기', '대출 이자 계산기', '원리금균등 상환', '원금균등 상환', '주택담보대출', '월 납입금 계산', 'DSR 계산기', '대출 상환 비교', '만기일시 상환', '대출 이자 비교'],
  authors: [{ name: '머니핏 계산기' }],
  category: 'finance',
  openGraph: {
    title: '주택담보대출 이자 계산기 — 3가지 상환방식 비교',
    description: '원리금균등·원금균등·만기일시 상환 월 납입금·총 이자 비교. DSR 한도 자동 계산.',
    url: `${SITE}/mortgage`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/mortgage/opengraph-image`, width: 1200, height: 630, alt: '머니핏 — 주택담보대출 이자 계산기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '주택담보대출 이자 계산기 — 3가지 상환방식 비교',
    description: '원리금균등·원금균등·만기일시 월 납입금·총 이자 비교.',
    images: [{ url: `${SITE}/mortgage/opengraph-image`, alt: '대출 이자 계산기' }],
  },
  alternates: { canonical: `${SITE}/mortgage` },
  robots: { index: true, follow: true },
}

function MortgageBreadcrumb() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE },
      { '@type': 'ListItem', position: 2, name: '대출 이자 계산기', item: `${SITE}/mortgage` },
    ],
  }
  return (
    <Script
      id="mortgage-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}

export default function MortgageLayout({ children }: { children: React.ReactNode }) {
  return <><MortgageBreadcrumb />{children}</>
}
