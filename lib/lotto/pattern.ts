import { fisherYatesPick6, secureRandomInt } from './random'

export type LottoPick = {
  numbers: number[]
}

/** 1~45 중 소수 (당첨번호 통계 가중치용) */
const LOTTO_PRIMES: ReadonlySet<number> = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43])

/**
 * 관측된 1등 조합 분포에서 자주 나오는 특성에 가까울수록 높은 점수를 반환합니다.
 * 평가 항목 — 합계·홀짝·구간(zone)·연속·끝자리·색상영역·최근 회차 오버랩
 *           · 고저 분포(1~22/23~45) · AC값(Arithmetic Complexity) · 소수 비율
 *
 * NOTE: 로또 6/45의 모든 조합 1등 확률은 1/8,145,060로 동일하며,
 *       본 점수는 통계적 분포에 가까운 조합을 "추천"할 뿐 당첨을 보장하지 않습니다.
 */
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

  // 고저 분포 (1~22 / 23~45) — 역대 1등 통계상 3:3·4:2·2:4가 80%+
  const lowCount = nums.filter(n => n <= 22).length
  if (lowCount === 3) score += 14
  else if (lowCount === 2 || lowCount === 4) score += 10
  else if (lowCount === 1 || lowCount === 5) score += 2
  else score -= 14

  // AC값 (Arithmetic Complexity) — 모든 두 수 차이의 distinct 개수 - 5
  // 1등 통계상 7~10이 약 70%, 4 이하는 5% 미만
  const diffs = new Set<number>()
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      diffs.add(nums[j]! - nums[i]!)
    }
  }
  const ac = diffs.size - 5
  if (ac >= 7 && ac <= 10) score += 14
  else if (ac === 5 || ac === 6 || ac === 11 || ac === 12) score += 6
  else if (ac >= 13) score -= 4
  else score -= 8

  // 소수 비율 — 1등 통계 평균 1.8개, 0개나 5개 이상은 드묾
  const primeCount = nums.filter(n => LOTTO_PRIMES.has(n)).length
  if (primeCount >= 1 && primeCount <= 3) score += 8
  else if (primeCount === 4) score += 2
  else score -= 4

  return score
}

/**
 * scorePattern 이론상 하한·상한 (정규화용)
 *  베스트  = 28+24+22+12+8+10+6+14+14+8 = 146
 *  실용 워스트 = 기존 -95 + 신규 (-14 -8 -4) = -121
 */
const SCORE_FLOOR = -121
const SCORE_CEIL = 146

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
