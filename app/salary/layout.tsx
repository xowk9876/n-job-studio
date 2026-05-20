import Script from 'next/script'
import { buildBreadcrumbJsonLd, buildCalculatorMetadata, jsonLd } from '@/lib/seo'

export const metadata = buildCalculatorMetadata({
  path: '/salary',
  title: '연봉 실수령액 계산기 — 2026년 4대보험·소득세 최신 기준',
  description:
    '2026년 4대보험 요율(국민연금 근로자 4.75%, 건강보험 3.595%, 장기요양보료의 13.14%, 고용보험 0.9%)과 근로소득세 간이세액표 기준으로 연봉 실수령액을 계산합니다. 비과세 식대·자녀세액공제 반영.',
  keywords: [
    '연봉 계산기',
    '연봉 실수령액',
    '세후 월급 계산',
    '4대보험 계산',
    '2026 연봉 세후',
    '월급 실수령',
    '실수령액 계산기',
    '세전 세후',
    '국민연금',
    '건강보험료',
  ],
  ogImagePath: '/salary/opengraph-image',
  ogTitle: '연봉 실수령액 계산기 — 2026년 최신 기준',
  ogDescription: '4대보험·근로소득세 공제 후 세후 월급을 정확히 계산. 비과세 식대·자녀세액공제 반영.',
})

export default function SalaryLayout({ children }: { children: React.ReactNode }) {
  const ld = buildBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '연봉 실수령액 계산기', path: '/salary' },
  ])
  return (
    <>
      <Script
        id="salary-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
      />
      {children}
    </>
  )
}
