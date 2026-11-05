/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const random = require('../lib/lotto/random.ts')
const { generateGames, DEFAULT_GENERATOR_OPTIONS, BALANCED_GENERATOR_OPTIONS } = require('../lib/lotto/generator.ts')
const { buildLottoStats, combinationRank } = require('../lib/lotto/stats.ts')
const { SNAPSHOT_DRAWS } = require('../lib/lotto/history.ts')
const { fetchLottoStats, isLottoStats, preserveNewerStats } = require('../lib/lotto/stats-client.ts')
const stats = buildLottoStats(SNAPSHOT_DRAWS, { origin: 'live' })

test('uniform accepts consecutive, extreme-sum and past winning combinations without scoring', t => {
  const sequence = [0, 1, 2, 3, 4, 5]
  let calls = 0
  t.mock.method(random, 'secureRandomInt', () => sequence[calls++])
  const context = { stats: { ...stats, pastCombinationRanks: [combinationRank([1, 2, 3, 4, 5, 6])] }, latestNumbers: [1, 2, 3, 4, 5, 6] }
  const games = generateGames({ ...DEFAULT_GENERATOR_OPTIONS, games: 1 }, context)
  assert.deepEqual(games[0].numbers, [1, 2, 3, 4, 5, 6])
  assert.equal(games[0].score, 0)
  assert.equal(games[0].relaxed, false)
  assert.equal(calls, 6, 'must accept the first combination, not rank 40 candidates')
})

test('all 5040 random choice paths over seven numbers yield each six-number subset exactly 720 times', t => {
  let path = [], cursor = 0
  const outcomes = new Map()
  t.mock.method(random, 'secureRandomInt', max => {
    const value = path[cursor++]
    assert.ok(value < max)
    return value
  })
  const options = { ...DEFAULT_GENERATOR_OPTIONS, games: 1, exclude: Array.from({ length: 38 }, (_, i) => i + 8) }
  function visit(prefix) {
    if (prefix.length === 6) {
      path = prefix; cursor = 0
      const games = generateGames(options)
      assert.equal(games.length, 1)
      const key = games[0].numbers.join(',')
      outcomes.set(key, (outcomes.get(key) ?? 0) + 1)
      return
    }
    for (let i = 0; i < 7 - prefix.length; i++) visit([...prefix, i])
  }
  visit([])
  assert.equal(outcomes.size, 7)
  for (const count of outcomes.values()) assert.equal(count, 720)
})

test('uniform includes the maximum-sum combination and all-odd combinations', t => {
  let calls = 0
  const choices = [44, 43, 42, 41, 40, 39, 0, 2, 4, 6, 8, 10]
  t.mock.method(random, 'secureRandomInt', () => choices[calls++])
  const games = generateGames({ ...DEFAULT_GENERATOR_OPTIONS, games: 2 })
  assert.deepEqual(games.map(g => g.numbers), [[40, 41, 42, 43, 44, 45], [1, 3, 5, 7, 9, 11]])
})

test('past-combination exclusion is opt-in and removes only the complete six-number match', t => {
  let calls = 0
  const choices = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 6]
  t.mock.method(random, 'secureRandomInt', () => choices[calls++])
  const context = { stats: { ...stats, pastCombinationRanks: [combinationRank([1, 2, 3, 4, 5, 6])] } }
  const games = generateGames({ ...DEFAULT_GENERATOR_OPTIONS, games: 1, avoidPastWinning: true }, context)
  assert.deepEqual(games[0].numbers, [1, 2, 3, 4, 5, 7])
  assert.equal(calls, 12)
})

test('uniform rejects a duplicate game without penalizing shared individual numbers', t => {
  let calls = 0
  const choices = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 6]
  t.mock.method(random, 'secureRandomInt', () => choices[calls++])
  const games = generateGames({ ...DEFAULT_GENERATOR_OPTIONS, games: 2 })
  assert.deepEqual(games.map(g => g.numbers), [[1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 7]])
})

test('uniform never silently relaxes impossible filters or duplicates a single available combination', () => {
  const impossible = generateGames({ ...DEFAULT_GENERATOR_OPTIONS, games: 1, include: [1, 2, 3, 4, 5, 6], sumMin: 100 })
  assert.deepEqual(impossible, [])
  const fixed = generateGames({ ...DEFAULT_GENERATOR_OPTIONS, games: 5, include: [1, 2, 3, 4, 5, 6] })
  assert.equal(fixed.length, 1)
})

test('balanced remains an explicit filter with valid, unique game output', () => {
  const games = generateGames(BALANCED_GENERATOR_OPTIONS, { stats, latestNumbers: stats.recentDraws[0].numbers })
  assert.equal(games.length, 5)
  assert.equal(new Set(games.map(g => g.numbers.join(','))).size, 5)
  for (const game of games) {
    assert.equal(new Set(game.numbers).size, 6)
    assert.ok(game.metrics.sum >= 100 && game.metrics.sum <= 175)
    assert.ok(game.metrics.maxConsecutive <= 2)
    assert.ok(game.metrics.filledZones >= 3)
    assert.equal(game.relaxed, false)
  }
})

test('integer RNG rejects modulo tail and invalid upper bounds', t => {
  let calls = 0
  t.mock.method(globalThis.crypto, 'getRandomValues', array => {
    array[0] = calls++ === 0 ? 0xffffffff : 10
    return array
  })
  assert.equal(random.secureRandomInt(45), 10)
  assert.equal(calls, 2)
  for (const value of [0, -1, 1.5, NaN, Infinity, 0x100000001]) assert.throws(() => random.secureRandomInt(value), RangeError)
})

