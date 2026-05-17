import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const LOTTO_API = 'https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do'

type DhlotteryLatestItem = {
  ltEpsd: number
  ltRflYmd: string
  tm1WnNo: number
  tm2WnNo: number
  tm3WnNo: number
  tm4WnNo: number
  tm5WnNo: number
  tm6WnNo: number
  bnsWnNo: number
  rnk1WnAmt: number
  rnk1WnNope: number
  rnk1SumWnAmt: number
}

type DhlotteryLatestResponse = {
  data?: {
    list?: DhlotteryLatestItem[]
  }
}

type LatestLottoResult = {
  round: number
  drawDate: string
  numbers: number[]
  bonusNumber: number
  firstPrizeAmount: number
  firstWinnerCount: number
  firstAccumulatedAmount: number
  source: string
  fetchedAt: string
}

function formatDrawDate(rawDate: string) {
  if (!/^\d{8}$/.test(rawDate)) return rawDate
  return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
}

function isValidResult(item: DhlotteryLatestItem | undefined): item is DhlotteryLatestItem {
  if (!item) return false

  const numbers = [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo, item.bnsWnNo]
  const uniqueNumbers = new Set(numbers)

  return (
    Number.isInteger(item.ltEpsd) &&
    uniqueNumbers.size === 7 &&
    numbers.every((num) => Number.isInteger(num) && num >= 1 && num <= 45)
  )
}

async function fetchLatestLottoResult(): Promise<LatestLottoResult | null> {
  const response = await fetch(LOTTO_API, {
    cache: 'no-store',
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      referer: 'https://www.dhlottery.co.kr/gameResult.do?method=byWin',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest',
    },
  })

  if (!response.ok) return null

  const data = (await response.json()) as DhlotteryLatestResponse
  const latest = data.data?.list?.[0]
  if (!isValidResult(latest)) return null

  return {
    round: latest.ltEpsd,
    drawDate: formatDrawDate(latest.ltRflYmd),
    numbers: [latest.tm1WnNo, latest.tm2WnNo, latest.tm3WnNo, latest.tm4WnNo, latest.tm5WnNo, latest.tm6WnNo].sort(
      (a, b) => a - b,
    ),
    bonusNumber: latest.bnsWnNo,
    firstPrizeAmount: latest.rnk1WnAmt,
    firstWinnerCount: latest.rnk1WnNope,
    firstAccumulatedAmount: latest.rnk1SumWnAmt,
    source: '동행복권 로또 6/45 최신 당첨번호 조회',
    fetchedAt: new Date().toISOString(),
  }
}

export async function GET() {
  try {
    const result = await fetchLatestLottoResult()

    if (result) {
      return NextResponse.json(result, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      })
    }

    return NextResponse.json(
      { error: '최근 로또 당첨번호를 찾지 못했습니다.' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json(
      { error: '동행복권 당첨번호 조회 중 오류가 발생했습니다.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
