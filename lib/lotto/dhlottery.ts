/**
 * 동행복권(dhlottery.co.kr) 로또 6/45 당첨번호 조회 클라이언트 (서버 전용).
 *
 * 브라우저에서 직접 호출하면 CORS로 차단되므로 Route Handler에서만 사용한다.
 *
 * 실측 확인한 공식 엔드포인트 (2026-08 기준):
 *  - 최신 회차 1건   GET /lt645/selectPstLt645Info.do
 *  - 회차 기준 10건  GET /lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd={회차}
 *
 * 구 엔드포인트 `common.do?method=getLottoNumber`는 사이트 개편으로 JSON이 아닌
 * HTML을 반환하므로 더 이상 사용할 수 없다.
 */

import type { LottoRoundResult } from './types'

const ORIGIN = 'https://www.dhlottery.co.kr'
const LATEST_URL = `${ORIGIN}/lt645/selectPstLt645Info.do`
const ROUND_URL = `${ORIGIN}/lt645/selectPstLt645InfoNew.do`

const REQUEST_HEADERS: Record<string, string> = {
  accept: 'application/json, text/javascript, */*; q=0.01',
  'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  referer: `${ORIGIN}/lt645/result`,
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest',
}

/** 외부 응답 지연이 페이지 로딩을 잡아먹지 않도록 상한을 둔다 */
const REQUEST_TIMEOUT_MS = 6000

type DhlotteryItem = {
  ltEpsd?: unknown
  ltRflYmd?: unknown
  tm1WnNo?: unknown
  tm2WnNo?: unknown
  tm3WnNo?: unknown
  tm4WnNo?: unknown
  tm5WnNo?: unknown
  tm6WnNo?: unknown
  bnsWnNo?: unknown
  rnk1WnNope?: unknown
  rnk1WnAmt?: unknown
  wholEpsdSumNtslAmt?: unknown
}

type DhlotteryResponse = {
  data?: { list?: DhlotteryItem[] }
}

function toDrawDate(rawDate: unknown): string | null {
  const value = String(rawDate ?? '')
  if (!/^\d{8}$/.test(value)) return null
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
}

/** 외부 응답을 신뢰하지 않고 회차·번호 범위·중복까지 전부 검증한 뒤 변환한다 */
function toRoundResult(item: DhlotteryItem | undefined): LottoRoundResult | null {
  if (!item || typeof item !== 'object') return null

  const round = Number(item.ltEpsd)
  const drawDate = toDrawDate(item.ltRflYmd)
  if (!Number.isInteger(round) || round < 1 || !drawDate) return null

  const numbers = [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo].map(Number)
  const bonusNumber = Number(item.bnsWnNo)
  const all = [...numbers, bonusNumber]

  if (new Set(all).size !== 7) return null
  if (!all.every(num => Number.isInteger(num) && num >= 1 && num <= 45)) return null

  return {
    round,
    drawDate,
    numbers: numbers.sort((a, b) => a - b),
    bonusNumber,
    firstWinnerCount: Number(item.rnk1WnNope) || 0,
    firstPrizeAmount: Number(item.rnk1WnAmt) || 0,
    // 총 판매금액은 wholEpsdSumNtslAmt다. rlvtEpsdSumNtslAmt는 261회부터 당첨금
    // 총액(판매액의 약 50%)이 담기므로 판매금액으로 쓰면 절반 값이 나온다.
    // (1회 3,681,782,000원 = 복권위원회 공식 최저 판매액 기록과 대조 확인)
    totalSalesAmount: Number(item.wholEpsdSumNtslAmt) || 0,
    origin: 'live',
  }
}

async function fetchList(url: string, revalidate: number): Promise<DhlotteryItem[]> {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate },
  })
  if (!response.ok) throw new Error(`동행복권 응답 오류 (HTTP ${response.status})`)

  const payload = (await response.json()) as DhlotteryResponse
  return payload.data?.list ?? []
}

/** 최신 회차 1건. 실패 시 null (호출부에서 정적 스냅샷으로 폴백) */
export async function fetchLatestRound(revalidate = 300): Promise<LottoRoundResult | null> {
  try {
    const list = await fetchList(LATEST_URL, revalidate)
    return toRoundResult(list[0])
  } catch {
    return null
  }
}

/**
 * 특정 회차 1건. 공식 API가 요청 회차 주변 10건을 함께 주므로 그중 정확히 일치하는 항목만 고른다.
 * 실패하거나 미추첨 회차면 null.
 */
export async function fetchRound(round: number, revalidate = 86400): Promise<LottoRoundResult | null> {
  if (!Number.isInteger(round) || round < 1) return null

  try {
    const list = await fetchList(`${ROUND_URL}?srchDir=center&srchLtEpsd=${round}`, revalidate)
    for (const item of list) {
      if (Number(item.ltEpsd) === round) return toRoundResult(item)
    }
    return null
  } catch {
    return null
  }
}

/**
 * `after` 회차 이후에 추첨된 회차들을 최신순으로 가져온다.
 * 정적 스냅샷 생성 이후 새로 추첨된 회차를 통계에 병합할 때 사용한다.
 */
export async function fetchRoundsAfter(
  after: number,
  latest: LottoRoundResult,
  limit = 60,
  revalidate = 300,
): Promise<LottoRoundResult[]> {
  if (latest.round <= after) return []

  const collected: LottoRoundResult[] = [latest]

  // 공식 API는 요청당 10건이므로, 누락 구간이 넓으면 여러 번 나눠 가져온다 (최대 8회 = 80회차)
  let cursor = latest.round
  for (let request = 0; request < 8 && cursor - 1 > after && collected.length < limit; request++) {
    let list: DhlotteryItem[]
    try {
      list = await fetchList(`${ROUND_URL}?srchDir=older&srchCursorLtEpsd=${cursor}`, revalidate)
    } catch {
      break
    }

    let lowest = cursor
    for (const item of list) {
      const result = toRoundResult(item)
      if (!result || result.round <= after) continue
      collected.push(result)
      lowest = Math.min(lowest, result.round)
    }

    if (lowest >= cursor) break
    cursor = lowest
  }

  return collected.sort((a, b) => b.round - a.round).slice(0, limit)
}
