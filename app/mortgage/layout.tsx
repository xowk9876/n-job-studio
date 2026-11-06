import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/mortgage'
const guide = getGuideLinkForCalculator(PATH)
const name = '주택담보대출 이자 계산기'
const description = '대출 금액, 금리, 기간을 입력해 매달 갚을 원금과 이자를 확인하세요. 원리금균등·원금균등·만기일시 상환 방식의 총이자와 DSR 기준 예상 한도를 비교할 수 있어요.'

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '주택담보대출 이자 계산기 — 월 상환액·총이자 비교',
  description,
  ogImagePath: `${PATH}/opengraph-image`,
})

export default function MortgageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="mortgage-seo"
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
