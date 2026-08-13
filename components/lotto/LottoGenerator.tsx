'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Sparkles, SlidersHorizontal, X } from 'lucide-react'

import {
  CONSECUTIVE_UNLIMITED,
  DEFAULT_GENERATOR_OPTIONS,
  generateGames,
  STRATEGY_DESCRIPTIONS,
  STRATEGY_LABELS,
  SUM_MAX_POSSIBLE,
  SUM_MIN_POSSIBLE,
  validateGeneratorOptions,
  type GeneratedGame,
  type GeneratorOptions,
  type PoolStrategy,
  type RatioPreset,
} from '@/lib/lotto/generator'
import { LOTTO_MAX, TOTAL_COMBINATIONS } from '@/lib/lotto/stats'
import type { LottoStats } from '@/lib/lotto/types'

import { BALL_ROW_XL_CLASS, LottoBall } from './LottoBall'

/**
 * 번호 생성기.
 *
 * 기본 화면은 3단계로만 구성한다 — 게임 수 선택 → [번호 생성] → 큰 번호 확인.
 * 번호 풀 전략 · 출현 통계 · 밸런스 필터(홀짝/고저/합계/연속/구간/고정·제외)는
 * 모두 "고급 설정" 접이식 영역으로 내려 두고, 기본값은 균형(balanced) 전략으로 고정한다.
 *
 * 확률 고지: 로또는 매 회차 독립 추첨이므로 어떤 옵션도 당첨 확률을 바꾸지 못한다.
 * 이 UI는 "당첨 보장"을 주장하지 않으며 조합의 선택 근거만 투명하게 제시한다.
 */

const GAME_COUNTS = [1, 3, 5] as const
const STRATEGIES: PoolStrategy[] = ['balanced', 'hot', 'cold', 'overdue', 'uniform']
const RATIO_PRESETS: RatioPreset[] = ['any', '3:3', '4:2', '2:4']

const RATIO_LABELS: Record<RatioPreset, string> = {
  any: '제한 없음',
  '3:3': '3:3',
  '4:2': '4:2',
  '2:4': '2:4',
}

const SUM_PRESETS = [
  { label: '100~175', min: 100, max: 175 },
  { label: '115~155', min: 115, max: 155 },
  { label: '90~200', min: 90, max: 200 },
  { label: '제한 없음', min: SUM_MIN_POSSIBLE, max: SUM_MAX_POSSIBLE },
] as const

const CONSECUTIVE_PRESETS = [
  { label: '없음', value: 1 },
  { label: '2연속', value: 2 },
  { label: '3연속', value: 3 },
  { label: '제한 없음', value: CONSECUTIVE_UNLIMITED },
] as const

const ZONE_PRESETS = [2, 3, 4] as const

const SEG_GROUP = 'flex flex-wrap gap-1 rounded-lg bg-ink/[0.05] p-1'

function segButtonClass(active: boolean) {
  return [
    'rounded-md px-2.5 py-1.5 text-[12px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40',
    active
      ? 'bg-[color:var(--brand)] text-white shadow-sm'
      : 'text-ink/70 hover:bg-ink/[0.06] hover:text-ink',
  ].join(' ')
}

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-[12px] font-medium text-ink/70">{label}</span>
      {children}
    </div>
  )
}

type NumberSelection = 'none' | 'include' | 'exclude'

