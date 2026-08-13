/**
 * 동행복권 로또 6/45 전 회차 당첨번호 스냅샷 생성 스크립트
 *
 * 사용법: node scripts/fetch-lotto-history.mjs
 * 출력:   data/lotto-history.json
 *
 * 통계(핫/콜드·미출현 기간)와 과거 회차 조회 폴백에 쓰이는 정적 스냅샷을 만든다.
 * 매 요청마다 외부 API를 124회 호출하는 것을 피하기 위해, 회차 데이터를 1회 수집해
 * 저장소에 커밋해 두고 런타임에는 최신 회차만 라이브로 병합한다.
 *
 * 공식 엔드포인트 (2026-08 기준 실측):
 *  - 최신 회차 1건:      GET /lt645/selectPstLt645Info.do
 *  - 회차 기준 10건:     GET /lt645/selectPstLt645InfoNew.do?srchDir=center&srchLtEpsd={회차}
 *  - 이전 방향 10건:     GET /lt645/selectPstLt645InfoNew.do?srchDir=older&srchCursorLtEpsd={회차}
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT_PATH = resolve(ROOT, 'data/lotto-history.json')

const ORIGIN = 'https://www.dhlottery.co.kr'
const LATEST_URL = `${ORIGIN}/lt645/selectPstLt645Info.do`
const PAGE_URL = `${ORIGIN}/lt645/selectPstLt645InfoNew.do`

const REQUEST_HEADERS = {
  accept: 'application/json, text/javascript, */*; q=0.01',
  'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  referer: `${ORIGIN}/lt645/result`,
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest',
}

/** 제1회 추첨일 — 이후 매주 토요일 추첨 (연속성은 수집 후 검증한다) */
const FIRST_DRAW_YMD = '20021207'
const REQUEST_DELAY_MS = 120

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: REQUEST_HEADERS })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (error) {
      if (attempt === 4) throw error
      await sleep(500 * attempt)
    }
  }
  throw new Error('unreachable')
}

/** 동행복권 응답 1건 → [회차, 추첨일, n1..n6, 보너스, 1등당첨자수, 1등당첨금, 회차판매금액] */
function toRow(item) {
  const numbers = [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo]
  const all = [...numbers, item.bnsWnNo]

  if (!Number.isInteger(item.ltEpsd) || item.ltEpsd < 1) throw new Error(`잘못된 회차: ${item.ltEpsd}`)
  if (!/^\d{8}$/.test(String(item.ltRflYmd))) throw new Error(`${item.ltEpsd}회 추첨일 형식 오류: ${item.ltRflYmd}`)
  if (new Set(all).size !== 7) throw new Error(`${item.ltEpsd}회 번호 중복`)
  if (!all.every(n => Number.isInteger(n) && n >= 1 && n <= 45)) throw new Error(`${item.ltEpsd}회 번호 범위 오류`)

  numbers.sort((a, b) => a - b)

  return [
    item.ltEpsd,
    String(item.ltRflYmd),
    ...numbers,
    item.bnsWnNo,
    Number(item.rnk1WnNope) || 0,
    Number(item.rnk1WnAmt) || 0,
    // 총 판매금액 — rlvtEpsdSumNtslAmt는 261회부터 당첨금 총액(판매액의 절반)이므로 쓰면 안 된다
    Number(item.wholEpsdSumNtslAmt) || 0,
  ]
}

function ymdToUtc(ymd) {
  return Date.UTC(Number(ymd.slice(0, 4)), Number(ymd.slice(4, 6)) - 1, Number(ymd.slice(6, 8)))
}

