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

/** [0, 1) 구간 균등 실수 — 가중 표본 추출(weighted sampling)용 */
export function secureRandomFloat(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    return arr[0]! / 0x100000000
  }
  return Math.random()
}
