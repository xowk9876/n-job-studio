'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw, Trophy, TrendingUp, Info, Zap, Coins } from 'lucide-react'

// 로또 당첨 확률 및 금액 (동행복권 공식)
const PRIZE_INFO = [
  { rank: 1, match: '6개 번호', prob: '1 / 8,145,060', amount: '약 20억원', color: '#fbbf24', shadow: 'shadow-amber-500/50' },
  { rank: 2, match: '5개 + 보너스', prob: '1 / 1,357,510', amount: '약 5,000만원', color: '#94a3b8', shadow: 'shadow-slate-400/50' },
  { rank: 3, match: '5개 번호', prob: '1 / 35,724', amount: '약 140만원', color: '#f97316', shadow: 'shadow-orange-500/50' },
  { rank: 4, match: '4개 번호', prob: '1 / 733', amount: '50,000원', color: '#3b82f6', shadow: 'shadow-blue-500/50' },
  { rank: 5, match: '3개 번호', prob: '1 / 45', amount: '5,000원', color: '#10b981', shadow: 'shadow-emerald-500/50' },
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

// 당첨금 시뮬레이션 (랜덤)
function simulatePrize(): string {
  const rand = Math.random()
  if (rand < 1 / 8_145_060) return '🎉 1등 당첨! 약 20억원'
  if (rand < 1 / 1_357_510) return '✨ 2등 당첨! 약 5,000만원'
  if (rand < 1 / 35_724) return '💰 3등 당첨! 약 140만원'
  if (rand < 1 / 733) return '🎯 4등 당첨! 5만원'
  if (rand < 1 / 45) return '⭐ 5등 당첨! 5천원'
  return '아쉽지만 꽝... 다시 도전!'
}

export default function LottoPage() {
  const [mounted, setMounted] = useState(false)
  const [numbers, setNumbers] = useState<number[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [showPrize, setShowPrize] = useState(false)
  const [prizeResult, setPrizeResult] = useState('')
  const [history, setHistory] = useState<number[][]>([])

  useEffect(() => { setMounted(true); setNumbers(generateNumbers()) }, [])

  const handleGenerate = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setShowPrize(false)

    // 스핀 애니메이션 후 결과
    setTimeout(() => {
      const newNums = generateNumbers()
      setHistory(prev => [numbers, ...prev].slice(0, 5))
      setNumbers(newNums)
      setIsSpinning(false)
      setPrizeResult(simulatePrize())
      setShowPrize(true)
    }, 1200)
  }, [isSpinning, numbers])

  const stats = useMemo(() => {
    const sum = numbers.reduce((a, b) => a + b, 0)
    const odd = numbers.filter(n => n % 2 === 1).length
    const even = 6 - odd
    const high = numbers.filter(n => n > 23).length
    const low = 6 - high
    return { sum, odd, even, high, low }
  }, [numbers])

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* ===== 히어로 랜딩 섹션 ===== */}
      <div className="text-center pt-6 pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 mb-5"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          행운의 번호를 생성해보세요
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight"
        >
          <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
            로또 번호 생성기
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/55 text-base max-w-md mx-auto"
        >
          무작위 번호를 생성하고 당첨금 시뮬레이션으로 행운을 만나보세요
        </motion.p>
      </div>

      {/* ===== 메인 번호 생성 카드 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(236,72,153,0.25) 0%, rgba(147,51,234,0.15) 50%, rgba(59,130,246,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* 빛나는 효과 */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.4) 0%, transparent 60%)',
          }}
        />

        <div className="relative p-8 md:p-10">
          {/* 번호 공들 */}
          <div className="flex justify-center gap-3 mb-8">
            <AnimatePresence mode="popLayout">
              {(isSpinning ? Array.from({ length: 6 }, (_, i) => 1 + i * 7) : numbers).map((num, i) => {
                const color = getBallColor(num)
                return (
                  <motion.div
                    key={`${num}-${isSpinning ? 'spin' : 'real'}-${i}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      y: isSpinning ? [0, -8, 0] : 0,
                    }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: i * 0.08,
                      y: { repeat: isSpinning ? Infinity : 0, duration: 0.4 },
                    }}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${color.bg} ${color.text} ${color.glow} shadow-lg flex items-center justify-center text-xl md:text-2xl font-extrabold cursor-default select-none`}
                    style={{
                      textShadow: num <= 20 ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {isSpinning ? '?' : num}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* 생성 버튼 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={isSpinning}
            className={`w-full py-4.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              isSpinning
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/30 text-white shadow-lg shadow-white/10'
            }`}
          >
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? '번호 생성 중...' : '행운의 번호 뽑기'}
          </motion.button>

          {/* 결과 메시지 */}
          <AnimatePresence>
            {showPrize && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="mt-5 text-center"
              >
                <div className="inline-block px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-lg">
                  {prizeResult}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 번호 분석 */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
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
          </div>
        </div>
      </motion.div>

      {/* ===== 당첨 확률 카드 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-amber-400" /> 당첨 확률 & 예상금액
        </h2>
        <div className="flex flex-col gap-3">
          {PRIZE_INFO.map((prize, i) => (
            <motion.div
              key={prize.rank}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: prize.color, boxShadow: `0 4px 20px ${prize.color}40` }}
              >
                {prize.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-sm font-semibold text-white">{prize.match}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">{prize.prob}</span>
                  <span className="text-xs font-bold text-amber-300">{prize.amount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== 번호 히스토리 ===== */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> 최근 생성 번호
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

      {/* ===== 건전한 게임 안내 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-white/40" /> 유의사항
        </h2>
        <ul className="text-sm text-white/55 space-y-2 list-disc list-inside">
          <li>로또는 완전 무작위 추첨입니다. 이 생성기는 단순 랜덤 번호를 제공할 뿐, 당첨을 보장하지 않습니다.</li>
          <li>당첨금 시뮬레이션은 재미용이며 실제 당첨 결과와 무관합니다.</li>
          <li>건전한 게임문화를 위해 1인당 주 1회(5,000원) 이내로 구매하시기 바랍니다.</li>
          <li>미성년자는 복권을 구매할 수 없습니다.</li>
        </ul>
      </motion.div>

      {/* ===== 관련 계산기 ===== */}
      <div className="flex flex-wrap gap-2 pb-4">
        {[
          { href: '/salary', label: '연봉 실수령액', icon: Zap },
          { href: '/savings', label: '적금 이자', icon: Coins },
          { href: '/mortgage', label: '대출 이자', icon: TrendingUp },
        ].map(({ href, label, icon: Icon }) => (
          <a key={href} href={href} className="text-sm px-4 py-2 rounded-xl glass-card text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" /> {label}
          </a>
        ))}
      </div>
    </div>
  )
}
