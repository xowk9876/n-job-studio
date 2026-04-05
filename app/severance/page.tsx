'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSeveranceStore } from '@/store'
import { calcSeverance } from '@/lib/severance'
import { Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SeverancePage() {
  const { avgMonthly3, annualBonus, startDate, endDate, set } = useSeveranceStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() =>
    calcSeverance({ avgMonthly3, annualBonus, startDate, endDate }),
    [avgMonthly3, annualBonus, startDate, endDate]
  )

  if (!mounted) return null

  const workYearsLabel = `${Math.floor(result.workYears)}년 ${Math.floor((result.workYears % 1) * 12)}개월`

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">퇴직금 계산기</h1>
          <p className="text-sm text-white/60">근로기준법 기준 — 세전 퇴직금 자동 계산</p>
        </div>
      </div>

      {/* 입력 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            최근 3개월 평균 월급 <span className="text-xs font-normal text-white/40">(세전, 상여 제외)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold pr-10"
              value={avgMonthly3}
              step={100_000}
              onChange={(e) => set({ avgMonthly3: Number(e.target.value) })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">원</span>
          </div>
          <p className="text-xs text-white/40 mt-1">{formatKRW(avgMonthly3)}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            직전 1년 연간 상여금 <span className="text-xs font-normal text-white/40">(없으면 0)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-10"
              value={annualBonus}
              step={100_000}
              min={0}
              onChange={(e) => set({ annualBonus: Number(e.target.value) })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">입사일</label>
            <input
              type="date"
              className="glass-input w-full rounded-xl px-4 py-3"
              value={startDate}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">퇴직일</label>
            <input
              type="date"
              className="glass-input w-full rounded-xl px-4 py-3"
              value={endDate}
              onChange={(e) => set({ endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 결과 */}
      {!result.isEligible ? (
        <div className="glass-card rounded-2xl p-6 flex items-start gap-3" style={{ borderColor: 'rgba(245,158,11,0.35)' }}>
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">퇴직금 수급 불가</p>
            <p className="text-sm text-amber-400/80 mt-1">재직 기간이 {result.workDays}일({workYearsLabel})로 1년 미만입니다. 퇴직금은 1년 이상 근무 시 지급됩니다.</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/30 ring-1 ring-white/20 ring-inset">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 opacity-80" />
            <p className="text-sm opacity-80">세전 퇴직금 (예상)</p>
          </div>
          <p className="text-5xl font-extrabold tracking-tight">{formatKRW(result.severancePay)}</p>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div><p className="text-xs opacity-70">재직 기간</p><p className="font-bold">{workYearsLabel}</p></div>
            <div><p className="text-xs opacity-70">총 재직일수</p><p className="font-bold">{result.workDays.toLocaleString()}일</p></div>
            <div><p className="text-xs opacity-70">1일 평균임금</p><p className="font-bold">{formatKRW(result.dailyWage)}</p></div>
          </div>
        </div>
      )}

      {/* 광고 슬롯 */}
      <div id="adsense-severance" className="w-full min-h-[90px] glass-card rounded-xl flex items-center justify-center text-xs text-white/30">광고 영역</div>

      {/* 계산 방법 */}
      <div className="glass-card rounded-2xl p-6 text-sm text-white/60">
        <h2 className="font-bold text-white mb-3">퇴직금 계산 방법</h2>
        <div className="rounded-xl p-4 font-mono text-xs mb-3 text-white/70" style={{ background: 'rgba(255,255,255,0.06)' }}>
          퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
        </div>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>1일 평균임금 = 최근 3개월 총 임금 ÷ 91일</li>
          <li>연간 상여금이 있으면 3개월분(÷4)을 합산합니다</li>
          <li>1년 미만 근무 시 퇴직금 없음 (단시간근로자 제외)</li>
          <li>실제 세금(퇴직소득세)은 국세청 홈택스에서 확인하세요</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/savings',label:'적금 이자'},{href:'/mortgage',label:'대출 이자'}].map(({href,label})=>(
          <a key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</a>
        ))}
      </div>
    </div>
  )
}
