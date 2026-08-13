'use client'

import { useState, useEffect } from 'react'
import { LOTTO_BALL_COLORS } from '@/components/lotto/LottoBall'
import LottoGenerator from '@/components/lotto/LottoGenerator'
import LottoResultBrowser from '@/components/lotto/LottoResultBrowser'
import { FAQSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'

const CALC_PATH = '/lotto'
const calcSeo = getCalculatorLinks(CALC_PATH)

// ═══ 동행복권 회차 / 추첨시간 계산 ═══
const FIRST_DRAW = new Date('2002-12-07T20:45:00+09:00')

function getLottoInfo(now = new Date()) {
  const d = new Date(now)
  const day = d.getDay()
  const daysUntilSat = (6 - day + 7) % 7
  const nextDraw = new Date(d)
  nextDraw.setDate(d.getDate() + daysUntilSat)
  nextDraw.setHours(20, 45, 0, 0)
  if (daysUntilSat === 0 && d.getTime() >= nextDraw.getTime()) {
    nextDraw.setDate(nextDraw.getDate() + 7)
  }
  const salesCloseAt = new Date(nextDraw.getTime() - 45 * 60 * 1000)
  const round = Math.floor((nextDraw.getTime() - FIRST_DRAW.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
  return { round, nextDraw, salesCloseAt }
}

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']
function formatDrawDate(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${WEEKDAY[d.getDay()]}) 20:45`
}
function formatCountdown(diffMs: number) {
  if (diffMs <= 0) return '추첨 중'
  const sec = Math.floor(diffMs / 1000)
  const days = Math.floor(sec / 86400)
  const hours = Math.floor((sec % 86400) / 3600)
  const mins = Math.floor((sec % 3600) / 60)
  if (days > 0) return `${days}일 ${hours}시간 남음`
  if (hours > 0) return `${hours}시간 ${mins}분 남음`
  return `${mins}분 남음`
}

export default function LottoPage() {
  // 회차·추첨일·매출마감 정보는 60초 인터벌로만 갱신 (매 렌더 재계산 시 useEffect deps 무한 재구독 방지)
  const [info, setInfo] = useState(() => getLottoInfo())

  useEffect(() => {
    const id = setInterval(() => setInfo(getLottoInfo()), 60_000)
    return () => clearInterval(id)
  }, [])

  // 추첨일 카운트다운 — 클라이언트 마운트 후 매초 갱신 (render-purity 보장)
  const [countdown, setCountdown] = useState<string>('')
  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(info.nextDraw.getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [info.nextDraw])

  return (
    <div className="calc-page">
      {/* 헤더 */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">LOTTO · 6/45</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-ink">로또 번호 생성기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1" suppressHydrationWarning>
          제 {info.round.toLocaleString()}회차 · {formatDrawDate(info.nextDraw)} · {countdown}
        </p>
      </div>

      {/* 번호 생성기 — 게임 수 선택 → 생성 버튼 → 번호 확인이 이 페이지의 주 동선이므로 최상단에 둔다 */}
      <LottoGenerator />

      {/* 오락용 고지는 생성기 바로 아래에 둔다 — 공식 당첨번호 조회 결과에 걸리면 오해를 준다 */}
      <p className="lotto-disclaimer">
        생성된 번호는 참고·오락용이며, 실제 추첨 결과·당첨을 보장하지 않습니다.
        <span className="lotto-disclaimer__age">복권 이용은 만 19세 이상입니다.</span>
      </p>

      {/* 당첨번호 조회 — 최신 회차 + 과거 회차(회차 번호 기준) */}
      <LottoResultBrowser />

      {/* 당첨 등위 안내 — 동행복권 공식 공 색상 매핑 */}
      <div className="glass-card">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-semibold text-ink text-[14px] tracking-tight">당첨 등위 안내</h2>
          <span className="text-[10.5px] text-ink/60">동행복권 공식 기준</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { rank: '1등', match: '6개 번호 전부 일치', prize: '평균 20억원+', ball: LOTTO_BALL_COLORS.yellow, accent: '#FBC400' },
            { rank: '2등', match: '5개 + 보너스 번호 일치', prize: '평균 6,000만원', ball: LOTTO_BALL_COLORS.blue,   accent: '#69C8F2' },
            { rank: '3등', match: '5개 번호 일치',         prize: '평균 150만원',   ball: LOTTO_BALL_COLORS.red,    accent: '#FF7272' },
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
          { q: '로또 당첨금에 세금이 얼마나 붙나요?', a: '200만 원 이하는 비과세입니다. 200만 원 초과~3억 원 이하는 22%(소득세 20% + 지방소득세 2%), 3억 원 초과분은 33%(소득세 30% + 지방소득세 3%)가 원천징수됩니다.' },
          { q: '당첨금은 어디서 수령하나요?', a: '1등은 NH농협은행 본점(서울 중구), 2등과 200만 원 초과 3등은 NH농협은행 전국 지점, 200만 원 이하(3~5등)는 로또 판매점에서 수령합니다. 인터넷 구매분 200만 원 이하는 동행복권 예치금 계좌로 자동 입금됩니다. 신분증과 당첨 복권을 지참해야 합니다.' },
          { q: '당첨금 수령 기한이 있나요?', a: '추첨일로부터 1년 이내에 수령해야 합니다. 기한 초과 시 당첨금은 복권기금으로 귀속됩니다.' },
          { q: '번호 생성기가 당첨 확률을 높여 주나요?', a: '아니요. 로또 6/45는 매 회차 독립 추첨이며 모든 조합의 1등 확률은 1/8,145,060로 동일합니다. 통계 가중치(핫·콜드·장기 미출현)와 밸런스 필터(홀짝·고저·합계·연속번호)는 역대 1등 조합에서 드물게 관측된 극단적 조합을 피하고 선택 근거를 보여 주는 참고 도구일 뿐, 당첨을 보장하거나 확률을 바꾸지 않습니다.' },
          { q: '연금복권과 로또 세금이 다른가요?', a: '세율 구간은 동일합니다. 연금복권 1등은 매월 700만 원씩 20년간 수령하며, 매달 22%가 원천징수되어 월 약 546만 원을 실수령합니다.' },
          { q: '당첨금을 가족에게 나눠줘도 되나요?', a: '증여세가 부과됩니다. 배우자 6억 원, 성인 자녀 5,000만 원, 미성년 자녀 2,000만 원까지는 증여세 공제가 적용됩니다 (상속세 및 증여세법 기준).' },
        ]} />

        <TipsSection title="로또 당첨 후 알아두면 좋은 것" items={[
          { title: '복권 뒷면에 즉시 서명', desc: '당첨 즉시 복권 뒷면에 서명하세요. 서명 없는 복권은 소지자에게 권리가 인정될 수 있습니다. 분실·도난 시 서명이 유일한 소유 증거입니다.' },
          { title: '고액 당첨 시 전문가 상담 후 수령', desc: '변호사·세무사와 상담 후 수령하세요. 당첨 사실을 SNS에 공개하지 않는 것을 강력히 권장합니다. 익명 수령이 원칙입니다.' },
          { title: '당첨금 분산 운용', desc: 'IRP·연금저축에 일부를 넣으면 추가 절세가 가능합니다. 일시 소비보다 예금·펀드 등으로 분산 운용이 장기적으로 유리합니다.' },
          { title: '수령 기한 1년 엄수', desc: '미수령 당첨금은 추첨일 기준 1년 후 자동 소멸되어 복권기금으로 귀속됩니다. 매주 당첨 번호를 꼭 확인하세요.' },
          { title: '과도한 구매 자제', desc: '로또는 소액 오락용입니다. 1인 1매 제한은 없지만, 당첨 확률(약 1/8,145,060)을 고려하면 적정 금액 내에서 즐기세요. 도박 문제로 어려움을 겪는다면 한국도박문제예방치유원 상담센터(1336)에 도움을 요청할 수 있습니다.' },
        ]} />
        <OfficialSourcesSection
          sources={[
            '동행복권(dhlottery.co.kr) 로또 6/45 회차별 당첨번호 공식 조회 데이터',
            '복권 및 복권기금법과 동행복권 로또 6/45 회차·추첨 기준',
            '소득세법상 복권 당첨금 기타소득 원천징수 기준',
          ]}
          note="당첨번호는 동행복권 공식 데이터를 서버에서 조회해 표시하며, 공식 발표와 다를 경우 동행복권 발표가 우선합니다. 로또 번호 생성기는 오락용 정보 도구이며 당첨을 보장하지 않습니다. 과도한 복권 구매를 유도하지 않으며, 생성된 번호와 실제 추첨 결과는 독립적입니다."
        />

        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
