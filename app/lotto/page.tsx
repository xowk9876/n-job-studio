'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw, Trophy, Info, Zap, Coins, ChevronRight, Copy, Check, Clock } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// 동행복권 회차 / 추첨시간 계산
// ═══════════════════════════════════════════════════════════════
// 1회차: 2002-12-07(토), 매주 토요일 20:45 추첨, 20:00 판매마감
const FIRST_DRAW = new Date('2002-12-07T20:45:00+09:00')
const DRAW_HOUR = 20
const DRAW_MIN = 45

function getLottoInfo(now = new Date()): {
  round: number           // "이번 주 추첨 예정" 회차
  nextDraw: Date          // 다음 추첨 일시
  salesCloseAt: Date      // 이번 회차 판매 마감 (추첨 45분 전)
  isBeforeDraw: boolean   // 아직 이번 주 추첨 전인지
} {
  // KST 토요일 기준으로 다음 추첨일 계산
  const d = new Date(now)
  const day = d.getDay() // 0=일 … 6=토
  const daysUntilSat = (6 - day + 7) % 7

  const nextDraw = new Date(d)
  nextDraw.setDate(d.getDate() + daysUntilSat)
  nextDraw.setHours(DRAW_HOUR, DRAW_MIN, 0, 0)

  // 오늘이 토요일이고 이미 추첨 시각을 지났으면 → 다음 주 토요일로
  if (daysUntilSat === 0 && d.getTime() >= nextDraw.getTime()) {
    nextDraw.setDate(nextDraw.getDate() + 7)
  }

  const salesCloseAt = new Date(nextDraw.getTime() - 45 * 60 * 1000) // 추첨 45분 전

  // 1회차 토요일과의 주차 = 다음 추첨될 회차 번호
  const diffMs = nextDraw.getTime() - FIRST_DRAW.getTime()
  const round = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1

  return {
    round,
    nextDraw,
    salesCloseAt,
    isBeforeDraw: now.getTime() < nextDraw.getTime(),
  }
}

// ═══════════════════════════════════════════════════════════════
// 당첨 등위 (2024~2025 평균 기준)
// ═══════════════════════════════════════════════════════════════
const PRIZE_INFO = [
  { rank: 1, match: '6개 번호 일치',    prob: '1 / 8,145,060', amount: '평균 약 20억원',   color: '#fbbf24' },
  { rank: 2, match: '5개 + 보너스볼',   prob: '1 / 1,357,510', amount: '평균 약 5,000만원', color: '#94a3b8' },
  { rank: 3, match: '5개 번호 일치',    prob: '1 / 35,724',    amount: '평균 약 140만원',   color: '#f97316' },
  { rank: 4, match: '4개 번호 일치',    prob: '1 / 733',       amount: '50,000원',          color: '#3b82f6' },
  { rank: 5, match: '3개 번호 일치',    prob: '1 / 45',        amount: '5,000원',           color: '#10b981' },
]

// 동행복권 공식 공 색상
function getBallColor(num: number): { bg: string; text: string; glow: string } {
  if (num <= 10) return { bg: 'bg-yellow-400', text: 'text-yellow-900', glow: 'shadow-yellow-400/60' }
  if (num <= 20) return { bg: 'bg-blue-500',   text: 'text-white',      glow: 'shadow-blue-500/60' }
  if (num <= 30) return { bg: 'bg-red-500',    text: 'text-white',      glow: 'shadow-red-500/60' }
  if (num <= 40) return { bg: 'bg-gray-300',   text: 'text-gray-900',   glow: 'shadow-gray-300/60' }
  return          { bg: 'bg-green-500', text: 'text-white', glow: 'shadow-green-500/60' }
}

// 암호학적 난수 사용 (Math.random 보다 분산 균일)
function secureRandomInt(maxExclusive: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1)
    // 균등분포 보정 (rejection sampling)
    const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive
    let r: number
    do {
      crypto.getRandomValues(arr)
      r = arr[0]
    } while (r >= limit)
    return r % maxExclusive
  }
  return Math.floor(Math.random() * maxExclusive)
}

function generateOneGame(): number[] {
  const set = new Set<number>()
  while (set.size < 6) set.add(secureRandomInt(45) + 1)
  return Array.from(set).sort((a, b) => a - b)
}

