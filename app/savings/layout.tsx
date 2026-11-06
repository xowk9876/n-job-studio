import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/savings'
const guide = getGuideLinkForCalculator(PATH)
const name = '예금·적금 이자 계산기'
const description = '매월 붓는 적금과 목돈을 넣는 예금의 만기 수령액을 계산하세요. 납입액·금리·기간에 따른 단리와 월복리 이자, 세후에 받을 금액을 비교할 수 있어요.'

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '예금·적금 이자 계산기 — 세후 만기 수령액 비교',
  description,
  ogImagePath: `${PATH}/opengraph-image`,
})

export default function SavingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="savings-seo"
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
