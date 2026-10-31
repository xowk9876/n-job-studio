'use client'

import { useMemo } from 'react'
import { useJeonseStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcJeonse, DEFAULT_BASE_RATE, DEFAULT_CONVERSION_RATE, ConversionDirection } from '@/lib/jeonse'
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'
import { getCalculatorLinks } from '@/lib/seo'
import { officialSources } from '@/lib/content-sources'

const CALC_PATH = '/jeonse'
const calcSeo = getCalculatorLinks(CALC_PATH)

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }
function manwon(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억원`
  if (n >= 10_000) return `${Math.floor(n / 10_000)}만원`
  return won(n)
}

export default function JeonsePage() {
  const { direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, marketPrice, set } = useJeonseStore()
  usePersistRehydrate(useJeonseStore)

  const r = useMemo(() => calcJeonse({
    direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, marketPrice,
  }), [direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, marketPrice])

  const isToWolse = direction === 'jeonse-to-wolse'

  return (
    <div className="calc-page">
      {r.error && <p role="alert" className="glass-card text-[color:var(--danger)]">{r.error}</p>}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">JEONSE</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">전월세 전환 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">보증금·월세 환산 · 적용 범위 확인</p>
      </div>

      <div className="result-card">
        {isToWolse ? (
          <>
            <p className="result-label">전환 후 월세</p>
            <p className="result-value">{won(r.monthlyRent ?? 0)}</p>
            <p className="text-[12px] opacity-70 mt-2">연간 월세 {manwon(r.annualCost)}</p>
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
                <NumericInput ariaLabel="전세 보증금 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={jeonsDeposit} defaultValue={300_000_000} unitMultiplier={10000} onChange={(n) => set({ jeonsDeposit: n })} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1">= {manwon(jeonsDeposit)}</p>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">목표 월세 보증금</label>
              <div className="relative">
                <NumericInput ariaLabel="전환 후 월세 보증금 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={wolseDeposit} defaultValue={50_000_000} unitMultiplier={10000} onChange={(n) => set({ wolseDeposit: n })} />
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
                <NumericInput ariaLabel="현재 월세 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={currentWolse} defaultValue={700_000} unitMultiplier={10000} onChange={(n) => set({ currentWolse: n })} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1">= {won(currentWolse)}</p>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">현재 월세 보증금</label>
              <div className="relative">
                <NumericInput ariaLabel="현재 월세 보증금 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={currentWolseDeposit} defaultValue={50_000_000} unitMultiplier={10000} onChange={(n) => set({ currentWolseDeposit: n })} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1">= {manwon(currentWolseDeposit)}</p>
            </div>
          </>
        )}

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">
            전월세 전환율 (%)
            <span className="ml-2 text-[10.5px] font-normal text-white/40">법정 상한 {DEFAULT_CONVERSION_RATE.toFixed(2)}% (기준금리 {DEFAULT_BASE_RATE.toFixed(2)}%+2%)</span>
          </label>
          <NumericInput ariaLabel="전월세 전환율 (%)" max={100} min={0.001}  className="glass-input w-full rounded-xl px-4 py-3 font-bold" value={conversionRate} defaultValue={DEFAULT_CONVERSION_RATE} allowDecimal onChange={(n) => set({ conversionRate: n })} />
        </div>

        {isToWolse && (
          <div>
            <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">매매 시세 <span className="text-[10.5px] font-normal text-white/40">(선택 · 전세가율 참고)</span></label>
            <div className="relative">
              <NumericInput ariaLabel="매매 시세 (만원)"  className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={marketPrice} defaultValue={0} unitMultiplier={10000} onChange={(n) => set({ marketPrice: n })} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
            </div>
            <p className="text-[11.5px] text-white/40 mt-1">입력한 시세 대비 보증금 비율입니다. 선순위 채권·체납·반환보증 가입 여부는 판단하지 않습니다.</p>
          </div>
        )}
      </div>

      {/* 깡통전세 위험도 */}
      {r.risk && (
        <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border ${
          r.risk.level === 'danger' ? 'bg-rose-500/12 border-rose-500/30' :
          r.risk.level === 'caution' ? 'bg-amber-500/12 border-amber-500/30' :
          'bg-emerald-500/12 border-emerald-500/30'
        }`}>
          {r.risk.level === 'safe' ? <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${r.risk.level === 'danger' ? 'text-rose-400' : 'text-amber-400'}`} />}
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <p className={`font-semibold text-[13px] ${
                r.risk.level === 'danger' ? 'text-rose-200' :
                r.risk.level === 'caution' ? 'text-amber-200' :
                'text-emerald-200'
              }`}>{r.risk.label}</p>
              <span className={`font-bold tabular text-[14px] ${
                r.risk.level === 'danger' ? 'text-rose-300' :
                r.risk.level === 'caution' ? 'text-amber-300' :
                'text-emerald-300'
              }`}>전세가율 {r.risk.ratio.toFixed(1)}%</span>
            </div>
            <p className={`text-[11.5px] mt-1 leading-relaxed ${
              r.risk.level === 'danger' ? 'text-rose-300/85' :
              r.risk.level === 'caution' ? 'text-amber-300/85' :
              'text-emerald-300/85'
            }`}>{r.risk.message}</p>
          </div>
        </div>
      )}

      {/* 손익 */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-2.5 text-[13.5px] flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-white/40" />비용 비교 가정</h2>
        <div className="rounded-lg px-3 py-2.5 text-[12.5px] text-white/70 mb-2.5 bg-white/[0.05]">{r.suggestion}</div>
        <div className="flex justify-between text-[12.5px]">
          <span className="text-white/50">비교 가정 금리</span>
          <span className="font-bold text-[color:var(--brand)] tabular">{r.breakEvenRate.toFixed(2)}%</span>
        </div>
      </div>

      <div className="glass-card text-[12.5px] text-white/65">
        <h2 className="font-semibold text-white mb-2 text-[13.5px]">전월세 전환율이란?</h2>
        <p className="mb-2">전월세 전환율은 전세 보증금을 월세로 전환할 때 적용하는 이율입니다. 법정 상한은 <strong className="text-white">min(기준금리 + 2%p, 10%)</strong>로, 2026년 10월 기준 <strong className="text-white">{DEFAULT_CONVERSION_RATE.toFixed(2)}%</strong>입니다.</p>
        <ul className="list-disc list-inside space-y-1 text-white/45 text-[11.5px]">
          <li>월세 = (전세 보증금 − 월세 보증금) × 전환율 ÷ 12</li>
          <li>법정 상한은 보증금을 월세로 전환하는 경우의 기준</li>
          <li>월세→전세 역산은 계약 협의를 위한 참고값</li>
          <li>한국은행 기준금리 변동 시 법정 상한도 변동</li>
        </ul>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="전월세 전환 계산 예시" items={[
          { label: '전세 3억원 → 월세 · 연 5% 가정', input: '월세 보증금 5,000만원 유지', result: '월세 약 1,041,667원', note: '(3억원 − 5,000만원) × 5% ÷ 12' },
          { label: '월세 70만원 → 전세 · 연 5% 가정', input: '기존 월세 보증금 1,000만원', result: '전세 환산액 1억 7,800만원', note: '월세 × 12 ÷ 5% + 보증금 · 협의용 참고값' },
        ]} />
        <FAQSection pagePath={CALC_PATH} items={[
          { q: '법정 전환율은 양방향 모두 적용되나요?', a: '법정 상한은 보증금을 월차임으로 전환하는 경우의 기준으로, 기준금리 + 2%p와 연 10% 중 낮은 값입니다. 월세를 전세로 역산한 금액을 법정 보증금으로 볼 수는 없습니다. 신규 계약·갱신·조건 변경 여부에 따라 적용 범위를 확인하세요.' },
          { q: '표시된 상한은 언제 기준인가요?', a: '2026년 10월 22일 한국은행 기준금리 3.00% 기준 법정 상한은 연 5.00%입니다. 이후 기준금리가 바뀌면 상한도 달라집니다. 사용자가 입력한 전환율과 법정 상한은 구분해 비교하세요.' },
          { q: '전세가율이 낮으면 보증금이 안전한가요?', a: '아닙니다. 이 화면은 보증금÷입력 시세만 계산하며 선순위 채권, 다른 임차보증금, 체납과 경매 낙찰가를 반영하지 않습니다. HUG 보증한도는 인정 주택가격의 90%에서 선순위채권 등을 차감하고 다른 가입 조건도 확인합니다.' },
          { q: '전입신고와 확정일자를 받으면 바로 보호되나요?', a: '대항력은 주택 인도와 주민등록을 모두 갖춘 다음 날 발생합니다. 우선변제권에는 이 요건과 확정일자가 필요합니다. 보증금 회수는 선순위 권리와 배당 재원 등에도 영향을 받습니다.' },
          { q: '계약 변경이나 분쟁이 생기면 어떻게 하나요?', a: '기존 계약서·확정일자·지급 증빙을 보관하고, 변경된 보증금과 권리 순위를 확인하세요. 해결이 어렵다면 주택임대차분쟁조정위원회 또는 법률상담을 이용할 수 있습니다. 수수료·면제 여부와 절차는 접수 기관에서 확인하세요.' },
        ]} />
        <TipsSection title="계약 전 확인사항" items={[
          { title: '시세·등기·체납 함께 확인', desc: '보증금 비율 하나로 판단하지 말고 등기상 소유자·근저당·신탁, 다른 임차보증금과 임대인의 납세 관련 자료를 확인하세요.' },
          { title: '반환보증을 계약 전에 확인', desc: '보증금과 주택 조건, 선순위 권리, 신청기한을 확인하세요. 보증료와 인정 주택가격은 신청 조건별로 달라집니다.' },
          { title: '입주 후 권리와 증빙 유지', desc: '주택 인도·전입신고·확정일자를 갖추고 계약서와 송금 기록을 보관하세요. 보증금을 받기 전 이사할 때는 임차권등기 완료 등 권리 보전 절차를 확인하세요.' },
        ]} />
        <OfficialSourcesSection sources={officialSources[CALC_PATH]} />
        <RelatedLinks links={calcSeo.related} guideLink={calcSeo.guide} />
      </div>
    </div>
  )
}
