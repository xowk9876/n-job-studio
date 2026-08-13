/**
 * 조합 패턴 분석 및 통계적 적합도 평가.
 *
 * NOTE: 로또 6/45의 1등 확률은 모든 조합이 1/8,145,060로 동일하다.
 *       여기서 계산하는 점수는 "역대 1등 조합에서 흔히 관측된 분포에 얼마나 가까운가"를
 *       나타내는 지표일 뿐이며, 당첨 확률을 높이거나 당첨을 보장하지 않는다.
 *       극단적 조합(예: 1·2·3·4·5·6)을 피해 심리적 만족도를 높이는 용도다.
 */

import { LOTTO_MAX } from './stats'

/** 1~45 중 소수 */
const LOTTO_PRIMES: ReadonlySet<number> = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43])

/** 구간 경계 — 동행복권 공식 볼 색상 구간과 동일 (1-10 / 11-20 / 21-30 / 31-40 / 41-45) */
export const ZONE_COUNT = 5

/** 저구간/고구간 경계 — 1~22 / 23~45 */
const LOW_MAX = 22

export type CombinationMetrics = {
  /** 6개 번호 합계 */
  sum: number
  oddCount: number
  evenCount: number
  /** 1~22 개수 */
  lowCount: number
  /** 23~45 개수 */
  highCount: number
  /** 5개 구간별 개수 */
  zoneCounts: number[]
  /** 번호가 분포한 구간 수 (1~5) */
  filledZones: number
  /** 한 구간에 몰린 최대 개수 */
  maxZoneConcentration: number
  /** 최장 연속 번호 길이 (1이면 연속 없음) */
  maxConsecutive: number
  /** 연속 번호 쌍 개수 */
  consecutivePairs: number
  /** AC값 (Arithmetic Complexity) — 두 수 차이의 서로 다른 값 개수 - 5, 최대 10 */
  ac: number
  primeCount: number
  /** 끝수(일의 자리) 합 */
  lastDigitSum: number
  /** 같은 끝수가 겹친 최대 개수 */
  maxSameLastDigit: number
}

/** 정렬된 6개 번호의 분포 지표를 한 번에 계산 — O(1) (고정 크기 루프) */
export function analyzeCombination(numbers: number[]): CombinationMetrics {
  const nums = [...numbers].sort((a, b) => a - b)

  let sum = 0
  let oddCount = 0
  let lowCount = 0
  let primeCount = 0
  let lastDigitSum = 0

  const zoneCounts = new Array<number>(ZONE_COUNT).fill(0)
  const lastDigitCounts = new Array<number>(10).fill(0)

  for (const num of nums) {
    sum += num
    if (num % 2 === 1) oddCount++
    if (num <= LOW_MAX) lowCount++
    if (LOTTO_PRIMES.has(num)) primeCount++

    const digit = num % 10
    lastDigitSum += digit
    lastDigitCounts[digit]! += 1

    zoneCounts[Math.min(Math.ceil(num / 10), ZONE_COUNT) - 1]! += 1
  }

  let maxConsecutive = 1
  let run = 1
  let consecutivePairs = 0
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]! + 1) {
      run++
      consecutivePairs++
      if (run > maxConsecutive) maxConsecutive = run
    } else {
      run = 1
    }
  }

  const diffs = new Set<number>()
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      diffs.add(nums[j]! - nums[i]!)
    }
  }

  return {
    sum,
    oddCount,
    evenCount: nums.length - oddCount,
    lowCount,
    highCount: nums.length - lowCount,
    zoneCounts,
    filledZones: zoneCounts.filter(c => c > 0).length,
    maxZoneConcentration: Math.max(...zoneCounts),
    maxConsecutive,
    consecutivePairs,
    ac: diffs.size - 5,
    primeCount,
    lastDigitSum,
    maxSameLastDigit: Math.max(...lastDigitCounts),
  }
}

/**
 * 관측된 1등 조합 분포에 가까울수록 높은 점수를 반환한다.
 * 평가 항목 — 합계 · 홀짝 · 구간 분포 · 연속 · 끝수 · 고저 · AC값 · 소수 비율 · 직전 회차 오버랩
 */
export function scorePattern(numbers: number[], latestNumbers: number[] = []): number {
  const m = analyzeCombination(numbers)
  let score = 0

  if (m.sum >= 115 && m.sum <= 175) score += 28
  else if (m.sum >= 100 && m.sum <= 195) score += 14
  else score -= 25

  if (m.oddCount === 3) score += 24
  else if (m.oddCount === 2 || m.oddCount === 4) score += 20
  else if (m.oddCount === 1 || m.oddCount === 5) score += 6
  else score -= 18

  if (m.filledZones >= 4) score += 22
  else if (m.filledZones === 3) score += 12
  else score -= 18

  if (m.maxConsecutive <= 2) score += 12
  else if (m.maxConsecutive === 3) score += 4
  else score -= 24

  if (m.maxSameLastDigit <= 2) score += 8
  else score -= 10

  if (m.maxZoneConcentration <= 2) score += 10
  else if (m.maxZoneConcentration === 3) score += 3
  else score -= 12

  // 직전 회차와 1~2개 겹치는 패턴이 통계적으로 가장 흔하다
  const latestOverlap = latestNumbers.length > 0 ? numbers.filter(n => latestNumbers.includes(n)).length : 0
  if (latestOverlap >= 1 && latestOverlap <= 2) score += 6
  else if (latestOverlap >= 4) score -= 14

  // 고저 분포 (1~22 / 23~45) — 역대 1등 통계상 3:3 · 4:2 · 2:4가 대부분
  if (m.lowCount === 3) score += 14
  else if (m.lowCount === 2 || m.lowCount === 4) score += 10
  else if (m.lowCount === 1 || m.lowCount === 5) score += 2
  else score -= 14

  // AC값 — 1등 통계상 7~10 구간의 비중이 가장 높다
  if (m.ac >= 7 && m.ac <= 10) score += 14
  else if (m.ac === 5 || m.ac === 6) score += 6
  else score -= 8

  if (m.primeCount >= 1 && m.primeCount <= 3) score += 8
  else if (m.primeCount === 4) score += 2
  else score -= 4

  return score
}

/** 번호 배열이 1~45 범위의 중복 없는 정수인지 검사 */
export function isValidNumberSet(numbers: number[], size = 6): boolean {
  if (numbers.length !== size) return false
  const unique = new Set(numbers)
  if (unique.size !== size) return false
  return numbers.every(n => Number.isInteger(n) && n >= 1 && n <= LOTTO_MAX)
}
