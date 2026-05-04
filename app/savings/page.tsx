'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSavingsStore } from '@/store'
import { calcSavings, SavingsType, InterestType } from '@/lib/savings'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SavingsPage() {
  const { type, amount, annualRate, months, interestType, set } = useSavingsStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const r = useMemo(() => calcSavings({ type, amount, annualRate, months, interestType }), [type, amount, annualRate, months, interestType])

  if (!mounted) return null

  return (
    <div className="calc-page">
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">SAVINGS</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">적금 · 예금 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">이자소득세 15.4% 차감 후 세후 수익</p>
      </div>

      <div className="result-card">
        <p className="result-label">만기 수령액 (세후)</p>
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
            <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={amount} defaultValue={1_000_000} unitMultiplier={10000} onChange={(n) => set({ amount: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">= {won(amount)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">연이율 (%)</label>
            <NumericInput className="glass-input w-full rounded-lg font-bold" value={annualRate} defaultValue={3.5} allowDecimal onChange={(n) => set({ annualRate: n })} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">기간 (개월)</label>
            <select className="glass-select" value={months} onChange={(e) => set({ months: Number(e.target.value) })}>
              {[3,6,12,18,24,36,48,60].map(m => <option key={m} value={m}>{m}개월 ({m >= 12 ? `${m/12}년` : `${m}달`})</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-white/75 mb-1.5">이자 방식</label>
          <div className="grid grid-cols-2 gap-2">
            {([['simple','단리','원금에만 이자'], ['compound','복리','이자에도 이자']] as [InterestType, string, string][]).map(([v, label, desc]) => (
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
          <div className="flex justify-between py-1.5"><span className="text-white/60">실효 연이율</span><span className="font-semibold text-[color:var(--brand)] tabular">{r.effectiveRate.toFixed(2)}%</span></div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="적금 · 예금 계산 예시" items={[
          { label: '월 30만 · 연 3.5% · 12개월 (적금)', input: '납입 원금 360만원', result: '세후 약 3,665,000원', note: '이자소득세 15.4% 차감 후' },
          { label: '1,000만 · 연 3.8% · 12개월 (예금)', input: '예치 원금 1,000만원', result: '세후 약 10,321,000원', note: '세후 이자 약 321,600원' },
          { label: '월 50만 · 연 4.0% · 24개월 (적금)', input: '납입 원금 1,200만원', result: '세후 이자 약 1,248,000원', note: '복리 기준' },
        ]} />
        <FAQSection items={[
          { q: '단리와 복리의 차이는?', a: '단리는 원금에만 이자가 붙고, 복리는 발생한 이자에도 다시 이자가 붙습니다. 기간이 길수록 복리 효과가 커집니다. 1,000만원 연 4% 10년 운용 시 단리 400만원, 복리 약 480만원 차이.' },
          { q: '이자소득세 15.4% 계산 방식은?', a: '소득세 14% + 지방소득세 1.4% = 15.4%. 만기 이자에서 자동 차감됩니다. 세전 이자 100만원이면 세후 846,000원.' },
          { q: '적금 vs 예금, 뭐가 유리?', a: '목돈이 있으면 예금(일시 예치)이 이자를 더 많이 받습니다. 적금은 첫 달만 12개월 전체 이자, 마지막 달은 1개월치만 받아 실효 이율이 명목의 절반 수준입니다.' },
          { q: '비과세 상품으로 세금 절감?', a: 'ISA 계좌는 200만원(서민형 400만원)까지 비과세. 세금우대 상품은 농어촌특별세 1.4%만 부과됩니다. 한도·조건 확인 필요.' },
          { q: '파킹통장 vs 정기적금?', a: '파킹통장은 자유 입출금에 일 단위 이자. 정기적금은 만기 유지 필요하지만 이율이 높음. 6개월 내 쓸 돈은 파킹통장, 1년+는 적금.' },
        ]} />
        <TipsSection title="이자 극대화 팁" items={[
          { title: 'ISA 계좌 활용', desc: 'ISA에 예·적금을 편입하면 연 200만원까지 이자·배당에 비과세. 서민형·농어민형은 400만원까지.' },
          { title: '인터넷은행 우대 이벤트', desc: '카카오뱅크·케이뱅크·토스뱅크는 시중은행보다 0.3~0.5%p 높은 경우가 많습니다. 신규 우대 이벤트를 적극 활용.' },
          { title: '만기 자동 재예치 주의', desc: '자동 재예치되면 당시(보통 더 낮은) 금리로 새로 계약됩니다. 만기 알림을 설정하고 직접 비교해 갈아타세요.' },
        ]} />
        <RelatedLinks links={[
          { href: '/salary', label: '연봉 실수령액' },
          { href: '/mortgage', label: '대출 이자' },
          { href: '/severance', label: '퇴직금' },
          { href: '/jeonse', label: '전월세 전환' },
        ]} />
      </div>
    </div>
  )
}
