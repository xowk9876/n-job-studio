import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '전세↔월세 전환 계산기 — 2026년 법정 상한 기준',
  description: '전세 보증금을 월세로 전환할 때의 월세와 손익분기 전환율을 계산합니다. 법정 상한(기준금리+2%) 자동 적용.',
  keywords: ['전월세 전환 계산기', '전세 월세 전환', '전월세 전환율', '월세 계산기', '전세 계산기'],
  authors: [{ name: '머니핏 계산기' }],
  openGraph: {
    title: '전세↔월세 전환 계산기',
    description: '법정 상한 기준 전세·월세 손익분기 전환율 자동 계산',
    url: `${SITE}/jeonse`,
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: `${SITE}/jeonse/opengraph-image`, width: 1200, height: 630, alt: '전세↔월세 전환 계산기' }],
  },
  twitter: { card: 'summary_large_image', title: '전세↔월세 전환 계산기', description: '법정 상한 기준 전세·월세 손익분기 전환율 자동 계산', images: [`${SITE}/jeonse/opengraph-image`] },
  alternates: { canonical: `${SITE}/jeonse` },
  robots: { index: true, follow: true },
}

export default function JeonseLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
