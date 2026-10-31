'use client'

import { useMemo, useState } from 'react'
import { useSalaryStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcSalary, MIN_HOURLY_WAGE_2026 } from '@/lib/salary'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'

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
        <ExamplesSection title="연봉별 월 실수령액 (부양가족 1인)" items={[36_000_000, 50_000_000, 80_000_000].map(annualSalary => ({
          label: `연봉 ${(annualSalary / 10000).toLocaleString('ko-KR')}만원`, input: '본인 1명 · 식대 20만원 · 수당 없음',
          result: won(calcSalary({ annualSalary, dependents: 1, children: 0, overtimeHours: 0, nightHours: 0, holidayHours: 0, mealAllowance: 200_000, transportAllowance: 0 }).monthlyNet),
          note: '간이세액표 100% · 2026년 7월 이후 보험료 기준',
        }))} />
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '2026년 4대보험 요율은 얼마인가요?', a: '국민연금 9.5%(근로자 4.75%), 건강보험 7.19%(근로자 3.595%), 장기요양보험은 건강보험료의 13.14%, 고용보험 실업급여분 1.8%(근로자 0.9%)입니다. 국민연금은 기준소득월액 상한 659만원(2026.7~2027.6) 기준 월 공제 상한 313,025원입니다. 산재보험은 전액 사업주 부담입니다. 근거: 국민연금법 제88조, 국민건강보험법 제69조, 노인장기요양보험법 제9조.' },
          { q: '식대·차량유지비 비과세 한도는?', a: '식대는 월 20만원까지(2023년 개정 소득세법 시행령 제17조의2), 자가운전보조금(차량유지비)은 월 20만원까지(본인 명의 차량 + 업무 사용 증빙 필요), 실제 지급이 아닌 명목상 항목이면 국세청이 부인할 수 있습니다.' },
          { q: '부양가족과 자녀 수는 어떻게 입력하나요?', a: '공제대상 가족 수에 본인과 기본공제 대상 가족을 포함하세요. 월 원천징수 계산에는 시행령 별표 2의 8~20세 자녀 수를 별도로 입력합니다. 표 세액에서 자녀 1명 20,830원, 2명 45,830원, 3명부터 추가 1명당 33,330원을 차감합니다. 연말정산의 자녀공제 요건은 월 간이세액표와 구별되므로 귀속연도 국세청 안내를 확인하세요.' },
          { q: '월세 세액공제를 받을 수 있나요?', a: '총급여 8,000만원 이하(종합소득금액 7,000만원 이하) 무주택 세대주가 국민주택규모(85㎡) 이하 또는 기준시가 4억원 이하 주택에 월세를 지급하면 연 1,000만원 한도 내 월세의 15% 세액공제. 총급여 5,500만원 이하라면 17% 공제. 근거: 조세특례제한법 제95조의2.' },
          { q: '주휴수당은 어떻게 계산되나요?', a: '1주 소정근로시간이 15시간 이상인 근로자가 개근했을 때 1일분 임금을 유급으로 추가 지급합니다. 월 209시간 기준에 이미 주휴수당이 포함되어 있습니다(주 40시간 × 4.345주 + 주휴 8시간 × 4.345주 ≒ 209). 근거: 근로기준법 제55조.' },
          { q: '연장·야간·휴일근로 가산수당은?', a: '5인 이상 사업장에서 연장근로(1일 8시간·주 40시간 초과) 50% 가산, 야간근로(22:00–06:00) 50% 가산, 휴일근로 8시간 이내 50%·8시간 초과분 100% 가산을 각각 적용합니다(중복 적용 가능). 근거: 근로기준법 제56조.' },
          { q: '2026년 최저임금은 얼마인가요?', a: '시급 10,320원, 월 209시간 기준 2,156,880원입니다(2025.8.5 고용노동부 고시 제2025-55호). 모든 사업장·업종에 동일 적용됩니다. 2027년 1월 1일부터는 시급 10,700원, 월 209시간 기준 2,236,300원입니다(2026.8.5 고용노동부 고시 제2026-60호).' },
        ]} />
        <TipsSection title="절세 · 실수령액 늘리기" items={[
          { title: '비과세 요건 확인', desc: '이 계산기는 식대·자가운전보조금의 월 20만원 한도를 반영합니다. 실제 지급·차량 업무 사용 등 법정 요건을 갖춘 항목만 입력하고 회사 급여 담당자에게 적용 여부를 확인하세요.' },
          { title: '연금저축 + IRP 최대 납입', desc: '연금저축 연 600만원 + IRP 연 900만원 통합 한도(중복 포함 900만). 총급여 5,500만 이하는 16.5%, 초과는 13.2% 세액공제. 2026년 연말정산 시 최대 148만원 환급 가능. 근거: 조세특례제한법 제91조의3·4.' },
          { title: '부양가족 범위 재확인', desc: '60세 이상 부모(소득금액 100만원 이하), 20세 이하 자녀, 60세 이상·20세 이하 형제자매도 기본공제 대상. 따로 사는 부모도 실제 부양 사실을 증빙하면 공제 가능합니다.' },
          { title: '주택청약종합저축 소득공제', desc: '총급여 7,000만원 이하 무주택 세대주가 연 납입액 300만원 한도 내 40% 소득공제. 연 최대 120만원 소득공제. 근거: 조세특례제한법 제87조.' },
        ]} />
        <OfficialSourcesSection sources={[
          '국세청 근로소득 간이세액표 및 소득세법 제134조',
          '국민연금법, 국민건강보험법, 노인장기요양보험법, 고용보험료 고시',
          '고용노동부 2026년 최저임금 고시와 근로기준법 수당 기준',
        ]} />
        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
