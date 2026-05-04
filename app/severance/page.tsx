'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSeveranceStore } from '@/store'
import { calcSeverance } from '@/lib/severance'
import { AlertCircle } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

function won(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SeverancePage() {
  const { avgMonthly3, annualBonus, startDate, endDate, set } = useSeveranceStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    if (endDate === '2026-01-01') {
      set({ endDate: new Date().toISOString().split('T')[0] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const r = useMemo(() =>
    calcSeverance({ avgMonthly3, annualBonus, startDate, endDate }),
    [avgMonthly3, annualBonus, startDate, endDate]
  )

  if (!mounted) return null

  const workYearsLabel = `${Math.floor(r.workYears)}년 ${Math.floor((r.workYears % 1) * 12)}개월`

  return (
    <div className="calc-page">
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">SEVERANCE</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">퇴직금 계산기</h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">근로기준법 평균임금 기준 · 세전 예상</p>
      </div>

      {/* 결과 */}
      {!r.isEligible ? (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-500/12 border border-amber-500/25">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200 text-[13px]">퇴직금 수급 불가</p>
            <p className="text-[12px] text-amber-300/80 mt-0.5">재직 {r.workDays}일({workYearsLabel}) — 1년 이상 근무 시 지급됩니다.</p>
          </div>
        </div>
      ) : (
        <div className="result-card">
          <p className="result-label">세전 퇴직금 (예상)</p>
          <p className="result-value">{won(r.severancePay)}</p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-[11.5px]">
            <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">재직 기간</div><div className="font-semibold mt-0.5">{workYearsLabel}</div></div>
            <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">재직일수</div><div className="font-semibold tabular mt-0.5">{r.workDays.toLocaleString()}일</div></div>
            <div className="bg-white/[0.10] rounded-lg px-2.5 py-2"><div className="opacity-70 text-[10.5px]">1일 평균임금</div><div className="font-semibold tabular mt-0.5">{won(r.dailyWage)}</div></div>
          </div>
        </div>
      )}

      {/* 입력 */}
      <div className="glass-card flex flex-col gap-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">최근 3개월 평균 월급 <span className="text-[10.5px] font-normal text-white/40">(세전, 상여 제외)</span></label>
          <div className="relative">
            <NumericInput className="glass-input w-full rounded-xl px-4 py-3 text-[17px] font-bold pr-14" value={avgMonthly3} defaultValue={3_000_000} unitMultiplier={10000} onChange={(n) => set({ avgMonthly3: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-[11.5px] text-white/40 mt-1">= {won(avgMonthly3)}</p>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-white/80 mb-1.5">직전 1년 연간 상여금 <span className="text-[10.5px] font-normal text-white/40">(없으면 0)</span></label>
          <div className="relative">
            <NumericInput className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14" value={annualBonus} defaultValue={0} unitMultiplier={10000} onChange={(n) => set({ annualBonus: n })} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/40 pointer-events-none">만원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">입사일</label>
            <input type="date" className="glass-input w-full rounded-lg" value={startDate} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-white/75 mb-1.5">퇴직일</label>
            <input type="date" className="glass-input w-full rounded-lg" value={endDate} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
        </div>
      </div>

      {/* 계산 방법 */}
      <div className="glass-card text-[12.5px] text-white/65">
        <h2 className="font-semibold text-white mb-2.5 text-[13.5px]">계산 방법</h2>
        <div className="rounded-lg px-3 py-2.5 font-mono text-[11.5px] mb-2.5 text-white/80 bg-white/[0.05]">
          퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
        </div>
        <ul className="list-disc list-inside space-y-1 text-white/50 text-[11.5px]">
          <li>1일 평균임금 = 최근 3개월 총 임금 ÷ 실제 일수(89~92일)</li>
          <li>연간 상여금의 3개월분(÷4)을 합산합니다</li>
          <li>1년 미만 근무 시 퇴직금 없음</li>
          <li>퇴직소득세는 국세청 홈택스에서 확인</li>
        </ul>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <ExamplesSection title="퇴직금 계산 예시" items={[
          { label: '3년 근무 · 월급 300만원', input: '1일 평균임금 약 100,000원 · 재직 1,095일', result: '퇴직금 약 9,000,000원', note: '상여금·퇴직소득세 제외 기준' },
          { label: '5년 근무 · 월급 400만원', input: '1일 평균임금 약 133,333원 · 재직 1,825일', result: '퇴직금 약 20,000,000원', note: '상여금·퇴직소득세 제외 기준' },
          { label: '10년 근무 · 월급 500만원', input: '1일 평균임금 약 166,666원 · 재직 3,650일', result: '퇴직금 약 50,000,000원', note: '상여금·퇴직소득세 제외 기준' },
        ]} />
        <FAQSection items={[
          { q: '퇴직금 지급 기준은 무엇인가요?', a: '근로기준법에 따라 1년 이상 계속 근로한 경우 퇴직 시 퇴직금을 받을 수 있습니다. 주 15시간 이상 근무하는 단시간 근로자도 1년 이상 근무 시 동일하게 적용됩니다.' },
          { q: '평균임금이란 무엇인가요?', a: '퇴직 전 3개월 동안 지급된 임금 총액을 해당 기간의 총 일수(91일)로 나눈 금액입니다. 기본급뿐만 아니라 수당, 상여금(3개월분)도 포함됩니다.' },
          { q: '계약직도 퇴직금을 받나요?', a: '네, 계약직도 1년 이상 계속 근로했다면 퇴직금 지급 대상입니다. 계약이 반복 갱신된 경우 총 근속기간으로 계산합니다.' },
          { q: '퇴직금에 세금이 붙나요?', a: '퇴직소득세가 부과됩니다. 근속연수 공제와 연분연승법이 적용되어 일반 근로소득세보다 실효 세율이 낮습니다.' },
          { q: 'IRP 계좌로 받으면 왜 유리한가요?', a: 'IRP 계좌로 수령 시 퇴직소득세를 55세 이후 연금 수령 시점으로 이연할 수 있고, 연금 수령 시 세금 30~40% 감면이 가능합니다.' },
          { q: '퇴직금을 못 받으면?', a: '퇴직 후 14일 이내 미지급 시 고용노동부에 임금체불 진정을 제기할 수 있습니다. 체불 퇴직금에는 연 20% 지연이자가 붙습니다.' },
        ]} />
        <TipsSection title="퇴직금 관련 팁" items={[
          { title: 'IRP 계좌 미리 개설', desc: '퇴직 전 IRP 계좌를 미리 만들어두면 즉시 이체 가능합니다. 55세 이후 연금 수령 시 세금 30~40% 절감.' },
          { title: '퇴직 전 3개월 임금 관리', desc: '퇴직 전 3개월 평균임금이 높을수록 퇴직금이 늘어납니다. 성과급·상여금 지급 직후 퇴직이 유리할 수 있습니다.' },
          { title: '연차수당도 평균임금 포함', desc: '퇴직 전 3개월 이내 지급된 연차 미사용 수당은 평균임금에 포함되어 퇴직금이 올라갑니다.' },
        ]} />
        <RelatedLinks links={[
          { href: '/salary', label: '연봉 실수령액' },
          { href: '/savings', label: '적금 이자' },
          { href: '/mortgage', label: '대출 이자' },
          { href: '/jeonse', label: '전월세 전환' },
        ]} />
      </div>
    </div>
  )
}
