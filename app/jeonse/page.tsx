'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useJeonseStore } from '@/store'
import { calcJeonse, DEFAULT_CONVERSION_RATE, ConversionDirection } from '@/lib/jeonse'
import { Building2, ArrowLeftRight, Info } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection } from '@/components/ui/PageContent'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }
function formatManwon(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억원`
  if (n >= 10_000) return `${Math.floor(n / 10_000)}만원`
  return formatKRW(n)
}

export default function JeonsePage() {
  const { direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, set } = useJeonseStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(() => calcJeonse({
    direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate,
  }), [direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate])

  if (!mounted) return null

  const isToWolse = direction === 'jeonse-to-wolse'

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">전세↔월세 전환 계산기</h1>
          <p className="text-sm text-white/55 mt-0.5">전월세 전환율 기준 — 손익분기 자동 분석</p>
        </div>
      </div>

      {/* 방향 선택 */}
      <div className="grid grid-cols-2 gap-3">
        {([['jeonse-to-wolse','전세 → 월세','전세를 월세로 전환'],['wolse-to-jeonse','월세 → 전세','월세를 전세로 전환']] as [ConversionDirection, string, string][]).map(([v, label, desc]) => (
          <button
            key={v}
            onClick={() => set({ direction: v })}
            className={`rounded-2xl p-4 border transition-all text-left flex items-center gap-3 ${
              direction === v
                ? 'border-blue-400/60 bg-blue-500/15'
                : 'border-white/20 bg-white/5 hover:border-white/35 hover:bg-white/10'
            }`}
          >
            <ArrowLeftRight className={`w-5 h-5 shrink-0 ${direction === v ? 'text-blue-300' : 'text-white/40'}`} />
            <div>
              <div className={`font-bold text-sm ${direction === v ? 'text-blue-200' : 'text-white/70'}`}>{label}</div>
              <div className="text-[11px] text-white/40">{desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 입력 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        {isToWolse ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">현재 전세 보증금</label>
              <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold"
                value={jeonsDeposit} defaultValue={300_000_000} unitMultiplier={10000}
                onChange={(n) => set({ jeonsDeposit: n })} />
              <p className="text-xs text-white/40 mt-1">= {formatManwon(jeonsDeposit)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">목표 월세 보증금</label>
              <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold"
                value={wolseDeposit} defaultValue={50_000_000} unitMultiplier={10000}
                onChange={(n) => set({ wolseDeposit: n })} />
              <p className="text-xs text-white/40 mt-1">= {formatManwon(wolseDeposit)}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">현재 월세</label>
              <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold"
                value={currentWolse} defaultValue={700_000} unitMultiplier={10000}
                onChange={(n) => set({ currentWolse: n })} />
              <p className="text-xs text-white/40 mt-1">= {formatKRW(currentWolse)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">현재 월세 보증금</label>
              <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold"
                value={currentWolseDeposit} defaultValue={50_000_000} unitMultiplier={10000}
                onChange={(n) => set({ currentWolseDeposit: n })} />
              <p className="text-xs text-white/40 mt-1">= {formatManwon(currentWolseDeposit)}</p>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-white/80 mb-1">
            전월세 전환율 (%)
            <span className="ml-2 text-xs font-normal text-white/40">
              법정 상한 {DEFAULT_CONVERSION_RATE}% (기준금리 2.5%+2%)
            </span>
          </label>
          <NumericInput
            className="glass-input w-full rounded-xl px-4 py-3 font-bold"
            value={conversionRate}
            defaultValue={4.5}
            allowDecimal
            onChange={(n) => set({ conversionRate: n })}
          />
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-2xl p-6 text-white ring-1 ring-inset ring-white/10" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0f766e 100%)', boxShadow: '0 12px 40px rgba(30,58,138,0.45), 0 0 0 1px rgba(96,165,250,0.25)' }}>
        {isToWolse ? (
          <>
            <p className="text-sm opacity-80 mb-1">전환 후 월세</p>
            <p className="text-5xl font-extrabold tracking-tight result-value">{formatKRW(result.monthlyRent ?? 0)}</p>
            <p className="text-sm opacity-70 mt-2">연간 주거비 {formatManwon(result.annualCost)}</p>
          </>
        ) : (
          <>
            <p className="text-sm opacity-80 mb-1">필요 전세 보증금</p>
            <p className="text-5xl font-extrabold tracking-tight result-value">{formatManwon(result.jeonseDeposit ?? 0)}</p>
            <p className="text-sm opacity-70 mt-2">현재 연간 월세 {formatManwon(result.annualCost)}</p>
          </>
        )}
      </div>

      {/* 손익 분석 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-white/40" /> 손익 분석
        </h2>
        <div className="rounded-xl p-4 text-sm text-white/70 mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {result.suggestion}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">손익분기 전환율</span>
          <span className="font-bold text-blue-300">{result.breakEvenRate.toFixed(2)}%</span>
        </div>
      </div>

      {/* 광고: Google 자동광고(Auto Ads)로 자동 배치 */}

      {/* SEO 텍스트 */}
      <div className="glass-card rounded-2xl p-6 text-sm text-white/60">
        <h2 className="font-bold text-white mb-3">전월세 전환율이란?</h2>
        <p className="mb-2">전월세 전환율은 전세 보증금을 월세로 전환할 때 적용하는 이율입니다. 법정 상한은 <strong className="text-white">기준금리 + 2%</strong>로, 2026년 기준 <strong className="text-white">4.5%</strong>입니다. (기준금리 2.5% 기준)</p>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>월세 = (전세 보증금 - 월세 보증금) × 전환율 ÷ 12</li>
          <li>집주인이 법정 상한 초과 전환율 요구 시 거부 가능</li>
          <li>실제 시장 전환율은 지역·상황마다 다를 수 있음</li>
          <li>한국은행 기준금리 변동 시 법정 상한도 변동됨</li>
        </ul>
      </div>

      {/* 계산 예시 */}
      <ExamplesSection title="전월세 전환 계산 예시" items={[
        { label: '전세 3억 → 월세 (전환율 4.5%)', input: '보증금 5천만원 유지 시', result: '월세 약 937,500원', note: '(3억-5천만) × 4.5% ÷ 12' },
        { label: '전세 2억 → 월세 (전환율 4.5%)', input: '보증금 2천만원 유지 시', result: '월세 약 675,000원', note: '(2억-2천만) × 4.5% ÷ 12' },
        { label: '월세 70만 → 전세 환산 (전환율 4.5%)', input: '보증금 1천만원 기준', result: '필요 전세 약 1억 9,667만원', note: '월세×12÷전환율+보증금' },
      ]} />

      {/* FAQ */}
      <FAQSection items={[
        { q: '전월세 전환율이란 무엇인가요?', a: '전세 보증금의 일부 또는 전부를 월세로 전환할 때 적용하는 연간 이율입니다. 법정 상한은 한국은행 기준금리 + 2%p이며, 2026년 기준 4.5%(기준금리 2.5%)입니다. 집주인은 이 상한을 초과하는 전환율을 요구할 수 없습니다.' },
        { q: '전세와 월세 중 어느 쪽이 유리한가요?', a: '본인의 자금 조달 비용과 전환율을 비교해야 합니다. 전세 보증금을 대출받아 마련했다면 대출 이자(연 4~5%)와 월세를 비교하세요. 보증금 운용수익률이 월세 전환율보다 높다면 전세가 유리하고, 낮다면 월세가 유리합니다.' },
        { q: '역전세란 무엇인가요?', a: '역전세는 전세 계약 만료 시 시세가 하락하여 집주인이 보증금을 돌려주기 어려운 상황입니다. 전세 시세가 기존 계약금보다 낮아지면 임차인은 보증금을 온전히 돌려받지 못할 위험이 있습니다. 전세 계약 시 전세보증보험 가입을 강력히 권장합니다.' },
        { q: '전세 보증금을 안전하게 지키는 방법은?', a: '① 확정일자를 받아두세요. ② 전입신고를 즉시 하세요. ③ 전세보증보험(HUG 또는 SGI)에 가입하세요. ④ 등기부등본을 확인해 근저당 설정 여부를 확인하세요. ⑤ 집주인의 체납 세금도 확인 가능합니다.' },
        { q: '전월세 전환 시 계약서는 어떻게 수정하나요?', a: '기존 전세 계약을 종료하고 새 월세 계약을 체결하거나, 합의각서(변경계약서)를 작성해 기존 계약을 변경할 수 있습니다. 어느 방법이든 확정일자를 다시 받고 변경된 조건을 등록해야 대항력이 유지됩니다.' },
        { q: '법정 전환율 상한을 집주인이 초과 요구하면?', a: '주택임대차보호법 제7조의2에 따라 법정 상한(기준금리+2%)을 초과하는 전환율은 효력이 없습니다. 초과 전환율로 월세를 납부했다면 차액을 반환 청구할 수 있습니다. 분쟁 시 주택임대차분쟁조정위원회에 신청하세요.' },
      ]} />

      <TipsSection title="전세·월세 체크리스트" items={[
        { title: '전세보증보험 필수 가입', desc: '전세보증보험(HUG 전세보증금반환보증)은 집주인이 보증금을 못 돌려줄 때 공사가 대신 지급해주는 보험입니다. 보증금의 약 0.12~0.15% 수준의 보험료로 큰 리스크를 헤지할 수 있습니다.' },
        { title: '확정일자 + 전입신고 즉시 처리', desc: '이사 당일 주민센터에서 전입신고와 확정일자를 모두 처리하세요. 이 두 가지가 완료되면 임차인의 우선변제권이 발생해 경매 시에도 보증금을 보호받을 수 있습니다.' },
        { title: '등기부등본 계약 직전 재확인', desc: '계약서에 도장 찍기 전 등기부등본을 다시 열람해 계약 이후 추가된 근저당이나 압류가 없는지 반드시 확인하세요. 인터넷 등기소에서 700원에 발급 가능합니다.' },
      ]} />

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/mortgage',label:'대출 이자'},{href:'/savings',label:'적금 이자'}].map(({href,label})=>(
          <Link key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</Link>
        ))}
      </div>
    </div>
  )
}