export default function LottoGenerator() {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_GENERATOR_OPTIONS)
  const [games, setGames] = useState<GeneratedGame[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [stats, setStats] = useState<LottoStats | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 연출 지연 중에 옵션이 바뀌어도 화면에 보이는 조건으로 생성되도록 최신 값을 참조한다
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

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

    async function loadStats() {
      try {
        const response = await fetch('/api/lotto/stats')
        if (!response.ok) throw new Error('stats fetch failed')
        const payload = (await response.json()) as LottoStats
        if (!cancelled) setStats(payload)
      } catch {
        // 통계 조회에 실패해도 균등 무작위 생성은 정상 동작하므로 조용히 넘어간다
      }
    }

    void loadStats()
    return () => {
      cancelled = true
    }
  }, [])

  const latestNumbers = useMemo(() => stats?.recentDraws[0]?.numbers ?? [], [stats])
  const validationErrors = useMemo(() => validateGeneratorOptions(options), [options])
  const hasGames = games.length > 0
  const isBlocked = validationErrors.length > 0

  const update = useCallback(<K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }, [])

  const selectionOf = useCallback(
    (num: number): NumberSelection => {
      if (options.include.includes(num)) return 'include'
      if (options.exclude.includes(num)) return 'exclude'
      return 'none'
    },
    [options.include, options.exclude],
  )

  /** 미지정 → 고정 → 제외 → 미지정 순환 */
  const cycleNumber = useCallback((num: number) => {
    setOptions(prev => {
      if (prev.include.includes(num)) {
        return { ...prev, include: prev.include.filter(n => n !== num), exclude: [...prev.exclude, num].sort((a, b) => a - b) }
      }
      if (prev.exclude.includes(num)) {
        return { ...prev, exclude: prev.exclude.filter(n => n !== num) }
      }
      if (prev.include.length >= 5) return prev
      return { ...prev, include: [...prev.include, num].sort((a, b) => a - b) }
    })
  }, [])

  const resetSelection = useCallback(() => {
    setOptions(prev => ({ ...prev, include: [], exclude: [] }))
  }, [])

  const handleGenerate = useCallback(() => {
    // 버튼은 포커스를 잃지 않도록 비활성화하지 않고, 중복 실행만 여기서 막는다
    if (isSpinning || validateGeneratorOptions(optionsRef.current).length > 0) return

    setIsSpinning(true)
    setCopiedIndex(null)

    // 연산은 동기지만, 공이 굴러가는 연출을 보여 준 뒤 결과를 교체한다
    const delay = games.length === 0 ? 700 : 450
    spinTimerRef.current = window.setTimeout(() => {
      spinTimerRef.current = null

      const current = optionsRef.current
      if (validateGeneratorOptions(current).length === 0) {
        const next = generateGames(current, { stats, latestNumbers })
        // 구조적으로 조합이 불가능한 경우에만 빈 배열이 오므로 직전 결과를 유지한다
        if (next.length > 0) setGames(next)
      }
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

  const overdueGapOf = useCallback(
    (num: number) => stats?.numbers.find(stat => stat.number === num)?.gap ?? 0,
    [stats],
  )

  const selectionCount = options.include.length + options.exclude.length

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
      <div className="mb-3">
        <OptionRow label="게임 수">
          <div className={SEG_GROUP} role="group" aria-label="게임 수 선택">
            {GAME_COUNTS.map(count => (
              <button
                key={count}
                type="button"
                onClick={() => update('games', count)}
                aria-pressed={options.games === count}
                className={segButtonClass(options.games === count)}
              >
                {count}게임
              </button>
            ))}
          </div>
        </OptionRow>
      </div>

      {isBlocked && (
        <div
          role="alert"
          className="mb-3 rounded-2xl border border-[color:var(--danger)]/25 bg-[color:var(--danger)]/[0.06] p-3.5"
        >
          <ul className="flex flex-col gap-1">
            {validationErrors.map(message => (
              <li key={message} className="text-[12px] font-semibold leading-relaxed text-[color:var(--danger)]">
                {message}
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[11px] text-[color:var(--danger)]/80">
            아래 고급 설정에서 조건을 조정하면 바로 생성할 수 있습니다.
          </p>
        </div>
      )}

      {/* 2단계 — 생성 버튼 */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isBlocked}
        aria-busy={isSpinning}
        aria-controls="lotto-generated-numbers"
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15.5px] font-bold transition-colors ${
          isBlocked
            ? 'cursor-not-allowed bg-ink/[0.06] text-ink/65'
            : 'bg-[color:var(--brand)] text-white shadow-[0_6px_16px_-6px_oklch(47%_0.165_262/0.5)] hover:bg-[color:var(--brand-strong)]'
        }`}
      >
        <Sparkles className={`h-[18px] w-[18px] ${isSpinning ? 'animate-pulse' : ''}`} aria-hidden />
        {isSpinning ? '번호를 뽑고 있습니다' : hasGames ? `다시 생성 (${options.games}게임)` : `번호 생성 (${options.games}게임)`}
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
                className="h-[clamp(34px,11.5vw,56px)] w-[clamp(34px,11.5vw,56px)] shrink-0 animate-bounce rounded-full bg-ink/[0.08]"
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
                  className="flex h-[clamp(34px,11.5vw,56px)] w-[clamp(34px,11.5vw,56px)] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-ink/20 bg-ink/[0.04]"
                >
                  <span aria-hidden className="text-[clamp(14px,4.2vw,22px)] font-bold text-ink/30">
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
                  className="mf-rise rounded-2xl border border-ink/10 bg-ink/[0.03] px-2 py-3 sm:px-3"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="mb-2 flex items-center justify-between gap-2 px-1">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink/50">GAME {label}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(index, game.numbers)}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40"
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
                  </div>

                  <div
                    className={BALL_ROW_XL_CLASS}
                    role="img"
                    aria-label={`${label} 게임 번호 ${game.numbers.join(', ')}`}
                  >
                    {game.numbers.map(num => (
                      <LottoBall key={num} number={num} size="xl" highlighted={latestNumbers.includes(num)} />
                    ))}
                  </div>

                  <p className="mt-2.5 text-center text-[10.5px] leading-relaxed text-[color:var(--muted)]">
                    {game.reasons.join(' · ')}
                  </p>
                  {game.relaxed && (
                    <p className="mt-1 text-center text-[10.5px] font-semibold text-[color:var(--warn)]">
                      조건이 너무 촘촘해 일부를 완화했습니다.
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* 고급 설정 — 기본 접힘. 번호 풀 전략 · 출현 통계 · 밸런스 필터 */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(value => !value)}
          aria-expanded={showAdvanced}
          aria-controls="lotto-advanced-options"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3.5 py-2.5 text-left transition-colors hover:border-[color:var(--brand)]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40"
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <SlidersHorizontal className="h-4 w-4 text-[color:var(--brand)]" aria-hidden />
            고급 설정
            <span className="font-normal text-[11px] text-[color:var(--muted)]">전략 · 통계 · 조건</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {options.strategy !== 'balanced' && (
              <span className="rounded-full bg-[color:var(--brand-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[color:var(--brand)]">
                {STRATEGY_LABELS[options.strategy]}
              </span>
            )}
            {selectionCount > 0 && (
              <span className="rounded-full bg-[color:var(--brand-soft)] px-2 py-0.5 text-[10.5px] font-bold text-[color:var(--brand)]">
                고정 {options.include.length} · 제외 {options.exclude.length}
              </span>
            )}
            <span aria-hidden className={`text-[color:var(--muted)] transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </span>
        </button>

        {showAdvanced && (
          <div id="lotto-advanced-options" className="mt-3 flex flex-col gap-3.5 rounded-2xl border border-ink/10 bg-ink/[0.03] p-3.5">
            {/* 번호 풀 전략 */}
            <div>
              <p className="text-[12px] font-medium text-ink/70 mb-2">번호 풀 전략</p>
              <div className={SEG_GROUP} role="group" aria-label="번호 풀 전략 선택">
                {STRATEGIES.map(strategy => (
                  <button
                    key={strategy}
                    type="button"
                    onClick={() => update('strategy', strategy)}
                    aria-pressed={options.strategy === strategy}
                    className={segButtonClass(options.strategy === strategy)}
                  >
                    {STRATEGY_LABELS[strategy]}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
                {STRATEGY_DESCRIPTIONS[options.strategy]}
                {options.strategy !== 'balanced' && options.strategy !== 'uniform' && stats && (
                  <> (최근 {stats.recentWindow}회 기준)</>
                )}
              </p>
            </div>

            {/* 출현 통계 */}
            {stats && (
              <div className="rounded-xl border border-ink/10 bg-[color:var(--surface)] p-3">
                <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-2">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--muted)]">STATS</p>
                  <p className="text-[10.5px] text-ink/55 tabular">
                    {stats.dataThrough.toLocaleString('ko-KR')}회까지 · 최근 {stats.recentWindow}회 기준
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: '자주 나온 번호', numbers: stats.hot },
                    { label: '적게 나온 번호', numbers: stats.cold },
                    { label: '장기 미출현', numbers: stats.overdue },
                  ].map(row => (
                    <div key={row.label} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="w-[5.6rem] shrink-0 text-[11px] text-ink/60">{row.label}</span>
                      <span className="flex flex-wrap gap-1">
                        {row.numbers.slice(0, 8).map(num => (
                          <LottoBall key={num} number={num} size="sm" />
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
                {stats.overdue.length > 0 && (
                  <p className="mt-2.5 text-[10px] leading-relaxed text-[color:var(--muted)]">
                    장기 미출현 1위는 {stats.overdue[0]}번({overdueGapOf(stats.overdue[0]!)}회 미출현)입니다. 과거 출현
                    빈도는 다음 회차 확률과 무관한 참고 지표입니다.
                  </p>
                )}
              </div>
            )}

            <OptionRow label="홀:짝 비율">
              <div className={SEG_GROUP} role="group" aria-label="홀짝 비율 선택">
                {RATIO_PRESETS.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => update('oddEven', preset)}
                    aria-pressed={options.oddEven === preset}
                    className={segButtonClass(options.oddEven === preset)}
                  >
                    {RATIO_LABELS[preset]}
                  </button>
                ))}
              </div>
            </OptionRow>

            <OptionRow label="저(1~22):고(23~45)">
              <div className={SEG_GROUP} role="group" aria-label="고저 비율 선택">
                {RATIO_PRESETS.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => update('highLow', preset)}
                    aria-pressed={options.highLow === preset}
                    className={segButtonClass(options.highLow === preset)}
                  >
                    {RATIO_LABELS[preset]}
                  </button>
                ))}
              </div>
            </OptionRow>

            <OptionRow label="번호 합계 구간">
              <div className={SEG_GROUP} role="group" aria-label="번호 합계 구간 선택">
                {SUM_PRESETS.map(preset => {
                  const active = options.sumMin === preset.min && options.sumMax === preset.max
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setOptions(prev => ({ ...prev, sumMin: preset.min, sumMax: preset.max }))}
                      aria-pressed={active}
                      className={segButtonClass(active)}
                    >
                      {preset.label}
                    </button>
                  )
                })}
              </div>
            </OptionRow>

            <OptionRow label="연속번호 허용">
              <div className={SEG_GROUP} role="group" aria-label="연속번호 허용 범위 선택">
                {CONSECUTIVE_PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => update('maxConsecutive', preset.value)}
                    aria-pressed={options.maxConsecutive === preset.value}
                    className={segButtonClass(options.maxConsecutive === preset.value)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </OptionRow>

            <OptionRow label="최소 분포 구간">
              <div className={SEG_GROUP} role="group" aria-label="최소 분포 구간 선택">
                {ZONE_PRESETS.map(zones => (
                  <button
                    key={zones}
                    type="button"
                    onClick={() => update('minZones', zones)}
                    aria-pressed={options.minZones === zones}
                    className={segButtonClass(options.minZones === zones)}
                  >
                    {zones}개 이상
                  </button>
                ))}
              </div>
            </OptionRow>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-3">
              <input
                type="checkbox"
                checked={options.avoidPastWinning}
                onChange={event => update('avoidPastWinning', event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--brand)]"
              />
              <span className="text-[12.5px] leading-relaxed text-ink/80">
                역대 1등 당첨 조합과 완전히 같은 조합 회피
                {stats && (
                  <span className="block text-[10.5px] text-[color:var(--muted)]">
                    {stats.pastCombinationRanks.length.toLocaleString('ko-KR')}개 과거 1등 조합과 비교합니다.
                  </span>
                )}
              </span>
            </label>

            {/* 번호 고정 / 제외 */}
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] font-medium text-ink/70">번호 고정 · 제외</span>
                <button
                  type="button"
                  onClick={resetSelection}
                  disabled={selectionCount === 0}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X className="h-3 w-3" aria-hidden />
                  초기화
                </button>
              </div>

              <div className="grid grid-cols-9 gap-1" role="group" aria-label="번호 고정 및 제외 선택">
                {Array.from({ length: LOTTO_MAX }, (_, index) => index + 1).map(num => {
                  const state = selectionOf(num)
                  // 고정 한도(5개)에 도달하면 미지정 번호는 더 누를 수 없도록 잠근다
                  const locked = state === 'none' && options.include.length >= 5
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => cycleNumber(num)}
                      disabled={locked}
                      aria-label={`${num}번 ${state === 'include' ? '고정됨' : state === 'exclude' ? '제외됨' : '미지정'}`}
                      className={[
                        'flex h-8 items-center justify-center rounded-md border text-[11.5px] font-bold tabular transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40',
                        state === 'include'
                          ? 'border-[color:var(--brand)] bg-[color:var(--brand)] text-white'
                          : state === 'exclude'
                            ? 'border-[color:var(--danger)]/35 bg-[color:var(--danger)]/[0.08] text-[color:var(--danger)] line-through'
                            : 'border-[color:var(--line)] bg-[color:var(--surface)] text-ink/70 hover:border-[color:var(--brand)]/40 hover:text-ink',
                        locked ? 'cursor-not-allowed opacity-40 hover:border-[color:var(--line)] hover:text-ink/70' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {num}
                    </button>
                  )
                })}
              </div>

              <p className="mt-2 text-[10.5px] leading-relaxed text-[color:var(--muted)]">
                번호를 누르면 <span className="font-semibold text-[color:var(--brand)]">고정</span> →{' '}
                <span className="font-semibold text-[color:var(--danger)]">제외</span> → 해제 순서로 바뀝니다. 고정은 최대
                5개까지 지정할 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3.5 text-[10.5px] leading-relaxed text-[color:var(--muted)]">
        로또는 매 회차 독립 추첨이므로 모든 조합의 1등 확률은 1/{TOTAL_COMBINATIONS.toLocaleString('ko-KR')}로
        동일합니다. 통계 가중치와 밸런스 필터는 조합의 선택 근거를 보여 주는 참고 도구이며 당첨 확률을 높이지 않습니다.
      </p>
    </div>
  )
}
