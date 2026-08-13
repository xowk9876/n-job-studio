/**
 * 저장소에 커밋된 동행복권 전 회차 스냅샷 로더 (서버 전용).
 *
 * `data/lotto-history.json`은 약 81KB이므로 클라이언트 컴포넌트에서 import 하면 안 된다.
 * API Route Handler(`app/api/lotto/*`)에서만 사용하고, 브라우저에는 집계된 통계만 내려보낸다.
 *
 * 갱신: `node scripts/fetch-lotto-history.mjs`
 */

import historyJson from '@/data/lotto-history.json'
import type { LottoRoundResult } from './types'

type SnapshotRow = (number | string)[]

const snapshot = historyJson as {
  source: string
  generatedAt: string
  latestRound: number
  latestDrawDate: string
  draws: SnapshotRow[]
}

/** [round, YYYYMMDD, n1..n6, bonus, 1등당첨자수, 1등당첨금, 회차판매금액] */
function toRoundResult(row: SnapshotRow): LottoRoundResult {
  const raw = row.map(Number)
  const ymd = String(row[1])

  return {
    round: raw[0]!,
    drawDate: `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`,
    numbers: raw.slice(2, 8) as number[],
    bonusNumber: raw[8]!,
    firstWinnerCount: raw[9]!,
    firstPrizeAmount: raw[10]!,
    totalSalesAmount: raw[11]!,
    origin: 'snapshot',
  }
}

/** 제1회부터 스냅샷 최신 회차까지 오름차순 */
export const SNAPSHOT_DRAWS: readonly LottoRoundResult[] = snapshot.draws.map(toRoundResult)

export const SNAPSHOT_LATEST_ROUND = snapshot.latestRound
export const SNAPSHOT_GENERATED_AT = snapshot.generatedAt
export const SNAPSHOT_SOURCE = snapshot.source

/** 스냅샷에서 특정 회차 조회 — 범위를 벗어나면 null */
export function getSnapshotRound(round: number): LottoRoundResult | null {
  if (!Number.isInteger(round) || round < 1 || round > SNAPSHOT_LATEST_ROUND) return null
  // 회차가 1부터 빈틈 없이 연속임은 수집 스크립트에서 검증하므로 인덱스로 직접 접근한다
  return SNAPSHOT_DRAWS[round - 1] ?? null
}
