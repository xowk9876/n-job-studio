import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/savings'
const guide = getGuideLinkForCalculator(PATH)
const name = '예금·적금 이자 계산기'
const description = '적금은 월 납입액, 예금은 예치 원금을 입력하세요. 단리와 월복리로 계산한 세후 이자와 만기 수령액을 비교할 수 있어요.'

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
