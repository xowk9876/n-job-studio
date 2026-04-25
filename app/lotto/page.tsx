'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw, Trophy, TrendingUp, Info, Zap, Coins, ChevronRight } from 'lucide-react'

// ==========================
// 실시간 동행복권 회차 계산
// ==========================
// 로또 1회차: 2002년 12월 7일 (토요일)
// 이후 매주 토요일 추첨
function getCurrentLottoRound(): { round: number; nextDrawDate: Date } {
  const firstDraw = new Date('2002-12-07')
  const now = new Date()

  // 현재 시점 기준 지난 토요일 찾기
  const lastSaturday = new Date(now)
  const dayOfWeek = lastSaturday.getDay() // 0=일, 6=토
  const daysSinceLastSaturday = (dayOfWeek + 1) % 7
  lastSaturday.setDate(lastSaturday.getDate() - daysSinceLastSaturday)
  lastSaturday.setHours(0, 0, 0, 0)

  // 다음 추첨일 = 이번 토요일 (지난 토요일 + 7일), 만약 지금이 토요일이고 추첨 전이면 = 이번 토요일
  const nextDraw = new Date(lastSaturday)
  nextDraw.setDate(nextDraw.getDate() + 7)

  // 1회차 ~ 현재까지의 주 차이 계산
  const diffMs = lastSaturday.getTime() - firstDraw.getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))
  const currentRound = diffWeeks + 1

  return { round: currentRound, nextDrawDate: nextDraw }
}

// 로또 당첨 확률 및 금액 (동행복권 공식)
const PRIZE_INFO = [
  { rank: 1, match: '6개 번호 일치', prob: '1 / 8,145,060', amount: '약 20억원', color: '#fbbf24', glow: 'shadow-amber-500/50' },
  { rank: 2, match: '5개 + 보너스볼', prob: '1 / 1,357,510', amount: '약 5,000만원', color: '#94a3b8', glow: 'shadow-slate-400/50' },
  { rank: 3, match: '5개 번호 일치', prob: '1 / 35,724', amount: '약 140만원', color: '#f97316', glow: 'shadow-orange-500/50' },
  { rank: 4, match: '4개 번호 일치', prob: '1 / 733', amount: '50,000원', color: '#3b82f6', glow: 'shadow-blue-500/50' },
  { rank: 5, match: '3개 번호 일치', prob: '1 / 45', amount: '5,000원', color: '#10b981', glow: 'shadow-emerald-500/50' },
]

// 번호별 실제 로또 공 색상
function getBallColor(num: number): { bg: string; text: string; glow: string } {
  if (num <= 10) return { bg: 'bg-yellow-400', text: 'text-yellow-900', glow: 'shadow-yellow-400/60' }
  if (num <= 20) return { bg: 'bg-blue-500', text: 'text-white', glow: 'shadow-blue-500/60' }
  if (num <= 30) return { bg: 'bg-red-500', text: 'text-white', glow: 'shadow-red-500/60' }
  if (num <= 40) return { bg: 'bg-gray-300', text: 'text-gray-900', glow: 'shadow-gray-300/60' }
  return { bg: 'bg-green-500', text: 'text-white', glow: 'shadow-green-500/60' }
}

function generateNumbers(): number[] {
  const set = new Set<number>()
  while (set.size < 6) set.add(Math.floor(Math.random() * 45) + 1)
  return Array.from(set).sort((a, b) => a - b)
}

