// ────────────────────────────────────────────────────────────────────────────
// 연봉 실수령액 계산기 — 2026 기준 (간이세액표 산출 알고리즘 적용)
// 소득세법 시행령 별표2 기반
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

// ═══ 근로소득세율 구간 (소득세법 §55) ═══
const TAX_BRACKETS = [
  { limit: 14_000_000,    rate: 0.06, deduction: 0 },
  { limit: 50_000_000,    rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000,    rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000,   rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000,   rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000,   rate: 0.40, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity,      rate: 0.45, deduction: 65_940_000 },
]

// ═══ 근로소득공제 (소득세법 §47 — 공제한도 2,000만원) ═══
function earnedIncomeDeduction(salary: number): number {
  let d: number
  if (salary <= 5_000_000)        d = salary * 0.70
  else if (salary <= 15_000_000)  d = 3_500_000 + (salary - 5_000_000) * 0.40
  else if (salary <= 45_000_000)  d = 7_500_000 + (salary - 15_000_000) * 0.15
  else if (salary <= 100_000_000) d = 12_000_000 + (salary - 45_000_000) * 0.05
  else                            d = 14_750_000 + (salary - 100_000_000) * 0.02
  return Math.min(d, 20_000_000)
}

// ═══ 산출세액 (소득세법 §55 누진세율) ═══
function calcGrossTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  for (const b of TAX_BRACKETS) {
    if (taxableIncome <= b.limit) {
      return Math.max(0, taxableIncome * b.rate - b.deduction)
    }
  }
  return 0
}

// ═══ 근로소득세액공제 (소득세법 §59) — 간이세액표 핵심 ═══
function earnedIncomeTaxCredit(grossTax: number, annualGross: number): number {
  // 공제 금액 계산
  let credit: number
  if (grossTax <= 1_300_000) {
    credit = grossTax * 0.55
  } else {
    credit = 715_000 + (grossTax - 1_300_000) * 0.30
  }

  // 한도 적용 (총급여 기준)
  let limit: number
  if (annualGross <= 33_000_000) {
    limit = 740_000
  } else if (annualGross <= 70_000_000) {
    limit = Math.max(740_000 - (annualGross - 33_000_000) * 0.008, 660_000)
  } else {
    limit = Math.max(660_000 - (annualGross - 70_000_000) * 0.005, 500_000)
  }

  return Math.min(credit, limit)
}

// ═══ 자녀세액공제 (소득세법 §59의2) ═══
function childTaxCredit(childCount: number): number {
  if (childCount <= 0) return 0
  if (childCount === 1) return 150_000
  if (childCount === 2) return 350_000
  return 350_000 + (childCount - 2) * 300_000
}

// ═══ 인터페이스 ═══

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
  monthlyGross: number
  monthlyNet: number
  annualNet: number
  hourlyWage: number
  overtimePay: number
  nightPay: number
  holidayPay: number
  totalAllowance: number
  taxExempt: number
  taxableMonthly: number
  pension: number
  health: number
  care: number
  employment: number
  incomeTax: number
  localTax: number
  totalDeduction: number
}

// ═══ 메인 계산 함수 ═══

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

  // ═══════════════════════════════════════════════════════════════════════
  // 간이세액표 산출 알고리즘 (소득세법 시행령 별표2)
  // ═══════════════════════════════════════════════════════════════════════

  const annualGross = taxableMonthly * 12

  // Step 1: 근로소득공제 (소득세법 §47)
  const earnedDeduction = earnedIncomeDeduction(annualGross)
  const earnedIncome = annualGross - earnedDeduction

  // Step 2: 인적공제 — 기본공제 150만원 × 가족수 (소득세법 §50)
  const personalDeduction = 1_500_000 * Math.max(dependents, 1)

  // Step 3: 연금보험료공제 — 국민연금 실납부액 (소득세법 §51의3)
  const annualPensionDeduction = pension * 12

  // Step 4: 특별소득공제 — 건강+장기요양+고용 보험료 (소득세법 §52)
  const annualInsuranceDeduction = (health + care + employment) * 12

  // Step 5: 과세표준
  const taxableIncome = Math.max(
    0,
    earnedIncome - personalDeduction - annualPensionDeduction - annualInsuranceDeduction
  )

  // Step 6: 산출세액 (소득세법 §55 누진세율)
  const grossTax = calcGrossTax(taxableIncome)

  // Step 7: 근로소득세액공제 (소득세법 §59)
  const eitc = earnedIncomeTaxCredit(grossTax, annualGross)

  // Step 8: 자녀세액공제 (소득세법 §59의2)
  const ctc = childTaxCredit(children)

  // Step 9: 결정세액 (연간)
  const annualIncomeTax = Math.max(0, grossTax - eitc - ctc)

  // Step 10: 월 원천징수 소득세
  const incomeTax = Math.round(annualIncomeTax / 12)
  const localTax = Math.round(incomeTax * 0.10)

  // ── 합산 ──
  const totalDeduction = pension + health + care + employment + incomeTax + localTax
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
    pension,
    health,
    care,
    employment,
    incomeTax,
    localTax,
    totalDeduction,
  }
}
