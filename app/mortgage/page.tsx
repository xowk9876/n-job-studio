'use client'

import { useMemo, useState, useEffect } from 'react'
import { useMortgageStore } from '@/store'
import { calcMortgage, RepaymentType } from '@/lib/mortgage'
import { ChevronDown } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

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
  const [mounted, setMounted] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  useEffect(() => setMounted(true), [])

  const r = useMemo(() => calcMortgage({ principal, annualRate, years, type }), [principal, annualRate, years, type])

  if (!mounted) return null

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

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="주담대 계산 예시" items={[
          { label: '3억 · 3.5% · 30년 (원리금균등)', input: '월 납입액', result: '약 1,347,000원', note: '총 이자 약 1억 8,492만원' },
          { label: '5억 · 4.0% · 20년 (원리금균등)', input: '월 납입액', result: '약 3,032,000원', note: '총 이자 약 2억 2,768만원' },
          { label: '2억 · 3.0% · 10년 (원금균등)', input: '첫달 납입액', result: '약 2,167,000원', note: '총 이자 약 3,025만원' },
        ]} />
        <FAQSection items={[
          { q: '원리금균등과 원금균등의 차이는?', a: '원리금균등은 매달 같은 금액을 납부하는 방식으로 가계 계획이 쉽습니다. 원금균등은 매달 동일한 원금을 갚아서 초반엔 납입액이 많지만 총 이자 부담이 적습니다.' },
          { q: 'DSR·LTV·DTI가 뭔가요?', a: 'LTV(담보인정비율)는 집값 대비 대출 가능 금액, DTI는 연 소득 대비 연간 원리금 상환액 비율, DSR은 모든 대출 원리금 합산 상환 비율(2023년부터 40% 규제)입니다.' },
          { q: '금리 0.5% 차이가 실제로 얼마나?', a: '3억 30년 기준, 3.5%→4.0% 상승 시 월 납입 약 8만원 증가, 총 이자 약 2,900만원 증가. 장기 대출일수록 금리 차이의 영향이 큽니다.' },
          { q: '중도상환수수료는 언제 발생?', a: '대출 실행 후 1~3년 내 조기 상환 시 발생합니다. 통상 잔여 원금의 1~2% 수준이며 기간에 따라 점감됩니다.' },
          { q: '변동금리 vs 고정금리?', a: '금리 상승기에는 고정금리, 하락기에는 변동금리가 유리합니다. 예측이 어렵다면 혼합형(5년 고정+변동)도 고려하세요.' },
          { q: '3억 대출 첫해 이자는?', a: '연 3.5% 기준 첫해 이자는 약 1,050만원(월 87.5만원). 원리금균등이면 매달 약 134.7만원 중 초반에는 이자 비중이 높습니다.' },
        ]} />
        <TipsSection title="주담대 절약 팁" items={[
          { title: '금리 비교 필수', desc: '시중은행·인터넷은행·신협 금리를 반드시 비교하세요. 같은 조건도 은행별 0.3~1%p 차이가 흔합니다.' },
          { title: '우대금리 조건 챙기기', desc: '급여 이체·카드 사용·자동이체 등 거래 실적에 따라 우대금리를 받을 수 있습니다.' },
          { title: '거치 기간 최소화', desc: '이자만 내는 거치 기간이 길수록 총 이자 부담이 늘어납니다. 가능하면 거치 없이 원금 상환을 시작하세요.' },
        ]} />
        <RelatedLinks links={[
          { href: '/salary', label: '연봉 실수령액' },
          { href: '/severance', label: '퇴직금' },
          { href: '/savings', label: '적금 이자' },
          { href: '/jeonse', label: '전월세 전환' },
        ]} />
      </div>
    </div>
  )
}
