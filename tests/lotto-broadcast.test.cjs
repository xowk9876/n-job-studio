/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test')
const assert = require('node:assert/strict')
const { nextRegularDraw } = require('../lib/lotto/schedule.ts')

test('regular broadcast rolls over at Saturday 20:35 KST in every viewer timezone', () => {
  const startsAt = Date.parse('2026-11-21T20:35:00+09:00')
  for (const instant of ['2026-11-21T20:34:59+09:00', '2026-11-21T06:34:59-05:00']) {
    assert.deepEqual(nextRegularDraw(Date.parse(instant)), { round: 1251, startsAt })
  }
  assert.deepEqual(nextRegularDraw(startsAt), {
    round: 1252, startsAt: Date.parse('2026-11-28T20:35:00+09:00'),
  })
})
