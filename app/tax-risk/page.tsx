'use client'

import { useMemo, useState, useEffect } from 'react'
import { useTaxRiskStore } from '@/store/tax-risk-store'
import { calcTaxRisk } from '@/lib/tax-risk'
import { ShieldCheck, AlertTriangle, ShieldAlert, Info } from 'lucide-react'
import { FAQSection, TipsSection, RelatedLinks } from '@/components/ui/PageContent'

function won(n: number) { return Math.round(n).toLocaleString('ko-KR') + '원' }
function manwon(n: number) { return Math.round(n / 10_000).toLocaleString('ko-KR') + '만원' }

const RISK_STYLES = {
  safe:    { bg: 'bg-emerald-500/12', border: 'border-emerald-500/30', text: 'text-emerald-300', icon: ShieldCheck },
  caution: { bg: 'bg-amber-500/12',   border: 'border-amber-500/30',   text: 'text-amber-300',   icon: AlertTriangle },
  danger:  { bg: 'bg-rose-500/12',    border: 'border-rose-500/30',    text: 'text-rose-300',    icon: ShieldAlert },
}

export default function TaxRiskPage() {
  const { mainJobSalary, sideIncome, set } = useTaxRiskStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const result = useMemo(
    () => calcTaxRisk({ mainJobSalary, sideIncome }),
    [mainJobSalary, sideIncome],
  )

  if (!mounted) return null

  const rs = RISK_STYLES[result.riskLevel]
  const RiskIcon = rs.icon

  return (
    <div className="calc-page">
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-1">TAX RISK</p>
        <h1 className="font-display text-[22px] md:text-[26px] font-bold tracking-tight text-white">
          부업 세금 리스크 예측기
        </h1>
        <p className="text-[12.5px] text-[color:var(--sub)] mt-1">N잡러의 세금·건보료 위험도를 실시간 예측합니다</p>
      </div>

      {/* Risk Badge */}
      <div className={`flex items-start gap-3 px-4 py-4 rounded-xl border ${rs.bg} ${rs.border}`}>
        <RiskIcon className={`w-5 h-5 shrink-0 mt-0.5 ${rs.text}`} />
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <p className={`font-bold text-[15px] ${rs.text}`}>{result.riskLabel}</p>
            <span className="text-[12px] text-white/40">건보 피부양자 기준</span>
          </div>
          <p className={`text-[13px] mt-1 ${rs.text} opacity-85`}>{result.riskMessage}</p>
          {result.riskDetail && (
            <p className="text-[11.5px] mt-2 text-white/50 leading-relaxed">{result.riskDetail}</p>
          )}
        </div>
      </div>

      {/* Result Card */}
      <div className="result-card">
        <p className="result-label">예상 실수령 (연)</p>
        <p className="result-value">{manwon(result.netIncome)}</p>
        <div className="flex items-center gap-3 mt-2 text-[12px] opacity-70">
          <span>총 수입 {manwon(result.totalIncome)}</span>
          <span>·</span>
          <span>공제 합계 {manwon(result.totalDeduction)}</span>
          <span>·</span>
          <span>실효세율 {result.effectiveTaxRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="glass-card p-5 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12.5px] font-semibold text-white/80">본업 연봉</label>
            <span className="text-[15px] font-bold text-white tabular">{mainJobSalary.toLocaleString()}만원</span>
          </div>
          <input
            type="range"
            min={0} max={15000} step={100}
            value={mainJobSalary}
            onChange={(e) => set({ mainJobSalary: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10.5px] text-white/30 mt-1">
            <span>0</span><span>5,000만</span><span>1억</span><span>1.5억</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12.5px] font-semibold text-white/80">부업 연수익</label>
            <span className={`text-[15px] font-bold tabular ${
              result.riskLevel === 'danger' ? 'text-rose-300' :
              result.riskLevel === 'caution' ? 'text-amber-300' : 'text-emerald-300'
            }`}>{sideIncome.toLocaleString()}만원</span>
          </div>
          <input
            type="range"
            min={0} max={10000} step={50}
            value={sideIncome}
            onChange={(e) => set({ sideIncome: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10.5px] text-white/30 mt-1">
            <span>0</span><span>2,500만</span><span>5,000만</span><span>1억</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[0, 500, 1000, 2000, 3000, 5000].map((v) => (
              <button
                key={v}
                onClick={() => set({ sideIncome: v })}
                className={`px-2 py-1 rounded text-[10.5px] border transition-colors ${
                  sideIncome === v
                    ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]'
                    : 'border-white/10 text-white/40 hover:border-white/25'
                }`}
              >
                {v === 0 ? '없음' : `${v.toLocaleString()}만`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="glass-card">
        <h2 className="font-semibold text-white mb-3 text-[13.5px] flex items-center gap-1.5 px-4 pt-4">
          <Info className="w-3.5 h-3.5 text-white/40" /> 예상 세금 항목별 내역
        </h2>
        <div className="divide-y divide-white/5">
          {[
            { label: '종합소득세', value: result.incomeTax, desc: '8단계 누진세율 적용' },
            { label: '지방소득세', value: result.localIncomeTax, desc: '소득세의 10%' },
            { label: '추가 건강보험료 (연)', value: result.healthInsurance, desc: result.riskLevel === 'danger' ? '지역가입자 전환' : result.riskLevel === 'caution' ? '직장가입자 추가부담' : '추가 없음' },
            { label: '장기요양보험료 (연)', value: result.longTermCare, desc: '건보료의 13.14%' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-[13px] text-white/70">{row.label}</span>
                <span className="block text-[10.5px] text-white/35">{row.desc}</span>
              </div>
              <span className="font-bold text-[14px] text-white tabular">{won(row.value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03]">
            <span className="text-[13px] font-semibold text-white">총 공제 합계</span>
            <span className="font-bold text-[15px] text-[color:var(--brand)] tabular">{won(result.totalDeduction)}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="glass-card text-[12.5px] text-white/65 p-4">
        <h2 className="font-semibold text-white mb-2 text-[13.5px]">건보 피부양자 자격 기준</h2>
        <div className="grid gap-2">
          <div className="flex gap-2 items-start">
            <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
            <p><strong className="text-emerald-300">안전</strong> — 부업 소득 연 500만원 미만: 피부양자 자격 유지 가능</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="shrink-0 w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
            <p><strong className="text-amber-300">주의</strong> — 500~2,000만원: 금융소득 합산 시 탈락 가능, 직장가입자 추가 보험료</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="shrink-0 w-2 h-2 rounded-full bg-rose-400 mt-1.5" />
            <p><strong className="text-rose-300">위험</strong> — 2,000만원 초과: 지역가입자 전환, 건보료 급등</p>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-8">
        <FAQSection items={[
          { q: '부업 소득에도 세금을 내야 하나요?', a: '네. 부업 소득이 연간 일정 금액을 넘으면 다음 해 5월 종합소득세 신고를 해야 합니다. 근로소득 외 소득(사업·기타·임대 등)이 합산되며, 종합소득세율 6~45%가 적용됩니다.' },
          { q: '건보 피부양자가 왜 중요한가요?', a: '직장인 배우자·자녀 등이 피부양자로 등록되면 건보료를 따로 내지 않습니다. 그러나 피부양자의 소득이 일정 기준(연 2,000만원)을 넘으면 자격이 박탈되고 지역가입자로 전환되어 별도 건보료가 부과됩니다.' },
          { q: '부업 소득 절세 방법이 있나요?', a: '① 사업자등록 후 경비 처리 (필요경비 인정) ② 노란우산공제 가입 (소득공제 연 최대 500만원) ③ IRP/연금저축 납입 (세액공제) ④ 부업 수익이 클 때는 법인 설립도 고려할 수 있습니다.' },
          { q: '이 계산기의 결과는 정확한가요?', a: '본 계산기는 2026년 종합소득세 누진세율과 건보 피부양자 기준을 참고한 근사치입니다. 실제 세액은 소득 유형, 필요경비, 각종 공제, 금융소득 등에 따라 달라지므로 정확한 세무 상담은 세무사에게 문의하세요.' },
        ]} />
        <TipsSection title="N잡러 세금 관리 팁" items={[
          { title: '사업자등록은 빠를수록 유리', desc: '부업으로 꾸준한 소득이 발생하면 사업자등록 후 경비 처리를 하는 것이 절세에 유리합니다. 단순경비율(업종별 60~90%) 또는 기장신고(증빙 기반)를 선택할 수 있습니다.' },
          { title: '소득 분산 전략', desc: '부부 중 소득이 낮은 쪽으로 부업 소득을 귀속시키면 누진세율 구간이 낮아져 세금을 줄일 수 있습니다. 공동사업자등록도 고려해보세요.' },
          { title: '5월 종합소득세 신고 준비', desc: '매월 소득·경비 증빙을 정리해두면 5월 신고가 수월합니다. 홈택스 간편장부 기능이나 세무 앱을 활용하세요.' },
        ]} />
        <RelatedLinks links={[
          { href: '/salary', label: '연봉 실수령액' },
          { href: '/savings', label: '적금 이자' },
          { href: '/mortgage', label: '대출 이자' },
        ]} />
      </div>
    </div>
  )
}