/** 회차 번호가 1씩, 추첨일이 정확히 7일씩 증가하는지 검증 */
function verify(rows) {
  const problems = []
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000

  if (rows[0][0] !== 1) problems.push(`첫 회차가 1이 아님: ${rows[0][0]}`)
  if (rows[0][1] !== FIRST_DRAW_YMD) problems.push(`제1회 추첨일 불일치: ${rows[0][1]} (기대 ${FIRST_DRAW_YMD})`)

  for (let i = 1; i < rows.length; i++) {
    const [round, ymd] = rows[i]
    const [prevRound, prevYmd] = rows[i - 1]
    if (round !== prevRound + 1) problems.push(`회차 누락: ${prevRound} → ${round}`)
    const gapDays = (ymdToUtc(ymd) - ymdToUtc(prevYmd)) / WEEK_MS
    if (gapDays !== 1) problems.push(`${round}회 추첨 간격 이상: ${prevYmd} → ${ymd}`)
  }

  return problems
}

async function main() {
  const latestResponse = await fetchJson(LATEST_URL)
  const latestItem = latestResponse?.data?.list?.[0]
  if (!latestItem) throw new Error('최신 회차 조회 실패')

  const latestRound = latestItem.ltEpsd
  console.log(`[1/3] 최신 회차 확인: ${latestRound}회 (${latestItem.ltRflYmd})`)

  const byRound = new Map()
  byRound.set(latestRound, toRow(latestItem))

  // 최신 회차부터 1회차까지 10건 단위로 역방향 수집.
  // srchDir=older는 커서가 실존 회차여야 하므로 첫 요청만 srchDir=center로 시작한다.
  let cursor = latestRound
  let requests = 0

  while (cursor > 1) {
    const url =
      requests === 0
        ? `${PAGE_URL}?srchDir=center&srchLtEpsd=${cursor}`
        : `${PAGE_URL}?srchDir=older&srchCursorLtEpsd=${cursor}`
    const json = await fetchJson(url)
    const list = json?.data?.list ?? []
    requests++

    if (list.length === 0) throw new Error(`${cursor}회 이전 데이터 조회 실패 — 응답 비어 있음`)

    let lowest = cursor
    for (const item of list) {
      byRound.set(item.ltEpsd, toRow(item))
      lowest = Math.min(lowest, item.ltEpsd)
    }

    if (lowest >= cursor) throw new Error(`커서가 전진하지 않음 (cursor=${cursor})`)
    cursor = lowest

    if (requests % 20 === 0) console.log(`      ...${cursor}회까지 수집 (요청 ${requests}회)`)
    await sleep(REQUEST_DELAY_MS)
  }

  console.log(`[2/3] 수집 완료: ${byRound.size}회차 (외부 요청 ${requests + 1}회)`)

  const rows = [...byRound.values()].sort((a, b) => a[0] - b[0])
  const problems = verify(rows)
  if (problems.length > 0) {
    console.error('[검증 실패]')
    problems.slice(0, 20).forEach(p => console.error(`  - ${p}`))
    throw new Error(`무결성 검증 실패 ${problems.length}건`)
  }
  console.log(`[3/3] 무결성 검증 통과 — 1~${latestRound}회 연속, 추첨 간격 7일 일정`)

  const payload = {
    source: '동행복권(dhlottery.co.kr) 로또 6/45 회차별 당첨번호',
    generatedAt: new Date().toISOString(),
    latestRound,
    latestDrawDate: rows[rows.length - 1][1],
    columns: ['round', 'drawDate', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'bonus', 'firstWinnerCount', 'firstPrizeAmount', 'totalSalesAmount'],
    draws: rows,
  }

  const json = `{
  "source": ${JSON.stringify(payload.source)},
  "generatedAt": ${JSON.stringify(payload.generatedAt)},
  "latestRound": ${payload.latestRound},
  "latestDrawDate": ${JSON.stringify(payload.latestDrawDate)},
  "columns": ${JSON.stringify(payload.columns)},
  "draws": [
${rows.map(r => `    ${JSON.stringify(r)}`).join(',\n')}
  ]
}
`

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, json, 'utf8')
  console.log(`      → ${OUTPUT_PATH} (${(Buffer.byteLength(json) / 1024).toFixed(1)} KB)`)
}

main().catch(error => {
  console.error(`[실패] ${error.message}`)
  process.exit(1)
})
