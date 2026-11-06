import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/jeonse'
const guide = getGuideLinkForCalculator(PATH)
const name = '전월세 전환 계산기'
const description = '보증금을 바꾸면 월세가 얼마나 달라지는지 계산하세요. 입력한 전환율에 따른 전세·월세 환산액과 보증금 차이에 따른 비용을 비교할 수 있어요.'

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '전월세 전환 계산기 — 전세 보증금·월세 환산',
  description,
  ogImagePath: `${PATH}/opengraph-image`,
})

export default function JeonseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="jeonse-seo"
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
