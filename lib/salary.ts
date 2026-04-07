// ────────────────────────────────────────────────────────────────────────────
// 연봉 실수령액 계산기 — 2026 기준 (수당 + 비과세 포함)
// ────────────────────────────────────────────────────────────────────────────

// 4대보험 요율 (2026 확정)
const PENSION_RATE = 0.0475         // 국민연금 4.75% (2026 인상, 총 9.5%)
const PENSION_MONTHLY_CAP = 302_575 // 국민연금 월 상한액 (기준소득월액 637만원 × 4.75%)
const HEALTH_RATE = 0.03595         // 건강보험 3.595% (2026 인상, 총 7.19%)
const CARE_RATE = 0.1314            // 장기요양보험 (건강보험료 × 13.14%, 2026)
const EMPLOYMENT_RATE = 0.009       // 고용보험 0.9%

// 수당 관련 상수
const MONTHLY_WORK_HOURS = 209      // 월 소정근로시간 (주40h + 주휴 포함)
const OVERTIME_RATE = 1.5           // 연장근로 가산율 (근로기준법 §56①)
const NIGHT_RATE = 0.5              // 야간근로 가산율 (22:00~06:00, §56③)
const HOLIDAY_RATE = 1.5            // 휴일근로 가산율 8h 이내 (§56②)
const HOLIDAY_OVER8_RATE = 2.0      // 휴일근로 가산율 8h 초과

// 비과세 한도
const MEAL_EXEMPT_LIMIT = 200_000       // 식대 비과세 월 20만원 (소득세법 시행령 §12)
const TRANSPORT_EXEMPT_LIMIT = 200_000  // 차량유지비 비과세 월 20만원

// 최저임금 (2026)
export const MIN_HOURLY_WAGE_2026 = 10_320  // 시급

// 근로소득세율 구간 (2024 개정, 2026 동일)
const TAX_BRACKETS = [
  { limit: 14_000_000,   rate: 0.06,  deduction: 0 },
  { limit: 50_000_000,   rate: 0.15,  deduction: 1_260_000 },
  { limit: 88_000_000,   rate: 0.24,  deduction: 5_760_000 },
  { limit: 150_000_000,  rate: 0.35,  deduction: 15_440_000 },
  { limit: 300_000_000,  rate: 0.38,  deduction: 19_940_000 },
  { limit: 500_000_000,  rate: 0.40,  deduction: 25_940_000 },
  { limit: 1_000_000_000,rate: 0.42,  deduction: 35_940_000 },
  { limit: Infinity,      rate: 0.45,  deduction: 65_940_000 },
]

// 근로소득공제 (소득세법 §47 — 공제한도 2,000만원)
function earnedIncomeDeduction(salary: number): number {
  let deduction: number
  if (salary <= 5_000_000)        deduction = salary * 0.70
  else if (salary <= 15_000_000)  deduction = 3_500_000 + (salary - 5_000_000) * 0.40
  else if (salary <= 45_000_000)  deduction = 7_500_000 + (salary - 15_000_000) * 0.15
  else if (salary <= 100_000_000) deduction = 12_000_000 + (salary - 45_000_000) * 0.05
  else                            deduction = 14_750_000 + (salary - 100_000_000) * 0.02
  return Math.min(deduction, 20_000_000)
}

// 근로소득세 계산 (연간)
function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return Math.max(0, taxableIncome * bracket.rate - bracket.deduction)
    }
  }
  return 0
}

export interface SalaryInput {
  annualSalary: number        // 연봉 (원)
  dependents: number          // 부양가족 수 (본인 포함)
  children: number            // 20세 미만 자녀 수
  overtimeHours: number       // 월 연장근로 시간
  nightHours: number          // 월 야간근로 시간
  holidayHours: number        // 월 휴일근로 시간
  mealAllowance: number       // 월 식대
  transportAllowance: number  // 월 차량유지비
}

