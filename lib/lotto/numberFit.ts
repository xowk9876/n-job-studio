/** 번호별 패턴 기여도 → UI용 적합도 % (당첨 확률 아님) */

export type NumberFit = {
  number: number
  fitPercent: number
}

function pickSeed(nums: number[]): number {
  return nums.reduce((h, n) => (h * 31 + n) | 0, 17)
}

function seededJitter(seed: number, index: number, number: number): number {
  return (((seed + index * 97 + number * 13) * 1103515245) >>> 0) % 9
}

/** 한 번호가 이 6수 조합 안에서 패턴에 얼마나 기여하는지 (raw 점수) */
function scoreNumberContribution(n: number, all: number[], latestNumbers: number[]): number {
  let score = 42

  const zone = Math.ceil(n / 10)
  const zoneCount = all.filter(x => Math.ceil(x / 10) === zone).length
  if (zoneCount === 1) score += 22
  else if (zoneCount === 2) score += 10
  else score -= 14

  const oddCount = all.filter(x => x % 2 === 1).length
  const isOdd = n % 2 === 1
  if (oddCount === 3) score += isOdd ? 8 : 8
  else if (isOdd && oddCount < 3) score += 14
  else if (!isOdd && oddCount > 3) score += 14
  else if (isOdd && oddCount > 4) score -= 10
  else if (!isOdd && oddCount < 2) score -= 10

  if (n >= 17 && n <= 33) score += 16
  else if (n >= 11 && n <= 38) score += 7
  else score += 2

  if (latestNumbers.includes(n)) {
    const overlap = all.filter(x => latestNumbers.includes(x)).length
    if (overlap >= 1 && overlap <= 2) score += 12
    else if (overlap >= 4) score -= 16
    else score += 4
  }

  const lastDigit = n % 10
  const sameLast = all.filter(x => x % 10 === lastDigit).length
  if (sameLast === 1) score += 10
  else if (sameLast === 2) score += 3
  else score -= 12

  const hasPrev = all.includes(n - 1)
  const hasNext = all.includes(n + 1)
  if (hasPrev && hasNext) score -= 8
  else if (hasPrev || hasNext) score += 6

  const sum = all.reduce((a, b) => a + b, 0)
  const ideal = sum / 6
  const dist = Math.abs(n - ideal)
  if (dist <= 4) score += 12
  else if (dist <= 8) score += 5
  else score -= 4

  return score
}

/**
 * 6개 번호마다 서로 다른 적합도 % (58~97 구간, 조합 내 상대 정규화)
 */
export function computeNumberFits(numbers: number[], latestNumbers: number[] = []): NumberFit[] {
  const seed = pickSeed(numbers)
  const raw = numbers.map((n, index) => ({
    number: n,
    raw: scoreNumberContribution(n, numbers, latestNumbers) + seededJitter(seed, index, n),
  }))

  const min = Math.min(...raw.map(r => r.raw))
  const max = Math.max(...raw.map(r => r.raw))
  const span = max - min || 1

  const mapped = raw.map(r => ({
    number: r.number,
    fitPercent: Math.round(58 + ((r.raw - min) / span) * 39),
  }))

  // 동일 % 방지 — 인접 값이 같으면 ±1~2 조정 (58~97 유지)
  const sorted = [...mapped].sort((a, b) => b.fitPercent - a.fitPercent)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]!.fitPercent >= sorted[i - 1]!.fitPercent) {
      sorted[i]!.fitPercent = Math.max(58, sorted[i - 1]!.fitPercent - (1 + (i % 3)))
    }
  }

  const byNumber = new Map(sorted.map(s => [s.number, s.fitPercent]))
  return numbers.map(n => ({ number: n, fitPercent: byNumber.get(n) ?? 70 }))
}

export function averageFitPercent(fits: NumberFit[]): number {
  if (fits.length === 0) return 0
  return Math.round(fits.reduce((a, f) => a + f.fitPercent, 0) / fits.length)
}
