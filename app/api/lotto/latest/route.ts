import { NextResponse } from 'next/server'

import { fetchLatestRound } from '@/lib/lotto/dhlottery'
import { getSnapshotRound, SNAPSHOT_LATEST_ROUND } from '@/lib/lotto/history'

/**
 * 최신 회차 당첨번호.
 *
 * 동행복권 실시간 조회를 우선하고, 외부 장애 시에는 저장소에 커밋된 정적 스냅샷으로
 * 폴백해 페이지가 빈 화면이 되지 않도록 한다. 두 경로 모두 실패하면 502를 반환한다.
 */

export const dynamic = 'force-dynamic'

export async function GET() {
  const live = await fetchLatestRound()

  if (live) {
    return NextResponse.json(live, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
    })
  }

  const snapshot = getSnapshotRound(SNAPSHOT_LATEST_ROUND)
  if (snapshot) {
    return NextResponse.json(snapshot, {
      // 폴백 응답은 짧게만 캐시해 외부 API 복구 시 빠르게 최신 데이터로 전환한다
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  }

  return NextResponse.json(
    { error: '당첨번호를 조회할 수 없습니다.' },
    { status: 502, headers: { 'Cache-Control': 'no-store' } },
  )
}
