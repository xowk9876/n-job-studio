'use client'

import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Copy, Check, Trophy } from 'lucide-react'
import { FAQSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { generateOptimizedGames, type LottoPick } from '@/lib/lotto/pattern'

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

// ═══ 동행복권 공식 번호 색상 (dhlottery.co.kr 기준) ═══
const BALL_COLORS: Record<string, { bg: string; text: string; shadow: string }> = {
  yellow: { bg: '#FBC400', text: '#6B4C00', shadow: 'rgba(251,196,0,0.35)' },
  blue:   { bg: '#69C8F2', text: '#1A3A5C', shadow: 'rgba(105,200,242,0.35)' },
  red:    { bg: '#FF7272', text: '#5C1A1A', shadow: 'rgba(255,114,114,0.35)' },
  gray:   { bg: '#AAAAAA', text: '#2A2A2A', shadow: 'rgba(170,170,170,0.35)' },
  green:  { bg: '#B0D840', text: '#3A4C00', shadow: 'rgba(176,216,64,0.35)' },
}

/** 모바일(320px~)에서 7개 공+보너스가 한 줄에 들어가도록 뷰포트 비례 크기 */
const LATEST_BALL_SIZE =
  'h-[clamp(26px,7.2vw,52px)] w-[clamp(26px,7.2vw,52px)] text-[clamp(10px,2.8vw,16px)]'
const LATEST_BALL_ROW = 'flex flex-nowrap items-center justify-center gap-[clamp(3px,1vw,12px)] w-full max-w-full'

function getBallStyle(n: number) {
  if (n <= 10) return BALL_COLORS.yellow
  if (n <= 20) return BALL_COLORS.blue
  if (n <= 30) return BALL_COLORS.red
  if (n <= 40) return BALL_COLORS.gray
  return BALL_COLORS.green
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

type LatestLottoResult = {
  round: number
  drawDate: string
  numbers: number[]
  bonusNumber: number
  firstPrizeAmount: number
  firstWinnerCount: number
  firstAccumulatedAmount: number
  source: string
  fetchedAt: string
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`
}

export default function LottoPage() {
  const [gameCount, setGameCount] = useState(5)
  const [games, setGames] = useState<LottoPick[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [, setTick] = useState(0)
  const [latestResult, setLatestResult] = useState<LatestLottoResult | null>(null)
  const [latestStatus, setLatestStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadLatestResult() {
      try {
        const response = await fetch('/api/lotto/latest', { cache: 'no-store' })
        if (!response.ok) throw new Error('Failed to fetch latest lotto result')

        const result = (await response.json()) as LatestLottoResult
        if (cancelled) return

        setLatestResult(result)
        setLatestStatus('ready')
      } catch {
        if (cancelled) return
        setLatestStatus('error')
      }
    }

    loadLatestResult()

    return () => {
      cancelled = true
    }
  }, [])

  const info = getLottoInfo()

  // 추첨일 카운트다운 — 클라이언트 마운트 후 매초 갱신 (render-purity 보장)
  const [countdown, setCountdown] = useState<string>('')
  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(info.nextDraw.getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [info.nextDraw])

  const handleGenerate = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setCopiedIdx(null)
    setTimeout(() => {
      setGames(generateOptimizedGames(gameCount, latestResult?.numbers ?? []))
      setIsSpinning(false)
    }, games.length === 0 ? 900 : 500)
  }, [isSpinning, games.length, gameCount, latestResult])

  const handleCopy = useCallback(async (idx: number, nums: number[]) => {
    try {
      await navigator.clipboard.writeText(nums.join(', '))
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    } catch { /* noop */ }
  }, [])

  const hasGames = games.length > 0

  return (
    <div className="calc-page">
      {/* 헤더 */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">LOTTO · 6/45</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">로또 번호 생성기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1" suppressHydrationWarning>
          제 {info.round.toLocaleString()}회차 · {formatDrawDate(info.nextDraw)} · {countdown}
        </p>
      </div>

      {/* 최신 당첨번호 */}
      <div className="glass-card relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
          <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#FBC400]/15 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-[#69C8F2]/10 blur-3xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-[#FBC400] mb-1">LATEST WINNING NUMBERS</p>
            <h2 className="font-display text-[18px] md:text-[20px] font-bold text-white tracking-tight">
              최신 로또 당첨번호
            </h2>
            <p className="text-[11.5px] text-white/45 mt-1">
              동행복권 발표 데이터 기준 · 발표 직후 미공개 회차는 직전 회차 표시
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10.5px] font-semibold text-white/70">
            <Trophy className="h-3.5 w-3.5 text-[#FBC400]" />
            자동 갱신
          </span>
        </div>

        {latestStatus === 'loading' && (
          <div className="relative flex flex-col gap-4">
            <div className={LATEST_BALL_ROW}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`${LATEST_BALL_SIZE} rounded-full bg-white/10 ${i === 6 ? 'ring-1 ring-white/15' : ''}`}
                  style={{ animation: `lotto-bounce 0.75s ease-in-out ${i * 0.06}s infinite` }}
                />
              ))}
            </div>
            <p className="text-center text-[11.5px] text-white/40">최신 회차 당첨번호를 확인하고 있습니다.</p>
          </div>
        )}

        {latestStatus === 'error' && (
          <div className="relative rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
            <p className="text-[13px] font-semibold text-white">당첨번호를 불러오지 못했습니다.</p>
            <p className="mt-1 text-[11.5px] text-white/45">잠시 후 다시 접속하면 자동으로 재시도됩니다.</p>
          </div>
        )}

        {latestStatus === 'ready' && latestResult && (
          <div className="relative">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold text-white/50">제 {latestResult.round.toLocaleString('ko-KR')}회</p>
                <p className="text-[20px] md:text-[24px] font-extrabold text-white tracking-tight">
                  {latestResult.drawDate} 추첨
                </p>
              </div>
              <span className="rounded-lg bg-black/25 px-2.5 py-1 text-[10.5px] text-white/45">
                5분 단위 확인
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-2 py-4 sm:px-3 md:rounded-3xl md:p-5">
              <div className={LATEST_BALL_ROW}>
                {latestResult.numbers.map(num => {
                  const style = getBallStyle(num)
                  return (
                    <div
                      key={num}
                      className={`${LATEST_BALL_SIZE} shrink-0 rounded-full flex items-center justify-center font-extrabold tabular`}
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        boxShadow: `0 3px 8px ${style.shadow}`,
                      }}
                    >
                      {num}
                    </div>
                  )
                })}
                <span className="shrink-0 text-[clamp(12px,3.2vw,18px)] font-light text-white/35 leading-none">+</span>
                {(() => {
                  const style = getBallStyle(latestResult.bonusNumber)
                  return (
                    <div
                      className={`relative ${LATEST_BALL_SIZE} shrink-0 rounded-full flex items-center justify-center font-extrabold tabular ring-2 ring-white/20`}
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        boxShadow: `0 3px 8px ${style.shadow}`,
                      }}
                    >
                      {latestResult.bonusNumber}
                      <span className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 text-[9px] font-bold text-white/38 md:block">BONUS</span>
                    </div>
                  )
                })()}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[10.5px] text-white/40">1등 당첨자</p>
                <p className="mt-1 text-[16px] font-extrabold text-white tabular">
                  {latestResult.firstWinnerCount.toLocaleString('ko-KR')}명
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[10.5px] text-white/40">1등 1명당 당첨금</p>
                <p className="mt-1 text-[15px] font-extrabold text-[#FBC400] tabular">
                  {formatWon(latestResult.firstPrizeAmount)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 생성 카드 */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[12px] text-white/55 font-medium">게임 수</span>
          <div className="flex gap-1 bg-black/25 rounded-lg p-1">
            {[1, 3, 5].map(n => (
              <button
                key={n}
                onClick={() => setGameCount(n)}
                disabled={isSpinning}
                className={`px-3 py-1 rounded-md text-[12px] font-bold transition-colors ${
                  gameCount === n ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 번호 영역 */}
        <div className="flex flex-col gap-3 mb-6 min-h-[56px]">
          {!hasGames && !isSpinning && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-white/20 text-base font-bold">?</span>
                </div>
              ))}
            </div>
          )}
          {isSpinning && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 flex items-center justify-center text-white/50"
                  style={{ animation: `lotto-bounce 0.6s ease-in-out ${i * 0.08}s infinite` }}
                >
                  ···
                </div>
              ))}
            </div>
          )}
          {hasGames && !isSpinning && games.map((game, gameIdx) => {
            const nums = game.numbers
            return (
            <div
              key={gameIdx}
              className="flex items-center gap-2 mf-rise"
              style={{ animationDelay: `${gameIdx * 60}ms` }}
            >
              <span className="text-white/35 text-[11px] font-mono w-5 shrink-0">{String.fromCharCode(65 + gameIdx)}</span>
              <div className="flex flex-nowrap gap-1 md:gap-2 flex-1 justify-center">
                {nums.map(num => {
                  const style = getBallStyle(num)
                  const isHit = latestResult?.numbers.includes(num)
                  return (
                    <div
                      key={num}
                      className={`w-8 h-8 min-[390px]:w-9 min-[390px]:h-9 md:w-11 md:h-11 shrink-0 rounded-full flex items-center justify-center text-[12px] min-[390px]:text-[13px] md:text-[15px] font-extrabold tabular ${isHit ? 'ring-2 ring-[#FBC400]/70' : ''}`}
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        boxShadow: `0 3px 8px ${style.shadow}`,
                      }}
                    >
                      {num}
                    </div>
                  )
                })}
              </div>
              <button
                onClick={() => handleCopy(gameIdx, nums)}
                className="shrink-0 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="번호 복사"
              >
                {copiedIdx === gameIdx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            )
          })}
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={isSpinning}
          className={`w-full py-3.5 rounded-xl font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
            isSpinning ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-white/90'
          }`}
        >
          <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          {hasGames ? `다시 뽑기 (${gameCount}게임)` : `번호 뽑기 (${gameCount}게임)`}
        </button>
      </div>

      <p className="lotto-disclaimer">
        로또 6/45의 1등 당첨 확률은 모든 번호 조합에서 같습니다(약 1/814만).
        생성된 번호는 참고·오락용이며, 실제 추첨 결과·당첨을 보장하지 않습니다.
        <span className="lotto-disclaimer__age">복권 이용은 만 19세 이상입니다.</span>
      </p>

      {/* 당첨 등위 안내 — 동행복권 공식 공 색상 매핑 */}
      <div className="glass-card">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-semibold text-white text-[14px] tracking-tight">당첨 등위 안내</h2>
          <span className="text-[10.5px] text-white/40">동행복권 공식 기준</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { rank: '1등', match: '6개 번호 전부 일치', prize: '평균 20억원+', ball: BALL_COLORS.yellow, accent: '#FBC400' },
            { rank: '2등', match: '5개 + 보너스 번호 일치', prize: '평균 6,000만원', ball: BALL_COLORS.blue,   accent: '#69C8F2' },
            { rank: '3등', match: '5개 번호 일치',         prize: '평균 150만원',   ball: BALL_COLORS.red,    accent: '#FF7272' },
            { rank: '4등', match: '4개 번호 일치',         prize: '고정 5만원',     ball: BALL_COLORS.gray,   accent: '#CFCFCF' },
            { rank: '5등', match: '3개 번호 일치',         prize: '고정 5,000원',   ball: BALL_COLORS.green,  accent: '#B0D840' },
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
                <p className="text-[12.5px] text-white font-semibold leading-tight">{r.match}</p>
              </div>
              <span className="shrink-0 text-[13.5px] font-bold tabular" style={{ color: r.accent }}>
                {r.prize}
              </span>
            </div>
          ))}
        </div>

      </div>

      <div className="flex flex-col gap-8">
        <FAQSection items={[
          { q: '로또 당첨금에 세금이 얼마나 붙나요?', a: '200만 원 이하는 비과세입니다. 200만 원 초과~3억 원 이하는 22%(소득세 20% + 지방소득세 2%), 3억 원 초과분은 33%(소득세 30% + 지방소득세 3%)가 원천징수됩니다.' },
          { q: '당첨금은 어디서 수령하나요?', a: '5만 원 이하는 일반 판매점, 5만 원 초과~200만 원 이하는 NH농협은행 지점, 200만 원 초과는 NH농협은행 본점(서울 중구)에서 수령합니다. 신분증과 당첨 복권을 지참해야 합니다.' },
          { q: '당첨금 수령 기한이 있나요?', a: '추첨일로부터 1년 이내에 수령해야 합니다. 기한 초과 시 당첨금은 복권기금으로 귀속됩니다.' },
          { q: '연금복권과 로또 세금이 다른가요?', a: '세율 구간은 동일합니다. 연금복권 1등은 매월 700만 원씩 20년간 수령하며, 매달 22%가 원천징수되어 월 약 546만 원을 실수령합니다.' },
          { q: '당첨금을 가족에게 나눠줘도 되나요?', a: '증여세가 부과됩니다. 배우자 6억 원, 성인 자녀 5,000만 원, 미성년 자녀 2,000만 원까지는 증여세 공제가 적용됩니다 (상속세 및 증여세법 기준).' },
        ]} />

        <TipsSection title="로또 당첨 후 알아두면 좋은 것" items={[
          { title: '복권 뒷면에 즉시 서명', desc: '당첨 즉시 복권 뒷면에 서명하세요. 서명 없는 복권은 소지자에게 권리가 인정될 수 있습니다. 분실·도난 시 서명이 유일한 소유 증거입니다.' },
          { title: '고액 당첨 시 전문가 상담 후 수령', desc: '변호사·세무사와 상담 후 수령하세요. 당첨 사실을 SNS에 공개하지 않는 것을 강력히 권장합니다. 익명 수령이 원칙입니다.' },
          { title: '당첨금 분산 운용', desc: 'IRP·연금저축에 일부를 넣으면 추가 절세가 가능합니다. 일시 소비보다 예금·펀드 등으로 분산 운용이 장기적으로 유리합니다.' },
          { title: '수령 기한 1년 엄수', desc: '미수령 당첨금은 추첨일 기준 1년 후 자동 소멸되어 복권기금으로 귀속됩니다. 매주 당첨 번호를 꼭 확인하세요.' },
          { title: '과도한 구매 자제', desc: '로또는 소액 오락용입니다. 1인 1매 제한은 없지만, 당첨 확률(약 1/8,145,060)을 고려하면 적정 금액 내에서 즐기세요.' },
        ]} />
        <OfficialSourcesSection
          sources={[
            '복권 및 복권기금법과 동행복권 로또 6/45 회차·추첨 기준',
            '소득세법상 복권 당첨금 기타소득 원천징수 기준',
          ]}
          note="로또 번호 생성기는 오락용 정보 도구이며 당첨을 보장하지 않습니다. 과도한 복권 구매를 유도하지 않으며, 생성된 번호와 실제 추첨 결과는 독립적입니다."
        />

        <RelatedLinks links={[
          { href: '/salary',    label: '연봉 실수령액' },
          { href: '/savings',   label: '적금 이자' },
          { href: '/mortgage',  label: '대출 이자' },
          { href: '/severance', label: '퇴직금' },
          { href: '/jeonse',    label: '전월세 전환' },
        ]} />
      </div>

      <style jsx>{`
        @keyframes lotto-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
