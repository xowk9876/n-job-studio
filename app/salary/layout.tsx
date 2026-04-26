import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '연봉 실수령액 계산기 — 2026년 최신 기준',
  description: '연봉에서 4대보험(국민연금·건강보험·고용보험)과 근로소득세를 공제한 실수령액을 정확히 계산합니다. 수당·비과세 항목 포함.',
  keywords: ['연봉 계산기', '연봉 실수령액', '세후 월급 계산', '4대보험 계산', '2026 연봉 세후', '월급 실수령'],
  authors: [{ name: '머니핏 계산기' }],
  openGraph: {
    title: '연봉 실수령액 계산기',
    description: '2026년 최신 기준 4대보험·소득세 공제 후 실수령액 계산',
    url: 'https://n-job-studio.vercel.app/salary',
    siteName: '머니핏 계산기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '연봉 실수령액 계산기',
    description: '2026년 최신 기준 4대보험·소득세 공제 후 실수령액 계산',
  },
  alternates: { canonical: 'https://n-job-studio.vercel.app/salary' },
  robots: { index: true, follow: true },
}

export default function SalaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
