'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, Trophy, Info, Copy, Check, Clock } from 'lucide-react'

// ═══ 동행복권 회차 / 추첨시간 계산 ═══
// 1회차: 2002-12-07(토), 매주 토요일 20:45 추첨, 20:00 판매마감
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

// ═══ 당첨 등위 ═══
const PRIZE_INFO = [
  { rank: 1, match: '6개 일치',        prob: '1 / 8,145,060', amount: '평균 약 20억원',   color: '#fbbf24' },
  { rank: 2, match: '5개 + 보너스볼',  prob: '1 / 1,357,510', amount: '평균 약 5,000만원', color: '#94a3b8' },
  { rank: 3, match: '5개 일치',        prob: '1 / 35,724',    amount: '평균 약 140만원',   color: '#f97316' },
  { rank: 4, match: '4개 일치',        prob: '1 / 733',       amount: '50,000원',          color: '#3b82f6' },
  { rank: 5, match: '3개 일치',        prob: '1 / 45',        amount: '5,000원',           color: '#10b981' },
]

// 동행복권 공 색상
function ballColor(n: number) {
  if (n <= 10) return 'bg-yellow-400 text-yellow-900'
  if (n <= 20) return 'bg-blue-500 text-white'
  if (n <= 30) return 'bg-red-500 text-white'
  if (n <= 40) return 'bg-gray-300 text-gray-900'
  return 'bg-green-500 text-white'
}

// 암호학적 난수 (균등분포 보정)
function secureRandomInt(maxExclusive: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1)
    const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive
    let r: number
    do { crypto.getRandomValues(arr); r = arr[0] } while (r >= limit)
    return r % maxExclusive
  }
  return Math.floor(Math.random() * maxExclusive)
}

function generateOneGame(): number[] {
  const set = new Set<number>()
  while (set.size < 6) set.add(secureRandomInt(45) + 1)
  return Array.from(set).sort((a, b) => a - b)
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

  const stats = useMemo(() => {
    if (games.length === 0) return null
    const all = games.flat()
    const odd = all.filter(n => n % 2 === 1).length
    const high = all.filter(n => n > 22).length
    const avgSum = Math.round(games.reduce((s, g) => s + g.reduce((a, b) => a + b, 0), 0) / games.length)
    return { odd, even: all.length - odd, high, low: all.length - high, avgSum }
  }, [games])

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
                {nums.map(num => (
                  <div
                    key={num}
                    className={`w-9 h-9 md:w-11 md:h-11 rounded-full ${ballColor(num)} shadow-md flex items-center justify-center text-[13px] md:text-[15px] font-extrabold tabular`}
                  >
                    {num}
                  </div>
                ))}
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

        {hasGames && !isSpinning && stats && (
          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-3 text-center text-[12px]">
            <div>
              <p className="text-white/50 mb-1">평균 합계</p>
              <p className="text-[17px] font-extrabold text-white tabular">{stats.avgSum}</p>
            </div>
            <div>
              <p className="text-white/50 mb-1">홀:짝</p>
              <p className="text-[17px] font-extrabold text-white tabular">{stats.odd}:{stats.even}</p>
            </div>
            <div>
              <p className="text-white/50 mb-1">저:고</p>
              <p className="text-[17px] font-extrabold text-white tabular">{stats.low}:{stats.high}</p>
            </div>
          </div>
        )}
      </div>

      {/* 당첨 등위 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-[15px]">
          <Trophy className="w-4 h-4 text-amber-400" /> 당첨 등위
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
                  <span className="text-[13px] font-semibold text-white">{p.rank}등 · {p.match}</span>
                  <span className="text-[12px] font-bold text-amber-300">{p.amount}</span>
                </div>
                <div className="text-[11px] text-white/45 mt-0.5">확률 {p.prob}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 안내 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-2.5 flex items-center gap-2 text-[14px]">
          <Info className="w-4 h-4 text-white/40" /> 알아두세요
        </h2>
        <ul className="text-[12.5px] text-white/60 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>실제 추첨과 무관하며 당첨을 보장하지 않습니다.</li>
          <li>추첨: 매주 토요일 20:45 / 판매마감: 토요일 20:00</li>
          <li>로또 구매는 만 19세 이상만 가능합니다.</li>
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
