import { NextResponse } from 'next/server'

import { fetchRound } from '@/lib/lotto/dhlottery'
import { getSnapshotRound, SNAPSHOT_LATEST_ROUND } from '@/lib/lotto/history'
import { checkRateLimit, getClientKey } from '@/lib/lotto/rate-limit'
import { fromIsoDate, FIRST_DRAW_DATE, roundOnOrBefore } from '@/lib/lotto/schedule'

/**
 * 특정 회차 당첨번호 조회 — `?round=1236` 또는 `?date=2026-08-08`
 *
 * 날짜로 조회하면 그 날짜까지 추첨이 끝난 가장 가까운 회차로 매핑한다.
 * 동행복권 실시간 조회를 우선하고, 실패하면 저장소에 커밋된 정적 스냅샷으로 폴백한다.
 */

export const dynamic = 'force-dynamic'

const RATE_LIMIT = 60
const RATE_WINDOW_MS = 60_000

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
}

export async function GET(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    `lotto-round:${getClientKey(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  )
  if (!allowed) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  const params = new URL(request.url).searchParams
  const roundParam = params.get('round')
  const dateParam = params.get('date')

  let round: number
  let matchedFromDate = false

  if (dateParam) {
    const date = fromIsoDate(dateParam)
    if (!date) return badRequest('날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)')

    round = roundOnOrBefore(date)
    if (round < 1) return badRequest(`제1회 추첨일(${FIRST_DRAW_DATE}) 이후 날짜를 선택해 주세요.`)
    matchedFromDate = true
  } else if (roundParam) {
    if (!/^\d{1,5}$/.test(roundParam)) return badRequest('회차는 1 이상의 정수로 입력해 주세요.')
    round = Number(roundParam)
    if (round < 1) return badRequest('회차는 1 이상의 정수로 입력해 주세요.')
  } else {
    return badRequest('round 또는 date 파라미터가 필요합니다.')
  }

  const snapshot = getSnapshotRound(round)

  // 스냅샷 범위 안이면 확실히 추첨이 끝난 회차 → 라이브 실패 시에도 응답할 수 있다
  const live = await fetchRound(round)
  const result = live ?? snapshot

  if (!result) {
    return NextResponse.json(
      {
        error: `${round}회는 아직 추첨되지 않았거나 조회할 수 없습니다.`,
        latestKnownRound: SNAPSHOT_LATEST_ROUND,
      },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  return NextResponse.json(
    { ...result, matchedFromDate },
    {
      headers: {
        // 지난 회차 결과는 변하지 않으므로 길게 캐시한다
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
