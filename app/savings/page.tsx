'use client'

import { useMemo } from 'react'
import { useSavingsStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcSavings, SavingsType, InterestType } from '@/lib/savings'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { officialSources } from '@/lib/content-sources'

const CALC_PATH = '/savings'
const calcSeo = getCalculatorLinks(CALC_PATH)

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SavingsPage() {
  const { type, amount, annualRate, months, interestType, set } = useSavingsStore()
  usePersistRehydrate(useSavingsStore)

  const r = useMemo(() => calcSavings({ type, amount, annualRate, months, interestType }), [type, amount, annualRate, months, interestType])

  return (
    <div className="calc-page">
      {r.error && <p role="alert" className="glass-card text-[color:var(--danger)]">{r.error}</p>}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">SAVINGS</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">적금 · 예금 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">이자소득세 15.4% 차감 후 세후 수익</p>
      </div>

      <div className="result-card">
        <p className="result-label">예상 만기 수령액 (세후)</p>
        <p className="result-value">{won(r.maturityAmount)}</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-[11.5px]">
          <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">납입 원금</div><div className="font-semibold tabular mt-0.5">{won(r.principal)}</div></div>
          <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">세후 이자</div><div className="font-semibold tabular mt-0.5">+{won(r.netInterest)}</div></div>
        </div>
      </div>

      <div className="glass-card flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">상품 유형</label>
          <div className="grid grid-cols-2 gap-2">
            {([['savings','정기적금','매월 납입'], ['deposit','정기예금','일시 예치']] as [SavingsType, string, string][]).map(([v, label, desc]) => (
              <button
                key={v}
                onClick={() => set({ type: v })}
                className={`rounded-lg p-2.5 border transition-colors text-left ${
                  type === v
                    ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]'
                    : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-[12.5px]">{label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">{type === 'savings' ? '월 납입액' : '예치 원금'}</label>
          <div className="relative">
            <NumericInput ariaLabel="예금 원금 또는 적금 월 납입액 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={amount} defaultValue={1_000_000} unitMultiplier={10000} onChange={(n) => set({ amount: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">= {won(amount)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">연이율 (%)</label>
            <NumericInput ariaLabel="연이율 (%)" max={100}  className="glass-input w-full rounded-lg font-bold" value={annualRate} defaultValue={3.5} allowDecimal onChange={(n) => set({ annualRate: n })} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">기간 (개월)</label>
            <select aria-label="저축기간 (개월)" className="glass-select" value={months} onChange={(e) => set({ months: Number(e.target.value) })}>
              {[3,6,12,18,24,36,48,60].map(m => <option key={m} value={m}>{m}개월 ({m >= 12 ? `${m/12}년` : `${m}달`})</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-white/75 mb-1.5">이자 방식</label>
          <div className="grid grid-cols-2 gap-2">
            {([['simple','단리','원금에만 이자'], ['compound','월복리','매월 이자 재투자']] as [InterestType, string, string][]).map(([v, label, desc]) => (
              <button
                key={v}
                onClick={() => set({ interestType: v })}
                className={`rounded-lg p-2.5 border transition-colors text-left ${
                  interestType === v
                    ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]'
                    : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-[12.5px]">{label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 세금 상세 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-3 text-[13.5px]">이자 세금 상세</h2>
        <div className="flex flex-col gap-1.5 text-[12.5px]">
          <div className="flex justify-between py-1.5 border-b border-white/8"><span className="text-white/60">세전 이자</span><span className="font-semibold text-white tabular">{won(r.grossInterest)}</span></div>
          <div className="flex justify-between py-1.5 border-b border-white/8"><span className="text-white/60">이자소득세 (15.4%)</span><span className="font-semibold text-rose-300 tabular">−{won(r.taxAmount)}</span></div>
          <div className="flex justify-between py-1.5 border-b border-white/8"><span className="text-white/60">세후 이자</span><span className="font-semibold text-emerald-300 tabular">{won(r.netInterest)}</span></div>
          <div className="flex justify-between py-1.5"><span className="text-white/60">원금 합계 대비 세후 연환산 수익률</span><span className="font-semibold text-[color:var(--brand)] tabular">{r.effectiveRate.toFixed(2)}%</span></div>
        </div>
      </div>

      {/* ISA 절세 비교 */}
      <div className="glass-card">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-semibold text-white text-[13.5px]">일반계좌 vs ISA 세금 가정 비교</h2>
          <span className="text-[10.5px] text-white/40">일반형 · 단순 비교</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11.5px]">
          <div className="rounded-lg bg-white/[0.05] p-3">
            <div className="text-white/55 text-[10.5px] mb-1">일반계좌 (15.4%)</div>
            <div className="font-bold text-white tabular">{won(r.isa.normalMaturity)}</div>
            <div className="text-white/40 mt-1">세금 −{won(r.isa.normalTax)}</div>
          </div>
          <div className="rounded-lg bg-[color:var(--brand)]/10 border border-[color:var(--brand)]/30 p-3">
            <div className="text-[color:var(--brand)] text-[10.5px] mb-1 font-semibold">ISA 일반형</div>
            <div className="font-bold text-[color:var(--brand)] tabular">{won(r.isa.isaMaturity)}</div>
            <div className="text-white/50 mt-1">세금 −{won(r.isa.isaTax)}</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 flex items-center justify-between">
          <span className="text-[12px] text-emerald-200">같은 이자의 세금 차이</span>
          <span className="font-bold text-emerald-300 tabular text-[14px]">+{won(r.isa.savedAmount)}</span>
        </div>
        <p className="text-[10.5px] text-white/40 mt-2 leading-relaxed">동일 이자를 만기에 과세하고 ISA 일반형 비과세 한도 200만원이 남아 있다고 가정합니다. 가입 자격·의무기간 3년·납입한도(연 2,000만원·총 1억원)·기존 손익은 계산에 반영하지 않습니다. 3년 미만 또는 한도 초과 입력도 실제 가입 가능액이나 세후 수령액을 뜻하지 않습니다.</p>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="적금 · 예금 계산 예시" items={[
          { label: '월 30만원 · 연 3.5% · 12개월 적금', input: '납입 원금 360만원 · 단리', result: '세후 3,657,739원', note: '매월 초 납입·만기 과세·원 단위 반올림 가정' },
          { label: '1,000만원 · 연 3.8% · 12개월 예금', input: '예치 원금 1,000만원 · 단리', result: '세후 10,321,480원', note: '세후 이자 321,480원 · 중도해지 제외' },
        ]} />
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '단리와 월복리는 어떻게 다른가요?', a: '단리는 원금에만, 월복리는 매월 발생한 이자를 원금에 더해 이자를 계산합니다. 이 계산기는 일정 금리·매월 정상 납입·만기 과세를 가정하며 실제 일수, 중도해지, 은행별 절사 방식은 반영하지 않습니다.' },
          { q: '이자소득세 15.4%는 무엇인가요?', a: '일반적인 이자소득 원천징수 소득세 14%와 지방소득세 1.4%의 합계입니다. 세전 이자 100만원이면 15만 4,000원을 차감합니다. 비과세·세금우대 상품이나 금융소득 종합과세 대상은 실제 세금이 달라집니다.' },
          { q: '같은 금리인데 적금 이자가 적은 이유는?', a: '적금은 매달 납입하므로 뒤에 넣은 돈일수록 이자가 붙는 기간이 짧습니다. 월 50만원·12개월·연 5% 단리라면 총 원금은 600만원, 세전 이자는 16만 2,500원입니다.' },
          { q: 'ISA 비교 결과는 실제 수령액인가요?', a: '아닙니다. 동일한 이자에 일반계좌와 ISA 일반형 세금만 적용한 가정입니다. ISA는 일반형 200만원, 요건을 충족한 서민형·농어민형 400만원까지 비과세이고 초과분은 9.9% 분리과세입니다. 화면은 서민형, 기존 계좌 손익, 가입·납입 가능 여부를 계산하지 않습니다.' },
          { q: '예금자보호는 어디까지 되나요?', a: '2025년 9월 1일부터 보호 대상 상품은 원금과 소정의 이자를 합쳐 금융회사별 1인당 1억원까지 보호됩니다. 같은 회사의 여러 지점·계좌를 합산합니다. 펀드 등 모든 금융상품이 보호되는 것은 아니므로 상품 설명을 확인하세요.' },
        ]} />
        <TipsSection title="저축상품 비교 체크리스트" items={[
          { title: '우대조건과 적용 한도 확인', desc: '최고금리 적용에 필요한 급여이체·카드 사용 등의 조건과 우대금리를 받는 금액 한도를 확인하세요.' },
          { title: '사용할 시점에 맞춰 비교', desc: '만기 전에 돈이 필요할 수 있다면 중도해지 이율과 인출 조건을 함께 확인하세요. 파킹통장도 이자 지급 주기와 금액별 금리가 상품마다 다릅니다.' },
          { title: '만기 후 조건 다시 확인', desc: '자동재예치 여부와 재예치 금리를 확인하고, 수수료·세금·예금자보호를 포함한 실제 조건으로 비교하세요.' },
        ]} />
        <OfficialSourcesSection sources={officialSources[CALC_PATH]} />
        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
