'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, Copy, Check } from 'lucide-react'
import { FAQSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

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

function getBallStyle(n: number) {
  if (n <= 10) return BALL_COLORS.yellow
  if (n <= 20) return BALL_COLORS.blue
  if (n <= 30) return BALL_COLORS.red
  if (n <= 40) return BALL_COLORS.gray
  return BALL_COLORS.green
}

// ═══ 암호학적 보안 난수 생성 (CSPRNG + Fisher-Yates) ═══
// Web Crypto API의 getRandomValues 사용 — 예측 불가능한 시스템 엔트로피 기반
// 모듈러 바이어스 제거를 위한 rejection sampling 적용

function secureRandomInt(maxExclusive: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1)
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive
    let r: number
    do { crypto.getRandomValues(arr); r = arr[0] } while (r >= limit)
    return r % maxExclusive
  }
  return Math.floor(Math.random() * maxExclusive)
}

// Fisher-Yates(Knuth) 셔플 기반 — O(n) 균등 분포 보장
function generateOneGame(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1)
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 6).sort((a, b) => a - b)
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
  const [mounted, setMounted] = useState(false)
  const [gameCount, setGameCount] = useState(5)
  const [games, setGames] = useState<number[][]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const info = useMemo(() => getLottoInfo(), [tick])

  const handleGenerate = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setCopiedIdx(null)
    setTimeout(() => {
      setGames(Array.from({ length: gameCount }, () => generateOneGame()))
      setIsSpinning(false)
    }, games.length === 0 ? 900 : 500)
  }, [isSpinning, games.length, gameCount])

  const handleCopy = useCallback(async (idx: number, nums: number[]) => {
    try {
      await navigator.clipboard.writeText(nums.join(', '))
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1500)
    } catch { /* noop */ }
  }, [])

  if (!mounted) return null

  const countdown = formatCountdown(info.nextDraw.getTime() - Date.now())
  const hasGames = games.length > 0

  return (
    <div className="calc-page">
      {/* 헤더 */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">LOTTO · 6/45</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">로또 번호 생성기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">
          제 {info.round.toLocaleString()}회차 · {formatDrawDate(info.nextDraw)} · {countdown}
        </p>
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
          {hasGames && !isSpinning && games.map((nums, gameIdx) => (
            <div
              key={gameIdx}
              className="flex items-center gap-2 mf-rise"
              style={{ animationDelay: `${gameIdx * 60}ms` }}
            >
              <span className="text-white/35 text-[11px] font-mono w-5 shrink-0">{String.fromCharCode(65 + gameIdx)}</span>
              <div className="flex gap-1.5 md:gap-2 flex-1 justify-center">
                {nums.map(num => {
                  const style = getBallStyle(num)
                  return (
                    <div
                      key={num}
                      className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-[13px] md:text-[15px] font-extrabold tabular"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${style.bg}ee, ${style.bg})`,
                        color: style.text,
                        boxShadow: `0 2px 8px ${style.shadow}, inset 0 1px 2px rgba(255,255,255,0.3)`,
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
          ))}
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

      <p className="text-[11px] text-white/30 text-center">
        실제 추첨과 무관하며 당첨을 보장하지 않습니다 · 만 19세 이상
      </p>

      {/* 당첨 등위 안내 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-4 text-[14px] tracking-tight">당첨 등위 안내</h2>
        <div className="flex flex-col gap-0">
          {[
            { rank: '1등', match: '6개 번호 전부 일치', prize: '평균 20억원+', odds: '1 / 8,145,060', color: '#FFD700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.2)' },
            { rank: '2등', match: '5개 + 보너스 번호 일치', prize: '평균 6,000만원', odds: '1 / 1,357,510', color: '#C0C0C0', bg: 'rgba(192,192,192,0.06)', border: 'rgba(192,192,192,0.15)' },
            { rank: '3등', match: '5개 번호 일치', prize: '평균 150만원', odds: '1 / 35,724', color: '#CD7F32', bg: 'rgba(205,127,50,0.06)', border: 'rgba(205,127,50,0.15)' },
            { rank: '4등', match: '4개 번호 일치', prize: '고정 5만원', odds: '1 / 733', color: 'var(--ink-2)', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)' },
            { rank: '5등', match: '3개 번호 일치', prize: '고정 5,000원', odds: '1 / 45', color: 'var(--sub)', bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.04)' },
          ].map((r, i) => (
            <div
              key={r.rank}
              className="flex items-center gap-3 py-3 px-3 rounded-lg transition-colors hover:bg-white/[0.03]"
              style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
            >
              <span
                className="shrink-0 w-10 text-center text-[13px] font-extrabold rounded-md py-1"
                style={{ color: r.color, background: r.bg, border: `1px solid ${r.border}` }}
              >
                {r.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] text-white font-medium">{r.match}</p>
                <p className="text-[11px] text-white/40 mt-0.5">확률 {r.odds}</p>
              </div>
              <span className="shrink-0 text-[13px] font-bold tabular" style={{ color: r.color }}>{r.prize}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <span className="text-white/40">200만원 이하</span>
            <span className="text-emerald-300 font-semibold ml-1.5">비과세</span>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <span className="text-white/40">3억 초과</span>
            <span className="text-rose-300 font-semibold ml-1.5">33% 원천징수</span>
          </div>
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
