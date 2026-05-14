'use client'

import { useMemo, useState, useEffect } from 'react'
import { useJeonseStore } from '@/store'
import { calcJeonse, DEFAULT_CONVERSION_RATE, ConversionDirection } from '@/lib/jeonse'
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }
function manwon(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억원`
  if (n >= 10_000) return `${Math.floor(n / 10_000)}만원`
  return won(n)
}

export default function JeonsePage() {
  const { direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, marketPrice, set } = useJeonseStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const r = useMemo(() => calcJeonse({
    direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, marketPrice,
  }), [direction, jeonsDeposit, wolseDeposit, currentWolse, currentWolseDeposit, conversionRate, marketPrice])

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

        {isToWolse && (
          <div>
            <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">매매 시세 <span className="text-[10.5px] font-normal text-white/40">(선택 · 깡통전세 위험 분석)</span></label>
            <div className="relative">
              <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={marketPrice} defaultValue={0} unitMultiplier={10000} onChange={(n) => set({ marketPrice: n })} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
            </div>
            <p className="text-[11.5px] text-white/40 mt-1">국토부 실거래가 또는 KB 시세 입력 → 전세가율(보증금÷시세) 기준 위험도 산출</p>
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
          { q: '전월세 전환율이란 정확히 무엇인가요?', a: '전세보증금의 일부 또는 전부를 월세로 전환할 때 적용되는 연간 이율입니다. 주택임대차보호법 제7조의2에 따라 법정 상한은 min(한국은행 기준금리 + 2%p, 10%) 중 낮은 값입니다. 2026년 5월 한은 기준금리 2.50% 기준 상한 4.5%. 집주인이 이를 초과해 월세를 요구하면 초과분은 무효이며 반환 청구가 가능합니다.' },
          { q: '전세 vs 월세 무엇이 유리한가요?', a: '본인의 기회비용(보증금 조달 비용 또는 운용수익률)과 실제 전환율을 비교하세요. 전세자금대출 금리가 월세 전환율보다 낮으면 전세가 유리합니다. 목돈을 예적금·투자로 운용할 수 있다면 그 수익률과 비교하세요. 전세대출 금리는 한국주택금융공사(hf.go.kr) 또는 시중은행 공시에서 확인할 수 있습니다. 장기 거주 계획이면 전세, 2년 이내 이사 가능성 있으면 월세가 유연합니다.' },
          { q: '역전세·깡통전세를 피하는 법?', a: '깡통전세는 전세가가 매매가에 근접하거나 초과한 상태. 지표로 전세가율 = 전세보증금 / 매매가가 80% 이상이면 위험. HUG 전세보증금반환보증보험은 공시가격의 126% 이내만 가입 가능(2023.5 강화). 실거래가 확인은 국토부 실거래가공개시스템(rt.molit.go.kr), 전세가율은 KB부동산·아실에서 확인.' },
          { q: '전세 보증금 지키는 5단계?', a: '① 계약 전 등기부등본 열람(인터넷등기소 700원)으로 근저당·가압류 확인 ② 집주인 국세·지방세 완납증명서 요구(2023.4 의무화) ③ 이사 당일 주민센터에서 전입신고 + 확정일자 동시 처리(대항력 + 우선변제권) ④ HUG·SGI 전세보증금반환보증 가입(보증료 연 0.115~0.154%) ⑤ 등기부등본 재열람으로 계약 직후 추가 근저당 없는지 확인.' },
          { q: '계약갱신청구권·전월세상한제는?', a: '주택임대차보호법(2020.7.31 시행)에 따라 임차인은 계약 만료 6개월~2개월 전 1회 계약갱신청구권 행사 가능(총 4년 거주 보장). 갱신 시 임대료 인상률은 5% 이내(전월세상한제). 집주인 본인·직계존비속 실거주 목적이면 갱신 거절 가능하나, 2년 내 타인에게 임대 시 임차인에게 손해배상 책임.' },
          { q: '전월세 전환 시 계약서는 어떻게?', a: '기존 전세 계약 종료 후 새 월세 계약을 체결하거나 변경계약서(합의각서)로 기존 계약을 일부 변경합니다. 어느 방법이든 새로운 확정일자를 받아야 새 월세 금액까지 대항력이 확보됩니다. 보증금이 줄어드는 경우 집주인은 줄어든 금액만큼 반환해야 하며, 이때 근저당 등 선순위 권리가 추가되지 않는지 등기부등본을 반드시 재확인하세요.' },
          { q: '집주인이 법정 상한 초과 요구 시?', a: '법정 상한 초과 전환율은 주택임대차보호법 제7조의2에 의해 무효이며, 초과 납부액은 반환 청구 가능. 합의로 해결이 안 되면 각 시도 주택임대차분쟁조정위원회(주택도시보증공사·한국감정원) 무료 조정 신청 → 불복 시 민사소송. 대한법률구조공단(132) 무료 법률상담 활용 가능.' },
        ]} />
        <TipsSection title="전세 · 월세 안전 체크리스트" items={[
          { title: '전세보증금반환보증 필수', desc: 'HUG(주택도시보증공사) 보증료 연 0.115~0.154%, SGI서울보증 0.183~0.271%. 보증금 1.5~3억 기준 월 1.5~3만원 수준. 전세가율 80% 이하·공시가격 126% 이내 등 가입조건 2023.5 강화. 집주인 동의 불필요(임차인 단독 가입).' },
          { title: '이사 당일 확정일자 + 전입신고', desc: '주민센터 또는 정부24(gov.kr)에서 전입신고 즉시 처리, 임대차계약서 원본 지참해 확정일자 도장 받기(수수료 600원). 두 가지 완료 시 대항력 + 우선변제권 발생. 경매 시에도 보증금 회수 가능.' },
          { title: '등기부등본 3회 확인', desc: '① 계약 전(근저당·가압류 확인) ② 계약 직전(추가 설정 여부) ③ 잔금일 당일(최종 확인). 인터넷등기소 700원. 근저당이 집값의 60% 이상이면 위험. 선순위 채권 + 내 보증금 < 집값 80% 수준이어야 안전.' },
          { title: '집주인 국세 체납 확인', desc: '2023.4.1부터 임차인이 임대차계약 후 국세청에 집주인 체납 국세 열람 신청 가능(홈택스·세무서). 1천만원 초과 보증금이면 필수 확인. 집주인이 체납 시 압류·경매로 보증금 회수 우선순위 후순위가 될 수 있습니다.' },
          { title: '전세자금대출 활용', desc: '청년·신혼·서민 대상 정책자금(중소기업청년전세대출, 버팀목전세자금, 청년주택드림 등)은 시중금리 대비 유리합니다. 자격·한도·금리는 정부 정책에 따라 변경되므로 주택도시기금 nhuf.molit.go.kr 또는 한국주택금융공사 hf.go.kr에서 최신 정보를 확인하세요. 시중은행 HF 보증 전세대출도 상품별 차이가 큽니다.' },
          { title: '월세 세액공제 신청', desc: '총급여 8,000만원 이하 무주택 세대주는 월세 연 750만원 한도의 15~17% 세액공제(총급여 5,500만원 이하 17%, 초과 15%). 연말정산 시 임대차계약서 사본·월세 납입증빙(계좌이체내역) 제출. 근거: 조세특례제한법 제95조의2.' },
          { title: '분쟁 시 무료 조정 활용', desc: '주택임대차분쟁조정위원회(각 시도·LH·HUG 운영)는 무료로 60일 내 조정안 제시. 보증금반환·월세 증감·계약갱신 등 모든 분쟁 대상. 불복 시 민사소송 진행. 대한법률구조공단 132(무료 상담).' },
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
