// ────────────────────────────────────────────────────────────────────────────
// 퇴직금 계산기
// 근거: 근로기준법 §2(평균임금·통상임금), §34 / 근로자퇴직급여보장법 §8
// 평균임금이 통상임금보다 적으면 통상임금을 평균임금으로 한다 (근기법 §2②)
// ────────────────────────────────────────────────────────────────────────────

import { inRange, parseCalendarDate } from './input-validation'

export interface SeveranceInput {
  avgMonthly3: number     // 최근 3개월 평균 월 급여 (원)
  annualBonus: number     // 직전 1년 연간 상여금 (원, 0이면 미포함)
  startDate: string       // 입사일 (YYYY-MM-DD)
  endDate: string         // 퇴직일 (YYYY-MM-DD)
  regularHourlyWage?: number  // 통상시급 (원, 선택 — 입력 시 통상임금 1일분과 비교)
}

export type SeveranceBasis = 'average' | 'regular'

export interface SeveranceResult {
  error?: string
  workDays: number          // 총 재직일수
  workYears: number         // 근속연수 (소수점)
  dailyWage: number         // 1일 평균임금(또는 통상임금) — 실제 채택값
  averageDailyWage: number  // 1일 평균임금 (산정값)
  regularDailyWage: number  // 1일 통상임금 (산정값, 미입력 시 0)
  basis: SeveranceBasis     // 채택 기준
  severancePay: number      // 세전 퇴직금 (원)
  isEligible: boolean       // 퇴직금 수급 자격 (1년 이상)
}

// n개월 전 같은 날짜(UTC 기준). Date.setMonth()는 말일에서 다음 달로 넘치므로
// (예: 5/31 → 2/31 → 3/3) 대상 월의 말일로 clamp 한다. 넘침을 방치하면
// 평균임금 산정기간이 89일로 짧아져 1일 평균임금이 과대 계상된다.
function subtractMonthsUtc(date: Date, months: number): Date {
  const day = date.getUTCDate()
  const result = new Date(date.getTime())
  result.setUTCDate(1)
  result.setUTCMonth(result.getUTCMonth() - months)
  const lastDayOfMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)
  ).getUTCDate()
  result.setUTCDate(Math.min(day, lastDayOfMonth))
  return result
}

export function calcSeverance(input: SeveranceInput): SeveranceResult {
  const { avgMonthly3, annualBonus, startDate, endDate, regularHourlyWage = 0 } = input

  const start = parseCalendarDate(startDate)
  const end = parseCalendarDate(endDate)
  const startMs = start?.getTime() ?? NaN
  const endMs = end?.getTime() ?? NaN

  // 입력 가드: 빈 문자열·Invalid Date·역순(end < start) 케이스 방어 (NaN 캐스케이드 차단)
  if (!start || !end || endMs < startMs || ![avgMonthly3, annualBonus, regularHourlyWage].every(v => inRange(v))) {
    return {
      error: '입사일·마지막 근무일과 급여 입력 범위를 확인해주세요.',
      workDays: 0,
      workYears: 0,
      dailyWage: 0,
      averageDailyWage: 0,
      regularDailyWage: 0,
      basis: 'average',
      severancePay: 0,
      isEligible: false,
    }
  }

  // 입사일·퇴직일(마지막 근무일) 양일 포함. 고용노동부 계산기는 퇴직일자를
  // 마지막 근무일 다음날로 넣으라고 안내하므로 exclusive 일수와 맞춘다.
  // 평균임금도 같은 법적 퇴직일(마지막 근무일 다음 날)을 기준으로 역산한다.
  const workDays = Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1
  const workYears = workDays / 365

  // 1년 미만은 퇴직금 없음
  const retirementDate = new Date(endMs + 86_400_000)
  const anniversary = new Date(startMs)
  anniversary.setUTCFullYear(anniversary.getUTCFullYear() + 1)
  if (retirementDate < anniversary) {
    return {
      workDays,
      workYears,
      dailyWage: 0,
      averageDailyWage: 0,
      regularDailyWage: 0,
      basis: 'average',
      severancePay: 0,
      isEligible: false,
    }
  }

  // ── 평균임금 (근기법 §2①) ──
  // 최근 3개월 임금총액 ÷ 3개월 실제 일수(89~92일) + 연간 상여금의 3/12
  const threeMonthWage = avgMonthly3 * 3 + (annualBonus * 3 / 12)
  const threeMonthStart = subtractMonthsUtc(retirementDate, 3)
  const threeMonthDays = Math.max(
    1,
    Math.round((retirementDate.getTime() - threeMonthStart.getTime()) / (1000 * 60 * 60 * 24))
  )
  const averageDailyWage = threeMonthWage / threeMonthDays

  // ── 통상임금 1일분 (근기법 시행령 §6 — 1일 소정근로 8시간 기준) ──
  const regularDailyWage = regularHourlyWage > 0
    ? regularHourlyWage * 8
    : 0

  // ── 큰 값 채택 (근기법 §2②) ──
  const basis: SeveranceBasis = regularDailyWage > averageDailyWage ? 'regular' : 'average'
  const dailyWage = basis === 'regular' ? regularDailyWage : averageDailyWage

  // 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
  const severancePay = Math.round(dailyWage * 30 * (workDays / 365))

  return {
    workDays,
    workYears,
    dailyWage,
    averageDailyWage,
    regularDailyWage,
    basis,
    severancePay,
    isEligible: true,
  }
}
