/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { monthlyWithholding } = require('../lib/withholding-tax.ts')
const { calcSalary } = require('../lib/salary.ts')
const { calcMortgage, calcDsrLimit } = require('../lib/mortgage.ts')
const { calcSeverance } = require('../lib/severance.ts')
const { calcSavings } = require('../lib/savings.ts')
const { calcJeonse } = require('../lib/jeonse.ts')
const { mergeStoredInputs, migrateSalaryInputs, parseCalendarDate } = require('../lib/input-validation.ts')
const { parseNumericInput } = require('../lib/numeric-input.ts')
const salary = { annualSalary: 36_000_000, dependents: 1, children: 0, overtimeHours: 0, nightHours: 0, holidayHours: 0, mealAllowance: 0, transportAllowance: 0 }
const retirement = { avgMonthly3: 3_500_000, annualBonus: 0, startDate: '2020-01-01', endDate: '2026-04-30' }
const mortgage = { principal: 300_000_000, annualRate: 3.5, years: 30, type: 'equal-payment' }
const savings = { type: 'savings', amount: 500_000, annualRate: 5, months: 12, interestType: 'simple' }
function finiteTree(value) {
  if (typeof value === 'number') assert.ok(Number.isFinite(value))
  else if (value && typeof value === 'object') Object.values(value).forEach(finiteTree)
}

