import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://n-job-studio.vercel.app'),
  title: '주택담보대출 이자 계산기 — 원리금균등·원금균등·만기일시',
  description: '3억·5억 원리금균등·원금균등·만기일시 상환 방식을 비교하고 총 이자와 월 납입금을 계산합니다. 금리 변동 시뮬레이션.',
  keywords: ['주담대 계산기', '대출 이자 계산기', '원리금균등 상환', '원금균등 상환', '주택담보대출', '월 납입금 계산'],
  authors: [{ name: '머니핏 계산기' }],
  openGraph: {
    title: '주택담보대출 이자 계산기',
    description: '원리금균등·원금균등·만기일시 3가지 방식 총 이자 비교',
    url: 'https://n-job-studio.vercel.app/mortgage',
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: 'https://n-job-studio.vercel.app/mortgage/opengraph-image', width: 1200, height: 630, alt: '주택담보대출 이자 계산기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '주택담보대출 이자 계산기',
    description: '원리금균등·원금균등·만기일시 3가지 방식 총 이자 비교',
    images: ['https://n-job-studio.vercel.app/mortgage/opengraph-image'],
  },
  alternates: { canonical: 'https://n-job-studio.vercel.app/mortgage' },
  robots: { index: true, follow: true },
}

export default function MortgageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
