import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: '부업 세금 리스크 예측기 — N잡러 건보료·종합소득세 시뮬레이션',
  description: '본업 연봉과 부업 수익을 입력하면 추가 종합소득세, 건보료 피부양자 탈락 위험도, 지역가입자 전환 시 보험료를 실시간 예측합니다.',
  keywords: ['부업 세금', 'N잡 세금', '건보료 피부양자', '종합소득세 계산', '부업 건강보험료', '지역가입자 보험료'],
  authors: [{ name: '머니핏 계산기' }],
  alternates: { canonical: `${SITE}/tax-risk` },
  robots: { index: true, follow: true },
}

export default function TaxRiskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
