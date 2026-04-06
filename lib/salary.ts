// ────────────────────────────────────────────────────────────────────────────
// 연봉 실수령액 계산기 — 2026 기준
// ────────────────────────────────────────────────────────────────────────────

// 4대보험 요율 (2026 확정)
const PENSION_RATE = 0.0475         // 국민연금 4.75% (2026 인상, 총 9.5%)
const PENSION_MONTHLY_CAP = 302_575 // 국민연금 월 상한액 (기준소득월액 637만원 × 4.75%)
const HEALTH_RATE = 0.03595         // 건강보험 3.595% (2026 인상, 총 7.19%)
const CARE_RATE = 0.1314            // 장기요양보험 (건강보험료 × 13.14%, 2026)
const EMPLOYMENT_RATE = 0.009       // 고용보험 0.9%

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
  return Math.min(deduction, 20_000_000) // 법정 한도 2,000만원
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
  annualSalary: number   // 연봉 (원)
  dependents: number     // 부양가족 수 (본인 포함)
  children: number       // 20세 미만 자녀 수
}

export interface SalaryResult {
  monthlyGross: number         // 월 세전 급여
  monthlyNet: number           // 월 실수령액
  pension: number              // 국민연금 (월)
  health: number               // 건강보험 (월)
  care: number                 // 장기요양보험 (월)
  employment: number           // 고용보험 (월)
  incomeTax: number            // 근로소득세 (월)
  localTax: number             // 지방소득세 (월)
  totalDeduction: number       // 총 공제액 (월)
  annualNet: number            // 연간 실수령액
}

export function calcSalary(input: SalaryInput): SalaryResult {
  const { annualSalary, dependents, children } = input
  const monthlyGross = Math.round(annualSalary / 12)

  // 4대보험 (월)
  const pension = Math.min(monthlyGross * PENSION_RATE, PENSION_MONTHLY_CAP)
  const health = Math.round(monthlyGross * HEALTH_RATE)
  const care = Math.round(health * CARE_RATE)
  const employment = Math.round(monthlyGross * EMPLOYMENT_RATE)

  // 과세표준 계산 (연간)
  const earnedDeduction = earnedIncomeDeduction(annualSalary)
  const personalDeduction = 1_500_000 * Math.max(dependents, 1) // 기본공제 150만×인원
  const childDeduction = children * 1_500_000                    // 자녀 기본공제 150만
  const taxableIncome = Math.max(
    0,
    annualSalary - earnedDeduction - personalDeduction - childDeduction
  )

  // 근로소득세 (월) — 표준세액공제 13만원 적용 (소득세법 §59의4⑩, 모든 근로자 자동 적용)
  const STANDARD_TAX_CREDIT = 130_000
  const annualIncomeTax = Math.max(0, calcIncomeTax(taxableIncome) - STANDARD_TAX_CREDIT)
  const incomeTax = Math.round(annualIncomeTax / 12)
  const localTax = Math.round(incomeTax * 0.10)

  const totalDeduction = Math.round(pension + health + care + employment + incomeTax + localTax)
  const monthlyNet = monthlyGross - totalDeduction
  const annualNet = monthlyNet * 12

  return {
    monthlyGross,
    monthlyNet,
    pension: Math.round(pension),
    health,
    care,
    employment,
    incomeTax,
    localTax,
    totalDeduction,
    annualNet,
  }
}
