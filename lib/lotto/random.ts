/** Web Crypto CSPRNG + rejection sampling (모듈러 바이어스 제거) */
export function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) throw new RangeError('maxExclusive must be positive')
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1)
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive
    let r: number
    do {
      crypto.getRandomValues(arr)
      r = arr[0]!
    } while (r >= limit)
    return r % maxExclusive
  }
  return Math.floor(Math.random() * maxExclusive)
}

/** Fisher-Yates — 1~45 중 6개 균등 무작위 */
export function fisherYatesPick6(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1)
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  return pool.slice(0, 6).sort((a, b) => a - b)
}
