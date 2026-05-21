import { fisherYatesPick6, secureRandomInt } from './random'

export type LottoPick = {
  numbers: number[]
}

/** 관측된 1등 조합 분포에서 자주 나오는 특성 (합계·홀짝·구간 등) */
export function scorePattern(nums: number[], latestNumbers: number[] = []): number {
  let score = 0
  const sum = nums.reduce((a, b) => a + b, 0)
  if (sum >= 115 && sum <= 175) score += 28
  else if (sum >= 100 && sum <= 195) score += 14
  else score -= 25

  const oddCount = nums.filter(n => n % 2 === 1).length
  if (oddCount === 3) score += 24
  else if (oddCount === 2 || oddCount === 4) score += 20
  else if (oddCount === 1 || oddCount === 5) score += 6
  else score -= 18

  const zones = new Set(nums.map(n => Math.ceil(n / 10)))
  if (zones.size >= 4) score += 22
  else if (zones.size === 3) score += 12
  else score -= 18

  let maxConsecutive = 1
  let curr = 1
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]! + 1) {
      curr++
      maxConsecutive = Math.max(maxConsecutive, curr)
    } else curr = 1
  }
  if (maxConsecutive <= 2) score += 12
  else if (maxConsecutive === 3) score += 4
  else score -= 24

  const lastDigitCounts = new Map<number, number>()
  nums.forEach(n => lastDigitCounts.set(n % 10, (lastDigitCounts.get(n % 10) || 0) + 1))
  const maxSameLastDigit = Math.max(...lastDigitCounts.values())
  if (maxSameLastDigit <= 2) score += 8
  else score -= 10

  const colorZones = new Map<string, number>()
  nums.forEach(n => {
    const color = n <= 10 ? 'y' : n <= 20 ? 'b' : n <= 30 ? 'r' : n <= 40 ? 'g' : 'gr'
    colorZones.set(color, (colorZones.get(color) || 0) + 1)
  })
  const maxSameColor = Math.max(...colorZones.values())
  if (maxSameColor <= 2) score += 10
  else if (maxSameColor === 3) score += 3
  else score -= 12

  const latestOverlap =
    latestNumbers.length > 0 ? nums.filter(n => latestNumbers.includes(n)).length : 0
  if (latestOverlap >= 1 && latestOverlap <= 2) score += 6
  else if (latestOverlap >= 4) score -= 14

  return score
}

/** scorePattern 이론상 하한·상한 (정규화용) */
const SCORE_FLOOR = -95
const SCORE_CEIL = 110

export function patternScoreToPercent(score: number): number {
  const clamped = Math.max(SCORE_FLOOR, Math.min(SCORE_CEIL, score))
  const raw = ((clamped - SCORE_FLOOR) / (SCORE_CEIL - SCORE_FLOOR)) * 100
  return Math.round(raw)
}

function passesHardFilters(nums: number[]): boolean {
  const sum = nums.reduce((a, b) => a + b, 0)
  if (sum < 100 || sum > 195) return false
  const odd = nums.filter(n => n % 2 === 1).length
  if (odd === 0 || odd === 6) return false
  if (new Set(nums.map(n => Math.ceil(n / 10))).size < 3) return false
  return true
}

/** 1개 번호 교체로 점수 개선 (hill-climb) */
function refineBySwap(nums: number[], latestNumbers: number[]): number[] {
  let current = [...nums]
  let currentScore = scorePattern(current, latestNumbers)

  for (let round = 0; round < 8; round++) {
    let improved = false
    for (let i = 0; i < 6; i++) {
      for (let candidate = 1; candidate <= 45; candidate++) {
        if (current.includes(candidate)) continue
        const next = [...current]
        next[i] = candidate
        next.sort((a, b) => a - b)
        if (!passesHardFilters(next)) continue
        const nextScore = scorePattern(next, latestNumbers)
        if (nextScore > currentScore) {
          current = next
          currentScore = nextScore
          improved = true
        }
      }
    }
    if (!improved) break
  }
  return current
}

const OPTIMIZATION_ROUNDS = 480

/**
 * 역대 당첨 번호 통계 패턴에 최대한 맞춘 6수 추천.
 * 6/45 모든 조합의 1등 확률은 동일하며, 이 함수는 당첨을 보장하지 않습니다.
 */
export function generateOptimizedPick(latestNumbers: number[] = []): LottoPick {
  let best = fisherYatesPick6()
  let bestScore = scorePattern(best, latestNumbers)

  for (let attempt = 0; attempt < OPTIMIZATION_ROUNDS; attempt++) {
    const nums = fisherYatesPick6()
    if (!passesHardFilters(nums)) continue
    const score = scorePattern(nums, latestNumbers) + secureRandomInt(3)
    if (score > bestScore) {
      best = nums
      bestScore = score
    }
  }

  if (!passesHardFilters(best)) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const nums = fisherYatesPick6()
      if (!passesHardFilters(nums)) continue
      const score = scorePattern(nums, latestNumbers)
      if (score > bestScore) {
        best = nums
        bestScore = score
      }
    }
  }

  const refined = refineBySwap(best, latestNumbers)

  return { numbers: refined }
}

export function generateOptimizedGames(
  count: number,
  latestNumbers: number[] = [],
): LottoPick[] {
  const used = new Set<string>()
  const games: LottoPick[] = []

  for (let i = 0; i < count; i++) {
    let pick = generateOptimizedPick(latestNumbers)
    let guard = 0
    while (used.has(pick.numbers.join(',')) && guard < 40) {
      pick = generateOptimizedPick(latestNumbers)
      guard++
    }
    used.add(pick.numbers.join(','))
    games.push(pick)
  }
  return games
}
