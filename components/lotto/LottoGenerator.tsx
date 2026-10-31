'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, RefreshCw, Sparkles } from 'lucide-react'

import { BALANCED_GENERATOR_OPTIONS, DEFAULT_GENERATOR_OPTIONS, generateGames, type GeneratedGame } from '@/lib/lotto/generator'
import { useLottoStats } from '@/hooks/useLottoStats'

import { BALL_ROW_XL_CLASS, LottoBall } from './LottoBall'

/**
 * 번호 생성기.
 *
 * 기본은 균등 무작위. 균형 필터와 과거 1등 조합 제외는 사용자가 따로 선택한다.
 * 데이터 갱신은 비교 기준만 바꾸며 이미 생성한 번호를 다시 뽑지 않는다.
 *
 * 확률 고지: 로또는 매 회차 독립 추첨이므로 어떤 옵션도 당첨 확률을 바꾸지 못한다.
 * 이 UI는 "당첨 보장"을 주장하지 않으며, 생성 결과는 번호 공만 표시한다.
 */

const GAME_COUNTS = [1, 3, 5] as const
const MODES = [{ value: 'uniform', label: '균등 무작위' }, { value: 'balanced', label: '균형 필터' }] as const

const BALL_PLACEHOLDER = 'h-[clamp(28px,8vw,40px)] w-[clamp(28px,8vw,40px)] shrink-0'

