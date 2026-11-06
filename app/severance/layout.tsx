import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/severance'
const guide = getGuideLinkForCalculator(PATH)
const name = '퇴직금 계산기'
const description = '입사일과 마지막 근무일, 월급과 상여금을 입력해 세전 퇴직금을 예상하세요. 계산에 사용한 재직일수와 평균임금·통상임금을 함께 확인할 수 있어요.'

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '퇴직금 계산기 — 근속기간·평균임금으로 세전 금액 계산',
  description,
  ogImagePath: `${PATH}/opengraph-image`,
})

export default function SeveranceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="severance-seo"
        breadcrumb={[
          { name: '홈', path: '/' },
          { name, path: PATH },
        ]}
        webApp={{
          path: PATH,
          name,
          description,
          guidePath: guide?.href,
        }}
      />
      {children}
    </>
  )
}
