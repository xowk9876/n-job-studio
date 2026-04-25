'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSalaryStore } from '@/store'
import { calcSalary, MIN_HOURLY_WAGE_2026 } from '@/lib/salary'
import { Wallet, Info, ChevronDown, Clock, Moon, CalendarCheck, AlertTriangle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

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
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" /> 휴일근로 <span className="text-xs text-white/40 font-normal">(8시간 이내 1.5배 / 초과 2배)</span>
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
                <span className="text-sm text-white/70 flex-1">연장수당 ({overtimeHours}시간 × {formatKRW(result.hourlyWage)} × 1.5)</span>
                <span className="text-sm font-semibold text-white num">{formatKRW(result.overtimePay)}</span>
              </div>
            )}
            {result.nightPay > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                <span className="text-sm text-white/70 flex-1">야간 가산 ({nightHours}시간 × {formatKRW(result.hourlyWage)} × 0.5)</span>
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

      {/* ═══ 계산 예시 ═══ */}
      <ExamplesSection title="연봉별 실수령액 예시 (2026년, 부양가족 1인 기준)" items={[
        { label: '신입 · 연봉 3,600만원', input: '월 기본급 300만원 · 식대 20만원 포함', result: '월 실수령 약 2,648,000원', note: '4대보험 + 소득세 공제 후' },
        { label: '대리 · 연봉 5,000만원', input: '월 기본급 416만원 · 식대 20만원 포함', result: '월 실수령 약 3,586,000원', note: '4대보험 + 소득세 공제 후' },
        { label: '과장 · 연봉 8,000만원', input: '월 기본급 666만원 · 식대 20만원 포함', result: '월 실수령 약 5,539,000원', note: '4대보험 + 소득세 공제 후' },
      ]} />

      {/* ═══ FAQ ═══ */}
      <FAQSection items={[
        { q: '연봉과 월급의 차이는 무엇인가요?', a: '연봉은 1년 치 세전 총액이고, 월급은 연봉을 12로 나눈 세전 금액입니다. 실수령액은 여기서 4대보험과 소득세를 공제한 금액입니다.' },
        { q: '4대보험이란 무엇이고 왜 공제되나요?', a: '국민연금(4.75%), 건강보험(3.595%), 장기요양보험(건강보험료×13.14%), 고용보험(0.9%)으로 구성됩니다. 근로자와 사업주가 절반씩 부담하며 노후·의료·실업 보장을 위해 의무적으로 납부합니다.' },
        { q: '야간·연장수당에도 세금이 붙나요?', a: '네, 수당도 과세소득입니다. 다만 통상임금의 50%(야간 가산), 150%(연장), 150~200%(휴일) 가산율로 계산된 금액 전체가 과세됩니다. 식대·차량유지비와 달리 비과세 항목이 아닙니다.' },
        { q: '식대 비과세는 어떻게 적용되나요?', a: '2023년 1월부터 월 20만원까지 비과세입니다. 즉 월급여에 식대가 포함돼 있다면 20만원까지는 4대보험·소득세 과세 대상에서 제외되어 실질적으로 세금이 절감됩니다.' },
        { q: '부양가족이 많을수록 세금이 줄어드나요?', a: '맞습니다. 부양가족 1명당 연 150만원 기본공제가 적용되어 과세표준이 낮아지고, 20세 미만 자녀에게는 자녀세액공제(1명 15만원, 2명 35만원)도 추가됩니다.' },
        { q: '2026년 최저임금은 얼마인가요?', a: '2026년 최저임금은 시급 10,320원이며, 월 환산 시 209시간 기준 2,156,880원입니다. 연봉으로는 약 2,588만원 수준입니다.' },
        { q: '연봉 협상 시 세전과 세후 중 어떻게 비교해야 하나요?', a: '항상 세전 연봉 기준으로 비교하되, 식대·교통비 등 비과세 항목이 포함됐는지 확인해야 합니다. 같은 연봉이라도 비과세 비중이 높으면 실수령액이 더 많아질 수 있습니다.' },
      ]} />

      {/* ═══ 절세 팁 ═══ */}
      <TipsSection title="직장인 절세 실용 팁" items={[
        { title: '비과세 항목 최대 활용', desc: '식대(월 20만원), 차량유지비(월 20만원), 출산·보육 수당(월 20만원) 등 비과세 항목을 급여 구조에 포함시키면 실수령액이 늘어납니다. 인사팀에 비과세 급여 구조를 요청해보세요.' },
        { title: '연금저축·IRP로 소득공제', desc: '연금저축(연 600만원 한도)과 IRP(연 900만원 한도)에 납입하면 세액공제(13.2% 또는 16.5%)를 받을 수 있어 연말정산 시 환급이 가능합니다.' },
        { title: '부양가족 공제 꼼꼼히 확인', desc: '60세 이상 부모님, 배우자, 20세 미만 자녀뿐만 아니라 형제자매(20세 이하 또는 60세 이상, 소득 100만원 이하)도 기본공제 대상이 될 수 있습니다.' },
      ]} />

      {/* ═══ 관련 계산기 ═══ */}
      <RelatedLinks links={[
        { href: '/mortgage', label: '대출 이자 계산기' },
        { href: '/severance', label: '퇴직금 계산기' },
        { href: '/savings', label: '적금 이자 계산기' },
        { href: '/jeonse', label: '전월세 전환 계산기' },
      ]} />
    </div>
  )
}