function generateGames(count: number): number[][] {
  return Array.from({ length: count }, () => generateOneGame())
}

// ═══════════════════════════════════════════════════════════════
// 요일·날짜 한국어 포맷
// ═══════════════════════════════════════════════════════════════
const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']
function formatDrawDate(d: Date): string {
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${WEEKDAY[d.getDay()]}) 20:45`
}

// 남은 시간 포맷 (예: "3일 12시간 남음")
function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) return '추첨 중'
  const totalSec = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  if (days > 0) return `${days}일 ${hours}시간 남음`
  if (hours > 0) return `${hours}시간 ${mins}분 남음`
  return `${mins}분 남음`
}

// ═══════════════════════════════════════════════════════════════
// 메인 컴포넌트
// ═══════════════════════════════════════════════════════════════
export default function LottoPage() {
  const [mounted, setMounted] = useState(false)
  const [gameCount, setGameCount] = useState(5)
  const [games, setGames] = useState<number[][]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [tick, setTick] = useState(0) // 카운트다운 리렌더 트리거

  // Hydration 안전: 클라이언트에서만 마운트
  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setTick(t => t + 1), 60_000) // 1분마다 카운트다운 갱신
    return () => clearInterval(id)
  }, [])

  const info = useMemo(() => getLottoInfo(), [tick])

  const stats = useMemo(() => {
    if (games.length === 0) return null
    const all = games.flat()
    const odd = all.filter(n => n % 2 === 1).length
    const even = all.length - odd
    const high = all.filter(n => n > 22).length
    const low = all.length - high
    const avgSum = Math.round(games.reduce((s, g) => s + g.reduce((a, b) => a + b, 0), 0) / games.length)
    return { odd, even, high, low, avgSum }
  }, [games])

  const handleGenerate = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setCopiedIdx(null)
    const duration = games.length === 0 ? 1200 : 600
    setTimeout(() => {
      setGames(generateGames(gameCount))
      setIsSpinning(false)
    }, duration)
  }, [isSpinning, games.length, gameCount])

  const handleCopy = useCallback(async (idx: number, nums: number[]) => {
    try {
      await navigator.clipboard.writeText(nums.join(', '))
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1600)
    } catch {
      /* noop */
    }
  }, [])

  if (!mounted) return null

  const countdown = formatCountdown(info.nextDraw.getTime() - Date.now())
  const hasGenerated = games.length > 0

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* ═══ 히어로 ═══ */}
      <div className="text-center pt-6 pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 mb-5"
        >
          <Sparkles className="w-4 h-4 text-amber-400" aria-hidden />
          <span>제 {info.round.toLocaleString()}회차 — {formatDrawDate(info.nextDraw)}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight"
        >
          이번 주 로또
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
            행운의 번호
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-1.5 text-white/60 text-sm"
        >
          <Clock className="w-4 h-4" aria-hidden />
          <span data-copyable>{countdown}</span>
          <span className="text-white/30 mx-1">·</span>
          <span className="text-white/40">판매마감 {info.salesCloseAt.getHours()}:{String(info.salesCloseAt.getMinutes()).padStart(2, '0')}</span>
        </motion.div>
      </div>

      {/* ═══ 생성 카드 ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(147,51,234,0.12) 50%, rgba(59,130,246,0.08) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.35) 0%, transparent 60%)' }}
          aria-hidden
        />

        <div className="relative p-6 md:p-10">
          {/* 게임 수 선택 */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-white/50 font-medium">게임 수</span>
            <div className="flex gap-1 bg-black/20 rounded-lg p-1">
              {[1, 3, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setGameCount(n)}
                  disabled={isSpinning}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    gameCount === n
                      ? 'bg-white text-slate-900'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  aria-pressed={gameCount === n}
                  aria-label={`${n}게임 생성`}
                >
                  {n}게임
                </button>
              ))}
            </div>
          </div>

          {/* 번호 공 영역 */}
          <div className="flex flex-col gap-3 mb-7 min-h-[64px]">
            <AnimatePresence mode="popLayout">
              {!hasGenerated && !isSpinning ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center gap-2"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center"
                    >
                      <span className="text-white/20 text-lg font-bold">?</span>
                    </div>
                  ))}
                </motion.div>
              ) : isSpinning ? (
                <motion.div
                  key="spinning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center gap-2"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold text-white/50"
                    >
                      ···
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                // 실제 생성된 게임들 (여러 조합)
                games.map((nums, gameIdx) => (
                  <motion.div
                    key={`game-${gameIdx}-${nums.join(',')}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gameIdx * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-white/35 text-xs font-mono w-5 shrink-0">{String.fromCharCode(65 + gameIdx)}</span>
                    <div className="flex gap-1.5 md:gap-2 flex-1 flex-wrap justify-center">
                      {nums.map((num, i) => {
                        const c = getBallColor(num)
                        return (
                          <motion.div
                            key={`${gameIdx}-${num}`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: gameIdx * 0.08 + i * 0.05 }}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${c.bg} ${c.text} ${c.glow} shadow-lg flex items-center justify-center text-sm md:text-base font-extrabold num`}
                            data-copyable
                          >
                            {num}
                          </motion.div>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => handleCopy(gameIdx, nums)}
                      className="shrink-0 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label={`${String.fromCharCode(65 + gameIdx)} 게임 번호 복사`}
                    >
                      {copiedIdx === gameIdx ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* 생성 버튼 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isSpinning}
            aria-label="로또 번호 새로 생성"
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              isSpinning
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-white/10'
            }`}
          >
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} aria-hidden />
            {hasGenerated ? `다시 뽑기 (${gameCount}게임)` : `행운의 번호 뽑기 (${gameCount}게임)`}
          </motion.button>

          {/* 통계 (전체 게임 합산) */}
          {hasGenerated && !isSpinning && stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center"
            >
              <div>
                <p className="text-xs text-white/50 mb-1">평균 합계</p>
                <p className="text-xl md:text-2xl font-extrabold text-white tabular-nums" data-copyable>{stats.avgSum}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">홀짝 (홀:짝)</p>
                <p className="text-xl md:text-2xl font-extrabold text-white tabular-nums">{stats.odd}:{stats.even}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">고저 (≤22:≥23)</p>
                <p className="text-xl md:text-2xl font-extrabold text-white tabular-nums">{stats.low}:{stats.high}</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 광고: Google 자동광고(Auto Ads)로 자동 배치 */}

      {/* ═══ 당첨 등위 ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-6"
        aria-labelledby="prize-heading"
      >
        <h2 id="prize-heading" className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-amber-400" aria-hidden /> 당첨 등위 안내
        </h2>
        <div className="flex flex-col gap-3">
          {PRIZE_INFO.map((prize, i) => (
            <motion.div
              key={prize.rank}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: prize.color, boxShadow: `0 4px 16px ${prize.color}50` }}
                aria-hidden
              >
                {prize.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">{prize.rank}등 · {prize.match}</span>
                  <span className="text-xs font-bold text-amber-300">{prize.amount}</span>
                </div>
                <div className="text-xs text-white/40 mt-0.5">당첨 확률 {prize.prob}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 유의사항 ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-6"
        aria-labelledby="notice-heading"
      >
        <h2 id="notice-heading" className="font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-white/40" aria-hidden /> 알아두세요
        </h2>
        <ul className="text-sm text-white/55 space-y-2 list-disc list-inside">
          <li>모든 번호는 암호학적 난수(<code className="text-white/70">crypto.getRandomValues</code>)로 생성됩니다.</li>
          <li>동행복권 실제 추첨과는 무관하며 당첨을 보장하지 않습니다.</li>
          <li>추첨: 매주 토요일 20:45 / 판매마감: 토요일 20:00 (나눔로또 방송 기준)</li>
          <li>건전한 게임문화를 위해 1인당 주 1회 5,000원 이내 구매를 권장합니다.</li>
          <li>로또 구매는 성인(만 19세 이상)만 가능합니다.</li>
        </ul>
      </motion.section>

      {/* ═══ 관련 계산기 ═══ */}
      <nav className="flex flex-wrap gap-2 pb-4" aria-label="관련 계산기">
        {[
          { href: '/salary',   label: '연봉 실수령액', icon: Zap },
          { href: '/savings',  label: '적금 이자',     icon: Coins },
          { href: '/mortgage', label: '대출 이자',     icon: ChevronRight },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="text-sm px-4 py-2.5 rounded-xl glass-card text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Icon className="w-3.5 h-3.5" aria-hidden /> {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
