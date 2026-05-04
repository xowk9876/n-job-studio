'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSalaryStore } from '@/store'
import { calcSalary, MIN_HOURLY_WAGE_2026 } from '@/lib/salary'
import { Info, ChevronDown, Clock, Moon, CalendarCheck, AlertTriangle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SalaryPage() {
  const store = useSalaryStore()
  const {
    annualSalary, dependents, children,
    overtimeHours, nightHours, holidayHours,
    mealAllowance, transportAllowance, set,
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
    { label: '장기요양 (건강×13.14%)', value: result.care, color: 'bg-teal-400' },
    { label: '고용보험 (0.9%)', value: result.employment, color: 'bg-cyan-400' },
    { label: '근로소득세', value: result.incomeTax, color: 'bg-violet-400' },
    { label: '지방소득세 (소득세×10%)', value: result.localTax, color: 'bg-sky-400' },
  ]

  return (
    <div className="calc-page">
      {/* 페이지 타이틀 */}
      <div className="mb-3 md:mb-5">
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">SALARY · 실수령액</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">연봉 실수령액 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">2026년 최신 4대보험·소득세·수당 기준 · 실시간 계산</p>
      </div>

      <div className="calc-grid">
        {/* ======================= LEFT: Inputs ======================= */}
        <div className="calc-main">
          {isMinWageWarning && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/12 border border-amber-500/25">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[12.5px] text-amber-200">
                통상시급 <b>{formatKRW(result.hourlyWage)}</b> — 2026 최저임금 {formatKRW(MIN_HOURLY_WAGE_2026)} 미만
              </p>
            </div>
          )}

          {/* 기본 입력 */}
          <div className="glass-card">
            <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">연봉 (세전)</label>
            <div className="relative">
              <NumericInput
                className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14"
                value={annualSalary}
                defaultValue={48_000_000}
                unitMultiplier={10000}
                onChange={(n) => set({ annualSalary: n })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
            </div>
            <div className="flex justify-between mt-1.5 text-[11.5px]">
              <span className="text-white/40">= {formatKRW(annualSalary)}</span>
              <span className="text-[color:var(--brand)]">시급 {formatKRW(result.hourlyWage)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[12px] font-semibold text-white/75 mb-1.5">부양가족 <span className="text-[10.5px] font-normal text-white/35">(본인포함)</span></label>
                <select
                  className="glass-select w-full rounded-xl px-3 py-2.5 text-[14px]"
                  value={dependents}
                  onChange={(e) => set({ dependents: Number(e.target.value) })}
                >
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}명</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-white/75 mb-1.5">20세 미만 자녀</label>
                <select
                  className="glass-select w-full rounded-xl px-3 py-2.5 text-[14px]"
                  value={children}
                  onChange={(e) => set({ children: Number(e.target.value) })}
                >
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}명</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 수당 접이식 */}
          <div className="glass-card !p-0 overflow-hidden">
            <button
              onClick={() => setShowAllowance(!showAllowance)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[color:var(--brand)]" />
                <span className="text-[13px] font-semibold text-white/85">추가 수당</span>
                {hasAllowance && (
                  <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                    +{formatKRW(result.totalAllowance)}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showAllowance ? 'rotate-180' : ''}`} />
            </button>
            {showAllowance && (
              <div className="px-4 pb-4 flex flex-col gap-4 border-t border-white/10 pt-4">
                {[
                  { label: '연장근로', sub: '(1.5배)', icon: <Clock className="w-3 h-3 text-blue-400" />, val: overtimeHours, pay: result.overtimePay, max: 80, mid: 40, color: 'accent-blue-500', onChange: (v:number) => set({ overtimeHours: v }), tone: 'text-blue-300' },
                  { label: '야간근로', sub: '(22~06시, +0.5배)', icon: <Moon className="w-3 h-3 text-violet-400" />, val: nightHours, pay: result.nightPay, max: 40, mid: 20, color: 'accent-violet-500', onChange: (v:number) => set({ nightHours: v }), tone: 'text-violet-300' },
                  { label: '휴일근로', sub: '(8h내 1.5배 / 초과 2배)', icon: <CalendarCheck className="w-3 h-3 text-emerald-400" />, val: holidayHours, pay: result.holidayPay, max: 32, mid: 16, color: 'accent-emerald-500', onChange: (v:number) => set({ holidayHours: v }), tone: 'text-emerald-300' },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-[12px] font-semibold text-white/80 flex items-center gap-1.5">
                        {r.icon} {r.label} <span className="text-[10.5px] text-white/35 font-normal">{r.sub}</span>
                      </label>
                      <span className={`text-[11.5px] ${r.tone} tabular`}>{r.val}h · {formatKRW(r.pay)}</span>
                    </div>
                    <input
                      type="range" min={0} max={r.max} step={1}
                      value={r.val}
                      onChange={(e) => r.onChange(Number(e.target.value))}
                      className={`w-full ${r.color}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 비과세 접이식 */}
          <div className="glass-card !p-0 overflow-hidden">
            <button
              onClick={() => setShowTaxFree(!showTaxFree)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[13px] font-semibold text-white/85">비과세 (식대·차량유지비)</span>
                {result.taxExempt > 0 && (
                  <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                    −{formatKRW(result.taxExempt)}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showTaxFree ? 'rotate-180' : ''}`} />
            </button>
            {showTaxFree && (
              <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11.5px] font-semibold text-white/75 mb-1.5">식대 <span className="text-[10px] text-white/40 font-normal">(월 20만원)</span></label>
                    <div className="relative">
                      <NumericInput
                        className="glass-input w-full rounded-lg px-3 py-2.5 pr-12 text-[13.5px]"
                        value={mealAllowance}
                        defaultValue={200_000}
                        unitMultiplier={10000}
                        onChange={(n) => set({ mealAllowance: n })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-semibold text-white/75 mb-1.5">차량유지비 <span className="text-[10px] text-white/40 font-normal">(월 20만원)</span></label>
                    <div className="relative">
                      <NumericInput
                        className="glass-input w-full rounded-lg px-3 py-2.5 pr-12 text-[13.5px]"
                        value={transportAllowance}
                        defaultValue={0}
                        unitMultiplier={10000}
                        onChange={(n) => set({ transportAllowance: n })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 공제 상세 */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[13.5px] text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-white/40" /> 공제 항목 상세
              </h2>
              {result.taxExempt > 0 && (
                <span className="text-[10.5px] text-emerald-400/80">과세 월급여 {formatKRW(result.taxableMonthly)}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {deductions.map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2.5 text-[12.5px]">
                  <div className={`w-1.5 h-1.5 rounded-full ${color} shrink-0`} />
                  <span className="text-white/65 flex-1">{label}</span>
                  <span className="font-semibold text-white/90 tabular">{formatKRW(value)}</span>
                </div>
              ))}
              <div className="pt-2.5 mt-1 border-t border-white/10 flex justify-between items-center">
                <span className="text-[12.5px] font-bold text-white/80">총 공제</span>
                <span className="text-[14px] font-bold text-red-300 tabular">{formatKRW(result.totalDeduction)}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex rounded-full overflow-hidden h-2">
                {deductions.map(({ value, color }) => (
                  <div key={color} className={color} style={{ width: `${(value / result.monthlyGross) * 100}%` }} />
                ))}
                <div className="bg-blue-600" style={{ width: `${(result.monthlyNet / result.monthlyGross) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10.5px] text-white/40 mt-1">
                <span>공제 {((result.totalDeduction / result.monthlyGross) * 100).toFixed(1)}%</span>
                <span>실수령 {((result.monthlyNet / result.monthlyGross) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================= RIGHT: Sticky Result ======================= */}
        <aside className="calc-aside">
          <div className="result-card">
            <p className="result-label">월 실수령액</p>
            <p className="result-value">{formatKRW(result.monthlyNet)}</p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11.5px]">
              <div className="bg-white/[0.08] rounded-lg px-2.5 py-2 backdrop-blur-sm">
                <div className="opacity-70 text-[10.5px]">세전 월급</div>
                <div className="font-semibold tabular mt-0.5">{formatKRW(result.monthlyGross)}</div>
              </div>
              <div className="bg-white/[0.08] rounded-lg px-2.5 py-2 backdrop-blur-sm">
                <div className="opacity-70 text-[10.5px]">연간 실수령</div>
                <div className="font-semibold tabular mt-0.5">{formatKRW(result.annualNet)}</div>
              </div>
            </div>
            {(hasAllowance || result.taxExempt > 0) && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hasAllowance && <span className="text-[10.5px] px-2 py-1 rounded-md bg-white/[0.12]">수당 +{formatKRW(result.totalAllowance)}</span>}
                {result.taxExempt > 0 && <span className="text-[10.5px] px-2 py-1 rounded-md bg-white/[0.12]">비과세 {formatKRW(result.taxExempt)}</span>}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ======================= BELOW FOLD ======================= */}
      <div className="mt-10 md:mt-14 flex flex-col gap-10">
        <ExamplesSection title="연봉별 실수령액 (2026, 부양가족 1인)" items={[
          { label: '신입 · 연봉 3,600만원', input: '월 기본급 300만원 · 식대 20만원', result: '월 실수령 약 2,648,000원', note: '4대보험 + 소득세 공제 후' },
          { label: '대리 · 연봉 5,000만원', input: '월 기본급 416만원 · 식대 20만원', result: '월 실수령 약 3,586,000원', note: '4대보험 + 소득세 공제 후' },
          { label: '과장 · 연봉 8,000만원', input: '월 기본급 666만원 · 식대 20만원', result: '월 실수령 약 5,539,000원', note: '4대보험 + 소득세 공제 후' },
        ]} />
        <FAQSection items={[
          { q: '연봉과 월급의 차이는 무엇인가요?', a: '연봉은 1년 치 세전 총액, 월급은 연봉을 12로 나눈 세전 금액입니다. 실수령액은 여기서 4대보험과 소득세를 공제한 금액입니다.' },
          { q: '4대보험이란 무엇이고 왜 공제되나요?', a: '국민연금(4.75%), 건강보험(3.595%), 장기요양보험(건강보험료×13.14%), 고용보험(0.9%)으로 구성됩니다. 근로자·사업주 절반씩 부담하며 노후·의료·실업 보장용으로 의무 납부합니다.' },
          { q: '야간·연장수당에도 세금이 붙나요?', a: '네, 수당도 과세소득입니다. 통상임금의 50%(야간), 150%(연장), 150~200%(휴일) 가산율로 계산된 금액 전체가 과세됩니다.' },
          { q: '식대 비과세는 어떻게 적용되나요?', a: '2023년 1월부터 월 20만원까지 비과세입니다. 즉 월급에 식대가 포함돼 있다면 20만원까지는 4대보험·소득세 과세 대상에서 제외됩니다.' },
          { q: '부양가족이 많을수록 세금이 줄어드나요?', a: '맞습니다. 1명당 연 150만원 기본공제가 적용되어 과세표준이 낮아지고, 20세 미만 자녀에게는 자녀세액공제도 적용됩니다.' },
          { q: '2026년 최저임금은 얼마인가요?', a: '2026년 최저임금은 시급 10,320원이며, 월 209시간 기준 2,156,880원입니다.' },
        ]} />
        <TipsSection title="직장인 절세 팁" items={[
          { title: '비과세 항목 최대 활용', desc: '식대(월 20만원), 차량유지비(월 20만원), 출산·보육 수당(월 20만원)을 급여 구조에 포함시키면 실수령액이 늘어납니다.' },
          { title: '연금저축·IRP로 소득공제', desc: '연금저축(연 600만원)+ IRP(연 900만원) 납입 시 13.2% 또는 16.5% 세액공제로 연말정산 환급이 가능합니다.' },
          { title: '부양가족 공제 확인', desc: '60세 이상 부모, 배우자, 20세 미만 자녀 외에도 형제자매(20세 이하 또는 60세 이상, 소득 100만원 이하)도 기본공제 대상이 될 수 있습니다.' },
        ]} />
        <RelatedLinks links={[
          { href: '/mortgage', label: '대출 이자' },
          { href: '/severance', label: '퇴직금' },
          { href: '/savings', label: '적금 이자' },
          { href: '/jeonse', label: '전월세 전환' },
        ]} />
      </div>
    </div>
  )
}
