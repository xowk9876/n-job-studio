'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSeveranceStore } from '@/store'
import { calcSeverance } from '@/lib/severance'
import { Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'
import { FAQSection, ExamplesSection, TipsSection } from '@/components/ui/PageContent'

function formatKRW(n: number) { return n.toLocaleString('ko-KR') + '원' }

export default function SeverancePage() {
  const { avgMonthly3, annualBonus, startDate, endDate, set } = useSeveranceStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    // 클라이언트 마운트 시 오늘 날짜로 보정 (SSR hydration 안정성)
    if (endDate === '2026-01-01') {
      set({ endDate: new Date().toISOString().split('T')[0] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const result = useMemo(() =>
    calcSeverance({ avgMonthly3, annualBonus, startDate, endDate }),
    [avgMonthly3, annualBonus, startDate, endDate]
  )

  if (!mounted) return null

  const workYearsLabel = `${Math.floor(result.workYears)}년 ${Math.floor((result.workYears % 1) * 12)}개월`

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">퇴직금 계산기</h1>
          <p className="text-sm text-white/55 mt-0.5">근로기준법 기준 — 세전 퇴직금 자동 계산</p>
        </div>
      </div>

      {/* 입력 */}
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            최근 3개월 평균 월급 <span className="text-xs font-normal text-white/40">(세전, 상여 제외)</span>
          </label>
          <div className="relative">
            <NumericInput
              className="glass-input w-full rounded-xl px-4 py-3 text-lg font-bold pr-14"
              value={avgMonthly3}
              defaultValue={3_000_000}
              unitMultiplier={10000}
              onChange={(n) => set({ avgMonthly3: n })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">만원</span>
          </div>
          <p className="text-xs text-white/40 mt-1">= {formatKRW(avgMonthly3)}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white/80 mb-2">
            직전 1년 연간 상여금 <span className="text-xs font-normal text-white/40">(없으면 0)</span>
          </label>
          <div className="relative">
            <NumericInput
              className="glass-input w-full rounded-xl px-4 py-3 font-bold pr-14"
              value={annualBonus}
              defaultValue={0}
              unitMultiplier={10000}
              onChange={(n) => set({ annualBonus: n })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">만원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">입사일</label>
            <input
              type="date"
              className="glass-input w-full rounded-xl px-4 py-3"
              value={startDate}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">퇴직일</label>
            <input
              type="date"
              className="glass-input w-full rounded-xl px-4 py-3"
              value={endDate}
              onChange={(e) => set({ endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 결과 */}
      {!result.isEligible ? (
        <div className="glass-card rounded-2xl p-6 flex items-start gap-3" style={{ borderColor: 'rgba(245,158,11,0.35)' }}>
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">퇴직금 수급 불가</p>
            <p className="text-sm text-amber-400/80 mt-1">재직 기간이 {result.workDays}일({workYearsLabel})로 1년 미만입니다. 퇴직금은 1년 이상 근무 시 지급됩니다.</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/30 ring-1 ring-white/20 ring-inset">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 opacity-80" />
            <p className="text-sm opacity-80">세전 퇴직금 (예상)</p>
          </div>
          <p className="text-5xl font-extrabold tracking-tight result-value">{formatKRW(result.severancePay)}</p>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div><p className="text-xs opacity-70">재직 기간</p><p className="font-bold">{workYearsLabel}</p></div>
            <div><p className="text-xs opacity-70">총 재직일수</p><p className="font-bold num">{result.workDays.toLocaleString()}일</p></div>
            <div><p className="text-xs opacity-70">1일 평균임금</p><p className="font-bold num">{formatKRW(result.dailyWage)}</p></div>
          </div>
        </div>
      )}

      {/* 광고: Google 자동광고(Auto Ads)로 자동 배치 */}

      {/* 계산 방법 */}
      <div className="glass-card rounded-2xl p-6 text-sm text-white/60">
        <h2 className="font-bold text-white mb-3">퇴직금 계산 방법</h2>
        <div className="rounded-xl p-4 font-mono text-xs mb-3 text-white/70" style={{ background: 'rgba(255,255,255,0.06)' }}>
          퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
        </div>
        <ul className="list-disc list-inside space-y-1 text-white/40">
          <li>1일 평균임금 = 최근 3개월 총 임금 ÷ 실제 일수(89~92일)</li>
          <li>연간 상여금이 있으면 3개월분(÷4)을 합산합니다</li>
          <li>1년 미만 근무 시 퇴직금 없음 (단시간근로자 제외)</li>
          <li>실제 세금(퇴직소득세)은 국세청 홈택스에서 확인하세요</li>
        </ul>
      </div>

      {/* 계산 예시 */}
      <ExamplesSection title="퇴직금 계산 예시" items={[
        { label: '3년 근무 · 월급 300만원', input: '1일 평균임금 약 100,000원 · 재직 1,095일', result: '퇴직금 약 9,000,000원', note: '상여금·퇴직소득세 제외 기준' },
        { label: '5년 근무 · 월급 400만원', input: '1일 평균임금 약 133,333원 · 재직 1,825일', result: '퇴직금 약 20,000,000원', note: '상여금·퇴직소득세 제외 기준' },
        { label: '10년 근무 · 월급 500만원', input: '1일 평균임금 약 166,666원 · 재직 3,650일', result: '퇴직금 약 50,000,000원', note: '상여금·퇴직소득세 제외 기준' },
      ]} />

      {/* FAQ */}
      <FAQSection items={[
        { q: '퇴직금 지급 기준은 무엇인가요?', a: '근로기준법에 따라 1년 이상 계속 근로한 경우 퇴직 시 퇴직금을 받을 수 있습니다. 주 15시간 이상 근무하는 단시간 근로자도 1년 이상 근무 시 동일하게 적용됩니다.' },
        { q: '평균임금이란 무엇인가요?', a: '퇴직 전 3개월 동안 지급된 임금 총액을 해당 기간의 총 일수(91일)로 나눈 금액입니다. 기본급뿐만 아니라 수당, 상여금(3개월분)도 포함됩니다.' },
        { q: '계약직(기간제) 근로자도 퇴직금을 받나요?', a: '네, 계약직도 1년 이상 계속 근로했다면 퇴직금 지급 대상입니다. 계약이 반복 갱신된 경우 총 근속기간으로 계산합니다.' },
        { q: '퇴직금에 세금이 붙나요?', a: '퇴직금에는 퇴직소득세가 부과됩니다. 하지만 근속연수에 따른 공제와 연분연승법을 적용해 일반 근로소득세보다 세율이 낮습니다. 30년 근속 기준 실질 세율은 매우 낮습니다.' },
        { q: 'IRP 계좌로 받으면 왜 유리한가요?', a: 'IRP(개인형 퇴직연금) 계좌로 수령 시 퇴직소득세 납부를 55세 이후 연금 수령 시점으로 이연할 수 있습니다. 또한 연금 수령 시 퇴직소득세의 30~40%를 감면받을 수 있어 유리합니다.' },
        { q: '퇴직금을 못 받으면 어떻게 하나요?', a: '퇴직 후 14일 이내에 지급받지 못하면 고용노동부 지방관서나 고용노동부 민원마당에 임금체불 진정을 제기할 수 있습니다. 체불된 퇴직금에는 지연이자(연 20%)가 붙습니다.' },
      ]} />

      <TipsSection title="퇴직금 관련 실용 팁" items={[
        { title: 'IRP 계좌 미리 개설해두기', desc: '퇴직 전 IRP 계좌를 미리 만들어두면 퇴직 즉시 퇴직금을 이체할 수 있습니다. 55세 이후 연금 수령 시 세금 30~40% 절감 효과가 있습니다.' },
        { title: '퇴직 전 3개월 임금 관리', desc: '퇴직금 기준이 되는 최근 3개월 평균임금이 높을수록 퇴직금이 늘어납니다. 성과급, 상여금이 지급된 직후 퇴직하면 유리할 수 있습니다.' },
        { title: '연차수당도 평균임금에 포함', desc: '퇴직 전 3개월 이내 지급된 연차 미사용 수당도 평균임금 계산에 포함됩니다. 연차를 소진하지 않고 퇴직수당으로 받으면 퇴직금 산정 기준이 높아질 수 있습니다.' },
      ]} />

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/savings',label:'적금 이자'},{href:'/mortgage',label:'대출 이자'}].map(({href,label})=>(
          <Link key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</Link>
        ))}
      </div>
    </div>
  )
}