test('official 2026 table: salary bands and family columns', () => {
  assert.equal(monthlyWithholding(3_000_000, 1), 74_350)
  assert.equal(monthlyWithholding(3_019_999, 1), 74_350)
  assert.equal(monthlyWithholding(3_000_000, 2), 56_850)
  assert.equal(monthlyWithholding(3_000_000, 3), 31_940)
  assert.equal(monthlyWithholding(3_500_000, 1), 127_220)
  assert.equal(monthlyWithholding(1_059_999, 1), 0)
  assert.equal(monthlyWithholding(1_060_000, 1), 1_040)
  assert.equal(monthlyWithholding(10_000_000, 1), 1_507_400)
})
test('official monthly child deduction and non-negative tax', () => {
  assert.equal(monthlyWithholding(3_000_000, 2, 1), 36_020)
  assert.equal(monthlyWithholding(3_000_000, 3, 2), 0)
  assert.equal(monthlyWithholding(10_000_000, 4, 3), 1_091_680)
})
test('official high-income formulas at bracket boundaries', () => {
  const base = 1_507_400
  for (const [income, extra] of [[14_000_000,1_397_000],[28_000_000,6_610_600],[30_000_000,7_394_600],[45_000_000,13_394_600],[87_000_000,31_034_600],[100_000_000,36_884_600]]) {
    assert.equal(monthlyWithholding(income, 1), base + extra)
  }
})
test('official table covers every salary interval without missing or duplicate rows', () => {
  const table = require('../data/income-tax-2026.json')
  assert.equal(table.rows.length, 646)
  assert.equal(table.rows[0][0], 770)
  assert.equal(table.rows.at(-1)[1], 10_000)
  table.rows.forEach((row, i) => {
    assert.equal(row.length, 13)
    if (i) assert.equal(table.rows[i - 1][1], row[0])
    row.slice(2).forEach(value => assert.equal(value % 10, 0))
  })
})
test('salary uses monthly table, non-taxable pay, and whole-thousand pension basis', () => {
  assert.equal(calcSalary(salary).incomeTax, 74_350)
  const result = calcSalary({ ...salary, annualSalary: 36_001_200, mealAllowance: 100 })
  assert.equal(result.taxableMonthly, 3_000_000)
  assert.equal(result.pension, 142_500)
  assert.equal(result.monthlyNet + result.totalDeduction, result.monthlyGross)
})
test('two 8-hour holidays do not become one 16-hour holiday', () => {
  const base = { ...salary, annualSalary: 50_160_000 }
  assert.equal(calcSalary({ ...base, holidayHours: 16 }).holidayPay, 480_000)
  assert.equal(calcSalary({ ...base, holidayHours: 8, holidayOver8Hours: 2 }).holidayPay, 320_000)
})
test('severance uses next day of last work as the retirement date and keeps daily precision', () => {
  const result = calcSeverance(retirement)
  assert.equal(result.averageDailyWage, 10_500_000 / 89)
  assert.equal(result.workDays, 2312)
  assert.equal(result.severancePay, 22_418_963)
})
test('severance: calendar anniversary, leap year, invalid date, ordinary wage floor', () => {
  assert.equal(calcSeverance({ ...retirement, startDate: '2024-01-01', endDate: '2024-12-30' }).isEligible, false)
  assert.equal(calcSeverance({ ...retirement, startDate: '2024-01-01', endDate: '2024-12-31' }).isEligible, true)
  assert.ok(calcSeverance({ ...retirement, endDate: '2026-02-30' }).error)
  assert.equal(calcSeverance({ ...retirement, regularHourlyWage: 20_000 }).dailyWage, 160_000)
  assert.equal(parseCalendarDate('2026-02-29'), null)
  assert.ok(parseCalendarDate('2024-02-29'))
})
for (const type of ['equal-payment', 'equal-principal', 'bullet']) {
  test(`mortgage ${type}: pays principal exactly, zero final balance`, () => {
    for (const annualRate of [0, 1e-14, 3.5, 100]) {
      const result = calcMortgage({ ...mortgage, type, annualRate })
      finiteTree(result)
      assert.equal(result.schedule.length, 360)
      assert.equal(result.schedule.at(-1).remaining, 0)
      assert.equal(result.schedule.reduce((sum, row) => sum + row.principal, 0), mortgage.principal)
      assert.ok(result.schedule.every(row => row.remaining >= 0 && row.principal >= 0))
      assert.equal(result.totalPayment, mortgage.principal + result.totalInterest)
    }
  })
}
test('DSR tiny interest behaves like zero interest and existing debt reduces available payment', () => {
  const input = { annualIncome: 60_000_000, existingDebtMonthlyPmt: 0, annualRate: 0, stressBps: 0, years: 30, dsrCap: 40 }
  assert.equal(calcDsrLimit(input).maxPrincipal, 720_000_000)
  assert.ok(Math.abs(calcDsrLimit({ ...input, annualRate: 1e-14 }).maxPrincipal - 720_000_000) <= 1)
  assert.equal(calcDsrLimit({ ...input, existingDebtMonthlyPmt: 2_000_001 }).maxPrincipal, 0)
})
test('savings: independent 12-month simple-interest example and ISA tax', () => {
  const r = calcSavings(savings)
  assert.equal(r.principal, 6_000_000)
  assert.equal(r.grossInterest, 162_500)
  assert.equal(r.taxAmount, 25_025)
  assert.equal(r.maturityAmount, 6_137_475)
  assert.equal(r.isa.isaTax, 0)
})
test('jeonse conversion and low ratio never promises safety', () => {
  const r = calcJeonse({ direction: 'jeonse-to-wolse', jeonsDeposit: 300_000_000, wolseDeposit: 50_000_000, conversionRate: 5, marketPrice: 500_000_000 })
  assert.equal(r.monthlyRent, 1_041_667)
  assert.doesNotMatch(r.risk.label, /안전/)
  assert.ok(calcJeonse({ direction: 'wolse-to-jeonse', currentWolse: 1_000_000, conversionRate: 0 }).error)
})
test('all calculators reject invalid and non-finite values without NaN or unbounded loops', () => {
  for (const bad of [NaN, Infinity, -1, 1e100]) {
    for (const r of [calcSalary({ ...salary, annualSalary: bad }), calcSeverance({ ...retirement, avgMonthly3: bad }), calcMortgage({ ...mortgage, principal: bad }), calcSavings({ ...savings, amount: bad }), calcJeonse({ direction: 'jeonse-to-wolse', jeonsDeposit: bad, conversionRate: 5 })]) {
      assert.ok(r.error); finiteTree(r)
    }
  }
  assert.ok(calcSavings({ ...savings, months: Infinity }).error)
  assert.ok(calcMortgage({ ...mortgage, years: 1.5 }).error)
})
test('numeric input validates multiplied values and rejects negative/exponential text', () => {
  assert.equal(parseNumericInput('5,000', 10000), 50_000_000)
  assert.equal(parseNumericInput('3.125', 1, true, 0, 100), 3.125)
  for (const bad of ['9'.repeat(400), '-20', '1e5', '1.2.3']) assert.equal(parseNumericInput(bad, 10000), null)
  assert.equal(parseNumericInput('100000001', 10000), null)
  assert.equal(parseNumericInput('101', 1, true, 0, 100), null)
})
test('persist merge retains legitimate saved date, rejects poisoned values and incompatible enum', () => {
  const set = () => {}
  const current = { endDate: '', annualSalary: 40_000_000, dependents: 1, children: 0, type: 'equal-payment', set }
  const merged = mergeStoredInputs({ endDate: '2026-10-15', annualSalary: null, dependents: 2, children: 5, type: 'deposit', set: 'bad', extra: 5 }, current)
  assert.equal(merged.endDate, '2026-10-15')
  assert.equal(merged.annualSalary, current.annualSalary)
  assert.equal(merged.type, 'equal-payment')
  assert.equal(merged.children, 1)
  assert.equal(merged.set, set)
  assert.equal(merged.extra, undefined)
})
test('salary migration preserves valid inputs and explicitly flags ambiguous holiday totals', () => {
  const migrated = migrateSalaryInputs({ annualSalary: 50_000_000, holidayHours: 16 }, 1)
  assert.equal(migrated.annualSalary, 50_000_000)
  assert.equal(migrated.holidayHours, 0)
  assert.equal(migrated.holidayOver8Hours, 0)
  assert.equal(migrated.holidayReviewRequired, true)
})
