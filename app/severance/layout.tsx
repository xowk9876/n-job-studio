import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://n-job-studio.vercel.app'),
  title: '퇴직금 계산기 — 2026년 근로기준법 기준',
  description: '입사일·퇴직일·월급·상여금을 입력하면 근로기준법에 따른 퇴직금을 정확히 계산합니다. 1일 평균임금 자동 산출.',
  keywords: ['퇴직금 계산기', '퇴직금 얼마', '퇴직금 계산 방법', '2026 퇴직금', '근로기준법 퇴직금'],
  openGraph: {
    title: '퇴직금 계산기',
    description: '근로기준법 기준 1일 평균임금 자동 산출 퇴직금 계산',
    url: 'https://n-job-studio.vercel.app/severance',
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: 'https://n-job-studio.vercel.app/severance/opengraph-image', width: 1200, height: 630, alt: '퇴직금 계산기' }],
  },
  twitter: { card: 'summary_large_image', title: '퇴직금 계산기', description: '근로기준법 기준 1일 평균임금 자동 산출 퇴직금 계산', images: ['https://n-job-studio.vercel.app/severance/opengraph-image'] },
  alternates: { canonical: 'https://n-job-studio.vercel.app/severance' },
  robots: { index: true, follow: true },
}
export default function SeveranceLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
