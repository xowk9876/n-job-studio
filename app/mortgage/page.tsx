'use client'

import { useMemo, useState } from 'react'
import { useMortgageStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcMortgage, calcDsrLimit, RepaymentType } from '@/lib/mortgage'
import { ChevronDown, ShieldCheck } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'

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
  const [dsrStress, setDsrStress] = useState(1.5)
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
            <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={principal} defaultValue={300_000_000} unitMultiplier={10000} onChange={(n) => set({ principal: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">= {won(principal)} ({manwon(principal)})</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">연이율 (%)</label>
            <NumericInput className="glass-input w-full rounded-lg font-bold" value={annualRate} defaultValue={3.5} allowDecimal onChange={(n) => set({ annualRate: n })} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">대출기간 (년)</label>
            <select className="glass-select" value={years} onChange={(e) => set({ years: Number(e.target.value) })}>
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
                  <NumericInput className="glass-input w-full rounded-lg px-3 py-2 font-bold pr-10" value={dsrIncome} defaultValue={60_000_000} unitMultiplier={10000} onChange={setDsrIncome} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">만원</span>
                </div>
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-white/75 mb-1">기존부채 월 상환</label>
                <div className="relative">
                  <NumericInput className="glass-input w-full rounded-lg px-3 py-2 font-bold pr-10" value={dsrExistingDebt} defaultValue={0} unitMultiplier={10000} onChange={setDsrExistingDebt} />
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
                <label className="block text-[11.5px] font-semibold text-white/75 mb-1">스트레스 가산금리 (%)</label>
                <NumericInput className="glass-input w-full rounded-lg font-bold" value={dsrStress} defaultValue={1.5} allowDecimal onChange={setDsrStress} />
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.05] px-3 py-2.5 grid grid-cols-2 gap-2 text-[11.5px]">
              <div><div className="text-white/50 text-[10.5px]">적용 금리 (스트레스 후)</div><div className="font-bold text-white tabular mt-0.5">{dsr.stressedRate.toFixed(2)}%</div></div>
              <div><div className="text-white/50 text-[10.5px]">월 상환 한도</div><div className="font-bold text-[color:var(--brand)] tabular mt-0.5">{won(dsr.maxMonthlyPmt)}</div></div>
              <div><div className="text-white/50 text-[10.5px]">신규대출 원금 한도</div><div className="font-bold text-emerald-300 tabular mt-0.5">{manwon(dsr.maxPrincipal)}원</div></div>
              <div><div className="text-white/50 text-[10.5px]">기존부채 DSR 점유</div><div className="font-bold text-white/80 tabular mt-0.5">{dsr.utilization.toFixed(1)}%</div></div>
            </div>
            <p className="text-[10.5px] text-white/40 leading-relaxed">금융위 「DSR 산정·운용 모범규준」 기반. 2025.7.1 시행 <strong className="text-white/70">스트레스 DSR 3단계</strong>는 가계대출 기본 1.5% · 수도권·규제지역 주담대 3.0%(10·15 부동산 대책) · 지방 주담대 0.75%(2026.6.30까지 유예) 차등 적용됩니다. 실제 한도는 은행 심사·LTV·소득산정 방식에 따라 달라질 수 있습니다.</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="주담대 계산 예시" items={[
          { label: '3억 · 3.5% · 30년 (원리금균등)', input: '월 납입액', result: '약 1,347,000원', note: '총 이자 약 1억 8,492만원' },
          { label: '5억 · 4.0% · 20년 (원리금균등)', input: '월 납입액', result: '약 3,032,000원', note: '총 이자 약 2억 2,768만원' },
          { label: '2억 · 3.0% · 10년 (원금균등)', input: '첫달 납입액', result: '약 2,167,000원', note: '총 이자 약 3,025만원' },
        ]} />
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '원리금균등과 원금균등의 차이는?', a: '원리금균등은 매월 동일한 금액(원금+이자)을 납부합니다. 초반엔 이자 비중이 높고 점차 원금 비중이 커져 가계 계획이 쉽습니다. 원금균등은 매월 동일한 원금에 잔여원금에 대한 이자를 더해 납부하므로 초기 부담이 크지만 총이자는 원리금균등보다 적습니다.' },
          { q: 'DSR·LTV·DTI는 무엇인가요?', a: 'LTV(담보인정비율)는 집값 대비 대출 가능 금액 비율. DTI(총부채상환비율)는 연소득 대비 주택담보대출 원리금 + 기타대출 이자의 비율. DSR(총부채원리금상환비율)은 연소득 대비 모든 대출 원리금 상환액의 비율입니다. 2022년 1월부터 차주별 DSR 40%(은행권)·50%(2금융권)가 전면 적용되고 있으며, 2024~2025년 스트레스 DSR 1~3단계가 순차 시행되었습니다.' },
          { q: '금리 0.5%p 차이가 실제로 얼마?', a: '3억원 · 30년 · 원리금균등 기준, 3.5%→4.0% 상승 시 월 납입 약 8만원(1,347,000→1,432,000) 증가, 총이자 약 2,900만원 증가. 5억·20년·4.0%→4.5%이면 월 약 12만원, 총이자 약 2,800만원 증가합니다.' },
          { q: '중도상환수수료는 언제 발생하나요?', a: '주담대는 통상 대출 실행일로부터 3년 이내에 조기상환 시 잔여 원금의 약 1.2~1.4%가 부과되며 경과기간에 비례해 감소(슬라이딩)합니다. 3년 경과 후엔 대부분 면제. 2024~2025년 정부 대환대출 정책으로 수수료 인하·면제 캠페인이 확산되고 있어 대환 검토 시 최신 조건을 확인하세요.' },
          { q: '생애최초·청년은 LTV가 완화되나요?', a: '생애최초 주택구입자는 지역 무관 LTV 최대 80%·DTI 60%까지 완화 적용(2022.8 시행 이후 유지). 청년주택드림대출은 만 19~34세 무주택 청년(미혼 연소득 5,000만원 이하, 기혼 7,000만원 이하)이 최저 2.2% 금리·최대 40년 상환으로 이용 가능합니다.' },
          { q: '변동금리 vs 고정금리, 무엇이 유리?', a: '금리 하락기에는 변동(COFIX 6개월·1년 연동)이, 상승기이거나 장기 보유 목적이면 고정(5년 고정 후 변동 혼합형 포함)이 유리합니다. 한국은행 기준금리 사이클과 본인의 상환계획 기간을 함께 고려하세요. 본 계산기는 단일 금리 기준이므로 변동 시나리오는 별도 산출해보셔야 합니다.' },
          { q: '중도상환으로 얼마나 절감될까요?', a: '대출 초기에 일부 상환할수록 절감 효과가 큽니다. 3억 · 30년 · 5% 조건에서 5년 차 5,000만원 상환 시 총이자 약 5,000만원 이상 절감 가능. 단 남은 기간 비례 중도상환수수료를 차감한 실절감액으로 비교하세요.' },
        ]} />
        <TipsSection title="주담대 부담 줄이기" items={[
          { title: '시중은행·인뱅·정책자금 3단 비교', desc: '같은 조건에서도 은행별 0.3~1%p 금리 차이가 흔합니다. 시중은행·인터넷은행·주택도시기금(디딤돌/버팀목/청년주택드림)을 모두 상담받아 비교 후 결정하세요.' },
          { title: '우대금리 모두 등록', desc: '급여이체·주거래카드·자동이체·청약저축·전자금융 가입 등 항목별 0.1~0.3%p, 최대 합산 1%p까지 우대 가능. 대출 실행 전 상담 단계에서 모두 등록 요청하세요.' },
          { title: '정책 대출 적극 검토', desc: '디딤돌대출(주택구입)·버팀목 전세자금·청년주택드림 등 정책자금은 시중금리 대비 유리한 경우가 많습니다. 자격·한도·금리는 정책 변경이 잦으므로 주택도시기금 nhuf.molit.go.kr 또는 한국주택금융공사 hf.go.kr에서 최신 조건을 확인 후 우선 검토하세요.' },
          { title: '대환대출 플랫폼 활용', desc: '네이버·카카오·토스 등 대환대출 인프라로 복수은행 금리를 실시간 비교 가능. 기존대출 대비 0.3%p 이상 낮으면 수수료·부대비용 고려해 갈아타기 검토.' },
          { title: '원리금 상환액 소득의 30% 이내', desc: '월 소득 대비 원리금이 30%를 넘으면 생활자금 압박이 커집니다. DSR 40% 규제보다 보수적으로 30% 선에서 관리하면 금리 상승·소득 변동 리스크에도 안정적입니다.' },
        ]} />
        <OfficialSourcesSection sources={[
          '금융위원회 스트레스 DSR 3단계 시행 자료 및 DSR 산정 기준',
          '금융감독원 금융상품 비교공시와 금융권 표준 상환 방식',
          '주택도시기금·한국주택금융공사 정책대출 안내',
        ]} />
        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
