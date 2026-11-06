import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/salary'
const guide = getGuideLinkForCalculator(PATH)
const name = '연봉 실수령액 계산기'
const description = '연봉과 비과세 수당, 가족 수를 입력해 세후 월급과 연간 실수령액을 예상하세요. 4대보험과 근로소득세 공제액을 항목별로 확인할 수 있어요.'

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '2026 연봉 실수령액 계산기 — 세후 월급과 공제액',
  description,
  ogImagePath: `${PATH}/opengraph-image`,
})

export default function SalaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="salary-seo"
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
