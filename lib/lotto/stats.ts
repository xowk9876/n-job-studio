/**
 * 역대 당첨번호 기반 출현 통계 집계.
 *
 * 서버(API Route)와 클라이언트 양쪽에서 쓸 수 있는 순수 함수 모듈이며,
 * 전 회차 원본 데이터는 서버에서만 다루고 브라우저에는 집계 결과만 전달한다.
 *
 * 주의: 로또 추첨은 매 회차 독립 사건이므로 아래 통계는 "지금까지 어떻게 나왔는지"에 대한
 * 사후 기술(descriptive)일 뿐 다음 회차 확률을 바꾸지 않는다. 모든 조합의 1등 확률은
 * 항상 1/8,145,060로 동일하다.
 */

import type { LottoDraw, LottoNumberStat, LottoStats, LottoDataOrigin } from './types'

/** 로또 번호 범위 */
export const LOTTO_MIN = 1
export const LOTTO_MAX = 45
export const LOTTO_PICK = 6

/** 전체 조합 수 — C(45,6) */
export const TOTAL_COMBINATIONS = 8_145_060

/** 핫/콜드 판정에 쓰는 기본 최근 회차 구간 (약 1년 2개월) */
export const DEFAULT_RECENT_WINDOW = 60

/** 이항계수 표 — C(n, k), n ≤ 44, k ≤ 6 */
const BINOMIAL: number[][] = (() => {
  const table: number[][] = []
  for (let n = 0; n <= LOTTO_MAX; n++) {
    const row = new Array<number>(LOTTO_PICK + 1).fill(0)
    row[0] = 1
    for (let k = 1; k <= LOTTO_PICK; k++) {
      row[k] = n === 0 ? 0 : table[n - 1]![k - 1]! + table[n - 1]![k]!
    }
    table.push(row)
  }
  return table
})()

/**
 * 6개 번호 조합을 0 ~ 8,145,059 범위의 고유 정수로 변환 (조합 수 체계 / colex rank).
 * 역대 1등 조합 집합을 정수 Set으로 압축해 전송·비교하기 위해 사용한다.
 */
export function combinationRank(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b)
  let rank = 0
  for (let i = 0; i < sorted.length; i++) {
    rank += BINOMIAL[sorted[i]! - 1]![i + 1]!
  }
  return rank
}

type BuildOptions = {
  /** 최근 몇 회차를 recentCount로 집계할지 */
  recentWindow?: number
  /** hot·cold·overdue 목록 길이 */
  listSize?: number
  /** 응답에 포함할 최근 회차 수 */
  recentDrawCount?: number
  origin?: LottoDataOrigin
}

/**
 * 회차 목록(오름차순) → 번호별 출현 통계 + 핫/콜드/미출현 랭킹.
 * 시간복잡도 O(회차 수), 번호별 집계는 고정 크기 배열로 처리한다.
 */
export function buildLottoStats(draws: readonly LottoDraw[], options: BuildOptions = {}): LottoStats {
  const { recentWindow = DEFAULT_RECENT_WINDOW, listSize = 8, recentDrawCount = 10, origin = 'snapshot' } = options

  if (draws.length === 0) {
    throw new Error('통계를 집계할 회차 데이터가 없습니다.')
  }

  const latest = draws[draws.length - 1]!
  const recentFrom = Math.max(0, draws.length - recentWindow)

  const counts = new Array<number>(LOTTO_MAX + 1).fill(0)
  const recentCounts = new Array<number>(LOTTO_MAX + 1).fill(0)
  const lastRounds = new Array<number>(LOTTO_MAX + 1).fill(0)

  draws.forEach((draw, index) => {
    const isRecent = index >= recentFrom
    for (const num of draw.numbers) {
      counts[num]! += 1
      if (isRecent) recentCounts[num]! += 1
      if (draw.round > lastRounds[num]!) lastRounds[num] = draw.round
    }
  })

  const numbers: LottoNumberStat[] = []
  for (let num = LOTTO_MIN; num <= LOTTO_MAX; num++) {
    const lastRound = lastRounds[num]! > 0 ? lastRounds[num]! : null
    numbers.push({
      number: num,
      count: counts[num]!,
      recentCount: recentCounts[num]!,
      lastRound,
      gap: lastRound === null ? draws.length : latest.round - lastRound,
    })
  }

  // 최근 구간 출현수가 같으면 누적 출현수로 tie-break → 순위가 흔들리지 않도록 결정적으로 정렬
  const byRecentDesc = [...numbers].sort((a, b) => b.recentCount - a.recentCount || b.count - a.count || a.number - b.number)
  const byRecentAsc = [...numbers].sort((a, b) => a.recentCount - b.recentCount || a.count - b.count || a.number - b.number)
  const byGapDesc = [...numbers].sort((a, b) => b.gap - a.gap || a.number - b.number)

  return {
    dataThrough: latest.round,
    latestDrawDate: latest.drawDate,
    totalDraws: draws.length,
    recentWindow: Math.min(recentWindow, draws.length),
    numbers,
    hot: byRecentDesc.slice(0, listSize).map(s => s.number),
    cold: byRecentAsc.slice(0, listSize).map(s => s.number),
    overdue: byGapDesc.slice(0, listSize).map(s => s.number),
    pastCombinationRanks: draws.map(draw => combinationRank(draw.numbers)),
    recentDraws: draws
      .slice(-recentDrawCount)
      .reverse()
      .map(({ round, drawDate, numbers: nums, bonusNumber }) => ({ round, drawDate, numbers: nums, bonusNumber })),
    origin,
  }
}
