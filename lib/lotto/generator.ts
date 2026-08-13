/**
 * 옵션 기반 로또 번호 조합 생성기.
 *
 * ⚠️ 확률에 대한 정직한 고지
 * 로또 6/45는 매 회차 독립 추첨이며 모든 조합의 1등 확률은 1/8,145,060로 **동일**하다.
 * 통계 가중치·밸런스 필터는 당첨 확률을 높이지 못한다. 이 모듈이 하는 일은
 *   ① 역대 1등 조합에서 드물게 관측된 극단적 분포(예: 1·2·3·4·5·6, 합계 30)를 피하고
 *   ② 사용자가 정한 조건(고정·제외·홀짝·합계 등)을 만족하는 조합을 찾아 주며
 *   ③ 그 조합이 왜 선택됐는지 근거를 함께 제시하는 것
 * 까지이며, 당첨을 보장하지 않는다.
 *
 * 알고리즘: 가중 비복원 추출(weighted sampling without replacement) → 하드 필터 →
 *          패턴 점수 최댓값 선택 → 조건 미충족 시 스왑 기반 복구(hill-climbing)
 */

import { analyzeCombination, describeCombination, scorePattern, type CombinationMetrics } from './pattern'
import { secureRandomFloat, secureRandomInt } from './random'
import { combinationRank, LOTTO_MAX, LOTTO_PICK } from './stats'
import type { LottoStats } from './types'

/** 번호 풀 가중치 전략 */
export type PoolStrategy = 'balanced' | 'hot' | 'cold' | 'overdue' | 'uniform'

/** 홀짝·고저 비율 프리셋 */
export type RatioPreset = 'any' | '3:3' | '4:2' | '2:4'

export type GeneratorOptions = {
  /** 동시 생성 게임 수 */
  games: number
  strategy: PoolStrategy
  /** 반드시 포함할 번호 */
  include: number[]
  /** 제외할 번호 */
  exclude: number[]
  /** 홀:짝 비율 */
  oddEven: RatioPreset
  /** 저(1~22):고(23~45) 비율 */
  highLow: RatioPreset
  sumMin: number
  sumMax: number
  /** 허용 최대 연속 번호 길이 (6이면 제한 없음) */
  maxConsecutive: number
  /** 최소 분포 구간 수 (1~5) */
  minZones: number
  /** 역대 1등 조합과 완전히 같은 조합 회피 */
  avoidPastWinning: boolean
}

export type GeneratedGame = {
  numbers: number[]
  metrics: CombinationMetrics
  /** "왜 이 조합인지" 근거 문구 */
  reasons: string[]
  score: number
  /** 조건을 모두 만족하는 조합을 찾지 못해 일부를 완화한 경우 true */
  relaxed: boolean
}

export type GeneratorContext = {
  /** 통계 가중치·과거 조합 회피에 사용. 없으면 균등 추출로 동작 */
  stats?: LottoStats | null
  /** 직전 회차 당첨번호 — 패턴 점수의 오버랩 평가에 사용 */
  latestNumbers?: number[]
}

/** 6개 번호 합계의 이론적 최소·최대 */
export const SUM_MIN_POSSIBLE = 21
export const SUM_MAX_POSSIBLE = 255

/** 연속 번호 제한 옵션에서 "제한 없음"을 뜻하는 값 */
export const CONSECUTIVE_UNLIMITED = 6

/**
 * UI는 전략 선택을 노출하지 않고 항상 이 기본값(균형)을 사용한다.
 * 균형 전략은 45개 번호를 동일 가중치로 뽑으므로 출현 빈도 통계에 의존하지 않는다.
 */
export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  games: 5,
  strategy: 'balanced',
  include: [],
  exclude: [],
  oddEven: 'any',
  highLow: 'any',
  sumMin: 100,
  sumMax: 175,
  maxConsecutive: 2,
  minZones: 3,
  avoidPastWinning: true,
}

const ODD_TARGET: Record<RatioPreset, number | null> = { any: null, '3:3': 3, '4:2': 4, '2:4': 2 }
const LOW_TARGET: Record<RatioPreset, number | null> = { any: null, '3:3': 3, '4:2': 4, '2:4': 2 }

