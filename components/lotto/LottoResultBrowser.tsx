'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, Trophy } from 'lucide-react'

import { FIRST_DRAW_DATE, fromIsoDate } from '@/lib/lotto/schedule'
import type { LottoRoundResult } from '@/lib/lotto/types'

import { BALL_ROW_CLASS, LottoBall } from './LottoBall'

/**
 * 최신 회차 당첨번호 + 과거 회차 조회.
 * 회차 번호 직접 입력 · 이전/다음 이동 · 최신 회차 복귀를 지원한다.
 * 데이터는 서버 프록시(`/api/lotto/*`)를 경유한 동행복권 공식 데이터다.
 */

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'] as const

function formatDrawDateLabel(iso: string): string {
  const date = fromIsoDate(iso)
  if (!date) return iso
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY[date.getDay()]})`
}

function formatExactWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/** 큰 금액을 억/만 단위로 압축 — 상세 금액은 별도로 함께 노출한다 */
function formatCompactWon(amount: number): string {
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000
    return `${eok >= 100 ? Math.round(eok).toLocaleString('ko-KR') : eok.toFixed(1)}억원`
  }
  if (amount >= 10_000) return `${Math.round(amount / 10_000).toLocaleString('ko-KR')}만원`
  return formatExactWon(amount)
}

const CARD_LABEL = 'text-[10.5px] text-ink/60'
const CARD_BOX = 'rounded-2xl border border-ink/10 bg-ink/[0.04] p-3'
const NAV_BUTTON =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface)] text-[color:var(--ink-2)] transition-colors hover:border-[color:var(--brand)]/50 hover:text-[color:var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[color:var(--line-strong)] disabled:hover:text-[color:var(--ink-2)]'

type Status = 'loading' | 'ready' | 'error'

export default function LottoResultBrowser() {
  const [latestRound, setLatestRound] = useState<number | null>(null)
  const [result, setResult] = useState<LottoRoundResult | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [roundInput, setRoundInput] = useState('')

  // 빠른 연속 클릭 시 늦게 도착한 이전 응답이 화면을 덮어쓰지 않도록 요청 순번을 비교한다
  const requestIdRef = useRef(0)

  const applyResult = useCallback((data: LottoRoundResult) => {
    setResult(data)
    setStatus('ready')
    setError(null)
    setRoundInput(String(data.round))
  }, [])

  const load = useCallback(
    async (url: string) => {
      const requestId = ++requestIdRef.current
      setStatus('loading')
      setError(null)

      try {
        const response = await fetch(url)
        const payload = (await response.json()) as LottoRoundResult & { error?: string }
        if (requestId !== requestIdRef.current) return

        if (!response.ok) {
          setStatus('error')
          setError(payload.error ?? '당첨번호를 불러오지 못했습니다.')
          return
        }

        applyResult(payload)
      } catch {
        if (requestId !== requestIdRef.current) return
        setStatus('error')
        setError('네트워크 오류로 당첨번호를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      }
    },
    [applyResult],
  )

  const loadRound = useCallback(
    (round: number) => {
      void load(`/api/lotto/round?round=${round}`)
    },
    [load],
  )

  // 최초 진입 시 최신 회차를 표시하고, 이후 회차 이동의 상한으로 사용한다
  useEffect(() => {
    let cancelled = false
    // 사용자가 최신 회차 응답보다 먼저 다른 회차를 조회했을 때 화면을 덮어쓰지 않도록 순번을 잡는다
    const requestId = ++requestIdRef.current

    async function loadLatest() {
      try {
        const response = await fetch('/api/lotto/latest')
        if (!response.ok) throw new Error('latest fetch failed')
        const payload = (await response.json()) as LottoRoundResult
        if (cancelled) return

        // 회차 상한은 조회 순서와 무관한 메타데이터이므로 항상 반영한다
        setLatestRound(payload.round)
        if (requestId !== requestIdRef.current) return
        applyResult(payload)
      } catch {
        if (cancelled || requestId !== requestIdRef.current) return
        setStatus('error')
        setError('최신 당첨번호를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      }
    }

    void loadLatest()
    return () => {
      cancelled = true
    }
  }, [applyResult])

  const currentRound = result?.round ?? null
  const canGoPrev = currentRound !== null && currentRound > 1
  const canGoNext = currentRound !== null && latestRound !== null && currentRound < latestRound
  const isLatest = currentRound !== null && currentRound === latestRound

  const handleRoundSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const digits = roundInput.replace(/[^\d]/g, '')
    const parsed = Number(digits)

    if (!digits || !Number.isInteger(parsed) || parsed < 1) {
      setError('1 이상의 회차 번호를 입력해 주세요.')
      return
    }
    if (latestRound !== null && parsed > latestRound) {
      setError(`아직 추첨되지 않은 회차입니다. 조회 가능한 최신 회차는 ${latestRound}회입니다.`)
      return
    }
    loadRound(parsed)
  }

  const ballAriaLabel = result
    ? `제 ${result.round}회 당첨번호 ${result.numbers.join(', ')}, 보너스 번호 ${result.bonusNumber}`
    : undefined

  return (
    <div className="glass-card">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-[color:var(--muted)] mb-1">WINNING NUMBERS</p>
          <h2 className="font-display text-[18px] md:text-[20px] font-bold text-ink tracking-tight">
            로또 당첨번호 조회
          </h2>
          <p className="text-[11.5px] text-ink/60 mt-1">
            동행복권 공식 데이터 · 회차 번호로 과거 당첨번호를 확인할 수 있습니다.
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/[0.05] px-2.5 py-1 text-[10.5px] font-semibold text-ink/80">
          <Trophy className="h-3.5 w-3.5 text-[color:var(--warn)]" aria-hidden />
          {isLatest ? '최신 회차' : '지난 회차'}
        </span>
      </div>

      <div aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'loading' && !result && (
          <div className="flex flex-col gap-4">
            <div className={BALL_ROW_CLASS}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  // Tailwind 기본 animate-bounce 사용 — styled-jsx는 keyframes 이름을 스코프 처리해
                  // 인라인 style의 animation 이름과 어긋나므로 전역 유틸리티로 처리한다
                  className={`h-[clamp(26px,7.2vw,52px)] w-[clamp(26px,7.2vw,52px)] shrink-0 animate-bounce rounded-full bg-ink/[0.06] ${i === 6 ? 'ring-1 ring-ink/15' : ''}`}
                  style={{ animationDelay: `${i * 0.06}s`, animationDuration: '0.8s' }}
                />
              ))}
            </div>
            <p className="text-center text-[11.5px] text-ink/60">당첨번호를 확인하고 있습니다.</p>
          </div>
        )}

        {result && (
          <div className={status === 'loading' ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
              <div>
                <p className="text-[12px] font-semibold text-ink/65">제 {result.round.toLocaleString('ko-KR')}회</p>
                <p className="text-[19px] md:text-[23px] font-extrabold text-ink tracking-tight">
                  {formatDrawDateLabel(result.drawDate)}
                </p>
              </div>
              <span className="rounded-lg bg-ink/[0.05] px-2.5 py-1 text-[10.5px] text-ink/60">
                {result.origin === 'live' ? '동행복권 실시간 조회' : '저장된 공식 데이터'}
              </span>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-ink/[0.04] px-2 py-4 sm:px-3 md:rounded-3xl md:p-5">
              <div className={BALL_ROW_CLASS} role="img" aria-label={ballAriaLabel}>
                {result.numbers.map(num => (
                  <LottoBall key={num} number={num} size="lg" />
                ))}
                <span aria-hidden className="shrink-0 text-[clamp(12px,3.2vw,18px)] font-light text-ink/55 leading-none">
                  +
                </span>
                {/* 보너스 번호 — 시각 라벨 없이 공만 노출하고, 낭독은 컨테이너 aria-label이 담당한다 */}
                <LottoBall number={result.bonusNumber} size="lg" bonus />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              <div className={CARD_BOX}>
                <p className={CARD_LABEL}>1등 당첨자</p>
                <p className="mt-1 text-[16px] font-extrabold text-ink tabular">
                  {result.firstWinnerCount.toLocaleString('ko-KR')}명
                </p>
              </div>
              <div className={CARD_BOX}>
                <p className={CARD_LABEL}>1등 1명당 당첨금</p>
                <p className="mt-1 text-[16px] font-extrabold text-[color:var(--warn)] tabular">
                  {formatCompactWon(result.firstPrizeAmount)}
                </p>
                <p className="mt-0.5 text-[10px] text-ink/50 tabular">{formatExactWon(result.firstPrizeAmount)}</p>
              </div>
              <div className={`${CARD_BOX} col-span-2 md:col-span-1`}>
                <p className={CARD_LABEL}>회차 총 판매금액</p>
                <p className="mt-1 text-[16px] font-extrabold text-ink tabular">
                  {formatCompactWon(result.totalSalesAmount)}
                </p>
                <p className="mt-0.5 text-[10px] text-ink/50 tabular">{formatExactWon(result.totalSalesAmount)}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-[color:var(--danger)]/25 bg-[color:var(--danger)]/[0.06] p-3.5 text-center"
          >
            <p className="text-[12.5px] font-semibold text-[color:var(--danger)]">{error}</p>
          </div>
        )}
      </div>

      {/* 회차 이동 컨트롤 */}
      <div className="mt-5 border-t border-[color:var(--line)] pt-5">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--muted)] mb-3">BROWSE · 다른 회차 보기</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => currentRound && loadRound(currentRound - 1)}
            disabled={!canGoPrev || status === 'loading'}
            className={NAV_BUTTON}
            aria-label="이전 회차 보기"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>

          <form onSubmit={handleRoundSubmit} className="flex flex-1 items-center gap-2">
            <label className="sr-only" htmlFor="lotto-round-input">
              조회할 회차 번호
            </label>
            <div className="relative flex-1">
              <input
                id="lotto-round-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                maxLength={5}
                value={roundInput}
                onChange={event => setRoundInput(event.target.value.replace(/[^\d]/g, ''))}
                placeholder="회차"
                className="glass-input h-10 w-full py-0 pr-9 text-[14px]"
              />
              <span aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[color:var(--muted)]">
                회
              </span>
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[color:var(--brand)] px-3.5 text-[13px] font-bold text-white transition-colors hover:bg-[color:var(--brand-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Search className="h-3.5 w-3.5" aria-hidden />
              조회
            </button>
          </form>

          <button
            type="button"
            onClick={() => currentRound && loadRound(currentRound + 1)}
            disabled={!canGoNext || status === 'loading'}
            className={NAV_BUTTON}
            aria-label="다음 회차 보기"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => latestRound && loadRound(latestRound)}
            disabled={latestRound === null || isLatest || status === 'loading'}
            className="h-10 w-full rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3.5 text-[12.5px] font-semibold text-[color:var(--ink-2)] transition-colors hover:border-[color:var(--brand)]/50 hover:text-[color:var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            최신 회차로 이동
          </button>
        </div>

        <p className="mt-3 text-[10.5px] leading-relaxed text-[color:var(--muted)]">
          로또 6/45는 제1회({FIRST_DRAW_DATE})부터 매주 토요일 추첨됩니다. 조회하려는 회차 번호를 입력하거나 화살표로
          앞뒤 회차를 이동할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
