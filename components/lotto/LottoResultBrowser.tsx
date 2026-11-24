'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Search } from 'lucide-react'

import { fromIsoDate } from '@/lib/lotto/schedule'
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

const WON_PER_EOK = 100_000_000

function formatPrizeHeadline(amount: number): string {
  if (amount < WON_PER_EOK) return formatExactWon(amount)
  const rounded = Math.round(amount / WON_PER_EOK)
  const prefix = amount % WON_PER_EOK === 0 ? '' : '약 '
  return `${prefix}${rounded.toLocaleString('ko-KR')}억 원`
}

const NAV_BUTTON =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface)] text-[color:var(--ink-2)] transition-colors hover:border-[color:var(--brand)]/50 hover:text-[color:var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[color:var(--line-strong)] disabled:hover:text-[color:var(--ink-2)]'

type Status = 'loading' | 'ready' | 'error'

export default function LottoResultBrowser() {
  const [latestRound, setLatestRound] = useState<number | null>(null)
  const [latestVerified, setLatestVerified] = useState(false)
  const [result, setResult] = useState<LottoRoundResult | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [roundInput, setRoundInput] = useState('')

  // 빠른 연속 클릭 시 늦게 도착한 이전 응답이 화면을 덮어쓰지 않도록 요청 순번을 비교한다
  const requestIdRef = useRef(0)
  const newestResultRef = useRef<LottoRoundResult | null>(null)

  const applyResult = useCallback((data: LottoRoundResult) => {
    setResult(data)
    setStatus('ready')
    setError(null)
    setRoundInput(String(data.round))
  }, [])

  const load = useCallback(
    async (url: string, refreshLatest = false) => {
      const requestId = ++requestIdRef.current
      setStatus('loading')
      setError(null)

      try {
        const response = await fetch(url, refreshLatest ? { cache: 'no-store' } : undefined)
        const payload = (await response.json()) as LottoRoundResult & { error?: string }
        if (requestId !== requestIdRef.current) return

        if (!response.ok) {
          setStatus('error')
          setError(payload.error ?? '당첨번호를 불러오지 못했습니다.')
          return
        }

        if (refreshLatest) {
          const known = newestResultRef.current
          if (known && payload.round < known.round) {
            applyResult(known)
            setLatestVerified(false)
            setError(`최신 조회가 지연되어 마지막으로 확인한 ${known.round}회를 표시합니다.`)
            return
          }
          newestResultRef.current = payload
          setLatestRound(payload.round)
          setLatestVerified(payload.origin === 'live')
        } else if (!newestResultRef.current || payload.round > newestResultRef.current.round) {
          newestResultRef.current = payload
          setLatestRound(payload.round)
          setLatestVerified(false)
        }
        applyResult(payload)
      } catch {
        if (requestId !== requestIdRef.current) return
        setStatus('error')
        setError('당첨번호를 불러오지 못했습니다. 다시 시도해 주세요.')
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
        if (!newestResultRef.current || payload.round >= newestResultRef.current.round) {
          newestResultRef.current = payload
          setLatestRound(payload.round)
          setLatestVerified(payload.origin === 'live')
        }
        if (requestId !== requestIdRef.current) return
        applyResult(payload)
      } catch {
        if (cancelled || requestId !== requestIdRef.current) return
        setStatus('error')
        setError('최신 당첨번호를 불러오지 못했습니다. 다시 시도해 주세요.')
      }
    }

    void loadLatest()
    return () => {
      cancelled = true
    }
  }, [applyResult])

  const currentRound = result?.round ?? null
  const canGoPrev = currentRound !== null && currentRound > 1
  const canGoNext = currentRound !== null && (!latestVerified || (latestRound !== null && currentRound < latestRound))
  const isLatest = currentRound !== null && currentRound === latestRound

  const handleRoundSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const digits = roundInput.replace(/[^\d]/g, '')
    const parsed = Number(digits)

    if (!digits || !Number.isInteger(parsed) || parsed < 1) {
      setError('1 이상의 회차 번호를 입력해 주세요.')
      return
    }
    if (latestVerified && latestRound !== null && parsed > latestRound) {
      setError(`최신 추첨은 ${latestRound}회입니다.`)
      return
    }
    loadRound(parsed)
  }

  const ballAriaLabel = result
    ? `제 ${result.round}회 당첨번호 ${result.numbers.join(', ')}, 보너스 번호 ${result.bonusNumber}`
    : undefined

  return (
    <div className="glass-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink md:text-xl">
            {result ? `${result.round}회 당첨번호` : '로또 당첨번호'}
          </h2>
          {result && (
            <p className="mt-1 text-sm text-ink/70">
              <time dateTime={result.drawDate}>{formatDrawDateLabel(result.drawDate)}</time>
              {result.origin === 'snapshot' && ' · 저장된 결과'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void load('/api/lotto/latest?refresh=1', true)}
          disabled={status === 'loading'}
          aria-label={isLatest ? '최신 회차 새로고침' : '최신 회차 조회'}
          className="min-h-10 rounded-lg px-2 text-sm font-medium text-ink/70 hover:text-ink disabled:opacity-50"
        >
          {isLatest ? '새로고침' : '최신 회차'}
        </button>
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
            <p className="text-center text-sm text-ink/70">당첨번호 확인 중…</p>
          </div>
        )}

        {result && (
          <div className={status === 'loading' ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
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

            <div className="mt-3 rounded-xl border border-ink/10">
              <table className="w-full table-fixed border-collapse text-center">
                <caption className="sr-only">{result.round}회 1등 당첨 결과</caption>
                <thead className="text-sm text-ink/70">
                  <tr>
                    <th scope="col" className="px-1 pt-3 font-medium">1등 당첨자<span className="sr-only"> (당첨된 줄 수 기준)</span></th>
                    <th scope="col" className="border-l border-ink/10 px-1 pt-3 font-medium">1등 당첨금 <span className="text-xs">(세전)</span></th>
                  </tr>
                </thead>
                <tbody className="text-lg font-bold tabular">
                  <tr>
                    <td className="px-1 pb-3">{result.firstWinnerCount.toLocaleString('ko-KR')}명</td>
                    <td className="border-l border-ink/10 px-1 pb-3 text-[color:var(--warn)]">
                      {result.firstWinnerCount > 0 ? formatPrizeHeadline(result.firstPrizeAmount) : '당첨 없음'}
                    </td>
                  </tr>
                </tbody>
              </table>
              <details className="group border-t border-ink/10">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-sm text-ink/75 [&::-webkit-details-marker]:hidden">
                  당첨금 상세
                  <ChevronDown aria-hidden className="h-4 w-4 group-open:rotate-180" />
                </summary>
                <dl className="grid grid-cols-[minmax(0,1fr)_max-content] items-baseline gap-x-2 gap-y-1.5 px-3 text-sm text-ink/80">
                  <dt className="break-keep">한 줄당 금액</dt>
                  <dd className="whitespace-nowrap text-right">
                    <a
                      href={`https://www.dhlottery.co.kr/lt645/result?ltEpsd=${result.round}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 tabular underline underline-offset-2 hover:text-ink"
                    >
                      {result.firstWinnerCount > 0 ? formatExactWon(result.firstPrizeAmount) : '당첨 없음'}
                      <ExternalLink aria-hidden className="h-3 w-3 shrink-0" />
                      <span className="sr-only"> (동행복권 {result.round}회 발표, 새 창)</span>
                    </a>
                  </dd>
                  <dt>총 판매액</dt>
                  <dd className="whitespace-nowrap text-right tabular">{formatExactWon(result.totalSalesAmount)}</dd>
                </dl>
                <p className="px-3 py-3 text-xs text-ink/65">당첨자 수는 당첨된 줄 수 기준입니다.</p>
              </details>
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
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => currentRound && loadRound(currentRound - 1)}
          disabled={!canGoPrev || status === 'loading'}
          className={NAV_BUTTON}
          aria-label="이전 회차 보기"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>

        <form onSubmit={handleRoundSubmit} className="flex min-w-0 flex-1 items-center gap-2">
          <label className="sr-only" htmlFor="lotto-round-input">
            조회할 회차 번호
          </label>
          <div className="relative min-w-0 flex-1">
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
    </div>
  )
}
