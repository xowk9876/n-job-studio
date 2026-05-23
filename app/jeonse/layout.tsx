import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/jeonse'
const guide = getGuideLinkForCalculator(PATH)

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '전세↔월세 전환 계산기 — 2026년 법정 전환율(기준금리+2%)',
  description:
    '전세 보증금을 월세로, 월세를 전세 보증금으로 양방향 전환합니다. 주택임대차보호법 법정 상한 전환율(기준금리+2%) 자동 적용. 손익분기 전환율 분석.',
  keywords: [
    '전월세 전환 계산기',
    '전세 월세 전환',
    '전월세 전환율',
    '월세 계산기',
    '전세 계산기',
    '법정 전환율',
    '기준금리',
    '전세 보증금',
    '월세 환산',
    '임대차보호법',
  ],
  ogImagePath: '/jeonse/opengraph-image',
  ogTitle: '전세↔월세 전환 계산기 — 법정 전환율 자동 적용',
  ogDescription: '법정 상한(기준금리+2%) 기준 전세↔월세 양방향 전환 + 손익분기 분석.',
})

export default function JeonseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="jeonse-seo"
        breadcrumb={[
          { name: '홈', path: '/' },
          { name: '전월세 전환 계산기', path: PATH },
        ]}
        webApp={{
          path: PATH,
          name: '전월세 전환 계산기',
          description: '주택임대차보호법 법정 전환율 기준 전세↔월세 양방향 환산',
          guidePath: guide?.href,
        }}
      />
      {children}
    </>
  )
}
