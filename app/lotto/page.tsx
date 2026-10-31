'use client'

import { useState, useEffect } from 'react'
import { LOTTO_BALL_COLORS } from '@/components/lotto/LottoBall'
import LottoGenerator from '@/components/lotto/LottoGenerator'
import LottoResultBrowser from '@/components/lotto/LottoResultBrowser'
import { FAQSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { officialSources } from '@/lib/content-sources'

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

      {/* 당첨번호 조회 — 히어로 바로 아래 (최신 회차 + 과거 회차) */}
      <LottoResultBrowser />

      {/* 번호 생성기 — 당첨번호 조회 아래 */}
      <LottoGenerator />

      {/* 오락용 고지는 생성기 바로 아래에 둔다 — 공식 당첨번호 조회 결과에 걸리면 오해를 준다 */}
      <p className="lotto-disclaimer">
        생성된 번호는 참고·오락용이며, 실제 추첨 결과·당첨을 보장하지 않습니다.
        <span className="lotto-disclaimer__age">복권 이용은 만 19세 이상입니다.</span>
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
          { q: '당첨금은 어디서 수령하나요?', a: '판매점 구매분은 1등 NH농협은행 본점, 2·3등 NH농협은행 전국 지점, 4·5등 로또 판매점에서 수령합니다. 인터넷 구매분 200만원 이하는 동행복권 예치금으로 자동 입금됩니다. 준비물과 예외는 아래 공식 지급 안내를 확인하세요.' },
          { q: '당첨금 수령 기한은 언제까지인가요?', a: '해당 회차 지급개시일로부터 1년입니다. 마지막 날이 은행 영업일이 아니면 다음 은행 영업일까지입니다. 복권 원본 또는 인터넷 구매내역의 지급기한을 확인하세요.' },
          { q: '번호 생성기가 당첨 확률을 높여 주나요?', a: '아니요. 로또 6/45의 각 조합의 1등 확률은 1/8,145,060로 같습니다. 기본 균등 무작위는 모든 6개 번호 조합을 같은 확률로 뽑으며, 한 번에 생성하는 게임끼리는 중복하지 않습니다. 균형 필터·과거 당첨 조합 제외는 취향에 따른 선택이며 당첨 확률을 높이지 않습니다.' },
          { q: '번호 공의 테두리는 무엇인가요?', a: '화면에 표시한 비교 기준 회차의 본번호와 일치하는 번호입니다. 다음 회차의 당첨 가능성이나 추천 점수를 의미하지 않습니다.' },
        ]} />

        <TipsSection title="이용·수령 시 확인사항" items={[
          { title: '번호 생성 결과의 의미', desc: '생성된 번호는 복권 구매나 당첨 확인을 대신하지 않습니다. 머니핏은 복권 구매·판매 기능을 제공하지 않습니다.' },
          { title: '실물 복권 보관', desc: '당첨 복권 원본을 안전하게 보관하세요. 사진이나 뒷면 서명만으로 분실한 복권의 당첨금 지급이 보장되지는 않습니다.' },
          { title: '공식 발표와 지급 안내 확인', desc: '회차별 당첨번호·당첨금과 지급기한은 동행복권에서 확인하세요. 가족에게 이전할 때의 증여세는 당첨금 원천징수와 별도로 검토해야 합니다.' },
        ]} />
        <OfficialSourcesSection
          sources={officialSources[CALC_PATH]}
          note="조회 장애 시 저장된 회차를 표시할 수 있으므로 회차와 데이터 상태를 확인하세요. 당첨번호·지급 조건은 동행복권 공식 발표가 우선합니다."
        />

        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
