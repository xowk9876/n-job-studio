'use client'

import { useMemo, useState, useEffect } from 'react'
import { useJeonseStore } from '@/store'
import { calcJeonse, DEFAULT_CONVERSION_RATE, ConversionDirection } from '@/lib/jeonse'
import { Info } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }
function manwon(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억원`
  if (n >= 10_000) return `${Math.floor(n / 10_000)}만원`
  return won(n)
}

export default function JeonsePage() {
  const { direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, set } = useJeonseStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const r = useMemo(() => calcJeonse({
    direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate,
  }), [direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate])

  if (!mounted) return null

  const isToWolse = direction === 'jeonse-to-wolse'

  return (
    <div className="calc-page">
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">JEONSE</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">전월세 전환 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">법정 전월세 전환율 기준</p>
      </div>

      <div className="result-card">
        {isToWolse ? (
          <>
            <p className="result-label">전환 후 월세</p>
            <p className="result-value">{won(r.monthlyRent ?? 0)}</p>
            <p className="text-[12px] opacity-70 mt-2">연간 주거비 {manwon(r.annualCost)}</p>
          </>
        ) : (
          <>
            <p className="result-label">필요 전세 보증금</p>
            <p className="result-value">{manwon(r.jeonseDeposit ?? 0)}</p>
            <p className="text-[12px] opacity-70 mt-2">현재 연간 월세 {manwon(r.annualCost)}</p>
          </>
        )}
      </div>

      {/* 방향 */}
      <div className="grid grid-cols-2 gap-2">
        {([['jeonse-to-wolse','전세 → 월세'],['wolse-to-jeonse','월세 → 전세']] as [ConversionDirection, string][]).map(([v, label]) => (
          <button
            key={v}
            onClick={() => set({ direction: v })}
            className={`rounded-lg py-2.5 px-3 border transition-colors font-semibold text-[13px] ${
              direction === v
                ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]'
                : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 입력 */}
      <div className="glass-card flex flex-col gap-4">
        {isToWolse ? (
          <>
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">현재 전세 보증금</label>
              <div className="relative">
                <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={jeonsDeposit} defaultValue={300_000_000} unitMultiplier={10000} onChange={(n) => set({ jeonsDeposit: n })} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1">= {manwon(jeonsDeposit)}</p>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">목표 월세 보증금</label>
              <div className="relative">
                <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={wolseDeposit} defaultValue={50_000_000} unitMultiplier={10000} onChange={(n) => set({ wolseDeposit: n })} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1">= {manwon(wolseDeposit)}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">현재 월세</label>
              <div className="relative">
                <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={currentWolse} defaultValue={700_000} unitMultiplier={10000} onChange={(n) => set({ currentWolse: n })} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1">= {won(currentWolse)}</p>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">현재 월세 보증금</label>
              <div className="relative">
                <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={currentWolseDeposit} defaultValue={50_000_000} unitMultiplier={10000} onChange={(n) => set({ currentWolseDeposit: n })} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1">= {manwon(currentWolseDeposit)}</p>
            </div>
          </>
        )}

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">
            전월세 전환율 (%)
            <span className="ml-2 text-[10.5px] font-normal text-white/40">법정 상한 {DEFAULT_CONVERSION_RATE}% (기준금리 2.5%+2%)</span>
          </label>
          <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold" value={conversionRate} defaultValue={4.5} allowDecimal onChange={(n) => set({ conversionRate: n })} />
        </div>
      </div>

      {/* 손익 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-2.5 text-[13.5px] flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-white/40" />손익 분석</h2>
        <div className="rounded-lg px-3 py-2.5 text-[12.5px] text-white/70 mb-2.5 bg-white/[0.05]">{r.suggestion}</div>
        <div className="flex justify-between text-[12.5px]">
          <span className="text-white/50">손익분기 전환율</span>
          <span className="font-bold text-[color:var(--brand)] tabular">{r.breakEvenRate.toFixed(2)}%</span>
        </div>
      </div>

      <div className="glass-card text-[12.5px] text-white/65">
        <h2 className="font-semibold text-white mb-2 text-[13.5px]">전월세 전환율이란?</h2>
        <p className="mb-2">전월세 전환율은 전세 보증금을 월세로 전환할 때 적용하는 이율입니다. 법정 상한은 <strong className="text-white">기준금리 + 2%</strong>로, 2026년 기준 <strong className="text-white">4.5%</strong>입니다.</p>
        <ul className="list-disc list-inside space-y-1 text-white/45 text-[11.5px]">
          <li>월세 = (전세 보증금 − 월세 보증금) × 전환율 ÷ 12</li>
          <li>집주인이 법정 상한 초과 요구 시 거부 가능</li>
          <li>시장 전환율은 지역·상황마다 다름</li>
          <li>한국은행 기준금리 변동 시 법정 상한도 변동</li>
        </ul>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="전월세 전환 계산 예시" items={[
          { label: '전세 3억 → 월세 (전환율 4.5%)', input: '보증금 5천만원 유지', result: '월세 약 937,500원', note: '(3억−5천만) × 4.5% ÷ 12' },
          { label: '전세 2억 → 월세 (전환율 4.5%)', input: '보증금 2천만원 유지', result: '월세 약 675,000원', note: '(2억−2천만) × 4.5% ÷ 12' },
          { label: '월세 70만 → 전세 환산 (전환율 4.5%)', input: '보증금 1천만원 기준', result: '필요 전세 약 1억 9,667만원', note: '월세×12÷전환율+보증금' },
        ]} />
        <FAQSection items={[
          { q: '전월세 전환율이란?', a: '전세 보증금의 일부 또는 전부를 월세로 전환할 때 적용하는 연간 이율입니다. 법정 상한은 한국은행 기준금리 + 2%p이며, 2026년 기준 4.5%(기준금리 2.5%)입니다.' },
          { q: '전세와 월세 중 어느 쪽이 유리?', a: '본인의 자금 조달 비용과 전환율을 비교하세요. 전세 보증금을 대출로 마련했다면 대출 이자(연 4~5%)와 월세 전환율을 비교합니다. 보증금 운용수익률이 전환율보다 높으면 전세, 낮으면 월세가 유리.' },
          { q: '역전세란?', a: '전세 계약 만료 시 시세가 하락하여 집주인이 보증금을 돌려주기 어려운 상황입니다. 전세보증보험 가입을 강력히 권장합니다.' },
          { q: '전세 보증금을 안전하게 지키는 방법?', a: '① 확정일자 ② 전입신고 즉시 ③ 전세보증보험(HUG·SGI) 가입 ④ 등기부등본으로 근저당 확인 ⑤ 집주인 체납세금 확인.' },
          { q: '전월세 전환 시 계약서 수정 방법?', a: '기존 전세 계약 종료 후 새 월세 계약 체결하거나, 합의각서(변경계약서)로 기존 계약을 변경합니다. 어느 방법이든 확정일자를 다시 받아야 대항력이 유지됩니다.' },
          { q: '집주인이 법정 상한 초과 요구 시?', a: '주택임대차보호법 제7조의2에 따라 법정 상한(기준금리+2%) 초과 전환율은 효력이 없습니다. 초과 납부액은 반환 청구 가능. 분쟁 시 주택임대차분쟁조정위원회.' },
        ]} />
        <TipsSection title="전세 · 월세 체크리스트" items={[
          { title: '전세보증보험 필수 가입', desc: 'HUG 전세보증금반환보증은 집주인이 보증금을 못 돌려줄 때 공사가 대신 지급합니다. 보증금의 약 0.12~0.15% 보험료로 큰 리스크를 헤지.' },
          { title: '확정일자 + 전입신고 즉시', desc: '이사 당일 주민센터에서 전입신고와 확정일자 동시 처리. 두 가지 완료 시 우선변제권이 발생해 경매 시에도 보증금을 보호받을 수 있습니다.' },
          { title: '계약 직전 등기부등본 재확인', desc: '도장 찍기 전 등기부등본을 다시 열람해 추가된 근저당이나 압류가 없는지 확인. 인터넷등기소 700원.' },
        ]} />
        <RelatedLinks links={[
          { href: '/salary', label: '연봉 실수령액' },
          { href: '/mortgage', label: '대출 이자' },
          { href: '/savings', label: '적금 이자' },
          { href: '/severance', label: '퇴직금' },
        ]} />
      </div>
    </div>
  )
}
