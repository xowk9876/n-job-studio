import type { Metadata } from 'next'
import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/lotto'
const guide = getGuideLinkForCalculator(PATH)
const name = '로또 번호 생성기'
const description = '로또 6/45 번호를 무작위 또는 균형 필터로 생성하고 복사하세요. 회차별 당첨번호와 보너스 번호를 조회해 생성한 조합과 비교할 수 있어요.'

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: '로또 번호 생성기 — 로또 6/45 회차별 당첨번호 조회',
  description,
  ogImagePath: `${PATH}/opengraph-image`,
  category: 'entertainment',
})

export default function LottoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="lotto-seo"
        breadcrumb={[
          { name: '홈', path: '/' },
          { name, path: PATH },
        ]}
        webApp={{
          path: PATH,
          name,
          description,
          category: 'GameApplication',
          guidePath: guide?.href,
        }}
      />
      {children}
    </>
  )
}
