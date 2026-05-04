'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSalaryStore } from '@/store'
import { calcSalary, MIN_HOURLY_WAGE_2026 } from '@/lib/salary'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SalaryPage() {
  const s = useSalaryStore()
  const [mounted, setMounted] = useState(false)
  const [showAllowance, setShowAllowance] = useState(false)
  const [showExempt, setShowExempt] = useState(false)
  useEffect(() => setMounted(true), [])

  const r = useMemo(() => calcSalary({
    annualSalary: s.annualSalary,
    dependents: s.dependents,
    children: s.children,
    overtimeHours: s.overtimeHours,
    nightHours: s.nightHours,
    holidayHours: s.holidayHours,
    mealAllowance: s.mealAllowance,
    transportAllowance: s.transportAllowance,
  }), [s])

  if (!mounted) return null

  const underMinWage = r.hourlyWage < MIN_HOURLY_WAGE_2026
  const hasAllowance = r.totalAllowance > 0

  return (
    <div className="calc-page">
      {/* 페이지 헤더 */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">SALARY</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">연봉 실수령액 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">2026년 4대보험·소득세 기준</p>
      </div>

      {/* 결과 카드 — 항상 최상단 */}
      <div className="result-card">
        <p className="result-label">월 실수령액</p>
        <p className="result-value">{won(r.monthlyNet)}</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-[11.5px]">
          <div className="bg-white/[0.10] rounded-lg px-2.5 py-2">
            <div className="opacity-70 text-[10.5px]">세전 월급</div>
            <div className="font-semibold tabular mt-0.5">{won(r.monthlyGross)}</div>
          </div>
          <div className="bg-white/[0.10] rounded-lg px-2.5 py-2">
            <div className="opacity-70 text-[10.5px]">연 실수령</div>
            <div className="font-semibold tabular mt-0.5">{won(r.annualNet)}</div>
          </div>
        </div>
      </div>

      {underMinWage && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/12 border border-amber-500/25">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-[12.5px] text-amber-200">통상시급 {won(r.hourlyWage)} — 2026 최저임금 {won(MIN_HOURLY_WAGE_2026)} 미만</p>
        </div>
      )}

      {/* 입력 카드 */}
      <div className="glass-card">
        <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">연봉 (세전)</label>
        <div className="relative">
          <NumericInput
            className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14"
            value={s.annualSalary}
            defaultValue={48_000_000}
            unitMultiplier={10000}
            onChange={(n) => s.set({ annualSalary: n })}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
        </div>
        <div className="flex justify-between mt-1.5 text-[11.5px]">
          <span className="text-white/40">= {won(s.annualSalary)}</span>
          <span className="text-[color:var(--brand)]">시급 {won(r.hourlyWage)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">부양가족 <span className="text-[10.5px] font-normal text-white/35">(본인포함)</span></label>
            <select className="glass-select" value={s.dependents} onChange={(e) => s.set({ dependents: Number(e.target.value) })}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}명</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">20세 미만 자녀</label>
            <select className="glass-select" value={s.children} onChange={(e) => s.set({ children: Number(e.target.value) })}>
              {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}명</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 수당 접이식 */}
      <div className="glass-card !p-0 overflow-hidden">
        <button onClick={() => setShowAllowance(!showAllowance)} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-white/85">추가 수당</span>
            {hasAllowance && <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">+{won(r.totalAllowance)}</span>}
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showAllowance ? 'rotate-180' : ''}`} />
        </button>
        {showAllowance && (
          <div className="px-4 pb-4 flex flex-col gap-4 border-t border-white/10 pt-4">
            {[
              { label: '연장근로 (×1.5)', val: s.overtimeHours, pay: r.overtimePay, max: 80, onChange: (v:number) => s.set({ overtimeHours: v }) },
              { label: '야간근로 (22~06시, +0.5)', val: s.nightHours, pay: r.nightPay, max: 40, onChange: (v:number) => s.set({ nightHours: v }) },
              { label: '휴일근로 (8h내 ×1.5 / 초과 ×2)', val: s.holidayHours, pay: r.holidayPay, max: 32, onChange: (v:number) => s.set({ holidayHours: v }) },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[12px] font-semibold text-white/80">{row.label}</label>
                  <span className="text-[11.5px] text-[color:var(--brand)] tabular">{row.val}h · {won(row.pay)}</span>
                </div>
                <input type="range" min={0} max={row.max} step={1} value={row.val} onChange={(e) => row.onChange(Number(e.target.value))} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 비과세 접이식 */}
      <div className="glass-card !p-0 overflow-hidden">
        <button onClick={() => setShowExempt(!showExempt)} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-white/85">비과세 (식대·차량유지비)</span>
            {r.taxExempt > 0 && <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">−{won(r.taxExempt)}</span>}
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showExempt ? 'rotate-180' : ''}`} />
        </button>
        {showExempt && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <div>
              <label className="block text-[11.5px] font-semibold text-white/75 mb-1.5">식대 <span className="text-[10px] text-white/40 font-normal">(월 20만원)</span></label>
              <div className="relative">
                <NumericInput className="glass-input w-full rounded-lg pr-12 text-[13.5px]" value={s.mealAllowance} defaultValue={200_000} unitMultiplier={10000} onChange={(n) => s.set({ mealAllowance: n })} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
              </div>
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-white/75 mb-1.5">차량유지비 <span className="text-[10px] text-white/40 font-normal">(월 20만원)</span></label>
              <div className="relative">
                <NumericInput className="glass-input w-full rounded-lg pr-12 text-[13.5px]" value={s.transportAllowance} defaultValue={0} unitMultiplier={10000} onChange={(n) => s.set({ transportAllowance: n })} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 공제 내역 */}
      <div className="glass-card">
        <h2 className="font-semibold text-[13.5px] text-white mb-3">공제 내역</h2>
        <div className="flex flex-col gap-2 text-[12.5px]">
          {[
            ['국민연금 4.75%', r.pension],
            ['건강보험 3.595%', r.health],
            ['장기요양 13.14%', r.care],
            ['고용보험 0.9%', r.employment],
            ['근로소득세', r.incomeTax],
            ['지방소득세', r.localTax],
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between">
              <span className="text-white/65">{label}</span>
              <span className="font-semibold text-white/90 tabular">{won(value as number)}</span>
            </div>
          ))}
          <div className="pt-2.5 mt-1 border-t border-white/10 flex justify-between">
            <span className="font-bold text-white/80">총 공제</span>
            <span className="font-bold text-red-300 tabular">{won(r.totalDeduction)}</span>
          </div>
        </div>
      </div>

      {/* 하단 참고 자료 */}
      <div className="mt-6 flex flex-col gap-8">
        <ExamplesSection title="연봉별 월 실수령액 (부양가족 1인)" items={[
          { label: '연봉 3,600만원', input: '월 300만원 · 식대 20만원', result: '약 2,648,000원', note: '4대보험 + 소득세 공제 후' },
          { label: '연봉 5,000만원', input: '월 416만원 · 식대 20만원', result: '약 3,586,000원', note: '4대보험 + 소득세 공제 후' },
          { label: '연봉 8,000만원', input: '월 666만원 · 식대 20만원', result: '약 5,539,000원', note: '4대보험 + 소득세 공제 후' },
        ]} />
        <FAQSection items={[
          { q: '4대보험 요율은 어떻게 되나요?', a: '국민연금 4.75%, 건강보험 3.595%, 장기요양보험(건강보험료×13.14%), 고용보험 0.9%입니다. 근로자·사업주가 절반씩 부담합니다.' },
          { q: '식대 비과세 한도는 얼마인가요?', a: '월 20만원까지 비과세입니다. 급여에 식대가 포함돼 있다면 20만원까지는 4대보험·소득세 과세 대상에서 제외됩니다.' },
          { q: '부양가족이 많으면 세금이 줄어드나요?', a: '네. 기본공제 1인당 연 150만원이 적용되며, 20세 미만 자녀에게는 자녀세액공제(첫째 25만원, 둘째 30만원, 셋째부터 40만원)가 추가됩니다.' },
          { q: '2026년 최저임금은?', a: '시급 10,320원, 월 209시간 기준 2,156,880원입니다.' },
        ]} />
        <TipsSection title="절세 팁" items={[
          { title: '비과세 항목 활용', desc: '식대(월 20만원), 차량유지비(월 20만원), 출산·보육 수당(월 20만원)을 급여에 포함시키면 과세표준이 낮아집니다.' },
          { title: '연금저축·IRP', desc: '연금저축(연 600만원) + IRP(연 900만원) 납입 시 13.2% 또는 16.5% 세액공제를 받을 수 있습니다.' },
          { title: '부양가족 확인', desc: '60세 이상 부모, 20세 미만 자녀 외에 형제자매(소득 100만원 이하)도 기본공제 대상입니다.' },
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
