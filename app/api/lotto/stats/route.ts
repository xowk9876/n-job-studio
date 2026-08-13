import { NextResponse } from 'next/server'

import { fetchLatestRound, fetchRoundsAfter } from '@/lib/lotto/dhlottery'
import { SNAPSHOT_DRAWS, SNAPSHOT_LATEST_ROUND } from '@/lib/lotto/history'
import { checkRateLimit, getClientKey } from '@/lib/lotto/rate-limit'
import { buildLottoStats, DEFAULT_RECENT_WINDOW } from '@/lib/lotto/stats'
import type { LottoRoundResult } from '@/lib/lotto/types'

/**
 * 역대 당첨번호 출현 통계 — 번호 생성기의 핫/콜드/장기 미출현 가중치 및
 * 과거 1등 조합 회피에 사용한다.
 *
 * 정적 스냅샷(`data/lotto-history.json`)을 기준으로 집계하고,
 * 스냅샷 생성 이후 추첨된 회차가 있으면 동행복권 실시간 조회로 병합한다.
 */

export const dynamic = 'force-dynamic'

const RATE_LIMIT = 60
const RATE_WINDOW_MS = 60_000
const MAX_RECENT_WINDOW = 500

export async function GET(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    `lotto-stats:${getClientKey(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  )
  if (!allowed) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  const windowParam = new URL(request.url).searchParams.get('window')
  const recentWindow =
    windowParam && /^\d{1,3}$/.test(windowParam)
      ? Math.min(Math.max(Number(windowParam), 10), MAX_RECENT_WINDOW)
      : DEFAULT_RECENT_WINDOW

  // 라이브 최신 회차를 먼저 확인해 스냅샷이 최신인지 검증하고, 뒤처진 구간만 병합한다
  const liveLatest = await fetchLatestRound()
  const newer =
    liveLatest && liveLatest.round > SNAPSHOT_LATEST_ROUND
      ? await fetchRoundsAfter(SNAPSHOT_LATEST_ROUND, liveLatest)
      : []

  const draws: LottoRoundResult[] = [...SNAPSHOT_DRAWS, ...newer.slice().reverse()]

  const stats = buildLottoStats(draws, {
    recentWindow,
    // 'live' = 동행복권 조회로 최신 회차까지 확인됨 · 'snapshot' = 조회 실패로 스냅샷 기준
    origin: liveLatest ? 'live' : 'snapshot',
  })

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  })
}
