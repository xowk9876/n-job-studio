/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { mergeCompleteHistory } = require('../lib/lotto/merge-history.ts')
const { buildLottoStats } = require('../lib/lotto/stats.ts')
const { installFromPrompt } = require('../lib/pwa-install.ts')
const draw = round => ({ round, drawDate: '2026-10-24', numbers: [1, 8, 17, 25, 33, 42], bonusNumber: 10, firstWinnerCount: 10, firstPrizeAmount: 2_000_000_000, totalSalesAmount: 100_000_000_000, origin: 'live' })

test('partial latest history cannot masquerade as complete live statistics', () => {
  const snapshot = [draw(1), draw(2)]
  const result = mergeCompleteHistory(snapshot, [draw(5), draw(4)], draw(5))
  assert.equal(result.origin, 'snapshot')
  assert.equal(result.updateIncomplete, true)
  assert.equal(result.latestKnownRound, 5)
  const stats = buildLottoStats(result.draws, { origin: result.origin })
  assert.equal(stats.dataThrough, 2)
  assert.equal(stats.totalDraws, 2)
})
test('complete history deduplicates rounds and labels verified data live', () => {
  const result = mergeCompleteHistory([draw(1), draw(2)], [draw(4), draw(3), draw(3), draw(4)], draw(4))
  assert.equal(result.origin, 'live')
  assert.equal(result.updateIncomplete, false)
  assert.deepEqual(result.draws.map(row => row.round), [1, 2, 3, 4])
})
test('latest endpoint outage keeps complete snapshot', () => {
  const result = mergeCompleteHistory([draw(1), draw(2)], [], null)
  assert.equal(result.origin, 'snapshot')
  assert.equal(result.draws.length, 2)
})
test('stats route falls back on a missing intermediate API response', async t => {
  const { SNAPSHOT_LATEST_ROUND } = require('../lib/lotto/history.ts')
  const latest = SNAPSHOT_LATEST_ROUND + 3
  let calls = 0
  t.mock.method(global, 'fetch', async () => {
    if (++calls > 1) throw new Error('simulated upstream outage')
    return Response.json({ data: { list: [{ ltEpsd: latest, ltRflYmd: '20261031', tm1WnNo: 1, tm2WnNo: 8, tm3WnNo: 17, tm4WnNo: 25, tm5WnNo: 33, tm6WnNo: 42, bnsWnNo: 10 }] } })
  })
  const { GET } = require('../app/api/lotto/stats/route.ts')
  const response = await GET(new Request('https://moneyfit.example/api/lotto/stats'))
  const body = await response.json()
  assert.equal(body.origin, 'snapshot')
  assert.equal(body.dataThrough, SNAPSHOT_LATEST_ROUND)
  assert.equal(body.latestKnownRound, latest)
  assert.equal(body.updateIncomplete, true)
})
test('external API rejects impossible dates and non-finite prize amounts', async t => {
  const { fetchLatestRound } = require('../lib/lotto/dhlottery.ts')
  const item = { ltEpsd: 1250, ltRflYmd: '20260230', tm1WnNo: 1, tm2WnNo: 8, tm3WnNo: 17, tm4WnNo: 25, tm5WnNo: 33, tm6WnNo: 42, bnsWnNo: 10 }
  t.mock.method(global, 'fetch', async () => Response.json({ data: { list: [item] } }))
  assert.equal(await fetchLatestRound(), null)
  item.ltRflYmd = '20261031'; item.rnk1WnAmt = 'Infinity'
  assert.equal(await fetchLatestRound(), null)
})
for (const outcome of ['accepted', 'dismissed']) {
  test(`install prompt handles ${outcome} without a false completion state`, async () => {
    let count = 0
    assert.equal(await installFromPrompt({ prompt: async () => { count++ }, userChoice: Promise.resolve({ outcome }) }), outcome)
    assert.equal(count, 1)
  })
}
test('install prompt rejection has a recoverable fallback', async () => {
  assert.equal(await installFromPrompt({ prompt: async () => { throw new Error('not available') }, userChoice: Promise.resolve({ outcome: 'dismissed' }) }), 'failed')
})
test('home includes Android, iPhone and desktop actions even without a native install event', () => {
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const HomeAppShortcut = require('../components/home/HomeAppShortcut.tsx').default
  const html = renderToStaticMarkup(React.createElement(HomeAppShortcut))
  for (const label of ['Android 홈 화면에 추가', 'iPhone 홈 화면 추가 안내', 'PC에 앱 설치']) assert.ok(html.includes(label))
  assert.ok(html.includes('id="install-app"'))
})
