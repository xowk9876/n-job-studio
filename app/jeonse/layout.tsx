import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://n-job-studio.vercel.app'),
  title: '전세↔월세 전환 계산기 — 2026년 법정 상한 기준',
  description: '전세 보증금을 월세로 전환할 때의 월세와 손익분기 전환율을 계산합니다. 법정 상한(기준금리+2%) 자동 적용.',
  keywords: ['전월세 전환 계산기', '전세 월세 전환', '전월세 전환율', '월세 계산기', '전세 계산기'],
  openGraph: {
    title: '전세↔월세 전환 계산기',
    description: '법정 상한 기준 전세·월세 손익분기 전환율 자동 계산',
    url: 'https://n-job-studio.vercel.app/jeonse',
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: 'https://n-job-studio.vercel.app/jeonse/opengraph-image', width: 1200, height: 630, alt: '전세↔월세 전환 계산기' }],
  },
  twitter: { card: 'summary_large_image', title: '전세↔월세 전환 계산기', description: '법정 상한 기준 전세·월세 손익분기 전환율 자동 계산', images: ['https://n-job-studio.vercel.app/jeonse/opengraph-image'] },
  alternates: { canonical: 'https://n-job-studio.vercel.app/jeonse' },
  robots: { index: true, follow: true },
}
export default function JeonseLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
