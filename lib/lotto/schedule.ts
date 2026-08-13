/**
 * 로또 6/45 회차 ↔ 추첨일 변환.
 *
 * 제1회(2002-12-07, 토)부터 중단 없이 매주 토요일 추첨되므로
 * `추첨일 = 제1회 추첨일 + (회차 - 1) × 7일` 관계가 성립한다.
 * 이 전제는 `scripts/fetch-lotto-history.mjs`가 전 회차를 수집할 때
 * 회차 연속성과 7일 간격을 검증하여 확인한다.
 */

const FIRST_DRAW_UTC = Date.UTC(2002, 11, 7)
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** 제1회 추첨일 (YYYY-MM-DD) */
export const FIRST_DRAW_DATE = '2002-12-07'

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

/** Date → 로컬 달력 기준 YYYY-MM-DD (UTC 변환으로 날짜가 밀리는 문제 방지) */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/** YYYY-MM-DD → 로컬 자정 Date. 형식이 잘못되면 null */
export function fromIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(year, month - 1, day)

  // 2026-02-31처럼 존재하지 않는 날짜를 걸러낸다
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

/** 시각 성분을 버린 달력 기준 UTC 밀리초 */
function calendarUtc(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

/** 회차 → 추첨일 (YYYY-MM-DD) */
export function drawDateOfRound(round: number): string {
  const utc = FIRST_DRAW_UTC + (round - 1) * WEEK_MS
  const date = new Date(utc)
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`
}

/**
 * 임의의 날짜 → 그 날짜까지 추첨이 끝난 가장 가까운 회차.
 * 제1회 추첨일(2002-12-07) 이전이면 0을 반환한다.
 */
export function roundOnOrBefore(date: Date): number {
  const diff = calendarUtc(date) - FIRST_DRAW_UTC
  if (diff < 0) return 0
  return Math.floor(diff / WEEK_MS) + 1
}
