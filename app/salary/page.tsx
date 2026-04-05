'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSalaryStore } from '@/store'
import { calcSalary } from '@/lib/salary'
import { Wallet, Info } from 'lucide-react'

function formatKRW(n: number) {
  return n.toLocaleString('ko-KR') + '원'
}

const relatedLinks = [
  { href: '/mortgage', label: '대출 이자 계산기' },
  { href: '/severance', label: '퇴직금 계산기' },
  { href: '/savings', label: '적금 이자 계산기' },
]

export default function SalaryPage() {
  const { annualSalary, dependents, children, set } = useSalaryStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() =>
    calcSalary({ annualSalary, dependents, children }),
    [annualSalary, dependents, children]
  )

  if (!mounted) return null

  const deductions = [
    { label: '국민연금 (4.75%)', value: result.pension, color: 'bg-blue-400' },
    { label: '건강보험 (3.595%)', value: result.health, color: 'bg-emerald-400' },
    { label: '장기요양 (건강보험×13.14%)', value: result.care, color: 'bg-teal-400' },
    { label: '고용보험 (0.9%)', value: result.employment, color: 'bg-cyan-400' },
    { label: '근로소득세', value: result.incomeTax, color: 'bg-violet-400' },
    { label: '지방소득세 (소득세×10%)', value: result.localTax, color: 'bg-pink-400' },
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">연봉 실수령액 계산기</h1>
          <p className="text-sm text-white/60">2026년 최신 4대보험·소득세 기준</p>
        </div>
      </div>

      {/* 입력 카드 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">연봉 (세전)</label>
          <div className="relative">
            <input
              type="number"
              className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold pr-10"
              value={annualSalary}
              min={1_000_000}
              max={1_000_000_000}
              step={1_000_000}
              onChange={(e) => set({ annualSalary: Number(e.target.value) })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">원</span>
          </div>
          <p className="text-xs text-white/40 mt-1">{formatKRW(annualSalary)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">부양가족 수 <span className="text-xs font-normal text-white/40">(본인 포함)</span></label>
            <select
              className="glass-select w-full rounded-xl px-4 py-3"
              value={dependents}
              onChange={(e) => set({ dependents: Number(e.target.value) })}
            >
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">20세 미만 자녀 수</label>
            <select
              className="glass-select w-full rounded-xl px-4 py-3"
              value={children}
              onChange={(e) => set({ children: Number(e.target.value) })}
            >
              {[0,1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 결과 카드 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/30 ring-1 ring-white/20 ring-inset">
        <p className="text-sm font-medium opacity-80 mb-1">월 실수령액</p>
        <p className="text-5xl font-extrabold tracking-tight">{formatKRW(result.monthlyNet)}</p>
        <div className="flex gap-4 mt-4 text-sm opacity-80">
          <span>세전 월급 {formatKRW(result.monthlyGross)}</span>
          <span>연간 실수령 {formatKRW(result.annualNet)}</span>
        </div>
      </div>

      {/* 공제 항목 상세 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-white/40" /> 월 공제 항목 상세
        </h2>
        <div className="flex flex-col gap-3">
          {deductions.map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
              <span className="text-sm text-white/70 flex-1">{label}</span>
              <span className="text-sm font-semibold text-white">{formatKRW(value)}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-white/15 flex justify-between items-center">
            <span className="text-sm font-bold text-white/80">총 공제액</span>
            <span className="text-base font-bold text-red-400">{formatKRW(result.totalDeduction)}</span>
          </div>
        </div>

        {/* 비율 바 */}
        <div className="mt-4">
          <div className="flex rounded-full overflow-hidden h-3">
            {deductions.map(({ value, color }) => (
              <div key={color} className={color} style={{ width: `${(value / result.monthlyGross) * 100}%` }} />
            ))}
            <div className="bg-blue-600" style={{ width: `${(result.monthlyNet / result.monthlyGross) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>공제 {((result.totalDeduction / result.monthlyGross) * 100).toFixed(1)}%</span>
            <span>실수령 {((result.monthlyNet / result.monthlyGross) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* 광고 슬롯 */}
      <div id="adsense-salary" className="w-full min-h-[90px] glass-card rounded-xl flex items-center justify-center text-xs text-white/30">
        광고 영역
      </div>

      {/* SEO 텍스트 */}
      <div className="glass-card rounded-2xl p-6 text-sm text-white/60">
        <h2 className="font-bold text-white mb-3">연봉 실수령액 계산 방법 (2026년)</h2>
        <p className="mb-2">연봉 실수령액은 세전 월급에서 4대보험(국민연금·건강보험·장기요양보험·고용보험)과 근로소득세·지방소득세를 공제한 금액입니다.</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>국민연금: 월급의 4.75% (월 상한 302,575원 / 기준소득 637만원)</li>
          <li>건강보험: 월급의 3.595% (2026 인상, 총 7.19%)</li>
          <li>장기요양보험: 건강보험료의 13.14% (2026 인상)</li>
          <li>고용보험: 월급의 0.9%</li>
          <li>근로소득세: 과세표준에 따른 누진세율 적용</li>
        </ul>
      </div>

      {/* 관련 계산기 */}
      <div className="flex flex-wrap gap-2">
        {relatedLinks.map(({ href, label }) => (
          <a key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">
            → {label}
          </a>
        ))}
      </div>
    </div>
  )
}
