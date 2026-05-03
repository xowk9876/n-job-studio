'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useMortgageStore } from '@/store'
import { calcMortgage, RepaymentType } from '@/lib/mortgage'
import { Home, ChevronDown, ChevronUp } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection } from '@/components/ui/PageContent'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }
function formatManwon(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`
  if (n >= 10_000) return `${Math.floor(n / 10_000)}만`
  return n.toLocaleString()
}

const REPAYMENT_TYPES: { value: RepaymentType; label: string; desc: string }[] = [
  { value: 'equal-payment',   label: '원리금균등', desc: '매달 같은 금액 납부 (가장 일반적)' },
  { value: 'equal-principal', label: '원금균등',   desc: '매달 원금 동일, 이자는 감소' },
  { value: 'bullet',          label: '만기일시',   desc: '매달 이자만, 만기에 원금 상환' },
]

export default function MortgagePage() {
  const { principal, annualRate, years, type, set } = useMortgageStore()
  const [mounted, setMounted] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() =>
    calcMortgage({ principal, annualRate, years, type }),
    [principal, annualRate, years, type]
  )

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
          <Home className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">주택담보대출 이자 계산기</h1>
          <p className="text-sm text-white/55 mt-0.5">원리금균등·원금균등·만기일시 3가지 방식 비교</p>
        </div>
      </div>

      {/* 입력 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">대출금액</label>
          <NumericInput
            className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold"
            value={principal}
            defaultValue={300_000_000}
            unitMultiplier={10000}
            onChange={(n) => set({ principal: n })}
          />
          <p className="text-xs text-white/40 mt-1">= {formatKRW(principal)} ({formatManwon(principal)})</p>
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
            <label className="block text-sm font-semibold text-white/80 mb-2">대출기간 (년)</label>
            <select
              className="glass-select w-full rounded-xl px-4 py-3"
              value={years}
              onChange={(e) => set({ years: Number(e.target.value) })}
            >
              {[5,10,15,20,25,30,35,40].map(y => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">상환 방식</label>
          <div className="grid grid-cols-3 gap-2">
            {REPAYMENT_TYPES.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => set({ type: value })}
                className={`rounded-xl p-3 text-left border transition-all ${
                  type === value
                    ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-bold">{label}</div>
                <div className="text-[10px] mt-0.5 opacity-60">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/30 ring-1 ring-white/20 ring-inset">
        <p className="text-sm opacity-80 mb-1">
          {type === 'equal-payment' ? '월 납입액' : type === 'equal-principal' ? '첫 달 납입액' : '월 이자 (만기 전)'}
        </p>
        <p className="text-5xl font-extrabold tracking-tight result-value">{formatKRW(result.monthlyPayment)}</p>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div><p className="text-xs opacity-70">총 납입액</p><p className="font-bold num">{formatManwon(result.totalPayment)}</p></div>
          <div><p className="text-xs opacity-70">총 이자</p><p className="font-bold num">{formatManwon(result.totalInterest)}</p></div>
          <div><p className="text-xs opacity-70">이자 비율</p><p className="font-bold num">{result.interestRatio.toFixed(1)}%</p></div>
        </div>
      </div>

      {/* 광고: Google 자동광고(Auto Ads)로 자동 배치 */}

      {/* 상환 스케줄 */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-white/80 hover:bg-white/5 transition-colors"
          onClick={() => setShowSchedule(!showSchedule)}
        >
          월별 상환 스케줄 ({years * 12}개월)
          {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showSchedule && (
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <tr>
                  {['회차','납입액','원금','이자','잔여원금'].map(h => (
                    <th key={h} className="px-3 py-2 text-right text-white/50 font-semibold first:text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-t border-white/8 hover:bg-white/5">
                    <td className="px-3 py-2 text-white/60">{row.month}회</td>
                    <td className="px-3 py-2 text-right font-medium text-white/80">{row.payment.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-blue-400">{row.principal.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-red-400">{row.interest.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-white/50">{row.remaining.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 계산 예시 */}
      <ExamplesSection title="주담대 계산 예시" items={[
        { label: '3억 · 3.5% · 30년 (원리금균등)', input: '월 납입액', result: '약 1,347,000원', note: '총 이자 약 1억 8,492만원' },
        { label: '5억 · 4.0% · 20년 (원리금균등)', input: '월 납입액', result: '약 3,032,000원', note: '총 이자 약 2억 2,768만원' },
        { label: '2억 · 3.0% · 10년 (원금균등)', input: '첫달 납입액', result: '약 2,167,000원', note: '총 이자 약 3,025만원' },
      ]} />

      {/* FAQ */}
      <FAQSection items={[
        { q: '원리금균등과 원금균등 상환의 차이는?', a: '원리금균등은 매달 동일한 금액을 납부하는 방식이라 가계 계획이 쉽습니다. 원금균등은 매달 동일한 원금을 갚아서 초반엔 납입액이 많지만 총 이자 부담이 적습니다. 총 이자는 원금균등이 더 유리합니다.' },
        { q: 'DSR·LTV·DTI가 뭔가요?', a: 'LTV(담보인정비율)는 집값 대비 대출 가능 금액(예: 70%면 3억 집에 최대 2.1억 대출 가능). DTI는 연 소득 대비 연간 원리금 상환액 비율. DSR은 모든 대출 원리금을 합산한 상환 비율로 2023년부터 40% 규제가 적용됩니다.' },
        { q: '금리 0.5% 차이가 실제로 얼마나 큰가요?', a: '3억 30년 대출 기준, 금리가 3.5%에서 4.0%로 0.5%p 오르면 월 납입액은 약 8만원 증가하고 총 이자는 약 2,900만원 더 많아집니다. 장기 대출일수록 금리 차이의 영향이 매우 큽니다.' },
        { q: '중도상환수수료는 언제 발생하나요?', a: '대출 실행 후 일정 기간(보통 1~3년) 내에 조기 상환할 경우 중도상환수수료가 발생합니다. 통상 잔여 원금의 1~2% 수준이며, 기간이 지남에 따라 점감됩니다. 상환 전 반드시 은행에 수수료를 확인하세요.' },
        { q: '변동금리 vs 고정금리 어떻게 선택하나요?', a: '금리 상승기에는 고정금리가 유리하고, 금리 하락기에는 변동금리가 유리합니다. 향후 금리 방향을 예측하기 어렵다면 안정적인 고정금리를 선택하는 것이 리스크 관리에 좋습니다. 혼합형(5년 고정+변동)도 고려해보세요.' },
        { q: '3억 대출 시 연간 이자만 얼마나 되나요?', a: '연 3.5% 기준 3억 대출의 첫해 이자는 약 1,050만원(월 87.5만원)입니다. 원리금균등 방식이라면 매달 약 134.7만원을 납부하며, 그 중 초반에는 이자 비중이 높고 후반으로 갈수록 원금 비중이 높아집니다.' },
      ]} />

      <TipsSection title="주담대 절약 팁" items={[
        { title: '금리 비교 필수 — 0.1%도 수천만원 차이', desc: '시중은행, 인터넷은행(카카오뱅크, 케이뱅크), 신용협동조합 금리를 반드시 비교하세요. 같은 조건이라도 은행별로 0.3~1%p 차이가 나는 경우가 많습니다.' },
        { title: '우대금리 조건 챙기기', desc: '급여 이체, 카드 사용, 자동이체 등 거래 실적에 따라 우대금리를 받을 수 있습니다. 영업점 방문 시 적용 가능한 우대금리 항목을 꼭 확인하세요.' },
        { title: '거치 기간 최소화', desc: '이자만 내는 거치 기간을 길게 잡으면 총 이자 부담이 크게 늘어납니다. 가능하다면 거치 기간 없이 바로 원금 상환을 시작하는 것이 장기적으로 유리합니다.' },
      ]} />

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/severance',label:'퇴직금'},{href:'/jeonse',label:'전월세'}].map(({href,label})=>(
          <Link key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</Link>
        ))}
      </div>
    </div>
  )
}