test('stats payload rejects malformed history, dates and numbers', () => {
  assert.equal(isLottoStats(stats), true)
  assert.equal(isLottoStats({ ...stats, dataThrough: 0 }), false)
  assert.equal(isLottoStats({ ...stats, latestDrawDate: '2026-02-30' }), false)
  assert.equal(isLottoStats({ ...stats, pastCombinationRanks: [-1] }), false)
  assert.equal(isLottoStats({ ...stats, recentDraws: [{ ...stats.recentDraws[0], numbers: [1, 1, 2, 3, 4, 5] }] }), false)
  assert.equal(isLottoStats({ ...stats, numbers: [] }), false)
})

test('stats retry requests fresh data, surfaces HTTP/schema failures and can recover', async t => {
  const signal = new AbortController().signal
  let url, init
  const mock = t.mock.method(globalThis, 'fetch', async (u, options) => { url = u; init = options; return Response.json(stats) })
  assert.equal((await fetchLottoStats(signal, true)).dataThrough, stats.dataThrough)
  assert.equal(url, '/api/lotto/stats?refresh=1')
  assert.equal(init.cache, 'no-store')
  assert.equal(init.signal, signal)
  mock.mock.mockImplementation(async () => new Response('', { status: 503 }))
  await assert.rejects(fetchLottoStats(signal))
  mock.mock.mockImplementation(async () => Response.json({ dataThrough: 0 }))
  await assert.rejects(fetchLottoStats(signal))
  mock.mock.mockImplementation(async () => Response.json(stats))
  assert.equal((await fetchLottoStats(signal)).dataThrough, stats.dataThrough)
})

test('an older fallback does not overwrite a newer verified history', () => {
  const older = { ...stats, dataThrough: stats.dataThrough - 1, origin: 'snapshot' }
  assert.equal(preserveNewerStats(stats, older), stats)
  assert.equal(preserveNewerStats(null, stats), stats)
  const newer = { ...stats, dataThrough: stats.dataThrough + 1 }
  assert.equal(preserveNewerStats(stats, newer), newer)
})

test('manual API refresh bypasses upstream cache and response is never served stale by CDN', async t => {
  const latest = SNAPSHOT_DRAWS.at(-1)
  const calls = []
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    calls.push(options.next.revalidate)
    return Response.json({ data: { list: [{ ltEpsd: latest.round, ltRflYmd: latest.drawDate.replaceAll('-', ''), ...Object.fromEntries(latest.numbers.map((n, i) => [`tm${i + 1}WnNo`, n])), bnsWnNo: latest.bonusNumber }] } })
  })
  const { GET } = require('../app/api/lotto/stats/route.ts')
  const fresh = await GET(new Request('https://moneyfit.example/api/lotto/stats?refresh=1'))
  assert.equal(fresh.headers.get('Cache-Control'), 'no-store')
  assert.equal((await fresh.json()).origin, 'live')
  const automatic = await GET(new Request('https://moneyfit.example/api/lotto/stats'))
  assert.equal(automatic.status, 200)
  assert.deepEqual(calls, [0, 300])
})

test('the latest draw never falls behind the snapshot and manual refresh bypasses caches', async t => {
  const { GET } = require('../app/api/lotto/latest/route.ts')
  const latest = SNAPSHOT_DRAWS.at(-1)
  let upstream = SNAPSHOT_DRAWS.at(-2)
  const revalidations = []
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    revalidations.push(options.next.revalidate)
    const item = {
      ltEpsd: upstream.round, ltRflYmd: upstream.drawDate.replaceAll('-', ''),
      ...Object.fromEntries(upstream.numbers.map((n, i) => [`tm${i + 1}WnNo`, n])),
      bnsWnNo: upstream.bonusNumber, rnk1WnNope: upstream.firstWinnerCount,
      rnk1WnAmt: upstream.firstPrizeAmount, wholEpsdSumNtslAmt: upstream.totalSalesAmount,
    }
    return Response.json({ data: { list: [item] } })
  })
  const url = 'https://moneyfit.example/api/lotto/latest'
  const fallback = await (await GET(new Request(url))).json()
  assert.equal(fallback.round, latest.round)
  assert.equal(fallback.origin, 'snapshot')
  upstream = latest
  const refreshed = await GET(new Request(url + '?refresh=1'))
  assert.equal(refreshed.headers.get('cache-control'), 'no-store')
  const result = await refreshed.json()
  assert.equal(result.origin, 'live')
  assert.deepEqual(result.numbers, latest.numbers)
  assert.deepEqual(revalidations, [300, 0])
})

test('an unpublished round cannot cache an empty upstream result for the whole next day', async t => {
  const { GET } = require('../app/api/lotto/round/route.ts')
  const latest = SNAPSHOT_DRAWS.at(-1)
  const revalidations = []
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    revalidations.push(options.next.revalidate)
    return Response.json({ data: { list: [] } })
  })
  const url = 'https://moneyfit.example/api/lotto/round?round='
  assert.equal((await GET(new Request(url + latest.round))).status, 200)
  assert.equal((await GET(new Request(url + (latest.round + 1)))).status, 404)
  assert.deepEqual(revalidations, [86400, 300])
})

test('generator renders uniform default, opt-in exclusion, data status and refresh controls', () => {
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const LottoGenerator = require('../components/lotto/LottoGenerator.tsx').default
  const html = renderToStaticMarkup(React.createElement(LottoGenerator))
  assert.match(html, /type="radio"[^>]*checked=""[^>]*value="uniform"/)
  assert.doesNotMatch(html, /type="checkbox"[^>]*checked/)
  for (const label of ['균등 무작위', '균형 필터', '과거 1등 당첨 조합 제외', '당첨 데이터 확인 중', '당첨 데이터 새로고침']) assert.ok(html.includes(label))
})
