'use client'

import { useMemo, useState, useEffect } from 'react'
import { useJeonseStore } from '@/store'
import { calcJeonse, DEFAULT_CONVERSION_RATE, ConversionDirection } from '@/lib/jeonse'
import { Building2, ArrowLeftRight, Info } from 'lucide-react'
import NumericInput from '@/components/ui/NumericInput'

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
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 shrink-0">
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
                ? 'border-pink-400/60 bg-pink-500/20'
                : 'border-white/20 bg-white/5 hover:border-white/35 hover:bg-white/10'
            }`}
          >
            <ArrowLeftRight className={`w-5 h-5 shrink-0 ${direction === v ? 'text-pink-400' : 'text-white/40'}`} />
            <div>
              <div className={`font-bold text-sm ${direction === v ? 'text-pink-300' : 'text-white/70'}`}>{label}</div>
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
      <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl shadow-pink-500/30 ring-1 ring-white/20 ring-inset">
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
          <span className="font-bold text-pink-400">{result.breakEvenRate.toFixed(2)}%</span>
        </div>
      </div>

      {/* 광고 슬롯 */}
      <div id="adsense-jeonse" className="w-full min-h-[90px] glass-card rounded-xl flex items-center justify-center text-xs text-white/30">광고 영역</div>

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

      <div className="flex flex-wrap gap-2">
        {[{href:'/salary',label:'연봉 실수령액'},{href:'/mortgage',label:'대출 이자'},{href:'/savings',label:'적금 이자'}].map(({href,label})=>(
          <a key={href} href={href} className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">→ {label} 계산기</a>
        ))}
      </div>
    </div>
  )
}
