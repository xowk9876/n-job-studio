'use client'

import { useState, useEffect, useMemo } from 'react'
import { Ticket, RefreshCw, BarChart3, Info, Shuffle } from 'lucide-react'

// 로또 1등 ~ 5등 당첨 확률 (동행복권 공식 기준)
const LOTTO_STATS = {
  totalCombinations: 8_145_060, // 45C6
  prizes: [
    { rank: '1등', match: '6개', probability: '1 / 8,145,060', amount: '약 20억원 (변동)', color: 'from-yellow-400 to-amber-500' },
    { rank: '2등', match: '5개 + 볼', probability: '1 / 1,357,510', amount: '약 5천만원 (변동)', color: 'from-gray-300 to-gray-400' },
    { rank: '3등', match: '5개', probability: '1 / 35,724', amount: '약 140만원 (변동)', color: 'from-amber-600 to-amber-700' },
    { rank: '4등', match: '4개', probability: '1 / 733', amount: '50,000원', color: 'from-blue-400 to-blue-500' },
    { rank: '5등', match: '3개', probability: '1 / 45', amount: '5,000원', color: 'from-emerald-400 to-emerald-500' },
  ],
  // 번호별 출현 통계 (2024년 기준 역대 당첨번호 분석)
  hotNumbers: [34, 43, 12, 6, 27, 39], // 자주 나온 번호
  coldNumbers: [9, 4, 18, 21, 33, 42], // 덜 나온 번호
}

function generateRandomNumbers(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

function formatKRW(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(0)}억`
  if (n >= 10_000) return `${(n / 10_000).toFixed(0)}만`
  return n.toLocaleString('ko-KR')
}

export default function LottoPage() {
  const [mounted, setMounted] = useState(false)
  const [numbers, setNumbers] = useState<number[]>([])
  const [history, setHistory] = useState<number[][]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setMounted(true)
    setNumbers(generateRandomNumbers())
  }, [])

  const generateNew = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newNumbers = generateRandomNumbers()
      setHistory(prev => [numbers, ...prev].slice(0, 10))
      setNumbers(newNumbers)
      setIsGenerating(false)
    }, 300)
  }

  const numberAnalysis = useMemo(() => {
    const sum = numbers.reduce((a, b) => a + b, 0)
    const avg = sum / 6
    const oddCount = numbers.filter(n => n % 2 === 1).length
    const evenCount = 6 - oddCount
    const highCount = numbers.filter(n => n > 23).length
    const lowCount = 6 - highCount
    return { sum, avg: avg.toFixed(1), oddCount, evenCount, highCount, lowCount }
  }, [numbers])

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0">
          <Ticket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">로또 번호 생성기</h1>
          <p className="text-sm text-white/55 mt-0.5">무작위 번호 생성 + 당첨 통계 분석</p>
        </div>
      </div>

      {/* 번호 생성기 카드 */}
      <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl p-8 text-white shadow-xl shadow-rose-500/30 ring-1 ring-white/20 ring-inset">
        <div className="flex justify-center gap-3 mb-6">
          {numbers.map((num, i) => (
            <div
              key={`${num}-${i}`}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 ${
                isGenerating ? 'scale-90 opacity-50' : 'scale-100 opacity-100'
              } ${
                num <= 10 ? 'bg-yellow-400 text-yellow-900' :
                num <= 20 ? 'bg-blue-400 text-blue-900' :
                num <= 30 ? 'bg-red-400 text-red-900' :
                num <= 40 ? 'bg-gray-300 text-gray-900' :
                'bg-green-400 text-green-900'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <button
          onClick={generateNew}
          disabled={isGenerating}
          className="w-full py-4 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          새로운 번호 생성
        </button>

        {/* 번호 분석 */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="opacity-70 mb-1">번호 합계</p>
            <p className="font-bold text-lg">{numberAnalysis.sum}</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">홀짝 비율</p>
            <p className="font-bold text-lg">{numberAnalysis.oddCount}:{numberAnalysis.evenCount}</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">고저 비율</p>
            <p className="font-bold text-lg">{numberAnalysis.lowCount}:{numberAnalysis.highCount}</p>
          </div>
        </div>
      </div>

      {/* 번호 히스토리 */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-rose-400" /> 최근 생성 번호
          </h2>
          <div className="flex flex-col gap-2">
            {history.map((nums, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-white/40 w-8">#{idx + 1}</span>
                <div className="flex gap-1">
                  {nums.map(n => (
                    <span key={n} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 당첨 확률 및 금액 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-rose-400" /> 당첨 확률 및 금액
        </h2>
        <div className="flex flex-col gap-3">
          {LOTTO_STATS.prizes.map((prize) => (
            <div key={prize.rank} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${prize.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {prize.rank.replace('등', '')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-white">{prize.match}</span>
                  <span className="text-xs text-white/50">{prize.probability}</span>
                </div>
                <p className="text-xs text-white/60 truncate">{prize.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 번호 출현 통계 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">역대 출현 통계 (2024년 기준)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-rose-400 font-semibold mb-2">자주 나온 번호 (Hot)</p>
            <div className="flex flex-wrap gap-2">
              {LOTTO_STATS.hotNumbers.map(n => (
                <span key={n} className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-sm font-bold">
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-blue-400 font-semibold mb-2">덜 나온 번호 (Cold)</p>
            <div className="flex flex-wrap gap-2">
              {LOTTO_STATS.coldNumbers.map(n => (
                <span key={n} className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-sm font-bold">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 유의사항 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-white/40" /> 유의사항
        </h2>
        <ul className="text-sm text-white/60 space-y-2 list-disc list-inside">
          <li>로또는 완전한 무작위 추첨입니다. 이 생성기는 단순 랜덤 번호를 제공할 뿐 당첨을 보장하지 않습니다.</li>
          <li>통계는 역대 당첨 번호 분석 결과이며, 미래 추첨 결과와는 무관합니다.</li>
          <li>건전한 게임문화를 위해 1인당 주 1회(5,000원) 이내로 구매하시기 바랍니다.</li>
          <li>미성년자는 복권을 구매할 수 없습니다.</li>
        </ul>
      </div>

      {/* 관련 계산기 */}
      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/savings',label:'적금 이자'},{href:'/mortgage',label:'대출 이자'}].map(({href,label})=>{
          return (
            <a key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</a>
          )
        })}
      </div>
    </div>
  )
}
