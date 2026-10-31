/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const values = new Map()
global.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key),
}
global.window = { localStorage: global.localStorage }
const { useSeveranceStore, useSalaryStore } = require('../store/index.ts')

test('Zustand rehydrates exact user-selected date rather than replacing it with today', async () => {
  values.set('mf-severance', JSON.stringify({ version: 1, state: { startDate: '2020-01-01', endDate: '2026-10-15', avgMonthly3: 3_500_000, annualBonus: 0, regularHourlyWage: 0 } }))
  assert.equal(useSeveranceStore.getState().endDate, '')
  await useSeveranceStore.persist.rehydrate()
  assert.equal(useSeveranceStore.getState().endDate, '2026-10-15')
  useSeveranceStore.getState().set({ endDate: '2026-05-22' })
  await useSeveranceStore.persist.rehydrate()
  assert.equal(useSeveranceStore.getState().endDate, '2026-05-22')
})
test('Zustand migrates version 1 salary and persists validated new holiday fields', async () => {
  values.set('mf-salary', JSON.stringify({ version: 1, state: { annualSalary: 50_000_000, dependents: 2, children: 1, holidayHours: 16 } }))
  await useSalaryStore.persist.rehydrate()
  const state = useSalaryStore.getState()
  assert.equal(state.annualSalary, 50_000_000)
  assert.equal(state.holidayReviewRequired, true)
  assert.equal(state.holidayHours, 0)
  assert.equal(state.holidayOver8Hours, 0)
  assert.equal(JSON.parse(values.get('mf-salary')).version, 2)
})
