import Script from 'next/script'
import { buildBreadcrumbJsonLd, buildCalculatorMetadata, jsonLd } from '@/lib/seo'

export const metadata = buildCalculatorMetadata({
  path: '/savings',
  title: '적금·예금 이자 계산기 — 세후 수익 + ISA 비과세 비교',
  description:
    '단리·복리 선택, 이자소득세 15.4% 차감 후 실제 세후 만기 수령액을 계산합니다. 2026년 ISA 일반형 비과세 한도(500만원) 적용 비교까지.',
  keywords: [
    '적금 계산기',
    '예금 계산기',
    '적금 이자 계산',
    '이자소득세',
    '복리 계산기',
    '세후 이자',
    'ISA 비과세',
    '이자소득세 15.4%',
    '적금 만기 수령액',
    '단리 복리 비교',
  ],
  ogImagePath: '/savings/opengraph-image',
  ogTitle: '적금·예금 이자 계산기 — 세후 수익 + ISA 비교',
  ogDescription: '단리·복리, 이자소득세 15.4% 차감 후 세후 만기 수령액 계산. ISA 비과세 비교.',
})

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  const ld = buildBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '적금·예금 이자 계산기', path: '/savings' },
  ])
  return (
    <>
      <Script
        id="savings-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
      />
      {children}
    </>
  )
}
