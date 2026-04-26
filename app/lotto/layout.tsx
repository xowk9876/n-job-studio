import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://n-job-studio.vercel.app'),
  title: '로또 번호 생성기 — 무작위 번호 + 당첨 확률 분석',
  description: '무작위 로또 번호를 생성하고 당첨 확률을 분석합니다. 1등부터 5등까지 실제 당첨금과 확률을 확인하세요.',
  keywords: ['로또 번호 생성기', '로또 번호 추천', '로또 당첨 확률', '로또 시뮬레이션', '로또 번호 뽑기'],
  openGraph: {
    title: '로또 번호 생성기',
    description: '무작위 로또 번호 생성 + 1~5등 당첨 확률 분석',
    url: 'https://n-job-studio.vercel.app/lotto',
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: 'https://n-job-studio.vercel.app/lotto/opengraph-image', width: 1200, height: 630, alt: '로또 번호 생성기' }],
  },
  twitter: { card: 'summary_large_image', title: '로또 번호 생성기', description: '무작위 로또 번호 생성 + 1~5등 당첨 확률 분석', images: ['https://n-job-studio.vercel.app/lotto/opengraph-image'] },
  alternates: { canonical: 'https://n-job-studio.vercel.app/lotto' },
  robots: { index: true, follow: true },
}
export default function LottoLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }
