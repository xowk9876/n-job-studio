'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSalaryStore } from '@/store'
import { calcSalary, MIN_HOURLY_WAGE_2026 } from '@/lib/salary'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'

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
          { q: '2026년 4대보험 요율은 얼마인가요?', a: '국민연금 9.5%(근로자 4.75%), 건강보험 7.19%(근로자 3.595%), 장기요양보험은 건강보험료의 13.14%, 고용보험 실업급여분 1.8%(근로자 0.9%)입니다. 산재보험은 전액 사업주 부담이라 근로자 급여에서 공제되지 않습니다. 근거: 국민연금법 제88조, 국민건강보험법 제69조, 노인장기요양보험법 제9조, 고용보험 및 산업재해보상보험의 보험료징수 등에 관한 법률.' },
          { q: '식대·차량유지비 비과세 한도는?', a: '식대는 월 20만원까지(2023년 개정 소득세법 시행령 제17조의2), 자가운전보조금(차량유지비)은 월 20만원까지(본인 명의 차량 + 업무 사용 증빙 필요), 출산·보육수당은 6세 이하 자녀 양육 시 월 20만원까지 비과세입니다. 실제 지급이 아닌 명목상 항목이면 국세청이 부인할 수 있습니다.' },
          { q: '부양가족공제와 자녀세액공제는 어떻게 적용되나요?', a: '기본공제 1인당 연 150만원(본인·배우자·부양가족). 2026년부터 자녀세액공제는 첫째 25만원, 둘째 30만원, 셋째부터 1인당 40만원입니다(2024년 세법개정 반영). 70세 이상 부모는 경로우대 공제 연 100만원이 추가됩니다. 근거: 소득세법 제50조·제59조의2.' },
          { q: '월세 세액공제를 받을 수 있나요?', a: '총급여 8,000만원 이하(종합소득금액 7,000만원 이하) 무주택 세대주가 국민주택규모(85㎡) 이하 또는 기준시가 4억원 이하 주택에 월세를 지급하면 연 1,000만원 한도 내 월세의 15% 세액공제. 총급여 5,500만원 이하라면 17% 공제. 근거: 조세특례제한법 제95조의2.' },
          { q: '주휴수당은 어떻게 계산되나요?', a: '1주 소정근로시간이 15시간 이상인 근로자가 개근했을 때 1일분 임금을 유급으로 추가 지급합니다. 월 209시간 기준에 이미 주휴수당이 포함되어 있습니다(주 40시간 × 4.345주 + 주휴 8시간 × 4.345주 ≒ 209). 근거: 근로기준법 제55조.' },
          { q: '연장·야간·휴일근로 가산수당은?', a: '5인 이상 사업장에서 연장근로(1일 8시간·주 40시간 초과) 50% 가산, 야간근로(22:00–06:00) 50% 가산, 휴일근로 8시간 이내 50%·8시간 초과분 100% 가산을 각각 적용합니다(중복 적용 가능). 근거: 근로기준법 제56조.' },
          { q: '2026년 최저임금은 얼마인가요?', a: '시급 10,320원, 월 209시간 기준 2,156,880원입니다(2025.8.5 고용노동부 고시 제2025-55호). 모든 사업장·업종에 동일 적용됩니다.' },
        ]} />
        <TipsSection title="절세 · 실수령액 늘리기" items={[
          { title: '비과세 항목 구조화', desc: '식대 20만, 자가운전보조금 20만, 6세 이하 자녀 보육수당 20만을 급여명세서 별도 항목으로 잡으면 과세표준이 월 최대 60만원 감소합니다. 회사 HR에 요청해 조정 가능.' },
          { title: '연금저축 + IRP 최대 납입', desc: '연금저축 연 600만원 + IRP 연 900만원 통합 한도(중복 포함 900만). 총급여 5,500만 이하는 16.5%, 초과는 13.2% 세액공제. 2026년 연말정산 시 최대 148만원 환급 가능. 근거: 조세특례제한법 제91조의3·4.' },
          { title: '부양가족 범위 재확인', desc: '60세 이상 부모(소득금액 100만원 이하), 20세 이하 자녀, 60세 이상·20세 이하 형제자매도 기본공제 대상. 따로 사는 부모도 실제 부양 사실을 증빙하면 공제 가능합니다.' },
          { title: '주택청약종합저축 소득공제', desc: '총급여 7,000만원 이하 무주택 세대주가 연 납입액 300만원 한도 내 40% 소득공제. 연 최대 120만원 소득공제. 근거: 조세특례제한법 제87조.' },
        ]} />
        <OfficialSourcesSection sources={[
          '국세청 근로소득 간이세액표 및 소득세법 제134조',
          '국민연금법, 국민건강보험법, 노인장기요양보험법, 고용보험료 고시',
          '고용노동부 2026년 최저임금 고시와 근로기준법 수당 기준',
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
