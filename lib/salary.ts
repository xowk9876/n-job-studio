// ────────────────────────────────────────────────────────────────────────────
// 연봉 실수령액 계산기 — 공식 간이세액표 조회
// 근거: 소득세법 §47/§55/§59, 시행령 별표2 (간이세액표)
// 모든 요율은 최근 고시 기준이며 매년 정부 고시에 따라 갱신됩니다.
// ────────────────────────────────────────────────────────────────────────────

// ═══ 4대보험 요율 (최근 고시 기준) ═══
// 국민연금: 2026.1.1 시행 연금개혁법(2025 통과)에 따라 9%→9.5% 인상
//          총 9.5%(노사 각 4.75%), 매년 0.5%p씩 단계 인상 → 2033년 13%
//          출처: 국민연금공단·보건복지부 보도자료
const PENSION_RATE = 0.0475
// 기준소득월액 상한액 (2026.7~2027.6: 6,590,000원 — 보건복지부 고시, A값 변동률 3.4% 반영)
// 월 보험료 상한(근로자 부담) = 6,590,000 × 4.75% = 313,025원
const PENSION_MONTHLY_CAP = 313_025
// 기준소득월액 하한액 (2026.7~2027.6: 410,000원 — 동일 고시)
// 월 보험료 하한(근로자 부담) = 410,000 × 4.75% = 19,475원
const PENSION_MONTHLY_MIN = 19_475
// 건강보험: 2026년 7.19%(노사 각 3.595%) — 건강보험정책심의위원회 결정
//          출처: 국민건강보험공단 고시
const HEALTH_RATE = 0.03595
// 장기요양보험: 2026년 소득 대비 직접요율 0.9448% (건강보험료 대비 약 13.14%)
//             13.14% = 0.9448% ÷ 7.19% — 보건복지부 고시
const CARE_RATE = 0.9448 / 7.19
// 고용보험: 실업급여 분 0.9% (근로자 부담) — 고용보험법 시행령
const EMPLOYMENT_RATE = 0.009

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

import { monthlyWithholding } from './withholding-tax'
import { inRange } from './input-validation'

// ═══ 인터페이스 ═══

export interface SalaryInput {
  annualSalary: number        // 연봉 (원)
  dependents: number          // 부양가족 수 (본인 포함)
  children: number            // 간이세액표상 8~20세 공제 대상 자녀 수
  overtimeHours: number       // 월 연장근로 시간
  nightHours: number          // 월 야간근로 시간
  holidayHours: number        // 각 휴일의 8시간 이내 시간 월 합계
  holidayOver8Hours?: number  // 각 휴일의 8시간 초과 시간 월 합계
  mealAllowance: number       // 월 식대
  transportAllowance: number  // 월 차량유지비
}

export interface SalaryResult {
  error?: string
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
    holidayOver8Hours = 0,
    mealAllowance = 0,
    transportAllowance = 0,
  } = input

  // 입력 가드: 음수·0 연봉 방어
  const valid = [annualSalary, mealAllowance, transportAllowance].every(v => inRange(v)) &&
    inRange(dependents, 1, 11) && Number.isInteger(dependents) &&
    inRange(children, 0, dependents - 1) && Number.isInteger(children) &&
    inRange(overtimeHours, 0, 80) && inRange(nightHours, 0, 40) &&
    inRange(holidayHours, 0, 248) && inRange(holidayOver8Hours, 0, 248)
  if (!valid || annualSalary === 0) {
    return {
      error: valid ? undefined : '연봉·가족 수·수당 입력 범위를 확인해주세요.',
      monthlyGross: 0, monthlyNet: 0, annualNet: 0, hourlyWage: 0,
      overtimePay: 0, nightPay: 0, holidayPay: 0, totalAllowance: 0,
      taxExempt: 0, taxableMonthly: 0,
      pension: 0, health: 0, care: 0, employment: 0,
      incomeTax: 0, localTax: 0, totalDeduction: 0,
    }
  }

  const monthlyBase = Math.round(annualSalary / 12)

  // ── 통상시급 ──
  const hourlyWage = monthlyBase / MONTHLY_WORK_HOURS

  // ── 수당 계산 (근로기준법 §56) ──
  const overtimePay = Math.round(hourlyWage * OVERTIME_RATE * overtimeHours)
  const nightPay = Math.round(hourlyWage * NIGHT_RATE * nightHours)
  const holidayPay = Math.round(
    hourlyWage * HOLIDAY_RATE * holidayHours +
    hourlyWage * HOLIDAY_OVER8_RATE * holidayOver8Hours
  )
  const totalAllowance = overtimePay + nightPay + holidayPay

  // ── 총 월급여 ──
  // 식대·차량유지비는 연봉에 포함된 항목이므로 월급여에 가산하지 않는다.
  // (사람인·인크루트 등 표준 산식: 세전 월급 = 연봉÷12, 비과세액은 과세표준에서만 차감)
  const monthlyGross = monthlyBase + totalAllowance

  // ── 비과세 처리 (소득세법 시행령 §12) ──
  const mealExempt = Math.min(mealAllowance, MEAL_EXEMPT_LIMIT)
  const transportExempt = Math.min(transportAllowance, TRANSPORT_EXEMPT_LIMIT)
  const taxExempt = Math.min(mealExempt + transportExempt, monthlyGross)

  // ── 과세 월급여 ──
  const taxableMonthly = monthlyGross - taxExempt

  // ── 4대보험 (과세 월급여 기준) ──
  const pension = taxableMonthly > 0
    ? Math.min(Math.max(Math.round(Math.floor(taxableMonthly / 1000) * 1000 * PENSION_RATE), PENSION_MONTHLY_MIN), PENSION_MONTHLY_CAP)
    : 0
  const health = Math.round(taxableMonthly * HEALTH_RATE)
  const care = Math.round(health * CARE_RATE)
  const employment = Math.round(taxableMonthly * EMPLOYMENT_RATE)

  // 월 원천징수는 연말정산 추정식이 아닌 공식 급여 구간표를 조회한다.
  const incomeTax = monthlyWithholding(taxableMonthly, dependents, children)
  const localTax = Math.floor(incomeTax * 0.10 / 10) * 10

  // ── 합산 ──
  const totalDeduction = pension + health + care + employment + incomeTax + localTax
  // 국민연금 하한(19,475원)이 과세월급보다 큰 초저소득에서 실수령이 음수가 되지 않게 한다.
  const monthlyNet = Math.max(0, monthlyGross - totalDeduction)
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