export interface SalaryResult {
  // 기본
  monthlyGross: number
  monthlyNet: number
  annualNet: number
  // 통상시급
  hourlyWage: number
  // 수당
  overtimePay: number
  nightPay: number
  holidayPay: number
  totalAllowance: number
  // 비과세
  taxExempt: number
  taxableMonthly: number
  // 4대보험 (월)
  pension: number
  health: number
  care: number
  employment: number
  // 세금 (월)
  incomeTax: number
  localTax: number
  totalDeduction: number
}

export function calcSalary(input: SalaryInput): SalaryResult {
  const {
    annualSalary,
    dependents,
    children,
    overtimeHours = 0,
    nightHours = 0,
    holidayHours = 0,
    mealAllowance = 0,
    transportAllowance = 0,
  } = input

  const monthlyBase = Math.round(annualSalary / 12)

  // ── 통상시급 ──
  const hourlyWage = Math.round(monthlyBase / MONTHLY_WORK_HOURS)

  // ── 수당 계산 (근로기준법 §56) ──
  const overtimePay = Math.round(hourlyWage * OVERTIME_RATE * overtimeHours)
  const nightPay = Math.round(hourlyWage * NIGHT_RATE * nightHours)
  // 휴일: 8시간 이내 1.5배, 초과분 2.0배
  const holidayNormal = Math.min(holidayHours, 8)
  const holidayOver = Math.max(holidayHours - 8, 0)
  const holidayPay = Math.round(
    hourlyWage * HOLIDAY_RATE * holidayNormal +
    hourlyWage * HOLIDAY_OVER8_RATE * holidayOver
  )
  const totalAllowance = overtimePay + nightPay + holidayPay

  // ── 비과세 처리 ──
  const mealExempt = Math.min(mealAllowance, MEAL_EXEMPT_LIMIT)
  const transportExempt = Math.min(transportAllowance, TRANSPORT_EXEMPT_LIMIT)
  const taxExempt = mealExempt + transportExempt

  // ── 총 월급여 / 과세 월급여 ──
  const monthlyGross = monthlyBase + totalAllowance + mealAllowance + transportAllowance
  const taxableMonthly = monthlyGross - taxExempt

  // ── 4대보험 (과세 월급여 기준) ──
  const pension = Math.min(Math.round(taxableMonthly * PENSION_RATE), PENSION_MONTHLY_CAP)
  const health = Math.round(taxableMonthly * HEALTH_RATE)
  const care = Math.round(health * CARE_RATE)
  const employment = Math.round(taxableMonthly * EMPLOYMENT_RATE)

  // ── 근로소득세 (과세 연봉 기준) ──
  const taxableAnnual = taxableMonthly * 12
  const earnedDeduction = earnedIncomeDeduction(taxableAnnual)
  const personalDeduction = 1_500_000 * Math.max(dependents, 1)
  const childDeduction = children * 1_500_000
  const taxableIncome = Math.max(
    0,
    taxableAnnual - earnedDeduction - personalDeduction - childDeduction
  )
  const STANDARD_TAX_CREDIT = 130_000
  const annualIncomeTax = Math.max(0, calcIncomeTax(taxableIncome) - STANDARD_TAX_CREDIT)
  const incomeTax = Math.round(annualIncomeTax / 12)
  const localTax = Math.round(incomeTax * 0.10)

  // ── 합산 ──
  const totalDeduction = Math.round(pension + health + care + employment + incomeTax + localTax)
  const monthlyNet = monthlyGross - totalDeduction
  const annualNet = monthlyNet * 12

  return {
    monthlyGross,
    monthlyNet,
    annualNet,
    hourlyWage,
    overtimePay,
    nightPay,
    holidayPay,
    totalAllowance,
    taxExempt,
    taxableMonthly,
    pension: Math.round(pension),
    health,
    care,
    employment,
    incomeTax,
    localTax,
    totalDeduction,
  }
}
