'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSavingsStore } from '@/store'
import { calcSavings, SavingsType, InterestType } from '@/lib/savings'
import { PiggyBank } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection } from '@/components/ui/PageContent'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SavingsPage() {
  const { type, amount, annualRate, months, interestType, set } = useSavingsStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() =>
    calcSavings({ type, amount, annualRate, months, interestType }),
    [type, amount, annualRate, months, interestType]
  )

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
          <PiggyBank className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">적금/예금 이자 계산기</h1>
          <p className="text-sm text-white/55 mt-0.5">이자소득세 15.4% 차감 후 세후 수익 자동 계산</p>
        </div>
      </div>

      {/* 입력 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        {/* 유형 선택 */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">상품 유형</label>
          <div className="grid grid-cols-2 gap-2">
            {([['savings','정기적금','매월 납입'], ['deposit','정기예금','일시 예치']] as [SavingsType, string, string][]).map(([v, label, desc]) => (
              <button
                key={v}
                onClick={() => set({ type: v })}
                className={`rounded-xl p-3 border transition-all text-left ${
                  type === v
                    ? 'border-amber-400/60 bg-amber-500/20 text-amber-300'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-sm">{label}</div>
                <div className="text-[11px] opacity-60 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 금액 */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            {type === 'savings' ? '월 납입액' : '예치 원금'}
          </label>
          <div className="relative">
            <NumericInput
              className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold pr-14"
              value={amount}
              defaultValue={1_000_000}
              unitMultiplier={10000}
              onChange={(n) => set({ amount: n })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-xs text-white/40 mt-1">= {formatKRW(amount)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">연이율 (%)</label>
            <NumericInput
              className="glass-input w-full rounded-xl px-4 py-3 font-bold"
              value={annualRate}
              defaultValue={3.5}
              allowDecimal
              onChange={(n) => set({ annualRate: n })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">기간 (개월)</label>
            <select
              className="glass-select w-full rounded-xl px-4 py-3"
              value={months}
              onChange={(e) => set({ months: Number(e.target.value) })}
            >
              {[3,6,12,18,24,36,48,60].map(m => (
                <option key={m} value={m}>{m}개월 ({m >= 12 ? `${m/12}년` : `${m}달`})</option>
              ))}
            </select>
          </div>
        </div>

        {/* 이자 방식 */}
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">이자 방식</label>
          <div className="grid grid-cols-2 gap-2">
            {([['simple','단리','원금에만 이자'], ['compound','복리','이자에도 이자']] as [InterestType, string, string][]).map(([v, label, desc]) => (
              <button
                key={v}
                onClick={() => set({ interestType: v })}
                className={`rounded-xl p-3 border transition-all text-left ${
                  interestType === v
                    ? 'border-amber-400/60 bg-amber-500/20 text-amber-300'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-sm">{label}</div>
                <div className="text-[11px] opacity-60 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/30 ring-1 ring-white/20 ring-inset">
        <p className="text-sm opacity-80 mb-1">만기 수령액 (세후)</p>
        <p className="text-5xl font-extrabold tracking-tight result-value">{formatKRW(result.maturityAmount)}</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs opacity-70">납입 원금</p>
            <p className="font-bold num">{formatKRW(result.principal)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xs opacity-70">세후 이자</p>
            <p className="font-bold num">+{formatKRW(result.netInterest)}</p>
          </div>
        </div>
      </div>

      {/* 세금 상세 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">이자 세금 상세</h2>
        <div className="flex flex-col gap-2">
          {[
            { label: '세전 이자',           value: result.grossInterest,  color: 'text-white' },
            { label: '이자소득세 (15.4%)',   value: -result.taxAmount,     color: 'text-red-400' },
            { label: '세후 이자',            value: result.netInterest,    color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between py-2 border-b border-white/12 last:border-0">
              <span className="text-sm text-white/60">{label}</span>
              <span className={`text-sm font-semibold ${color}`}>{value < 0 ? '-' : ''}{formatKRW(Math.abs(value))}</span>
            </div>
          ))}
          <div className="flex justify-between py-2">
            <span className="text-sm text-white/60">실효 연이율</span>
            <span className="text-sm font-semibold text-amber-400">{result.effectiveRate.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* 광고 슬롯 */}
      <div id="adsense-savings" className="w-full min-h-[90px] glass-card rounded-xl flex items-center justify-center text-xs text-white/30">광고 영역</div>

      {/* 계산 예시 */}
      <ExamplesSection title="적금/예금 계산 예시" items={[
        { label: '월 30만 · 연 3.5% · 12개월 (적금)', input: '납입 원금 360만원', result: '세후 약 3,665,000원', note: '이자소득세 15.4% 차감 후' },
        { label: '1,000만 · 연 3.8% · 12개월 (예금)', input: '예치 원금 1,000만원', result: '세후 약 10,321,000원', note: '세후 이자 약 321,600원' },
        { label: '월 50만 · 연 4.0% · 24개월 (적금)', input: '납입 원금 1,200만원', result: '세후 약 1,248,000원 이자', note: '복리 기준' },
      ]} />

      {/* FAQ */}
      <FAQSection items={[
        { q: '단리와 복리의 차이는 무엇인가요?', a: '단리는 원금에만 이자가 붙는 방식이고, 복리는 발생한 이자에도 다시 이자가 붙는 방식입니다. 기간이 길수록 복리의 효과가 훨씬 커집니다. 1,000만원을 연 4%로 10년 운용 시 단리 400만원, 복리 약 480만원의 차이가 납니다.' },
        { q: '이자소득세 15.4%는 어떻게 계산되나요?', a: '이자소득세는 소득세 14% + 지방소득세 1.4% = 총 15.4%입니다. 만기 이자에서 자동으로 차감된 후 지급됩니다. 예를 들어 세전 이자 100만원이라면 세후 실제 수령액은 846,000원입니다.' },
        { q: '적금 vs 예금 어느 쪽이 유리한가요?', a: '목돈이 있다면 예금(일시 예치)이 이자를 더 많이 받습니다. 매달 납입하는 적금은 첫 달 입금액만 12개월 전체 이자를 받고, 마지막 달 납입액은 1개월치 이자만 받기 때문에 실효 이율이 명목 이율의 절반 수준입니다.' },
        { q: '비과세 상품으로 세금을 줄일 수 있나요?', a: '네, ISA 계좌(개인종합자산관리계좌)를 활용하면 200만원(서민형 400만원)까지 비과세 혜택이 있습니다. 농어촌특별세 1.4%만 부과되는 세금우대 상품도 있습니다. 단, 조건과 한도가 있으므로 가입 전 확인이 필요합니다.' },
        { q: '파킹통장과 정기적금 중 어느 것이 나은가요?', a: '파킹통장은 자유롭게 입출금이 가능하고 일 단위 이자를 받아 유동성이 높습니다. 정기적금은 만기까지 유지해야 하지만 이율이 더 높습니다. 6개월 이내에 써야 할 돈은 파킹통장, 1년 이상 묶어둘 수 있는 돈은 적금이 유리합니다.' },
      ]} />

      <TipsSection title="이자 극대화 팁" items={[
        { title: 'ISA 계좌 활용으로 비과세 혜택', desc: '개인종합자산관리계좌(ISA)에 예금·적금을 편입하면 연간 200만원까지 이자·배당에 비과세 혜택이 주어집니다. 서민형·농어민형은 400만원까지 가능합니다.' },
        { title: '금리 높은 인터넷은행 활용', desc: '카카오뱅크, 케이뱅크, 토스뱅크 등 인터넷은행은 시중은행보다 0.3~0.5%p 높은 이율을 제공하는 경우가 많습니다. 특히 신규 가입자 우대 이벤트를 적극 활용하세요.' },
        { title: '만기 자동 재예치 주의', desc: '만기 후 자동 재예치되면 당시 금리(보통 더 낮은 금리)로 새로 계약됩니다. 만기 알림을 설정하고 만기 직후 금리를 직접 비교해 가장 유리한 상품으로 갈아타세요.' },
      ]} />

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/mortgage',label:'대출 이자'},{href:'/jeonse',label:'전월세 전환'}].map(({href,label})=>(
          <a key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</a>
        ))}
      </div>
    </div>
  )
}
