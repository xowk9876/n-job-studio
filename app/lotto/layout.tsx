import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '로또 번호 생성기 — 무작위 번호 + 당첨 확률 분석',
  description: '무작위 로또 번호를 생성하고 당첨 확률을 분석합니다. 1등부터 5등까지 실제 당첨금과 확률을 확인하세요.',
  keywords: ['로또 번호 생성기', '로또 번호 추천', '로또 당첨 확률', '로또 시뮬레이션', '로또 번호 뽑기'],
  authors: [{ name: '머니핏 계산기' }],
  openGraph: {
    title: '로또 번호 생성기',
    description: '무작위 로또 번호 생성 + 1~5등 당첨 확률 분석',
    url: `${SITE}/lotto`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/lotto/opengraph-image`, width: 1200, height: 630, alt: '로또 번호 생성기' }],
  },
  twitter: { card: 'summary_large_image', title: '로또 번호 생성기', description: '무작위 로또 번호 생성 + 1~5등 당첨 확률 분석', images: [`${SITE}/lotto/opengraph-image`] },
  alternates: { canonical: `${SITE}/lotto` },
  robots: { index: true, follow: true },
}

export default function LottoLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
