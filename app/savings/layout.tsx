import type { Metadata } from 'next'
import Script from 'next/script'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '적금·예금 이자 계산기 — 세후 수익 + ISA 비과세 비교',
  description: '단리·복리 선택, 이자소득세 15.4% 차감 후 실제 세후 만기 수령액을 계산합니다. 2026년 ISA 일반형 비과세 한도(500만원) 적용 비교까지.',
  keywords: ['적금 계산기', '예금 계산기', '적금 이자 계산', '이자소득세', '복리 계산기', '세후 이자', 'ISA 비과세', '이자소득세 15.4%', '적금 만기 수령액', '단리 복리 비교'],
  authors: [{ name: '머니핏 계산기' }],
  category: 'finance',
  openGraph: {
    title: '적금·예금 이자 계산기 — 세후 수익 + ISA 비교',
    description: '단리·복리, 이자소득세 15.4% 차감 후 세후 만기 수령액 계산. ISA 비과세 비교.',
    url: `${SITE}/savings`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/savings/opengraph-image`, width: 1200, height: 630, alt: '머니핏 — 적금·예금 이자 계산기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '적금·예금 이자 계산기 — 세후 수익 + ISA 비교',
    description: '단리·복리, 이자소득세 15.4% 차감 후 세후 만기 수령액 계산.',
    images: [{ url: `${SITE}/savings/opengraph-image`, alt: '적금 이자 계산기' }],
  },
  alternates: { canonical: `${SITE}/savings` },
  robots: { index: true, follow: true },
}

function SavingsBreadcrumb() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE },
      { '@type': 'ListItem', position: 2, name: '적금·예금 이자 계산기', item: `${SITE}/savings` },
    ],
  }
  return (
    <Script
      id="savings-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  return <><SavingsBreadcrumb />{children}</>
}
