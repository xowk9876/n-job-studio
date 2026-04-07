'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSalaryStore } from '@/store'
import { calcSalary, MIN_HOURLY_WAGE_2026 } from '@/lib/salary'
import { Wallet, Info, ChevronDown, Clock, Moon, CalendarCheck, AlertTriangle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'

function formatKRW(n: number) {
  return n.toLocaleString('ko-KR') + '원'
}

const relatedLinks = [
  { href: '/mortgage', label: '대출 이자 계산기' },
  { href: '/severance', label: '퇴직금 계산기' },
  { href: '/savings', label: '적금 이자 계산기' },
]

export default function SalaryPage() {
  const store = useSalaryStore()
  const {
    annualSalary, dependents, children,
    overtimeHours, nightHours, holidayHours,
    mealAllowance, transportAllowance,
    set,
  } = store

  const [mounted, setMounted] = useState(false)
  const [showAllowance, setShowAllowance] = useState(false)
  const [showTaxFree, setShowTaxFree] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() =>
    calcSalary({
      annualSalary, dependents, children,
      overtimeHours, nightHours, holidayHours,
      mealAllowance, transportAllowance,
    }),
    [annualSalary, dependents, children, overtimeHours, nightHours, holidayHours, mealAllowance, transportAllowance]
  )

  if (!mounted) return null

  const isMinWageWarning = result.hourlyWage < MIN_HOURLY_WAGE_2026
  const hasAllowance = result.totalAllowance > 0

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
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">연봉 실수령액 계산기</h1>
          <p className="text-sm text-white/55 mt-0.5">2026년 최신 4대보험·소득세·수당 기준</p>
        </div>
      </div>

      {/* 최저임금 경고 */}
      {isMinWageWarning && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-500/30">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            현재 통상시급 <span className="font-bold">{formatKRW(result.hourlyWage)}</span>은
            2026년 최저임금 <span className="font-bold">{formatKRW(MIN_HOURLY_WAGE_2026)}</span> 미만입니다.
          </p>
        </div>
      )}

      {/* ═══ 기본 정보 입력 ═══ */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">연봉 (세전)</label>
          <div className="relative">
            <NumericInput
              className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold pr-14"
              value={annualSalary}
              defaultValue={48_000_000}
              unitMultiplier={10000}
              onChange={(n) => set({ annualSalary: n })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">만원</span>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-white/40">= {formatKRW(annualSalary)}</p>
            <p className="text-xs text-blue-400/80">통상시급 {formatKRW(result.hourlyWage)}</p>
          </div>
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

      {/* ═══ 추가 수당 (접이식) ═══ */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowAllowance(!showAllowance)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white/80">추가 수당 (연장·야간·휴일)</span>
            {hasAllowance && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                +{formatKRW(result.totalAllowance)}
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${showAllowance ? 'rotate-180' : ''}`} />
        </button>

        {showAllowance && (
          <div className="px-6 pb-6 flex flex-col gap-5 border-t border-white/10 pt-5">
            {/* 연장근로 */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> 연장근로 <span className="text-xs text-white/40 font-normal">(통상 1.5배)</span>
                </label>
                <span className="text-sm text-blue-400 num">{overtimeHours}시간 = {formatKRW(result.overtimePay)}</span>
              </div>
              <input
                type="range" min={0} max={80} step={1}
                value={overtimeHours}
                onChange={(e) => set({ overtimeHours: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>0시간</span><span>40시간</span><span>80시간</span>
              </div>
            </div>

            {/* 야간근로 */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-violet-400" /> 야간근로 <span className="text-xs text-white/40 font-normal">(22시~06시, +0.5배)</span>
                </label>
                <span className="text-sm text-violet-400 num">{nightHours}시간 = {formatKRW(result.nightPay)}</span>
              </div>
              <input
                type="range" min={0} max={40} step={1}
                value={nightHours}
                onChange={(e) => set({ nightHours: Number(e.target.value) })}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>0시간</span><span>20시간</span><span>40시간</span>
              </div>
            </div>

            {/* 휴일근로 */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" /> 휴일근로 <span className="text-xs text-white/40 font-normal">(8h 이내 1.5배 / 초과 2배)</span>
                </label>
                <span className="text-sm text-emerald-400 num">{holidayHours}시간 = {formatKRW(result.holidayPay)}</span>
              </div>
              <input
                type="range" min={0} max={32} step={1}
                value={holidayHours}
                onChange={(e) => set({ holidayHours: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>0시간</span><span>16시간</span><span>32시간</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ 비과세 항목 (접이식) ═══ */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowTaxFree(!showTaxFree)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white/80">비과세 항목 (식대·차량유지비)</span>
            {result.taxExempt > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                비과세 {formatKRW(result.taxExempt)}
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${showTaxFree ? 'rotate-180' : ''}`} />
        </button>

        {showTaxFree && (
          <div className="px-6 pb-6 flex flex-col gap-5 border-t border-white/10 pt-5">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">식대 <span className="text-xs font-normal text-white/40">(비과세 한도 월 20만원)</span></label>
              <div className="relative">
                <NumericInput
                  className="glass-input w-full rounded-xl px-4 py-3 pr-14"
                  value={mealAllowance}
                  defaultValue={200_000}
                  unitMultiplier={10000}
                  onChange={(n) => set({ mealAllowance: n })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">만원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">차량유지비 <span className="text-xs font-normal text-white/40">(비과세 한도 월 20만원)</span></label>
              <div className="relative">
                <NumericInput
                  className="glass-input w-full rounded-xl px-4 py-3 pr-14"
                  value={transportAllowance}
                  defaultValue={0}
                  unitMultiplier={10000}
                  onChange={(n) => set({ transportAllowance: n })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">만원</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ 결과 카드 ═══ */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/30 ring-1 ring-white/20 ring-inset">
        <p className="text-sm font-medium opacity-80 mb-1">월 실수령액</p>
        <p className="text-5xl font-extrabold tracking-tight result-value">{formatKRW(result.monthlyNet)}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm opacity-80">
          <span>세전 총급여 <span className="num font-semibold">{formatKRW(result.monthlyGross)}</span></span>
          <span>연간 실수령 <span className="num font-semibold">{formatKRW(result.annualNet)}</span></span>
        </div>
        {/* 수당/비과세 요약 배지 */}
        {(hasAllowance || result.taxExempt > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {hasAllowance && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm">
                수당 포함 +{formatKRW(result.totalAllowance)}
              </span>
            )}
            {result.taxExempt > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm">
                비과세 {formatKRW(result.taxExempt)} 제외
              </span>
            )}
          </div>
        )}
      </div>

      {/* ═══ 수당 상세 (수당 있을 때만) ═══ */}
      {hasAllowance && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" /> 수당 상세
          </h2>
          <div className="flex flex-col gap-3">
            {result.overtimePay > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span className="text-sm text-white/70 flex-1">연장수당 ({overtimeHours}h × {formatKRW(result.hourlyWage)} × 1.5)</span>
                <span className="text-sm font-semibold text-white num">{formatKRW(result.overtimePay)}</span>
              </div>
            )}
            {result.nightPay > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                <span className="text-sm text-white/70 flex-1">야간 가산 ({nightHours}h × {formatKRW(result.hourlyWage)} × 0.5)</span>
                <span className="text-sm font-semibold text-white num">{formatKRW(result.nightPay)}</span>
              </div>
            )}
            {result.holidayPay > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-sm text-white/70 flex-1">휴일수당 ({holidayHours}h)</span>
                <span className="text-sm font-semibold text-white num">{formatKRW(result.holidayPay)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/15 flex justify-between items-center">
              <span className="text-sm font-bold text-white/80">총 수당합계</span>
              <span className="text-base font-bold text-blue-400">{formatKRW(result.totalAllowance)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 공제 항목 상세 ═══ */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-white/40" /> 월 공제 항목 상세
        </h2>
        {result.taxExempt > 0 && (
          <p className="text-xs text-emerald-400/70 mb-3">
            과세 기준 월급여: {formatKRW(result.taxableMonthly)} (비과세 {formatKRW(result.taxExempt)} 제외)
          </p>
        )}
        <div className="flex flex-col gap-3">
          {deductions.map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
              <span className="text-sm text-white/70 flex-1">{label}</span>
              <span className="text-sm font-semibold text-white num">{formatKRW(value)}</span>
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
        <p className="mb-2">연봉 실수령액은 세전 월급에서 4대보험(국민연금·건강보험·장기요양보험·고용보험)과 근로소득세·지방소득세를 공제한 금액입니다. 연장·야간·휴일근로수당과 식대·차량유지비 비과세 항목을 정확히 반영합니다.</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>국민연금: 월 과세급여의 4.75% (월 상한 302,575원)</li>
          <li>건강보험: 월 과세급여의 3.595% (2026 인상, 총 7.19%)</li>
          <li>장기요양보험: 건강보험료의 13.14% (2026 인상)</li>
          <li>고용보험: 월 과세급여의 0.9%</li>
          <li>연장수당: 통상시급 × 1.5 × 연장시간 (근로기준법 §56①)</li>
          <li>야간수당: 통상시급 × 0.5 가산 (22:00~06:00, §56③)</li>
          <li>휴일수당: 통상시급 × 1.5 (8h 이내) / 2.0 (8h 초과, §56②)</li>
          <li>식대 비과세: 월 20만원 한도 (소득세법 시행령 §12)</li>
          <li>차량유지비 비과세: 월 20만원 한도</li>
          <li>2026년 최저임금: 시급 10,320원 (월 2,156,880원)</li>
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
