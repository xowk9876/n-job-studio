/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const snapshot = require('../data/lotto-history.json')

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
