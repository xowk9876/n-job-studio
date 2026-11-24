import { ChevronDown } from 'lucide-react'
import LottoDrawSchedule from '@/components/lotto/LottoDrawSchedule'
import LottoGenerator from '@/components/lotto/LottoGenerator'
import LottoResultBrowser from '@/components/lotto/LottoResultBrowser'
import { FAQSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { lottoResultSources } from '@/lib/content-sources'

const CALC_PATH = '/lotto'
const calcSeo = getCalculatorLinks(CALC_PATH)
const prizeTiers = [
  { rank: '1등', match: '6개', prize: '회차별 변동' },
  { rank: '2등', match: '5개 + 보너스', prize: '회차별 변동' },
  { rank: '3등', match: '5개', prize: '회차별 변동' },
  { rank: '4등', match: '4개', prize: '5만 원' },
  { rank: '5등', match: '3개', prize: '5,000원' },
]

export default function LottoPage() {
  return (
    <div className="calc-page">
      {/* 헤더 */}
      <div>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-ink">로또 번호 생성기</h1>
        <LottoDrawSchedule />
      </div>

      {/* 당첨번호 조회 — 히어로 바로 아래 (최신 회차 + 과거 회차) */}
      <LottoResultBrowser />

      {/* 번호 생성기 — 당첨번호 조회 아래 */}
      <LottoGenerator />

      {/* 오락용 고지는 생성기 바로 아래에 둔다 — 공식 당첨번호 조회 결과에 걸리면 오해를 준다 */}
      <p className="lotto-disclaimer">
        생성된 번호는 오락용이며 당첨을 보장하지 않습니다.
        <span className="lotto-disclaimer__age">19세 미만은 복권을 구매할 수 없습니다.</span>
      </p>

      <details className="glass-card group">
        <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <h2 className="flex min-h-11 items-center justify-between text-base font-semibold text-ink">
            등수별 당첨 기준
            <ChevronDown aria-hidden className="h-4 w-4 group-open:rotate-180" />
          </h2>
        </summary>
        <table className="mt-2 w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">등수별 당첨 기준과 당첨금</caption>
          <thead className="text-ink/70">
            <tr>
              <th scope="col" className="w-1/5 py-2 text-left font-medium">등수</th>
              <th scope="col" className="w-2/5 py-2 text-left font-medium">맞힌 번호</th>
              <th scope="col" className="py-2 text-right font-medium">당첨금</th>
            </tr>
          </thead>
          <tbody>
            {prizeTiers.map(({ rank, match, prize }) => (
              <tr key={rank} className="border-t border-ink/10">
                <th scope="row" className="py-2 text-left font-semibold">{rank}</th>
                <td className="py-2 text-left">{match}</td>
                <td className="py-2 text-right tabular">{prize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <div className="flex flex-col gap-8">
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '로또 당첨금에 세금이 얼마나 붙나요?', a: '건별 당첨금 200만원 이하는 비과세입니다. 이를 넘으면 200만원을 빼는 방식이 아니며, 3억원 이하 구간은 지방소득세 포함 22%, 3억원 초과분은 33%가 적용됩니다. 실제 원천징수액은 복권 구입비 등의 처리에 따라 달라집니다.' },
          { q: '당첨금은 어디서 수령하나요?', a: '판매점에서 샀다면 당첨 복권 원본을 지참하세요. 1등은 NH농협은행 본점, 2·3등은 NH농협은행 지점, 4·5등은 로또 판매점에서 받습니다. 인터넷 구매분 200만원 이하는 동행복권 예치금으로 자동 입금됩니다. 준비물과 예외는 동행복권 지급 안내에서 확인하세요.' },
          { q: '당첨금 수령 기한은 언제까지인가요?', a: '해당 회차 지급개시일로부터 1년입니다. 마지막 날이 은행 영업일이 아니면 다음 은행 영업일까지입니다. 복권 원본 또는 인터넷 구매내역의 지급기한을 확인하세요.' },
          { q: '번호 생성기가 당첨 확률을 높여 주나요?', a: '번호를 어떻게 고르든 한 게임의 1등 확률은 814만 5,060분의 1입니다. 균형 필터와 과거 당첨 조합 제외는 생성할 조합의 범위만 바꿉니다.' },
        ]} />

        <OfficialSourcesSection sources={lottoResultSources} note={null} />

        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
