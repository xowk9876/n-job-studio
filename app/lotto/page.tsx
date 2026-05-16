'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, Trophy, Info, Copy, Check } from 'lucide-react'

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

// ═══ 당첨 등위 (동행복권 공식 기준) ═══
const PRIZE_INFO = [
  { rank: 1, match: '6개 일치',        prob: '1 / 8,145,060', amount: '회차별 변동 (1등 배분)', color: '#D4AF37' },
  { rank: 2, match: '5개 + 보너스볼',  prob: '1 / 1,357,510', amount: '회차별 변동 (2등 배분)', color: '#A8A9AD' },
  { rank: 3, match: '5개 일치',        prob: '1 / 35,724',    amount: '회차별 변동 (3등 배분)', color: '#CD7F32' },
  { rank: 4, match: '4개 일치',        prob: '1 / 733',       amount: '50,000원 (고정)',       color: '#3b82f6' },
  { rank: 5, match: '3개 일치',        prob: '1 / 45',        amount: '5,000원 (고정)',        color: '#10b981' },
]

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

      {/* 당첨 등위 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-[15px]">
          <Trophy className="w-4 h-4 text-amber-400" /> 당첨 등위 · 확률
        </h2>
        <div className="flex flex-col gap-2">
          {PRIZE_INFO.map(p => (
            <div key={p.rank} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04]">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-extrabold text-[13px] shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-white">{p.match}</span>
                  <span className="text-[11px] text-white/50 font-mono">{p.prob}</span>
                </div>
                <p className="text-[11.5px] text-amber-300/80 mt-0.5">{p.amount}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-white/35 leading-relaxed">
          1~3등 당첨금은 총 판매액 배분. 4등 5만원·5등 5천원 고정. 3억 이하 22%, 초과분 33% 원천징수.
        </p>
      </div>

      {/* 안내 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-2.5 flex items-center gap-2 text-[14px]">
          <Info className="w-4 h-4 text-white/40" /> 안내사항
        </h2>
        <ul className="text-[12.5px] text-white/60 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>Web Crypto API(CSPRNG) 기반 암호학적 난수 생성 — 예측 불가능.</li>
          <li>실제 추첨과 무관하며 당첨을 보장하지 않습니다.</li>
          <li>추첨: 매주 토요일 20:45 / 판매마감: 토요일 20:00</li>
          <li>구매 자격: 만 19세 이상 · 공식 판매처(동행복권) 이용.</li>
        </ul>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="관련 계산기">
        {[
          { href: '/salary',   label: '연봉 실수령액' },
          { href: '/savings',  label: '적금 이자' },
          { href: '/mortgage', label: '대출 이자' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-[12.5px] px-3 py-2 rounded-md border border-[color:var(--line-strong)] bg-white/[0.03] text-[color:var(--ink-2)] hover:text-[color:var(--brand)] hover:bg-[color:var(--brand-soft)] transition-colors"
          >
            → {label}
          </Link>
        ))}
      </nav>

      <style jsx>{`
        @keyframes lotto-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
