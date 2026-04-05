'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSavingsStore } from '@/store'
import { calcSavings, SavingsType, InterestType } from '@/lib/savings'
import { PiggyBank } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SavingsPage() {
  const { type, amount, annualRate, months, interestType, set } = useSavingsStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() =>
    calcSavings({ type, amount, annualRate, months, interestType }),
    [type, amount, annualRate, months, interestType]
  )

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <PiggyBank className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">적금/예금 이자 계산기</h1>
          <p className="text-sm text-white/60">이자소득세 15.4% 차감 후 세후 수익 자동 계산</p>
        </div>
      </div>

      {/* 입력 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        {/* 유형 선택 */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">상품 유형</label>
          <div className="grid grid-cols-2 gap-2">
            {([['savings','정기적금','매월 납입'], ['deposit','정기예금','일시 예치']] as [SavingsType, string, string][]).map(([v, label, desc]) => (
              <button
                key={v}
                onClick={() => set({ type: v })}
                className={`rounded-xl p-3 border transition-all text-left ${
                  type === v
                    ? 'border-amber-400/60 bg-amber-500/20 text-amber-300'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-sm">{label}</div>
                <div className="text-[11px] opacity-60 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 금액 */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            {type === 'savings' ? '월 납입액' : '예치 원금'}
          </label>
          <div className="relative">
            <NumericInput
              className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold pr-10"
              value={amount}
              defaultValue={1_000_000}
              onChange={(n) => set({ amount: n })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">원</span>
          </div>
          <p className="text-xs text-white/40 mt-1">{formatKRW(amount)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">연이율 (%)</label>
            <NumericInput
              className="glass-input w-full rounded-xl px-4 py-3 font-bold"
              value={annualRate}
              defaultValue={3.5}
              allowDecimal
              onChange={(n) => set({ annualRate: n })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">기간 (개월)</label>
            <select
              className="glass-select w-full rounded-xl px-4 py-3"
              value={months}
              onChange={(e) => set({ months: Number(e.target.value) })}
            >
              {[3,6,12,18,24,36,48,60].map(m => (
                <option key={m} value={m}>{m}개월 ({m >= 12 ? `${m/12}년` : `${m}달`})</option>
              ))}
            </select>
          </div>
        </div>

        {/* 이자 방식 */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">이자 방식</label>
          <div className="grid grid-cols-2 gap-2">
            {([['simple','단리','원금에만 이자'], ['compound','복리','이자에도 이자']] as [InterestType, string, string][]).map(([v, label, desc]) => (
              <button
                key={v}
                onClick={() => set({ interestType: v })}
                className={`rounded-xl p-3 border transition-all text-left ${
                  interestType === v
                    ? 'border-amber-400/60 bg-amber-500/20 text-amber-300'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-sm">{label}</div>
                <div className="text-[11px] opacity-60 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/30 ring-1 ring-white/20 ring-inset">
        <p className="text-sm opacity-80 mb-1">만기 수령액 (세후)</p>
        <p className="text-5xl font-extrabold tracking-tight">{formatKRW(result.maturityAmount)}</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs opacity-70">납입 원금</p>
            <p className="font-bold">{formatKRW(result.principal)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs opacity-70">세후 이자</p>
            <p className="font-bold">+{formatKRW(result.netInterest)}</p>
          </div>
        </div>
      </div>

      {/* 세금 상세 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">이자 세금 상세</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: '세전 이자',           value: result.grossInterest,  color: 'text-white' },
            { label: '이자소득세 (15.4%)',   value: -result.taxAmount,     color: 'text-red-400' },
            { label: '세후 이자',            value: result.netInterest,    color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between py-2 border-b border-white/12 last:border-0">
              <span className="text-sm text-white/60">{label}</span>
              <span className={`text-sm font-semibold ${color}`}>{value < 0 ? '-' : ''}{formatKRW(Math.abs(value))}</span>
            </div>
          ))}
          <div className="flex justify-between py-2">
            <span className="text-sm text-white/60">실효 연이율</span>
            <span className="text-sm font-semibold text-amber-400">{result.effectiveRate.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* 광고 슬롯 */}
      <div id="adsense-savings" className="w-full min-h-[90px] glass-card rounded-xl flex items-center justify-center text-xs text-white/30">광고 영역</div>

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/mortgage',label:'대출 이자'},{href:'/jeonse',label:'전월세 전환'}].map(({href,label})=>(
          <a key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</a>
        ))}
      </div>
    </div>
  )
}
