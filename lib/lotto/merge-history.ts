import type { LottoDataOrigin, LottoRoundResult } from './types'

/** 중간 회차가 빠지면 기존의 완전한 스냅샷으로 집계한다. 중복은 회차별로 제거한다. */
export function mergeCompleteHistory(snapshot: readonly LottoRoundResult[], newer: readonly LottoRoundResult[], latest: LottoRoundResult | null): {
  draws: LottoRoundResult[]; origin: LottoDataOrigin; updateIncomplete: boolean; latestKnownRound: number
} {
  const last = snapshot.at(-1)?.round ?? 0
  const fallback = { draws: [...snapshot], origin: 'snapshot' as const, updateIncomplete: true, latestKnownRound: Math.max(last, latest?.round ?? 0) }
  if (!latest || latest.round < last) return fallback
  if (latest.round === last) return { ...fallback, origin: 'live', updateIncomplete: false }
  const indexed = new Map(newer.filter(draw => draw.round > last && draw.round <= latest.round).map(draw => [draw.round, draw]))
  indexed.set(latest.round, latest)
  const extension: LottoRoundResult[] = []
  // 수집 상한보다 큰 구간은 요청을 늘리는 대신 스냅샷 갱신이 필요하다고 표시한다.
  if (latest.round - last > 60) return fallback
  for (let round = last + 1; round <= latest.round; round++) {
    const draw = indexed.get(round)
    if (!draw) return fallback
    extension.push(draw)
  }
  return { draws: [...snapshot, ...extension], origin: 'live', updateIncomplete: false, latestKnownRound: latest.round }
}
