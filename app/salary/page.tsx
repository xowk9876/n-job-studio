'use client'

import { useMemo, useState } from 'react'
import { useSalaryStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcSalary, MIN_HOURLY_WAGE_2026 } from '@/lib/salary'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { officialSources } from '@/lib/content-sources'

function won(n: number) { return n.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) + '원' }

const CALC_PATH = '/salary'
const calcSeo = getCalculatorLinks(CALC_PATH)

export default function SalaryPage() {
  const s = useSalaryStore()
  usePersistRehydrate(useSalaryStore)
  const [showAllowance, setShowAllowance] = useState(false)
  const [showExempt, setShowExempt] = useState(false)

  const r = useMemo(() => calcSalary({
    annualSalary: s.annualSalary,
    dependents: s.dependents,
    children: s.children,
    overtimeHours: s.overtimeHours,
    nightHours: s.nightHours,
    holidayHours: s.holidayHours,
    holidayOver8Hours: s.holidayOver8Hours,
    mealAllowance: s.mealAllowance,
    transportAllowance: s.transportAllowance,
  }), [s])

  const underMinWage = r.hourlyWage < MIN_HOURLY_WAGE_2026
  const hasAllowance = r.totalAllowance > 0

  return (
    <div className="calc-page">
      {r.error && <p role="alert" className="glass-card text-[color:var(--danger)]">{r.error}</p>}
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
          <NumericInput ariaLabel="연봉 (세전, 만원)"
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
            <select aria-label="공제대상 가족 수 (본인 포함)" className="glass-select" value={s.dependents} onChange={(e) => s.set({ dependents: Number(e.target.value), children: Math.min(s.children, Number(e.target.value) - 1) })}>
              {[1,2,3,4,5,6,7,8,9,10,11].map(n => <option key={n} value={n}>{n}명</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">자녀 <span className="text-[10.5px] font-normal text-white/35">(간이세액표 8~20세)</span></label>
            <select aria-label="간이세액표상 8~20세 자녀 수" className="glass-select" value={s.children} onChange={(e) => s.set({ children: Number(e.target.value) })}>
              {Array.from({ length: s.dependents }, (_, i) => i).map(n => <option key={n} value={n}>{n}명</option>)}
            </select>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[color:var(--sub)]">월 원천징수 100% 기준 · 2026.2.27 간이세액표 적용. 보험료는 신고 보수·가입 조건에 따라 실제 급여명세서와 차이가 날 수 있습니다. 수당은 주 40시간·월 209시간과 입력 연봉 전액을 통상임금으로 가정합니다.</p>
      {s.holidayReviewRequired && <p role="status" className="glass-card text-sm text-[color:var(--warn)]">휴일근로 계산 방식을 개선했습니다. 이전의 월 합계는 하루별 8시간 초과 여부를 알 수 없어 초기화했으니, 추가 수당에서 두 구간을 다시 입력해주세요.</p>}
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
            <p className="text-xs text-[color:var(--sub)]">예: 서로 다른 휴일에 8시간씩 일했다면 이내 16시간·초과 0시간입니다. 한 휴일에 10시간이면 이내 8시간·초과 2시간입니다.</p>
            {[
              { label: '연장근로 (×1.5)', val: s.overtimeHours, pay: r.overtimePay, max: 80, onChange: (v:number) => s.set({ overtimeHours: v }) },
              { label: '야간근로 (22~06시, +0.5)', val: s.nightHours, pay: r.nightPay, max: 40, onChange: (v:number) => s.set({ nightHours: v }) },
              { label: '휴일별 8시간 이내의 월 합계 (×1.5)', val: s.holidayHours, pay: Math.round(r.hourlyWage * 1.5 * s.holidayHours), max: 248, onChange: (v:number) => s.set({ holidayHours: v, holidayReviewRequired: false }) },
              { label: '휴일별 8시간 초과분의 월 합계 (×2)', val: s.holidayOver8Hours, pay: Math.round(r.hourlyWage * 2 * s.holidayOver8Hours), max: 248, onChange: (v:number) => s.set({ holidayOver8Hours: v, holidayReviewRequired: false }) },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[12px] font-semibold text-white/80">{row.label}</label>
                  <span className="text-[11.5px] text-[color:var(--brand)] tabular">{row.val}h · {won(row.pay)}</span>
                </div>
                <input type="range" min={0} max={row.max} step={1} value={row.val} aria-label={`${row.label} 시간`} onChange={(e) => row.onChange(Number(e.target.value))} />
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
                <NumericInput ariaLabel="월 식대 (만원)"  className="glass-input w-full rounded-lg pr-12 text-[13.5px]" value={s.mealAllowance} defaultValue={200_000} unitMultiplier={10000} onChange={(n) => s.set({ mealAllowance: n })} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
              </div>
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-white/75 mb-1.5">차량유지비 <span className="text-[10px] text-white/40 font-normal">(월 20만원)</span></label>
              <div className="relative">
                <NumericInput ariaLabel="월 차량유지비 (만원)"  className="glass-input w-full rounded-lg pr-12 text-[13.5px]" value={s.transportAllowance} defaultValue={0} unitMultiplier={10000} onChange={(n) => s.set({ transportAllowance: n })} />
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
        <ExamplesSection title="연봉별 월 실수령액 (본인 1인)" items={[36_000_000, 50_000_000].map(annualSalary => ({
          label: `연봉 ${(annualSalary / 10000).toLocaleString('ko-KR')}만원`, input: '본인 1명 · 식대 20만원 · 수당 없음',
          result: won(calcSalary({ annualSalary, dependents: 1, children: 0, overtimeHours: 0, nightHours: 0, holidayHours: 0, mealAllowance: 200_000, transportAllowance: 0 }).monthlyNet),
          note: '간이세액표 100% · 2026년 7월 이후 보험료 기준',
        }))} />
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '어떤 기준으로 실수령액을 계산하나요?', a: '2026년 4대보험과 2026.2.27 개정 근로소득 간이세액표의 원천징수 100% 기준을 적용합니다. 국민연금 상·하한은 2026년 7월 이후 기준입니다. 신고 보수, 보험료 정산, 상여금과 연말정산 공제에 따라 실제 급여명세서와 달라질 수 있습니다.' },
          { q: '부양가족과 자녀 수는 어떻게 입력하나요?', a: '공제대상 가족 수에는 본인을 포함하세요. 연령·소득 등 기본공제 요건을 충족하는 가족 중 8~20세 자녀 수를 별도로 입력합니다. 월 간이세액표의 자녀 차감액과 연말정산 자녀세액공제는 구분해야 합니다.' },
          { q: '식대·차량유지비는 모두 비과세인가요?', a: '아닙니다. 식대와 자가운전보조금은 각각 월 20만원 한도와 법정 요건을 충족한 실제 지급분만 비과세로 입력하세요. 식사 제공 여부, 업무용 차량 사용과 비용 정산 방식 등은 급여 담당자에게 확인하세요.' },
          { q: '추가 수당은 어떻게 계산하나요?', a: '주 40시간·월 209시간과 입력 연봉 전액을 통상임금으로 가정합니다. 5인 이상 사업장의 일반적인 가산 기준으로 연장 1.5배, 야간 추가 0.5배, 휴일별 8시간 이내 1.5배·초과분 2배를 적용합니다. 근무 형태와 실제 통상임금에 따라 달라집니다.' },
          { q: '2026년 최저임금은 얼마인가요?', a: '시급 10,320원, 주 40시간·유급주휴 포함 월 209시간 기준 2,156,880원입니다. 계산기의 환산시급만으로 최저임금 위반 여부를 확정할 수는 없습니다.' },
        ]} />
        <TipsSection title="입력 전 확인사항" items={[
          { title: '비과세 중복 입력 확인', desc: '연봉에 포함된 식대·자가운전보조금 중 비과세 대상 금액을 입력하세요. 연봉 외 별도 지급액인지도 확인해야 합니다.' },
          { title: '연말정산과 월 원천징수 구분', desc: '연금저축·IRP·월세 등 연말정산 공제는 이 계산에 포함되지 않습니다. 세액공제 한도만큼 현금 환급이 보장되는 것은 아닙니다.' },
          { title: '회사 급여명세서와 대조', desc: '차이가 나면 신고 보수, 원천징수 선택비율, 상여금·보험료 정산 여부부터 확인하세요.' },
        ]} />
        <OfficialSourcesSection sources={officialSources[CALC_PATH]} />
        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
