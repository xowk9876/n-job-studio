'use client'

import { useMemo, useEffect } from 'react'
import { useSeveranceStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcSeverance } from '@/lib/severance'
import { AlertCircle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import DatePicker from '@/components/ui/DatePicker'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'

function toISO(d: Date | null) {
  if (!d) return ''
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
function fromISO(s: string): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SeverancePage() {
  const { avgMonthly3, annualBonus, startDate, endDate, regularHourlyWage, set } = useSeveranceStore()
  usePersistRehydrate(useSeveranceStore)
  useEffect(() => {
    if (endDate === '2026-01-01') {
      set({ endDate: new Date().toISOString().split('T')[0] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const r = useMemo(() =>
    calcSeverance({ avgMonthly3, annualBonus, startDate, endDate, regularHourlyWage }),
    [avgMonthly3, annualBonus, startDate, endDate, regularHourlyWage]
  )

  const workYearsLabel = `${Math.floor(r.workYears)}년 ${Math.floor((r.workYears % 1) * 12)}개월`

  return (
    <div className="calc-page">
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">SEVERANCE</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">퇴직금 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">근로기준법 평균임금 기준 · 세전 예상</p>
      </div>

      {/* 결과 */}
      {!r.isEligible ? (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-500/12 border border-amber-500/25">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200 text-[13px]">퇴직금 수급 불가</p>
            <p className="text-[12px] text-amber-300/80 mt-0.5">재직 {r.workDays}일({workYearsLabel}) — 1년 이상 근무 시 지급됩니다.</p>
          </div>
        </div>
      ) : (
        <div className="result-card">
          <p className="result-label">세전 퇴직금 (예상) {r.basis === 'regular' && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">통상임금 적용</span>}</p>
          <p className="result-value">{won(r.severancePay)}</p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-[11.5px]">
            <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">재직 기간</div><div className="font-semibold mt-0.5">{workYearsLabel}</div></div>
            <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">재직일수</div><div className="font-semibold tabular mt-0.5">{r.workDays.toLocaleString()}일</div></div>
            <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">1일 {r.basis === 'regular' ? '통상' : '평균'}임금</div><div className="font-semibold tabular mt-0.5">{won(r.dailyWage)}</div></div>
          </div>
          {r.regularDailyWage > 0 && (
            <div className="mt-3 rounded-lg bg-white/[0.06] px-3 py-2 flex justify-between text-[11px]">
              <span className="text-white/55">평균임금 1일분</span><span className="font-semibold text-white/85 tabular">{won(r.averageDailyWage)}</span>
              <span className="text-white/55 ml-2">통상임금 1일분</span><span className="font-semibold text-white/85 tabular">{won(r.regularDailyWage)}</span>
            </div>
          )}
        </div>
      )}

      {/* 입력 */}
      <div className="glass-card flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">최근 3개월 평균 월급 <span className="text-[10.5px] font-normal text-white/40">(세전, 상여 제외)</span></label>
          <div className="relative">
            <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={avgMonthly3} defaultValue={3_000_000} unitMultiplier={10000} onChange={(n) => set({ avgMonthly3: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">= {won(avgMonthly3)}</p>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">직전 1년 연간 상여금 <span className="text-[10.5px] font-normal text-white/40">(없으면 0)</span></label>
          <div className="relative">
            <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={annualBonus} defaultValue={0} unitMultiplier={10000} onChange={(n) => set({ annualBonus: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">통상시급 <span className="text-[10.5px] font-normal text-white/40">(선택 · 근기법 §2② 비교용)</span></label>
          <div className="relative">
            <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-10" value={regularHourlyWage} defaultValue={0} onChange={(n) => set({ regularHourlyWage: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">입력 시 평균임금 1일분과 통상임금 1일분(시급×8)을 비교하여 큰 값으로 산정</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">입사일</label>
            <DatePicker ariaLabel="입사일 선택" value={fromISO(startDate)} onChange={(d) => set({ startDate: toISO(d) })} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">퇴직일</label>
            <DatePicker ariaLabel="퇴직일 선택" value={fromISO(endDate)} onChange={(d) => set({ endDate: toISO(d) })} />
          </div>
        </div>
      </div>

      {/* 계산 방법 */}
      <div className="glass-card text-[12.5px] text-white/65">
        <h2 className="font-semibold text-white mb-2.5 text-[13.5px]">계산 방법</h2>
        <div className="rounded-lg px-3 py-2.5 font-mono text-[11.5px] mb-2.5 text-white/80 bg-white/[0.05]">
          퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
        </div>
        <ul className="list-disc list-inside space-y-1 text-white/50 text-[11.5px]">
          <li>1일 평균임금 = 최근 3개월 총 임금 ÷ 실제 일수(89~92일)</li>
          <li>연간 상여금의 3개월분(÷4)을 합산합니다</li>
          <li>1년 미만 근무 시 퇴직금 없음</li>
          <li>퇴직소득세는 국세청 홈택스에서 확인</li>
        </ul>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="퇴직금 계산 예시" items={[
          { label: '3년 근무 · 월급 300만원', input: '1일 평균임금 약 100,000원 · 재직 1,095일', result: '퇴직금 약 9,000,000원', note: '상여금·퇴직소득세 제외 기준' },
          { label: '5년 근무 · 월급 400만원', input: '1일 평균임금 약 133,333원 · 재직 1,825일', result: '퇴직금 약 20,000,000원', note: '상여금·퇴직소득세 제외 기준' },
          { label: '10년 근무 · 월급 500만원', input: '1일 평균임금 약 166,666원 · 재직 3,650일', result: '퇴직금 약 50,000,000원', note: '상여금·퇴직소득세 제외 기준' },
        ]} />
        <FAQSection items={[
          { q: '퇴직금 지급 기준은 무엇인가요?', a: '근로기준법 제34조·근로자퇴직급여 보장법 제4조에 따라 1년 이상 계속 근로하고 4주 평균 주 15시간 이상 근무한 근로자가 퇴직하면 지급합니다. 계약직·일용직·아르바이트도 동일하게 적용되며 5인 미만 사업장도 2013.12.1부터 전면 적용되고 있습니다.' },
          { q: '평균임금은 어떻게 계산되나요?', a: '퇴직일 직전 3개월 동안 지급된 임금총액을 해당 기간 총일수(89~92일)로 나눈 금액입니다(근로기준법 제2조). 기본급·직책수당·연장근로수당·연차수당뿐 아니라 정기상여금의 3/12, 성과급 일부도 포함됩니다. 단, 경조사비·실비변상적 급여는 제외.' },
          { q: '퇴직금 계산식은?', a: '퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365). 예시: 재직 1,825일(5년), 평균임금 133,333원이면 133,333 × 30 × 1,825/365 ≒ 20,000,000원. 계산기 결과와 일치합니다.' },
          { q: '계약직·일용직도 받을 수 있나요?', a: '네. 계약이 반복 갱신되면 모든 계약기간을 합산해 1년 이상이면 대상. 일용직도 공사기간 중 상용적·반복적으로 근로했다면 퇴직금 청구 가능합니다(대법원 판례 다수).' },
          { q: '퇴직소득세는 얼마나 부과되나요?', a: '근속연수 공제(5년 이하 100만원/년, 6~10년 200만원/년, 11~20년 250만원/년, 20년 초과 300만원/년) 후 환산급여공제를 적용하고, 연분연승법(÷근속연수 → 누진세율 → ×근속연수)으로 계산합니다. 일반 근로소득세보다 실효세율이 현저히 낮습니다. 근거: 소득세법 제55조·제148조.' },
          { q: 'IRP 계좌로 받으면 왜 유리한가요?', a: '55세 이전에 현금으로 수령하면 퇴직소득세가 원천징수됩니다. IRP로 이체하면 과세이연되며, 55세 이후 연금(10년 이상 분할수령) 형태로 받으면 퇴직소득세의 60%(수령 10년 이내) 또는 70%(10년 초과분)만 부담. 근거: 소득세법 제14조의3.' },
          { q: '퇴직금 중간정산이 가능한 경우는?', a: '원칙적으로 금지이며 법정 사유에만 허용됩니다: 무주택자의 본인 명의 주택 구입·전세보증금 마련, 본인·배우자·부양가족의 6개월 이상 요양, 최근 5년 내 개인회생·파산, 임금피크제 도입, 근로시간 단축 등. 근거: 근로자퇴직급여 보장법 시행령 제3조.' },
          { q: '퇴직금을 못 받으면 어떻게 하나요?', a: '퇴직일로부터 14일 이내 지급이 원칙(근로기준법 제36조). 미지급 시 고용노동부 지방관서에 임금체불 진정 또는 고소 가능하며, 체불금에 연 20% 지연이자가 부과됩니다(근로기준법 시행령 제17조).' },
        ]} />
        <TipsSection title="퇴직금 최대화 · 세금 최소화" items={[
          { title: 'IRP 계좌 사전 개설', desc: '퇴직 전 은행·증권사에서 IRP(개인형 퇴직연금) 계좌를 미리 개설해두면 퇴직 즉시 이체 가능. 55세 이후 연금수령 시 퇴직소득세의 30~40%가 감면됩니다.' },
          { title: '퇴직 시점 선택', desc: '정기상여금·성과급 지급 직후 3개월 이내에 퇴직하면 해당 금액이 평균임금 산정에 포함되어 퇴직금이 증가합니다. 반대로 무급휴직이 3개월 안에 있으면 평균임금이 낮아져 불리합니다(근로기준법 시행령 제2조로 보정).' },
          { title: '연차수당 활용', desc: '퇴직 전 3개월 이내 지급된 연차 미사용 수당은 평균임금에 포함됩니다. 남은 연차를 사용하지 않고 수당으로 지급받으면 평균임금이 상승해 퇴직금 증가.' },
          { title: 'DC형 vs DB형 이해', desc: 'DB형(확정급여형)은 퇴직 시점 평균임금 기준, DC형(확정기여형)은 회사가 매년 임금의 1/12 이상을 근로자 계좌에 납입·운용한 금액을 수령. 임금상승률이 높으면 DB형, 운용수익이 높으면 DC형이 유리합니다.' },
        ]} />
        <OfficialSourcesSection sources={[
          '근로기준법 제2조·제34조 평균임금 및 퇴직금 기준',
          '근로자퇴직급여 보장법 제4조·제8조 계속근로기간 기준',
          '소득세법 퇴직소득세 계산 체계와 IRP 과세이연 기준',
        ]} />
        <RelatedLinks links={[
          { href: '/salary', label: '연봉 실수령액' },
          { href: '/savings', label: '적금 이자' },
          { href: '/mortgage', label: '대출 이자' },
          { href: '/jeonse', label: '전월세 전환' },
        ]} />
      </div>
    </div>
  )
}
