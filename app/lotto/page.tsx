import LottoDrawSchedule from '@/components/lotto/LottoDrawSchedule'
import { LOTTO_BALL_COLORS } from '@/components/lotto/LottoBall'
import LottoGenerator from '@/components/lotto/LottoGenerator'
import LottoResultBrowser from '@/components/lotto/LottoResultBrowser'
import { FAQSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { officialSources } from '@/lib/content-sources'

const CALC_PATH = '/lotto'
const calcSeo = getCalculatorLinks(CALC_PATH)

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

      {/* 당첨 등위 안내 — 동행복권 공식 공 색상 매핑 */}
      <div className="glass-card">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-semibold text-ink text-[14px] tracking-tight">당첨 등위 안내</h2>
          <span className="text-[10.5px] text-ink/60">동행복권 공식 기준</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { rank: '1등', match: '6개 번호 전부 일치', prize: '회차별 변동', ball: LOTTO_BALL_COLORS.yellow, accent: '#FBC400' },
            { rank: '2등', match: '5개 + 보너스 번호 일치', prize: '회차별 변동', ball: LOTTO_BALL_COLORS.blue,   accent: '#69C8F2' },
            { rank: '3등', match: '5개 번호 일치',         prize: '회차별 변동',   ball: LOTTO_BALL_COLORS.red,    accent: '#FF7272' },
            { rank: '4등', match: '4개 번호 일치',         prize: '고정 5만원',     ball: LOTTO_BALL_COLORS.gray,   accent: '#CFCFCF' },
            { rank: '5등', match: '3개 번호 일치',         prize: '고정 5,000원',   ball: LOTTO_BALL_COLORS.green,  accent: '#B0D840' },
          ].map((r) => (
            <div
              key={r.rank}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all"
              style={{
                background: `linear-gradient(90deg, ${r.ball.bg}14 0%, transparent 60%)`,
                border: `1px solid ${r.ball.bg}22`,
              }}
            >
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-extrabold"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${r.ball.bg}ee, ${r.ball.bg})`,
                  color: r.ball.text,
                  boxShadow: `0 2px 8px ${r.ball.shadow}, inset 0 1px 2px rgba(255,255,255,0.3)`,
                }}
              >
                {r.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] text-ink font-semibold leading-tight">{r.match}</p>
              </div>
              <span className="shrink-0 text-[13.5px] font-bold tabular" style={{ color: r.accent }}>
                {r.prize}
              </span>
            </div>
          ))}
        </div>

      </div>

      <div className="flex flex-col gap-8">
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '로또 당첨금에 세금이 얼마나 붙나요?', a: '건별 당첨금 200만원 이하는 비과세입니다. 이를 넘으면 200만원을 빼는 방식이 아니며, 3억원 이하 구간은 지방소득세 포함 22%, 3억원 초과분은 33%가 적용됩니다. 실제 원천징수액은 복권 구입비 등의 처리에 따라 달라집니다.' },
          { q: '당첨금은 어디서 수령하나요?', a: '판매점에서 샀다면 당첨 복권 원본을 지참하세요. 1등은 NH농협은행 본점, 2·3등은 NH농협은행 지점, 4·5등은 로또 판매점에서 받습니다. 인터넷 구매분 200만원 이하는 동행복권 예치금으로 자동 입금됩니다. 준비물과 예외는 동행복권 지급 안내에서 확인하세요.' },
          { q: '당첨금 수령 기한은 언제까지인가요?', a: '해당 회차 지급개시일로부터 1년입니다. 마지막 날이 은행 영업일이 아니면 다음 은행 영업일까지입니다. 복권 원본 또는 인터넷 구매내역의 지급기한을 확인하세요.' },
          { q: '번호 생성기가 당첨 확률을 높여 주나요?', a: '번호를 어떻게 고르든 한 게임의 1등 확률은 814만 5,060분의 1입니다. 균형 필터와 과거 당첨 조합 제외는 생성할 조합의 범위만 바꿉니다.' },
        ]} />

        <OfficialSourcesSection
          sources={officialSources[CALC_PATH]}
          note="실시간 조회가 지연되면 마지막으로 저장한 회차를 표시합니다."
        />

        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
