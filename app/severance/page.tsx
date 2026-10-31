'use client'

import { useMemo, useEffect } from 'react'
import { useSeveranceStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcSeverance } from '@/lib/severance'
import { AlertCircle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import DatePicker from '@/components/ui/DatePicker'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { officialSources } from '@/lib/content-sources'

const CALC_PATH = '/severance'
const calcSeo = getCalculatorLinks(CALC_PATH)

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

function won(n: number) { return n.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '원' }

export default function SeverancePage() {
  const { avgMonthly3, annualBonus, startDate, endDate, regularHourlyWage, set } = useSeveranceStore()
  const hydrated = usePersistRehydrate(useSeveranceStore)
  useEffect(() => {
    if (hydrated && !useSeveranceStore.getState().endDate) {
      set({ endDate: toISO(new Date()) })
    }
  }, [hydrated, set])

  const r = useMemo(() =>
    calcSeverance({ avgMonthly3, annualBonus, startDate, endDate, regularHourlyWage }),
    [avgMonthly3, annualBonus, startDate, endDate, regularHourlyWage]
  )

  const workYearsLabel = `${Math.floor(r.workYears)}년 ${Math.floor((r.workYears % 1) * 12)}개월`

  return (
    <div className="calc-page">
      {hydrated && r.error && <p role="alert" className="glass-card text-[color:var(--danger)]">{r.error}</p>}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">SEVERANCE</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">퇴직금 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">평균임금·통상임금 비교 · 세전 예상</p>
      </div>

      {/* 결과 */}
      {!hydrated ? <p role="status" className="glass-card text-sm">저장한 입력값을 불러오는 중입니다.</p> : r.error ? null : !r.isEligible ? (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-500/12 border border-amber-500/25">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200 text-[13px]">계속근로 1년 미만</p>
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

      <p className="text-xs text-[color:var(--sub)]">4주 평균 주 15시간 이상 근로한 경우의 예상액입니다. 휴직 등 산정 제외 기간과 연차수당은 별도로 확인하세요.</p>
      {/* 입력 */}
      <div className="glass-card flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">최근 3개월 평균 월급 <span className="text-[10.5px] font-normal text-white/40">(세전, 상여 제외)</span></label>
          <div className="relative">
            <NumericInput ariaLabel="최근 3개월 평균 월 급여 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={avgMonthly3} defaultValue={3_000_000} unitMultiplier={10000} onChange={(n) => set({ avgMonthly3: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">= {won(avgMonthly3)}</p>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">직전 1년 연간 상여금 <span className="text-[10.5px] font-normal text-white/40">(없으면 0)</span></label>
          <div className="relative">
            <NumericInput ariaLabel="연간 상여금 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={annualBonus} defaultValue={0} unitMultiplier={10000} onChange={(n) => set({ annualBonus: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">통상시급 <span className="text-[10.5px] font-normal text-white/40">(선택 · 근기법 §2② 비교용)</span></label>
          <div className="relative">
            <NumericInput ariaLabel="통상시급 (원)"  className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-10" value={regularHourlyWage} defaultValue={0} onChange={(n) => set({ regularHourlyWage: n })} />
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
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">마지막 근무일</label>
            <DatePicker ariaLabel="마지막 근무일 선택" value={fromISO(endDate)} onChange={(d) => set({ endDate: toISO(d) })} />
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
          <li>입력 날짜는 마지막 근무일입니다. 그 다음 날을 법적 퇴직일로 삼아 재직일수와 직전 3개월을 계산합니다. 고용노동부 계산기에는 마지막 근무일 다음 날을 입력하면 같은 기간입니다.</li>
          <li>퇴직소득세는 국세청 홈택스에서 확인</li>
        </ul>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="퇴직금 계산 예시" items={[
          { label: '평균임금 10만원 · 재직 1,095일', input: '1일 평균임금 100,000원 × 30 × 1,095/365', result: '세전 퇴직금 9,000,000원', note: '상여·연차·통상임금 비교 전 단순 예시' },
          { label: '평균임금 13만원 · 재직 1,825일', input: '1일 평균임금 130,000원 × 30 × 1,825/365', result: '세전 퇴직금 19,500,000원', note: '실제 평균임금은 직전 3개월의 실제 일수로 계산' },
        ]} />
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '퇴직금 지급 대상은 누구인가요?', a: '계속근로 1년 이상이고 4주 평균 1주 소정근로시간이 15시간 이상인 근로자가 대상입니다. 계약 명칭이나 사업장 규모만으로 판단하지 않으며, 계약이 반복된 경우 실제 계속근로 여부를 확인해야 합니다.' },
          { q: '평균임금에 무엇을 포함하나요?', a: '퇴직일 이전 3개월의 임금총액을 해당 기간 일수로 나눕니다. 임금에 해당하는 상여금과 산입 대상 연차수당은 별도 기준을 적용하며, 퇴직으로 비로소 발생한 미사용 연차수당은 구분해야 합니다. 이 계산기는 월 급여와 연간 상여금만 자동 반영합니다.' },
          { q: '입력 날짜는 퇴직일인가요?', a: '입사일과 마지막 근무일을 입력하세요. 계산기는 마지막 근무일의 다음 날을 법적 퇴직일로 보아 기간을 산정합니다. 휴직 등 산정 제외 기간은 자동 반영하지 않습니다.' },
          { q: '통상시급은 언제 입력하나요?', a: '평균임금이 통상임금보다 낮으면 통상임금 기준을 확인해야 합니다. 입력하면 시급 × 8시간을 1일 통상임금으로 비교하므로 1일 소정근로 8시간이 아닌 경우 별도 계산이 필요합니다.' },
          { q: '퇴직소득세와 IRP는 어떻게 처리하나요?', a: '표시 금액은 세전이며 퇴직소득세를 차감하지 않습니다. 퇴직급여는 원칙적으로 IRP로 이전하되 법정 예외가 있습니다. 실제 세후액과 연금·일시금 수령에 따른 과세는 회사와 국세청 안내로 확인하세요.' },
          { q: '퇴직금을 받지 못하면 어떻게 하나요?', a: '지급 사유 발생일부터 14일 이내 지급이 원칙입니다. 특별한 사정이 있으면 당사자 합의로 지급기일을 연장할 수 있습니다. 미지급 시 고용노동부에 진정 등 절차와 지연이자 적용 여부를 문의하세요.' },
        ]} />
        <TipsSection title="퇴직 전 확인사항" items={[
          { title: '급여·상여금 자료 준비', desc: '최근 3개월 급여명세서와 직전 1년 상여금 내역을 확인하세요. 상여금 지급 직후 퇴사했다고 전액을 3개월 임금에 더하지는 않습니다.' },
          { title: '연차수당·휴직 기간 별도 검토', desc: '연차수당의 지급 사유와 산정 제외 기간에 따라 평균임금이 달라집니다. 회사 산정표에서 분자와 분모를 함께 확인하세요.' },
          { title: 'DB·DC 방식 확인', desc: '이 계산기는 평균임금 기반 퇴직금 참고값입니다. DC형 퇴직연금은 회사 부담금과 운용 결과로 적립액이 결정되어 계산기 금액과 다를 수 있습니다.' },
        ]} />
        <OfficialSourcesSection sources={officialSources[CALC_PATH]} />
        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