export default function LottoPage() {
  const [mounted, setMounted] = useState(false)
  const [numbers, setNumbers] = useState<number[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [history, setHistory] = useState<number[][]>([])

  useEffect(() => { setMounted(true) }, [])

  const handleGenerate = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)

    // 스핀 애니메이션 후 결과
    const spinDuration = hasGenerated ? 800 : 1500
    setTimeout(() => {
      const newNums = generateNumbers()
      if (hasGenerated) {
        setHistory(prev => [numbers, ...prev].slice(0, 5))
      }
      setNumbers(newNums)
      setIsSpinning(false)
      setHasGenerated(true)
    }, spinDuration)
  }, [isSpinning, hasGenerated, numbers])

  const { round, nextDrawDate } = getCurrentLottoRound()
  const nextDrawStr = `${nextDrawDate.getMonth() + 1}월 ${nextDrawDate.getDate()}일 (${['일','월','화','수','목','금','토'][nextDrawDate.getDay()]}) 추첨`

  // 번호 분석
  const stats = (() => {
    if (numbers.length === 0) return null
    const sum = numbers.reduce((a, b) => a + b, 0)
    const odd = numbers.filter(n => n % 2 === 1).length
    const even = 6 - odd
    const high = numbers.filter(n => n > 23).length
    const low = 6 - high
    return { sum, odd, even, high, low }
  })()

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* ===== 히어로 랜딩 ===== */}
      <div className="text-center pt-6 pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 mb-5"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          {round}회차 동행복권 기준 — {nextDrawStr}
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/55 text-base max-w-md mx-auto"
        >
          완전 무작위로 생성된 {numbers.length > 0 ? '6개 번호' : '번호를 확인해보세요'}
        </motion.p>
      </div>

      {/* ===== 번호 생성 카드 ===== */}
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
        {/* 상단 빛 효과 */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.35) 0%, transparent 60%)' }}
        />

        <div className="relative p-8 md:p-10">
          {/* 번호 공 — 미생성 시 플레이스홀더 */}
          <div className="flex justify-center gap-3 mb-8 min-h-[64px]">
            <AnimatePresence mode="popLayout">
              {!hasGenerated ? (
                // 초기 상태: 빈 공 플레이스홀더
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`placeholder-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center"
                  >
                    <span className="text-white/20 text-lg font-bold">?</span>
                  </motion.div>
                ))
              ) : isSpinning ? (
                // 스핀 중: 색상만 있는 공
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`spin-${i}`}
                    animate={{
                      y: [0, -12, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      delay: i * 0.05,
                    }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/15 flex items-center justify-center text-lg font-bold text-white/50 shadow-lg"
                  >
                    ...
                  </motion.div>
                ))
              ) : (
                // 결과: 실제 번호
                numbers.map((num, i) => {
                  const color = getBallColor(num)
                  return (
                    <motion.div
                      key={num}
                      initial={{ scale: 0, rotate: -180, y: 20 }}
                      animate={{ scale: 1, rotate: 0, y: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                        delay: i * 0.1,
                      }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${color.bg} ${color.text} ${color.glow} shadow-xl flex items-center justify-center text-xl md:text-2xl font-extrabold select-none`}
                      style={{
                        textShadow: num <= 20 && num > 10 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                      }}
                    >
                      {num}
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>

          {/* 생성 버튼 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={isSpinning}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              isSpinning
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-white/10'
            }`}
          >
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            {hasGenerated ? '다시 뽑기' : '행운의 번호 뽑기'}
          </motion.button>

          {/* 번호 분석 */}
          {stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center"
            >
              <div>
                <p className="text-xs text-white/50 mb-1">번호 합계</p>
                <p className="text-2xl font-extrabold text-white">{stats.sum}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">홀짝</p>
                <p className="text-2xl font-extrabold text-white">{stats.odd}:{stats.even}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">고저</p>
                <p className="text-2xl font-extrabold text-white">{stats.low}:{stats.high}</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ===== 당첨 확률 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-amber-400" /> 당첨 등위 안내
        </h2>
        <div className="flex flex-col gap-3">
          {PRIZE_INFO.map((prize, i) => (
            <motion.div
              key={prize.rank}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: prize.color, boxShadow: `0 4px 16px ${prize.color}50` }}
              >
                {prize.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">{prize.match}</span>
                  <span className="text-xs font-bold text-amber-300">{prize.amount}</span>
                </div>
                <div className="text-xs text-white/40 mt-0.5">당첨 확률: {prize.prob}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== 히스토리 ===== */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> 최근 뽑은 번호
          </h2>
          <div className="flex flex-col gap-3">
            {history.map((nums, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-white/30 text-sm w-8 font-mono">#{idx + 1}</span>
                <div className="flex gap-1.5">
                  {nums.map(n => {
                    const c = getBallColor(n)
                    return (
                      <span key={n} className={`w-8 h-8 rounded-full ${c.bg} ${c.text} flex items-center justify-center text-xs font-bold`}>
                        {n}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== 유의사항 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-white/40" /> 알아두세요
        </h2>
        <ul className="text-sm text-white/55 space-y-2 list-disc list-inside">
          <li>이 생성기는 완전 무작위(랜덤)로 번호를 생성합니다. 당첨을 보장하지 않습니다.</li>
          <li>동행복권의 실제 추첨과는 무관하며, 생성된 번호는 참고용입니다.</li>
          <li>건전한 게임문화를 위해 1인당 주 1회(5,000원) 이내로 구매하시기 바랍니다.</li>
          <li>로또 구매는 성인(만 19세 이상)만 가능합니다.</li>
        </ul>
      </motion.div>

      {/* ===== 관련 계산기 ===== */}
      <div className="flex flex-wrap gap-2 pb-4">
        {[
          { href: '/salary', label: '연봉 실수령액', icon: Zap },
          { href: '/savings', label: '적금 이자', icon: Coins },
          { href: '/mortgage', label: '대출 이자', icon: ChevronRight },
        ].map(({ href, label, icon: Icon }) => (
          <a key={href} href={href} className="text-sm px-4 py-2.5 rounded-xl glass-card text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" /> {label}
          </a>
        ))}
      </div>
    </div>
  )
}
