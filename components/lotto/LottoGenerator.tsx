'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Sparkles } from 'lucide-react'

import { DEFAULT_GENERATOR_OPTIONS, generateGames, type GeneratedGame } from '@/lib/lotto/generator'
import type { LottoStats } from '@/lib/lotto/types'

import { BALL_ROW_XL_CLASS, LottoBall } from './LottoBall'

/**
 * 번호 생성기.
 *
 * 화면은 3단계뿐이다 — 게임 수 선택 → [번호 생성] → 번호 확인.
 *
 * 번호 풀 전략과 밸런스 필터(홀짝·고저·합계·연속·구간·고정·제외)는 UI에서 노출하지
 * 않고 `DEFAULT_GENERATOR_OPTIONS`를 그대로 사용한다. 즉 균형(balanced) 전략으로
 * 45개 번호를 동일 확률로 뽑은 뒤, 기본 필터(합계 100~175 · 2연속 이하 · 3구간 이상
 * 분산 · 역대 1등 조합 회피)를 만족하는 조합을 고른다. 생성 품질은 옵션 UI가 있던
 * 때와 동일하다.
 *
 * 통계 데이터(`/api/lotto/stats`)는 화면에 표시하지 않고 역대 1등 조합 회피와
 * 직전 회차 번호 강조에만 사용한다.
 *
 * 확률 고지: 로또는 매 회차 독립 추첨이므로 어떤 옵션도 당첨 확률을 바꾸지 못한다.
 * 이 UI는 "당첨 보장"을 주장하지 않으며, 생성 결과는 번호 공만 표시한다.
 */

const GAME_COUNTS = [1, 3, 5] as const

const BALL_PLACEHOLDER = 'h-[clamp(28px,8vw,40px)] w-[clamp(28px,8vw,40px)] shrink-0'

