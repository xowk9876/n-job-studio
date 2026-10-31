'use client'

import { useMemo, useState } from 'react'
import { useMortgageStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcMortgage, calcDsrLimit, STRESS_DSR_RATES, RepaymentType } from '@/lib/mortgage'
import { ChevronDown, ShieldCheck } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { officialSources } from '@/lib/content-sources'

const CALC_PATH = '/mortgage'
const calcSeo = getCalculatorLinks(CALC_PATH)

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }
function manwon(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`
  if (n >= 10_000) return `${Math.floor(n / 10_000)}만`
  return n.toLocaleString()
}

const REPAYMENT_TYPES: { value: RepaymentType; label: string; desc: string }[] = [
  { value: 'equal-payment',   label: '원리금균등', desc: '매달 같은 금액' },
  { value: 'equal-principal', label: '원금균등',   desc: '원금 동일·이자 감소' },
  { value: 'bullet',          label: '만기일시',   desc: '만기에 원금' },
]

export default function MortgagePage() {
  const { principal, annualRate, years, type, set } = useMortgageStore()
  usePersistRehydrate(useMortgageStore)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showDsr, setShowDsr] = useState(false)
  const [dsrIncome, setDsrIncome] = useState(60_000_000)
  const [dsrExistingDebt, setDsrExistingDebt] = useState(0)
  const [dsrCap, setDsrCap] = useState(40)
  const [dsrStress, setDsrStress] = useState<number>(STRESS_DSR_RATES.metroMortgage)
  const r = useMemo(() => calcMortgage({ principal, annualRate, years, type }), [principal, annualRate, years, type])
  const dsr = useMemo(() => calcDsrLimit({
    annualIncome: dsrIncome,
    existingDebtMonthlyPmt: dsrExistingDebt,
    annualRate,
    years,
    stressBps: dsrStress,
    dsrCap,
  }), [dsrIncome, dsrExistingDebt, annualRate, years, dsrStress, dsrCap])

  return (
    <div className="calc-page">
      {r.error && <p role="alert" className="glass-card text-[color:var(--danger)]">{r.error}</p>}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">MORTGAGE</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">대출 이자 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">원리금균등 · 원금균등 · 만기일시</p>
      </div>

      <div className="result-card">
        <p className="result-label">{type === 'equal-payment' ? '월 납입액' : type === 'equal-principal' ? '첫 달 납입액' : '월 이자 (만기 전)'}</p>
        <p className="result-value">{won(r.monthlyPayment)}</p>
        <div className="grid grid-cols-3 gap-2 mt-4 text-[11.5px]">
          <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">총 납입</div><div className="font-semibold tabular mt-0.5">{manwon(r.totalPayment)}</div></div>
          <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">총 이자</div><div className="font-semibold tabular mt-0.5">{manwon(r.totalInterest)}</div></div>
          <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">이자 비율</div><div className="font-semibold tabular mt-0.5">{r.interestRatio.toFixed(1)}%</div></div>
        </div>
      </div>

      <div className="glass-card flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">대출금액</label>
          <div className="relative">
            <NumericInput ariaLabel="대출금액 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={principal} defaultValue={300_000_000} unitMultiplier={10000} onChange={(n) => set({ principal: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">= {won(principal)} ({manwon(principal)})</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">연이율 (%)</label>
            <NumericInput ariaLabel="연이율 (%)" max={100}  className="glass-input w-full rounded-lg font-bold" value={annualRate} defaultValue={3.5} allowDecimal onChange={(n) => set({ annualRate: n })} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">대출기간 (년)</label>
            <select aria-label="대출기간 (년)" className="glass-select" value={years} onChange={(e) => set({ years: Number(e.target.value) })}>
              {[5,10,15,20,25,30,35,40].map(y => <option key={y} value={y}>{y}년</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-white/75 mb-1.5">상환 방식</label>
          <div className="grid grid-cols-3 gap-2">
            {REPAYMENT_TYPES.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => set({ type: value })}
                className={`rounded-lg p-2.5 text-left border transition-colors ${
                  type === value
                    ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]'
                    : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="text-[12.5px] font-bold">{label}</div>
                <div className="text-[10px] mt-0.5 opacity-60">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 스케줄 */}
      <div className="glass-card !p-0 overflow-hidden">
        <button onClick={() => setShowSchedule(!showSchedule)} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
          <span className="text-[13px] font-semibold text-white/85">월별 상환 스케줄 ({years * 12}개월)</span>
          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showSchedule ? 'rotate-180' : ''}`} />
        </button>
        {showSchedule && (
          <div className="overflow-x-auto max-h-80 overflow-y-auto border-t border-white/10">
            <table className="w-full text-[11.5px]">
              <thead className="sticky top-0 bg-white/[0.06]">
                <tr>
                  {['회차','납입액','원금','이자','잔여'].map(h => (
                    <th key={h} className="px-3 py-2 text-right text-white/50 font-semibold first:text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((row) => (
                  <tr key={row.month} className="border-t border-white/5 hover:bg-white/[0.03]">
                    <td className="px-3 py-1.5 text-white/60">{row.month}</td>
                    <td className="px-3 py-1.5 text-right text-white/80 tabular">{row.payment.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right text-blue-300 tabular">{row.principal.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right text-rose-300 tabular">{row.interest.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right text-white/45 tabular">{row.remaining.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DSR 한도 시뮬레이션 */}
      <div className="glass-card !p-0 overflow-hidden">
        <button onClick={() => setShowDsr(!showDsr)} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors">
          <span className="text-[13px] font-semibold text-white/85 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[color:var(--brand)]" />DSR 한도 시뮬레이션 <span className="text-[10.5px] font-normal text-white/40">(스트레스 DSR 포함)</span></span>
          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${showDsr ? 'rotate-180' : ''}`} />
        </button>
        {showDsr && (
          <div className="px-4 pb-4 pt-1 border-t border-white/10 flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11.5px] font-semibold text-white/75 mb-1">연 소득 (세전)</label>
                <div className="relative">
                  <NumericInput ariaLabel="연 소득 (만원)"  className="glass-input w-full rounded-lg px-3 py-2 font-bold pr-10" value={dsrIncome} defaultValue={60_000_000} unitMultiplier={10000} onChange={setDsrIncome} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
                </div>
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-white/75 mb-1">기존부채 월 상환</label>
                <div className="relative">
                  <NumericInput ariaLabel="기존 부채 월 상환액 (만원)"  className="glass-input w-full rounded-lg px-3 py-2 font-bold pr-10" value={dsrExistingDebt} defaultValue={0} unitMultiplier={10000} onChange={setDsrExistingDebt} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11.5px] font-semibold text-white/75 mb-1">DSR 한도</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[40, 50].map(c => (
                    <button key={c} onClick={() => setDsrCap(c)} className={`rounded-lg py-1.5 text-[12px] font-bold border transition-colors ${dsrCap === c ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]' : 'border-white/15 bg-white/5 text-white/55'}`}>{c}% {c === 40 ? '(은행)' : '(2금융)'}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-white/75 mb-1">스트레스 가산금리 (%p)</label>
                <NumericInput ariaLabel="스트레스 가산금리 (%p)" max={3}  className="glass-input w-full rounded-lg font-bold" value={dsrStress} defaultValue={STRESS_DSR_RATES.metroMortgage} allowDecimal onChange={setDsrStress} />
              </div>
            </div>
            {dsr.error && <p role="alert" className="text-sm text-[color:var(--danger)]">{dsr.error}</p>}
            <div className="rounded-lg bg-white/[0.05] px-3 py-2.5 grid grid-cols-2 gap-2 text-[11.5px]">
              <div><div className="text-white/50 text-[10.5px]">적용 금리 (스트레스 후)</div><div className="font-bold text-white tabular mt-0.5">{dsr.stressedRate.toFixed(2)}%</div></div>
              <div><div className="text-white/50 text-[10.5px]">월 상환 한도</div><div className="font-bold text-[color:var(--brand)] tabular mt-0.5">{won(dsr.maxMonthlyPmt)}</div></div>
              <div><div className="text-white/50 text-[10.5px]">신규 원금 한도 (가정)</div><div className="font-bold text-emerald-300 tabular mt-0.5">{manwon(dsr.maxPrincipal)}원</div></div>
              <div><div className="text-white/50 text-[10.5px]">기존부채 DSR 점유</div><div className="font-bold text-white/80 tabular mt-0.5">{dsr.utilization.toFixed(1)}%</div></div>
            </div>
            <p className="text-[10.5px] text-white/40 leading-relaxed">원리금균등 상환을 가정한 역산입니다. 위 상환 방식 선택과 별개이며, 스트레스 금리는 실제 이자에 더해지지 않습니다. 변동형 기준 수도권·규제지역 주담대 3.0%p, 지방 비규제지역 0.75%p(2026.12.31까지), 그 외 기본 1.5%p입니다. 금리 유형별 적용비율·LTV·지역별 한도·심사 인정 만기는 별도 확인하세요.</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="주담대 계산 예시" items={[
          { label: '3억 · 3.5% · 30년 (원리금균등)', input: '월 납입액', result: '1,347,134원', note: '총 이자 약 1억 8,497만원' },
          { label: '5억 · 4.0% · 20년 (원리금균등)', input: '월 납입액', result: '3,029,902원', note: '총 이자 약 2억 2,718만원' },
        ]} />
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '원리금균등과 원금균등의 차이는?', a: '원리금균등은 원금과 이자를 합친 월 납입액이 일정합니다. 원금균등은 매달 같은 원금과 남은 잔액의 이자를 내므로 초기 부담이 크고 이후 줄어듭니다. 같은 금리·기간이면 원금균등의 총이자가 더 적습니다.' },
          { q: 'DSR 결과가 은행 승인 한도인가요?', a: '아닙니다. 입력 소득·기존 월 상환액·금리·만기로 원리금균등 한도를 역산한 참고값입니다. 은행의 인정 소득, 대출별 DSR 산식, LTV, 지역별 총액 제한과 상품 조건에 따라 승인 한도가 달라집니다.' },
          { q: '스트레스 가산금리를 실제로 더 내나요?', a: '아닙니다. 금리 상승에 대비한 심사 가정입니다. 실제 월 납입액은 약정금리로 계산하며, 고정·혼합·주기형은 스트레스 적용비율이 다를 수 있습니다.' },
          { q: '중도상환이나 대환 비용도 포함되나요?', a: '포함되지 않습니다. 중도상환수수료, 인지세 등 부대비용과 새 상품의 우대조건을 별도로 확인하세요. 수수료는 계약·상환 시점과 금융기관에 따라 다릅니다.' },
          { q: '변동금리와 고정금리는 어떻게 비교하나요?', a: '미래 금리는 확정할 수 없습니다. 현재 금리뿐 아니라 금리 변경 주기, 고정기간 이후 조건, 중도상환 계획을 비교하세요. 이 계산기는 입력한 금리가 전체 기간 동안 유지된다고 가정합니다.' },
        ]} />
        <TipsSection title="대출 비교 체크리스트" items={[
          { title: '같은 조건으로 비교', desc: '대출금액·기간·상환 방식과 우대조건을 맞춰 비교하세요. 광고의 최저금리가 본인에게 적용되는 금리와 같지는 않을 수 있습니다.' },
          { title: '월 납입액과 총이자 함께 확인', desc: '만기를 늘리면 월 부담은 낮아져도 총이자가 늘 수 있습니다. 만기일시는 마지막에 상환할 원금도 준비해야 합니다.' },
          { title: '정책대출은 별도 자격 확인', desc: '주택가격·소득·보유주택·자금 용도 등 상품 조건을 주택도시기금 또는 한국주택금융공사에서 확인하세요.' },
        ]} />
        <OfficialSourcesSection sources={officialSources[CALC_PATH]} />
        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
