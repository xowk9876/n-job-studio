/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const snapshot = require('../data/lotto-history.json')

test('snapshot importer rejects missing or malformed prize data instead of saving zero', async () => {
  const { toRow } = await import('../scripts/fetch-lotto-history.mjs')
  const draw = { ltEpsd: 1250, ltRflYmd: '20261114', tm1WnNo: 1, tm2WnNo: 5,
    tm3WnNo: 18, tm4WnNo: 23, tm5WnNo: 27, tm6WnNo: 28, bnsWnNo: 8,
    rnk1WnNope: 9, rnk1WnAmt: 3103164459, wholEpsdSumNtslAmt: 116731227000 }
  assert.deepEqual(toRow(draw), [1250, '20261114', 1, 5, 18, 23, 27, 28, 8, 9, 3103164459, 116731227000])
  for (const key of ['rnk1WnNope', 'rnk1WnAmt', 'wholEpsdSumNtslAmt']) {
    for (const value of [undefined, null, '', ' ', 'invalid', false, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => toRow({ ...draw, [key]: value }), /값 오류/)
    }
  }
  for (const zero of [0, '0']) {
    const noWinners = { ...draw, rnk1WnNope: zero, rnk1WnAmt: zero }
    assert.deepEqual(toRow(noWinners).slice(9, 11), [0, 0])
    assert.doesNotThrow(() => toRow({ ...draw, wholEpsdSumNtslAmt: zero }))
    assert.throws(() => toRow({ ...draw, rnk1WnNope: zero }), /1등 당첨 수와 한 줄당 금액 불일치/)
    assert.throws(() => toRow({ ...draw, rnk1WnAmt: zero }), /1등 당첨 수와 한 줄당 금액 불일치/)
  }
})

test('committed fallback history contains every draw with valid dates, numbers and amounts', () => {
  assert.equal(snapshot.draws.length, snapshot.latestRound)
  assert.ok(snapshot.draws.length > 0)
  assert.ok(Number.isFinite(Date.parse(snapshot.generatedAt)))
  for (const [index, row] of snapshot.draws.entries()) {
    const round = index + 1
    assert.equal(row.length, 12, `${round}: column count`)
    assert.equal(row[0], round, `${round}: no missing or duplicate rounds`)
    const expectedDate = new Date(Date.UTC(2002, 11, 7) + index * 604800000)
      .toISOString().slice(0, 10).replaceAll('-', '')
    assert.equal(row[1], expectedDate, `${round}: weekly draw date`)
    const numbers = row.slice(2, 9)
    assert.equal(new Set(numbers).size, 7, `${round}: duplicate ball`)
    assert.ok(numbers.every(n => Number.isInteger(n) && n >= 1 && n <= 45), `${round}: ball range`)
    assert.deepEqual(row.slice(2, 8), row.slice(2, 8).sort((a, b) => a - b), `${round}: sorted main balls`)
    assert.ok(row.slice(9).every(n => Number.isSafeInteger(n) && n >= 0), `${round}: winners and amounts`)
  }
  assert.equal(snapshot.draws.at(-1)[1], snapshot.latestDrawDate)
})
