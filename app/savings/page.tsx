'use client'

import { useMemo } from 'react'
import { useSavingsStore } from '@/store'
import { usePersistRehydrate } from '@/hooks/usePersistRehydrate'
import { calcSavings, SavingsType, InterestType } from '@/lib/savings'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, OfficialSourcesSection, RelatedLinks } from '@/components/ui/PageContent'

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SavingsPage() {
  const { type, amount, annualRate, months, interestType, set } = useSavingsStore()
  usePersistRehydrate(useSavingsStore)

  const r = useMemo(() => calcSavings({ type, amount, annualRate, months, interestType }), [type, amount, annualRate, months, interestType])

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

      {/* ISA 절세 비교 */}
      <div className="glass-card">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-semibold text-white text-[13.5px]">일반계좌 vs ISA 절세 비교</h2>
          <span className="text-[10.5px] text-white/40">조특법 §91의18 (최근 고시 기준)</span>
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
          <span className="text-[12px] text-emerald-200">ISA 절세 효과</span>
          <span className="font-bold text-emerald-300 tabular text-[14px]">+{won(r.isa.savedAmount)}</span>
        </div>
        <p className="text-[10.5px] text-white/40 mt-2 leading-relaxed">일반형: 비과세 한도 500만원, 초과분 9.9% 분리과세. 서민형(총급여 5,000만 이하)은 한도 1,000만원. 의무가입 3년, 납입한도 연 4,000만·총 2억원. (2026년 세법개정 반영)</p>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="적금 · 예금 계산 예시" items={[
          { label: '월 30만 · 연 3.5% · 12개월 (적금)', input: '납입 원금 360만원', result: '세후 약 3,665,000원', note: '이자소득세 15.4% 차감 후' },
          { label: '1,000만 · 연 3.8% · 12개월 (예금)', input: '예치 원금 1,000만원', result: '세후 약 10,321,000원', note: '세후 이자 약 321,600원' },
          { label: '월 50만 · 연 4.0% · 24개월 (적금)', input: '납입 원금 1,200만원', result: '세후 이자 약 1,248,000원', note: '복리 기준' },
        ]} />
        <FAQSection items={[
          { q: '단리와 복리의 차이는?', a: '단리는 원금에만 이자가 붙는 계산방식이고, 복리는 발생한 이자를 원금에 더해 다음 이자 계산의 기준으로 삼습니다. 기간이 길수록 복리 효과가 극대화됩니다. 1,000만원 연 4% 10년 운용 시 단리 이자 400만원, 월복리 약 490만원(세전). 장기 적립일수록 복리 상품을 선택하세요. 근거: 금융소비자보호법 제19조 설명의무.' },
          { q: '이자소득세 15.4%는 어떻게 계산되나요?', a: '소득세법 제129조에 따라 이자소득 원천징수세율은 14%(소득세) + 1.4%(지방소득세) = 15.4%입니다. 만기 시 은행이 자동 원천징수 후 지급합니다. 세전이자 100만원 → 세후 846,000원. 금융소득(이자+배당) 연 2,000만원 초과 시 종합과세 대상으로 누진세율(6~45%) 적용.' },
          { q: '적금 vs 예금, 실수령 이자 차이는?', a: '목돈이 있다면 정기예금이 유리합니다. 정기적금은 첫 달 납입금은 12개월 전체 이자를 받지만, 마지막 달 납입금은 1개월치 이자만 받아 실효이율이 명목금리의 약 54%(12개월 기준)입니다. 예: 월 50만원 × 12개월 연 5% 적금의 세전이자는 원금 600만원 × 5% × 6.5/12 ≈ 162,500원.' },
          { q: 'ISA 계좌 비과세 한도는?', a: '2026년 세법개정으로 일반형 500만원까지 이자·배당 비과세(초과분 9.9% 분리과세), 서민형(총급여 5,000만원 이하·종합소득 3,800만원 이하)·농어민형은 1,000만원까지 비과세. 납입한도는 연 4,000만원·총 2억원. 의무가입 3년. 기존 가입자도 2026년 납입분부터 자동 적용. 근거: 조세특례제한법 제91조의18.' },
          { q: '파킹통장 vs 정기예금, 언제 무엇을?', a: '파킹통장은 수시입출금이 자유로우면서 일복리로 이자를 받는 상품입니다. 3~6개월 내 사용 예정 자금은 파킹통장, 1년 이상 묶어둘 수 있으면 정기예금이 유리합니다. 비상금은 생활비 3~6개월치를 파킹통장에 보관하는 것을 권장합니다. 은행별 금리는 변동이 크므로 금융감독원 금리비교공시 finlife.fss.or.kr에서 실시간 확인하세요.' },
          { q: '청년도약계좌·청년희망적금 남아있나요?', a: '청년희망적금(2022~2024 만기분)은 종료되었습니다. 청년도약계좌(2023.6 출시)는 만 19~34세, 개인소득 7,500만원 이하·가구소득 중위 180% 이하 대상, 월 최대 70만원 5년 납입 상품입니다. 소득 구간별 정부기여금과 이자소득 비과세가 결합됩니다. 자격·기여금 한도는 서민금융진흥원(kinfa.or.kr) 안내 참고. 근거: 조세특례제한법 제91조의22.' },
          { q: '저축은행 예금은 안전한가요?', a: '예금자보호법에 따라 원금+이자 합산 1인당 금융기관별로 예금보험공사가 보장합니다. 2025.9.1부터 보호한도가 1억원으로 상향 시행되었습니다(예금자보호법 개정). 저축은행 금리는 시중은행 대비 높은 편이지만 1개 저축은행당 보호한도 이내로 분산 예치하세요. 실시간 금리는 저축은행중앙회 SB톡톡플러스에서 확인 가능합니다.' },
        ]} />
        <TipsSection title="이자 극대화 전략" items={[
          { title: 'ISA 계좌 먼저 채우기', desc: '연 4,000만원 한도 내에서 예적금·ETF·리츠 편입 가능. 일반형 500만원·서민형 1,000만원까지 비과세로 일반 계좌 대비 15.4% 세금 차이가 복리로 누적. 총급여 5,000만원 이하라면 서민형으로 개설.' },
          { title: '인터넷은행·저축은행 우대 활용', desc: '인터넷은행·저축은행은 첫 거래·급여이체·체크카드 사용 등 조건으로 우대금리를 제공합니다. 우대 폭과 조건은 은행별로 상이하므로 금감원 금리비교공시 finlife.fss.or.kr 또는 저축은행중앙회 SB톡톡플러스에서 비교 후 가입하세요. 예금자보호 한도(2025.9 시행 1억원) 이내로 분산 예치.' },
          { title: '풍차돌리기 적금', desc: '매월 1년 만기 적금을 새로 가입해 12개 적금을 운용하면 1년차부터 매월 만기금 수령 가능. 유동성과 복리 효과를 동시에 확보. 인뱅 + 시중은행 조합으로 금리별 분산.' },
          { title: '청년도약계좌 자격되면 필수', desc: '만 19~34세 + 개인소득 7,500만원 이하·가구소득 중위 180% 이하라면 월 최대 70만원 5년 납입 시 정부기여금(소득구간별 차등)과 이자소득 비과세가 결합됩니다. 병역이행기간 최대 6년 나이 연장. 자세한 자격·기여금 한도는 서민금융진흥원(kinfa.or.kr) 안내 참고.' },
          { title: '만기 알림 설정·자동재예치 금지', desc: '자동재예치는 당시 기준금리로 재계약되어 기존 대비 0.5~1.0%p 낮은 경우가 많습니다. 만기 7~14일 전 알림 설정 후 금리비교사이트(금감원 금융상품통합비교공시 finlife.fss.or.kr)에서 최상위 상품 확인 후 직접 갈아타기.' },
          { title: '세금우대·노인비과세 저축', desc: '만 65세 이상·장애인·기초생활수급자·독립유공자 등은 1인당 5,000만원 한도 비과세종합저축 가능(농어촌특별세 미부과). 근거: 조세특례제한법 제88조의2.' },
        ]} />
        <OfficialSourcesSection sources={[
          '소득세법 제129조 이자소득 원천징수세율 15.4%',
          '조세특례제한법 제91조의18 ISA 비과세·분리과세 기준',
          '금융감독원 금융상품통합비교공시 및 예금자보호법 기준',
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
