import table from '@/data/income-tax-2026.json'
import { inRange } from './input-validation'

/** 소득세법 시행령 별표 2, 2026.2.27 개정. 월 원천징수 100% 선택 기준. */
export function monthlyWithholding(monthlyPay: number, family: number, children = 0): number {
  if (!inRange(monthlyPay) || !Number.isInteger(family) || !inRange(family, 1, 11) ||
      !Number.isInteger(children) || !inRange(children, 0, family - 1)) return 0
  let tax = 0
  if (monthlyPay < 10_000_000) {
    const row = table.rows.find(row => monthlyPay >= row[0] * 1000 && monthlyPay < row[1] * 1000)
    tax = row?.[family + 1] ?? 0
  } else {
    tax = table.atTenMillion[family - 1]
    if (monthlyPay > 87_000_000) tax += 31_034_600 + (monthlyPay - 87_000_000) * 0.45
    else if (monthlyPay > 45_000_000) tax += 13_394_600 + (monthlyPay - 45_000_000) * 0.42
    else if (monthlyPay > 30_000_000) tax += 7_394_600 + (monthlyPay - 30_000_000) * 0.40
    else if (monthlyPay > 28_000_000) tax += 6_610_600 + (monthlyPay - 28_000_000) * 0.98 * 0.40
    else if (monthlyPay > 14_000_000) tax += 1_397_000 + (monthlyPay - 14_000_000) * 0.98 * 0.38
    else if (monthlyPay > 10_000_000) tax += 25_000 + (monthlyPay - 10_000_000) * 0.98 * 0.35
  }
  const childCredit = children === 0 ? 0 : children === 1 ? 20_830 : 45_830 + (children - 2) * 33_330
  return Math.floor(Math.max(0, tax - childCredit) / 10) * 10
}
