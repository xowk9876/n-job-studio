'use client'

import { useMemo, useState, useEffect } from 'react'
import { useMortgageStore } from '@/store'
import { calcMortgage, RepaymentType } from '@/lib/mortgage'
import { Home, ChevronDown, ChevronUp } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }
function formatManwon(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`
  if (n >= 10_000) return `${Math.floor(n / 10_000)}만`
  return n.toLocaleString()
}

const REPAYMENT_TYPES: { value: RepaymentType; label: string; desc: string }[] = [
  { value: 'equal-payment',   label: '원리금균등', desc: '매달 같은 금액 납부 (가장 일반적)' },
  { value: 'equal-principal', label: '원금균등',   desc: '매달 원금 동일, 이자는 감소' },
  { value: 'bullet',          label: '만기일시',   desc: '매달 이자만, 만기에 원금 상환' },
]

export default function MortgagePage() {
  const { principal, annualRate, years, type, set } = useMortgageStore()
  const [mounted, setMounted] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() =>
    calcMortgage({ principal, annualRate, years, type }),
    [principal, annualRate, years, type]
  )

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">주택담보대출 이자 계산기</h1>
          <p className="text-sm text-white/60">원리금균등·원금균등·만기일시 3가지 방식 비교</p>
        </div>
      </div>

      {/* 입력 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">대출금액</label>
          <NumericInput
            className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold"
            value={principal}
            defaultValue={300_000_000}
            unitMultiplier={10000}
            onChange={(n) => set({ principal: n })}
          />
          <p className="text-xs text-white/40 mt-1">= {formatKRW(principal)} ({formatManwon(principal)})</p>
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
            <label className="block text-sm font-semibold text-white/80 mb-2">대출기간 (년)</label>
            <select
              className="glass-select w-full rounded-xl px-4 py-3"
              value={years}
              onChange={(e) => set({ years: Number(e.target.value) })}
            >
              {[5,10,15,20,25,30,35,40].map(y => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">상환 방식</label>
          <div className="grid grid-cols-3 gap-2">
            {REPAYMENT_TYPES.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => set({ type: value })}
                className={`rounded-xl p-3 text-left border transition-all ${
                  type === value
                    ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-bold">{label}</div>
                <div className="text-[10px] mt-0.5 opacity-60">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/30 ring-1 ring-white/20 ring-inset">
        <p className="text-sm opacity-80 mb-1">
          {type === 'equal-payment' ? '월 납입액' : type === 'equal-principal' ? '첫 달 납입액' : '월 이자 (만기 전)'}
        </p>
        <p className="text-5xl font-extrabold tracking-tight">{formatKRW(result.monthlyPayment)}</p>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div><p className="text-xs opacity-70">총 납입액</p><p className="font-bold">{formatManwon(result.totalPayment)}</p></div>
          <div><p className="text-xs opacity-70">총 이자</p><p className="font-bold">{formatManwon(result.totalInterest)}</p></div>
          <div><p className="text-xs opacity-70">이자 비율</p><p className="font-bold">{result.interestRatio.toFixed(1)}%</p></div>
        </div>
      </div>

      {/* 광고 슬롯 */}
      <div id="adsense-mortgage" className="w-full min-h-[90px] glass-card rounded-xl flex items-center justify-center text-xs text-white/30">광고 영역</div>

      {/* 상환 스케줄 */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-white/80 hover:bg-white/5 transition-colors"
          onClick={() => setShowSchedule(!showSchedule)}
        >
          월별 상환 스케줄 ({years * 12}개월)
          {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showSchedule && (
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <tr>
                  {['회차','납입액','원금','이자','잔여원금'].map(h => (
                    <th key={h} className="px-3 py-2 text-right text-white/50 font-semibold first:text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-t border-white/8 hover:bg-white/5">
                    <td className="px-3 py-2 text-white/60">{row.month}회</td>
                    <td className="px-3 py-2 text-right font-medium text-white/80">{row.payment.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-blue-400">{row.principal.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-red-400">{row.interest.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-white/50">{row.remaining.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/severance',label:'퇴직금'},{href:'/jeonse',label:'전월세'}].map(({href,label})=>(
          <a key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</a>
        ))}
      </div>
    </div>
  )
}
