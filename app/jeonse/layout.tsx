import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/jeonse'
const guide = getGuideLinkForCalculator(PATH)

export const metadata = buildCalculatorMetadata({
  path: PATH,
  title: '전세↔월세 전환 계산기 — 보증금·월세 환산과 법정 상한 안내',
  description:
    '입력한 전환율로 전세 보증금과 월세를 환산합니다. 보증금의 월차임 전환 상한과 비용 비교 가정을 안내하며, 월세의 전세 역산은 협의용 참고치입니다.',
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
  ogTitle: '전세↔월세 전환 계산기 — 전환율 입력·법정 상한 안내',
  ogDescription: '전환율에 따른 보증금·월세 환산과 비용 비교. 법정 상한의 적용 범위 안내.',
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
          description: '입력한 전환율에 따른 전세↔월세 환산 및 법정 상한 안내',
          guidePath: guide?.href,
        }}
      />
      {children}
    </>
  )
}
