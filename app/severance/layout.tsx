import Script from 'next/script'
import { buildBreadcrumbJsonLd, buildCalculatorMetadata, jsonLd } from '@/lib/seo'

export const metadata = buildCalculatorMetadata({
  path: '/severance',
  title: '퇴직금 계산기 — 2026년 근로기준법 제34조 기준',
  description:
    '입사일·퇴직일·월급·상여금을 입력하면 근로기준법 제34조에 따른 퇴직금을 정확히 계산합니다. 1일 평균임금 자동 산출, 근속 연수별 퇴직금 분석.',
  keywords: [
    '퇴직금 계산기',
    '퇴직금 얼마',
    '퇴직금 계산 방법',
    '2026 퇴직금',
    '근로기준법 퇴직금',
    '평균임금 계산',
    '1일 평균임금',
    '퇴직금 세금',
    '근속 연수',
  ],
  ogImagePath: '/severance/opengraph-image',
  ogTitle: '퇴직금 계산기 — 근로기준법 기준 자동 산출',
  ogDescription: '입사일·퇴직일·월급 입력 → 1일 평균임금·퇴직금 자동 계산. 근로기준법 제34조 기준.',
})

export default function SeveranceLayout({ children }: { children: React.ReactNode }) {
  const ld = buildBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '퇴직금 계산기', path: '/severance' },
  ])
  return (
    <>
      <Script
        id="severance-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
      />
      {children}
    </>
  )
}
