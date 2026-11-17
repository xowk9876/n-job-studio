import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/mortgage'
const guide = getGuideLinkForCalculator(PATH)
const name = '주택담보대출 원리금 계산기'
const description = '주담대 첫 달 원금과 이자, 마지막 달 납입액을 확인하세요. 원리금균등·원금균등·만기일시 상환표와 총이자를 비교해 보세요.'

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '주택담보대출 원리금 계산기 — 월 상환액과 대출 이자',
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