export default function LottoGenerator() {
  const [gameCount, setGameCount] = useState<number>(DEFAULT_GENERATOR_OPTIONS.games)
  const [games, setGames] = useState<GeneratedGame[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [stats, setStats] = useState<LottoStats | null>(null)

  // 연출 지연 중에 게임 수를 바꿔도 화면에 보이는 값으로 생성되도록 최신 값을 참조한다
  const gameCountRef = useRef(gameCount)
  useEffect(() => {
    gameCountRef.current = gameCount
  }, [gameCount])

  // 언마운트 시 남은 타이머를 정리해 해제된 컴포넌트에 setState가 걸리지 않게 한다
  const spinTimerRef = useRef<number | null>(null)
  const copyTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (spinTimerRef.current !== null) window.clearTimeout(spinTimerRef.current)
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    // 화면에 통계를 노출하지는 않는다. 역대 1등 조합 회피(pastCombinationRanks)와
    // 직전 회차 번호 강조에만 사용하므로, 실패해도 생성 자체는 정상 동작한다.
    async function loadStats() {
      try {
        const response = await fetch('/api/lotto/stats')
        if (!response.ok) throw new Error('stats fetch failed')
        const payload = (await response.json()) as LottoStats
        if (!cancelled) setStats(payload)
      } catch {
        // 조용히 넘어간다 — 기본 필터와 균등 추출은 통계 없이도 동작한다
      }
    }

    void loadStats()
    return () => {
      cancelled = true
    }
  }, [])

  const latestNumbers = useMemo(() => stats?.recentDraws[0]?.numbers ?? [], [stats])
  const hasGames = games.length > 0

  const handleGenerate = useCallback(() => {
    // 버튼은 포커스를 잃지 않도록 비활성화하지 않고, 중복 실행만 여기서 막는다
    if (isSpinning) return

    setIsSpinning(true)
    setCopiedIndex(null)

    // 연산은 동기지만, 공이 굴러가는 연출을 보여 준 뒤 결과를 교체한다
    const delay = games.length === 0 ? 700 : 450
    spinTimerRef.current = window.setTimeout(() => {
      spinTimerRef.current = null

      const next = generateGames(
        { ...DEFAULT_GENERATOR_OPTIONS, games: gameCountRef.current },
        { stats, latestNumbers },
      )
      // 구조적으로 조합이 불가능한 경우에만 빈 배열이 오므로 직전 결과를 유지한다
      if (next.length > 0) setGames(next)
      setIsSpinning(false)
    }, delay)
  }, [isSpinning, games.length, stats, latestNumbers])

  const handleCopy = useCallback(async (index: number, numbers: number[]) => {
    try {
      await navigator.clipboard.writeText(numbers.join(', '))
      setCopiedIndex(index)
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => {
        copyTimerRef.current = null
        setCopiedIndex(null)
      }, 1500)
    } catch {
      /* 클립보드 권한이 없으면 조용히 무시 */
    }
  }, [])

  return (
    <div className="glass-card">
      <div className="mb-4">
        <p className="font-mono text-[10px] tracking-[0.22em] text-[color:var(--muted)] mb-1">NUMBER GENERATOR</p>
        <h2 className="font-display text-[18px] md:text-[20px] font-bold text-ink tracking-tight">번호 생성기</h2>
        <p className="text-[11.5px] leading-relaxed text-ink/60 mt-1">
          게임 수를 고르고 <span className="font-semibold text-ink/80">번호 생성</span> 버튼만 누르면 됩니다.
        </p>
      </div>

      {/* 1단계 — 게임 수 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-ink/70">게임 수</span>
        <div className="flex flex-wrap gap-1 rounded-lg bg-ink/[0.05] p-1" role="group" aria-label="게임 수 선택">
          {GAME_COUNTS.map(count => (
            <button
              key={count}
              type="button"
              onClick={() => setGameCount(count)}
              aria-pressed={gameCount === count}
              className={[
                'rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40',
                gameCount === count
                  ? 'bg-[color:var(--brand)] text-white shadow-sm'
                  : 'text-ink/70 hover:bg-ink/[0.06] hover:text-ink',
              ].join(' ')}
            >
              {count}게임
            </button>
          ))}
        </div>
      </div>

      {/* 2단계 — 생성 버튼 */}
      <button
        type="button"
        onClick={handleGenerate}
        aria-busy={isSpinning}
        aria-controls="lotto-generated-numbers"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--brand)] py-4 text-[15.5px] font-bold text-white shadow-[0_6px_16px_-6px_oklch(47%_0.165_262/0.5)] transition-colors hover:bg-[color:var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40"
      >
        <Sparkles className={`h-[18px] w-[18px] ${isSpinning ? 'animate-pulse' : ''}`} aria-hidden />
        {isSpinning ? '번호를 뽑고 있습니다' : hasGames ? `다시 생성 (${gameCount}게임)` : `번호 생성 (${gameCount}게임)`}
      </button>

      {/* 3단계 — 결과 번호 (이 화면의 주인공) */}
      <div id="lotto-generated-numbers" className="mt-4" aria-live="polite" aria-busy={isSpinning}>
        {isSpinning && (
          <div className={BALL_ROW_XL_CLASS}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                // Tailwind 기본 animate-bounce 사용 — styled-jsx는 keyframes 이름을 스코프 처리해
                // 인라인 style의 animation 이름과 어긋나므로 전역 유틸리티로 처리한다
                className={`${BALL_PLACEHOLDER} animate-bounce rounded-full bg-ink/[0.08]`}
                style={{ animationDelay: `${i * 0.08}s`, animationDuration: '0.7s' }}
              />
            ))}
          </div>
        )}

        {!isSpinning && !hasGames && (
          <div className="flex flex-col items-center gap-2.5">
            <div className={BALL_ROW_XL_CLASS}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`${BALL_PLACEHOLDER} flex items-center justify-center rounded-full border-2 border-dashed border-ink/20 bg-ink/[0.04]`}
                >
                  <span aria-hidden className="text-[clamp(12px,3.1vw,16px)] font-bold text-ink/30">
                    ?
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11.5px] text-ink/55">위 버튼을 누르면 번호가 표시됩니다.</p>
          </div>
        )}

        {!isSpinning && hasGames && (
          <ul className="flex flex-col gap-2.5">
            {games.map((game, index) => {
              const label = String.fromCharCode(65 + index)
              return (
                <li
                  key={`${index}-${game.numbers.join('-')}`}
                  className="mf-rise grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-1 rounded-2xl border border-ink/10 bg-ink/[0.03] px-2 py-1.5 sm:px-3"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="justify-self-start truncate font-mono text-[10.5px] tracking-[0.14em] text-ink/50">
                    GAME {label}
                  </span>
                  <div
                    className="flex items-center justify-center gap-[clamp(3px,1vw,10px)]"
                    role="img"
                    aria-label={`${label} 게임 번호 ${game.numbers.join(', ')}`}
                  >
                    {game.numbers.map(num => (
                      <LottoBall key={num} number={num} size="xl" highlighted={latestNumbers.includes(num)} />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(index, game.numbers)}
                    className="inline-flex items-center justify-self-end gap-1 rounded-md px-1.5 py-1 text-[11px] text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40"
                    aria-label={`${label} 게임 번호 복사`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        복사
                      </>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