/** 게임당 표본 추출 상한 — 조건이 촘촘해도 응답 시간을 100ms 수준으로 묶어 둔다 */
const MAX_SAMPLES_PER_GAME = 3000
/** 유효 후보를 이만큼 모으면 그 중 최고 점수를 채택하고 종료 */
const ENOUGH_VALID_CANDIDATES = 40
/** 게임 간 번호 중복 1개당 점수 페널티 */
const OVERLAP_PENALTY = 4
/** 통계 전략의 최대 가중 배율 (1 ~ 1 + BIAS) */
const WEIGHT_BIAS = 2.4

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, Math.round(value)))
}

/** 1~45 범위의 중복 없는 정수만 남긴다 */
function sanitizeNumbers(values: number[]): number[] {
  const seen = new Set<number>()
  const result: number[] = []
  for (const value of values) {
    const num = Math.trunc(value)
    if (!Number.isInteger(num) || num < 1 || num > LOTTO_MAX || seen.has(num)) continue
    seen.add(num)
    result.push(num)
  }
  return result.sort((a, b) => a - b)
}

/** 사용자 입력을 안전한 범위로 정규화 (신뢰할 수 없는 입력 방어) */
export function normalizeGeneratorOptions(options: GeneratorOptions): GeneratorOptions {
  const include = sanitizeNumbers(options.include).slice(0, LOTTO_PICK)
  const includeSet = new Set(include)
  const exclude = sanitizeNumbers(options.exclude).filter(n => !includeSet.has(n))

  const sumMin = clamp(options.sumMin, SUM_MIN_POSSIBLE, SUM_MAX_POSSIBLE)
  const sumMax = clamp(options.sumMax, SUM_MIN_POSSIBLE, SUM_MAX_POSSIBLE)

  return {
    games: clamp(options.games, 1, 5),
    strategy: options.strategy,
    include,
    exclude,
    oddEven: options.oddEven,
    highLow: options.highLow,
    sumMin: Math.min(sumMin, sumMax),
    sumMax: Math.max(sumMin, sumMax),
    maxConsecutive: clamp(options.maxConsecutive, 1, CONSECUTIVE_UNLIMITED),
    minZones: clamp(options.minZones, 1, 5),
    avoidPastWinning: options.avoidPastWinning,
  }
}

/**
 * 조합 생성 전에 논리적으로 불가능한 조건을 찾아낸다.
 * 반환된 메시지가 있으면 UI에서 생성을 막고 그대로 노출한다.
 */
export function validateGeneratorOptions(options: GeneratorOptions): string[] {
  const opts = normalizeGeneratorOptions(options)
  const errors: string[] = []

  const available = LOTTO_MAX - opts.exclude.length - opts.include.length
  if (available < LOTTO_PICK - opts.include.length) {
    errors.push('제외한 번호가 너무 많아 6개를 뽑을 수 없습니다. 제외 번호를 줄여 주세요.')
  }

  const remaining = LOTTO_PICK - opts.include.length
  const fixedMetrics = opts.include.length >= 2 ? analyzeCombination(opts.include) : null

  const oddTarget = ODD_TARGET[opts.oddEven]
  if (oddTarget !== null) {
    const fixedOdd = opts.include.filter(n => n % 2 === 1).length
    const fixedEven = opts.include.length - fixedOdd
    if (fixedOdd > oddTarget || fixedEven > LOTTO_PICK - oddTarget) {
      errors.push(`고정 번호의 홀짝 구성이 "홀짝 ${opts.oddEven}" 조건과 충돌합니다.`)
    }
  }

  const lowTarget = LOW_TARGET[opts.highLow]
  if (lowTarget !== null) {
    const fixedLow = opts.include.filter(n => n <= 22).length
    const fixedHigh = opts.include.length - fixedLow
    if (fixedLow > lowTarget || fixedHigh > LOTTO_PICK - lowTarget) {
      errors.push(`고정 번호의 고저 구성이 "고저 ${opts.highLow}" 조건과 충돌합니다.`)
    }
  }

  // 고정 번호만으로 이미 합계 범위를 벗어나는지 (남은 자리의 최소·최대 합을 더해 판단)
  const fixedSum = opts.include.reduce((a, b) => a + b, 0)
  const minRest = (remaining * (remaining + 1)) / 2
  const maxRest = remaining * LOTTO_MAX - (remaining * (remaining - 1)) / 2
  if (fixedSum + minRest > opts.sumMax || fixedSum + maxRest < opts.sumMin) {
    errors.push(`고정 번호 합계(${fixedSum})로는 합계 ${opts.sumMin}~${opts.sumMax} 조건을 만족할 수 없습니다.`)
  }

  if (fixedMetrics && fixedMetrics.maxConsecutive > opts.maxConsecutive) {
    errors.push(`고정 번호에 이미 ${fixedMetrics.maxConsecutive}연속 번호가 있어 연속 제한 조건과 충돌합니다.`)
  }
  // 남은 자리로 구간을 더 채울 수 있으므로 고정 번호가 6개일 때만 구간 조건을 확정 판단한다
  if (remaining === 0 && fixedMetrics && fixedMetrics.filledZones < opts.minZones) {
    errors.push(`고정 번호만으로는 최소 ${opts.minZones}개 구간 분산 조건을 만족할 수 없습니다.`)
  }

  return errors
}

