import type { Metadata } from 'next'
import CalculatorSeoScripts from '@/components/seo/CalculatorSeoScripts'
import { buildCalculatorMetadata, getGuideLinkForCalculator } from '@/lib/seo'

const PATH = '/lotto'
const guide = getGuideLinkForCalculator(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: '로또 번호 생성기 — 최신 당첨번호·1~5등 안내',
  description:
    '동행복권 최신 추첨 회차·당첨번호(6+보너스)를 자동 표시하고, 6/45 번호를 생성합니다. 1등~5등 일치 조건, 당첨금 수령·세금(200만 원 이하 비과세) 안내. 당첨을 보장하지 않는 오락용 도구입니다.',
  keywords: [
    '로또 번호 생성기',
    '로또 최신 당첨번호',
    '로또 당첨번호 조회',
    '로또 6/45',
    '로또 당첨 등위',
    '로또 당첨금 수령',
    '로또 세금',
    '동행복권',
  ],
  ogImagePath: '/lotto/opengraph-image',
  ogTitle: '로또 번호 생성기 — 최신 당첨번호·등위 안내',
  ogDescription: '최신 추첨 당첨번호 자동 표시 + 6/45 번호 생성. 1~5등 조건·수령·세금 안내.',
  category: 'entertainment',
})

export default function LottoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorSeoScripts
        id="lotto-seo"
        breadcrumb={[
          { name: '홈', path: '/' },
          { name: '로또 번호 생성기', path: PATH },
        ]}
        webApp={{
          path: PATH,
          name: '로또 번호 생성기',
          description: '동행복권 최신 당첨번호 조회 및 6/45 번호 생성',
          category: 'GameApplication',
          guidePath: guide?.href,
        }}
      />
      {children}
    </>
  )
}