export default function LottoGenerator() {
  const [gameCount, setGameCount] = useState<number>(DEFAULT_GENERATOR_OPTIONS.games)
  const [games, setGames] = useState<GeneratedGame[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [mode, setMode] = useState<'uniform' | 'balanced'>('uniform')
  const [avoidPastWinning, setAvoidPastWinning] = useState(false)
  const [resultLabel, setResultLabel] = useState('')
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const { stats, isLoading: isStatsLoading, error: statsError, refresh } = useLottoStats()

  // 언마운트 시 남은 타이머를 정리해 해제된 컴포넌트에 setState가 걸리지 않게 한다
  const spinTimerRef = useRef<number | null>(null)
  const copyTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (spinTimerRef.current !== null) window.clearTimeout(spinTimerRef.current)
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)
    }
  }, [])

  const latestNumbers = useMemo(() => stats?.recentDraws[0]?.numbers ?? [], [stats])
  const hasGames = games.length > 0

  const handleGenerate = useCallback(() => {
    // 버튼은 포커스를 잃지 않도록 비활성화하지 않고, 중복 실행만 여기서 막는다
    if (spinTimerRef.current !== null || isSpinning) return
    if (avoidPastWinning && !stats) {
      setGenerationError('과거 당첨 조합을 제외하려면 데이터를 먼저 불러오거나 제외 옵션을 꺼주세요.')
      return
    }

    setIsSpinning(true)
    setCopiedIndex(null)
    setGenerationError(null)
    setCopyError(null)
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)

    // 클릭 시점의 조건을 보존한다. 연출 중에는 설정을 잠가 결과 설명과 번호가 일치하게 한다.
    const options = { ...(mode === 'uniform' ? DEFAULT_GENERATOR_OPTIONS : BALANCED_GENERATOR_OPTIONS), games: gameCount, avoidPastWinning }

    // 연산은 동기지만, 공이 굴러가는 연출을 보여 준 뒤 결과를 교체한다
    const delay = games.length === 0 ? 700 : 450
    spinTimerRef.current = window.setTimeout(() => {
      spinTimerRef.current = null

      try {
        const next = generateGames(options, { stats, latestNumbers })
        if (next.length !== gameCount || next.some(game => game.relaxed)) {
          setGenerationError('선택한 조건을 모두 만족하는 번호를 만들지 못했습니다. 다시 생성해주세요.')
          return
        }
        setGames(next)
        setResultLabel(`${mode === 'uniform' ? '균등 무작위' : '균형 필터'} · ${gameCount}게임${avoidPastWinning ? ` · ${stats!.dataThrough}회까지 과거 당첨 조합 제외` : ''}`)
      } catch {
        setGenerationError('번호 생성에 실패했습니다. 다시 시도해주세요.')
      } finally {
        setIsSpinning(false)
      }
    }, delay)
  }, [isSpinning, games.length, gameCount, mode, avoidPastWinning, stats, latestNumbers])

  const handleCopy = useCallback(async (index: number, numbers: number[]) => {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(numbers.join(', '))
      setCopiedIndex(index)
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => {
        copyTimerRef.current = null
        setCopiedIndex(null)
      }, 1500)
    } catch {
      setCopyError('번호를 복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해주세요.')
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

      <div className="mb-4 rounded-xl border border-ink/10 bg-ink/[0.03] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs leading-relaxed text-ink/70" role="status">
            {stats ? <p>비교 기준 <strong className="text-ink">{stats.dataThrough}회</strong> · {stats.latestDrawDate} 추첨</p> : <p>{isStatsLoading ? '당첨 데이터 확인 중' : '당첨 데이터 미확인'}</p>}
            {stats && <p>{isStatsLoading ? '갱신 확인 중…' : statsError ? '최신 갱신 확인 필요' : stats.origin === 'live' ? '공식 조회로 최신 회차 확인' : `${stats.dataThrough}회까지 저장된 데이터 사용`}</p>}
          </div>
          <button type="button" onClick={refresh} disabled={isStatsLoading} aria-label={statsError ? '당첨 데이터 다시 시도' : '당첨 데이터 새로고침'} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-ink/15 px-3 text-xs font-medium text-ink/80 hover:bg-ink/[0.06] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40">
            <RefreshCw className={`h-3.5 w-3.5 ${isStatsLoading ? 'animate-spin motion-reduce:animate-none' : ''}`} aria-hidden />
            {isStatsLoading ? '확인 중' : statsError ? '다시 시도' : '새로고침'}
          </button>
        </div>
        {statsError && <p role="alert" className="mt-2 text-xs text-ink/70">{statsError} {stats ? '표시된 기준 회차로 비교합니다.' : '과거 조합 제외 없이 번호 생성은 사용할 수 있습니다.'}</p>}
        {!statsError && stats?.origin === 'snapshot' && <p className="mt-2 text-xs text-ink/70">최신 갱신이 완료되지 않았습니다.{stats.latestKnownRound && stats.latestKnownRound > stats.dataThrough ? ` ${stats.latestKnownRound}회까지 확인됐지만 중간 회차를 모두 확보하지 못했습니다.` : ''} 새로고침으로 다시 확인할 수 있습니다.</p>}
      </div>

      <fieldset disabled={isSpinning} className="mb-4 min-w-0">
        <legend className="mb-2 text-xs font-medium text-ink/80">생성 방식</legend>
        <div className="grid grid-cols-2 gap-2">
          {MODES.map(option => <label key={option.value} className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-2 text-xs font-semibold ${mode === option.value ? 'border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-ink' : 'border-ink/15 text-ink/70'} ${isSpinning ? 'opacity-50' : ''}`}>
            <input type="radio" name="lotto-mode" value={option.value} checked={mode === option.value} onChange={() => setMode(option.value)} className="accent-[color:var(--brand)]" />
            {option.label}
          </label>)}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink/65">
          {mode === 'uniform' ? (avoidPastWinning ? '표시된 기준 회차의 당첨 조합을 제외하고 같은 확률로 뽑습니다.' : '모든 6개 번호 조합을 같은 확률로 뽑습니다. 연속번호와 과거 당첨 조합도 나올 수 있습니다.') : '합계 100~175 · 최대 2연속 · 3개 이상 구간 분산 조건과 홀짝·고저 등 패턴 점수를 적용합니다.'}
        </p>
        <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-2 text-xs text-ink/80">
          <input type="checkbox" checked={avoidPastWinning} onChange={event => setAvoidPastWinning(event.target.checked)} className="h-4 w-4 shrink-0 accent-[color:var(--brand)]" />
          과거 1등 당첨 조합 제외
        </label>
        <p className="text-[11px] leading-relaxed text-ink/60">같은 회차의 본번호 6개가 모두 일치하는 조합만 제외합니다. 개별 번호는 제외하지 않습니다. 필터는 당첨 확률을 높이지 않습니다.</p>
      </fieldset>
      {/* 1단계 — 게임 수 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-ink/70">게임 수</span>
        <div className="flex flex-wrap gap-1 rounded-lg bg-ink/[0.05] p-1" role="group" aria-label="게임 수 선택">
          {GAME_COUNTS.map(count => (
            <button
              key={count}
              type="button"
              disabled={isSpinning}
              onClick={() => setGameCount(count)}
              aria-pressed={gameCount === count}
              className={[
                'min-h-11 rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40',
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
        {generationError && <p role="alert" className="mb-3 text-xs text-ink/80">{generationError}{hasGames ? ' 이전 생성 결과를 유지합니다.' : ''}</p>}
        {hasGames && !isSpinning && <p className="mb-2 text-xs text-ink/70">생성 결과: {resultLabel}. 설정 변경은 다음 생성부터 적용됩니다.</p>}
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
                  className="mf-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 rounded-2xl border border-ink/10 bg-ink/[0.03] px-2 py-1.5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-3"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="order-1 justify-self-start truncate font-mono text-[10.5px] tracking-[0.14em] text-ink/50">
                    GAME {label}
                  </span>
                  <div
                    className="order-3 col-span-2 flex items-center justify-center gap-[clamp(3px,1vw,10px)] pb-2 sm:order-2 sm:col-span-1 sm:pb-0"
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
                    className="order-2 inline-flex min-h-11 min-w-11 items-center justify-center justify-self-end gap-1 rounded-md px-1.5 py-1 text-[11px] text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40 sm:order-3"
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
      {hasGames && stats && <p className="mt-2 text-[11px] text-ink/60">공 테두리 표시는 비교 기준 {stats.dataThrough}회 당첨번호와의 일치 표시입니다.</p>}
      {copyError && <p role="alert" className="mt-2 text-xs text-ink/80">{copyError}</p>}
    </div>
  )
}