/** 전략별 번호 가중치 (인덱스 = 번호, 값 ≥ 1 — 어떤 번호도 완전히 배제하지 않는다) */
export function buildWeights(strategy: PoolStrategy, stats: LottoStats | null | undefined): number[] {
  const weights = new Array<number>(LOTTO_MAX + 1).fill(1)
  if (!stats || strategy === 'balanced' || strategy === 'uniform') return weights

  const values = stats.numbers.map(stat => (strategy === 'overdue' ? stat.gap : stat.recentCount))
  const min = Math.min(...values)
  const span = Math.max(...values) - min
  if (span === 0) return weights

  stats.numbers.forEach((stat, index) => {
    const normalized = (values[index]! - min) / span
    const bias = strategy === 'cold' ? 1 - normalized : normalized
    weights[stat.number] = 1 + WEIGHT_BIAS * bias
  })

  return weights
}

/** 가중 비복원 추출 — 고정 번호 + 후보 풀에서 나머지를 뽑는다. O(뽑을 개수 × 풀 크기) */
function sampleCombination(fixed: number[], candidates: number[], weights: number[]): number[] {
  const pool = [...candidates]
  const picked = [...fixed]
  let total = 0
  for (const num of pool) total += weights[num]!

  const need = LOTTO_PICK - fixed.length
  for (let i = 0; i < need; i++) {
    let target = secureRandomFloat() * total
    let index = 0
    for (; index < pool.length - 1; index++) {
      target -= weights[pool[index]!]!
      if (target <= 0) break
    }

    const chosen = pool[index]!
    picked.push(chosen)
    total -= weights[chosen]!
    pool[index] = pool[pool.length - 1]!
    pool.pop()
  }

  return picked.sort((a, b) => a - b)
}

/** 조건 위반 개수 — 0이면 모든 필터 통과 */
function countViolations(
  numbers: number[],
  opts: GeneratorOptions,
  pastRanks: ReadonlySet<number> | null,
): number {
  const m = analyzeCombination(numbers)
  let violations = 0

  if (m.sum < opts.sumMin || m.sum > opts.sumMax) violations++

  const oddTarget = ODD_TARGET[opts.oddEven]
  if (oddTarget !== null && m.oddCount !== oddTarget) violations++

  const lowTarget = LOW_TARGET[opts.highLow]
  if (lowTarget !== null && m.lowCount !== lowTarget) violations++

  if (m.maxConsecutive > opts.maxConsecutive) violations++
  if (m.filledZones < opts.minZones) violations++
  if (pastRanks && pastRanks.has(combinationRank(numbers))) violations++

  return violations
}

/** 이미 생성된 게임들과 겹치는 번호 개수 */
function countOverlap(numbers: number[], previous: GeneratedGame[]): number {
  let overlap = 0
  for (const game of previous) {
    for (const num of numbers) {
      if (game.numbers.includes(num)) overlap++
    }
  }
  return overlap
}

