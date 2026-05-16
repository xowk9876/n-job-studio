import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '적금·예금 이자 계산기 — 세후 수익 계산',
  description: '단리·복리, 이자소득세 15.4% 차감 후 실제 세후 만기 수령액을 계산합니다. ISA 비과세 혜택 포함.',
  keywords: ['적금 계산기', '예금 계산기', '적금 이자 계산', '이자소득세', '복리 계산기', '세후 이자'],
  authors: [{ name: '머니핏 계산기' }],
  openGraph: {
    title: '적금·예금 이자 계산기',
    description: '단리·복리, 이자소득세 15.4% 차감 후 세후 만기 수령액 계산',
    url: `${SITE}/savings`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/savings/opengraph-image`, width: 1200, height: 630, alt: '적금·예금 이자 계산기' }],
  },
  twitter: { card: 'summary_large_image', title: '적금·예금 이자 계산기', description: '단리·복리, 이자소득세 15.4% 차감 후 세후 만기 수령액 계산', images: [`${SITE}/savings/opengraph-image`] },
  alternates: { canonical: `${SITE}/savings` },
  robots: { index: true, follow: true },
}

export default function SavingsLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
