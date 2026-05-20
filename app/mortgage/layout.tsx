import Script from 'next/script'
import { buildBreadcrumbJsonLd, buildCalculatorMetadata, jsonLd } from '@/lib/seo'

export const metadata = buildCalculatorMetadata({
  path: '/mortgage',
  title: '주택담보대출 이자 계산기 — 원리금균등·원금균등·만기일시 비교',
  description:
    '대출 금액·금리·기간을 입력하면 원리금균등·원금균등·만기일시 3가지 상환 방식의 월 납입금과 총 이자를 한눈에 비교합니다. DSR 한도 자동 계산 포함.',
  keywords: [
    '주담대 계산기',
    '대출 이자 계산기',
    '원리금균등 상환',
    '원금균등 상환',
    '주택담보대출',
    '월 납입금 계산',
    'DSR 계산기',
    '대출 상환 비교',
    '만기일시 상환',
    '대출 이자 비교',
  ],
  ogImagePath: '/mortgage/opengraph-image',
  ogTitle: '주택담보대출 이자 계산기 — 3가지 상환방식 비교',
  ogDescription: '원리금균등·원금균등·만기일시 상환 월 납입금·총 이자 비교. DSR 한도 자동 계산.',
})

export default function MortgageLayout({ children }: { children: React.ReactNode }) {
  const ld = buildBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '대출 이자 계산기', path: '/mortgage' },
  ])
  return (
    <>
      <Script
        id="mortgage-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
      />
      {children}
    </>
  )
}