/** 위반 수를 줄이는 방향으로 1개씩 교체 (hill-climbing). 고정 번호는 건드리지 않는다 */
function repair(
  start: number[],
  fixedSet: ReadonlySet<number>,
  candidates: number[],
  opts: GeneratorOptions,
  pastRanks: ReadonlySet<number> | null,
): number[] {
  let current = [...start]
  let currentViolations = countViolations(current, opts, pastRanks)

  for (let round = 0; round < 10 && currentViolations > 0; round++) {
    let improved = false

    for (let slot = 0; slot < current.length; slot++) {
      if (fixedSet.has(current[slot]!)) continue

      for (const candidate of candidates) {
        if (current.includes(candidate)) continue

        const next = [...current]
        next[slot] = candidate
        next.sort((a, b) => a - b)

        const violations = countViolations(next, opts, pastRanks)
        if (violations < currentViolations) {
          current = next
          currentViolations = violations
          improved = true
        }
      }
    }

    if (!improved) break
  }

  return current
}

function toGame(numbers: number[], score: number, relaxed: boolean): GeneratedGame {
  const metrics = analyzeCombination(numbers)
  return { numbers, metrics, reasons: describeCombination(metrics), score, relaxed }
}

/**
 * 옵션을 만족하는 조합을 게임 수만큼 생성한다.
 * 구조적으로 불가능한 옵션이면 빈 배열을 반환하므로 호출 전에
 * `validateGeneratorOptions`로 사용자에게 이유를 안내해야 한다.
 */
export function generateGames(options: GeneratorOptions, context: GeneratorContext = {}): GeneratedGame[] {
  const opts = normalizeGeneratorOptions(options)
  const fixed = opts.include
  const fixedSet = new Set(fixed)
  const excluded = new Set(opts.exclude)

  const candidates: number[] = []
  for (let num = 1; num <= LOTTO_MAX; num++) {
    if (excluded.has(num) || fixedSet.has(num)) continue
    candidates.push(num)
  }
  if (candidates.length < LOTTO_PICK - fixed.length) return []

  const weights = buildWeights(opts.strategy, context.stats)
  const latestNumbers = context.latestNumbers ?? []
  const pastRanks =
    opts.avoidPastWinning && context.stats ? new Set(context.stats.pastCombinationRanks) : null

  const games: GeneratedGame[] = []
  const usedKeys = new Set<string>()

  for (let gameIndex = 0; gameIndex < opts.games; gameIndex++) {
    let best: number[] | null = null
    let bestScore = Number.NEGATIVE_INFINITY
    let lastValid: number[] | null = null
    let fallback: number[] | null = null
    let fallbackViolations = Number.POSITIVE_INFINITY
    let validCount = 0

    for (let attempt = 0; attempt < MAX_SAMPLES_PER_GAME; attempt++) {
      const numbers = sampleCombination(fixed, candidates, weights)
      const violations = countViolations(numbers, opts, pastRanks)

      if (violations > 0) {
        if (violations < fallbackViolations) {
          fallback = numbers
          fallbackViolations = violations
        }
        continue
      }

      lastValid = numbers
      if (usedKeys.has(numbers.join(','))) continue

      // 무작위 지터를 섞어 같은 점수대 조합이 매번 똑같이 뽑히지 않게 한다
      const score =
        scorePattern(numbers, latestNumbers) - OVERLAP_PENALTY * countOverlap(numbers, games) + secureRandomInt(3)

      if (score > bestScore) {
        best = numbers
        bestScore = score
      }
      if (++validCount >= ENOUGH_VALID_CANDIDATES) break
    }

    if (best) {
      usedKeys.add(best.join(','))
      games.push(toGame(best, bestScore, false))
      continue
    }

    // 유효 조합을 찾았지만 앞선 게임과 중복뿐인 경우 (고정 번호 6개 등) — 중복을 허용한다
    if (lastValid) {
      games.push(toGame(lastValid, scorePattern(lastValid, latestNumbers), false))
      continue
    }

    // 조건을 만족하는 조합을 못 찾음 → 위반 수를 최소화한 조합으로 복구하고 완화 사실을 표시
    const seed = fallback ?? sampleCombination(fixed, candidates, weights)
    const repaired = repair(seed, fixedSet, candidates, opts, pastRanks)
    usedKeys.add(repaired.join(','))
    games.push(
      toGame(repaired, scorePattern(repaired, latestNumbers), countViolations(repaired, opts, pastRanks) > 0),
    )
  }

  return games
}
