// ────────────────────────────────────────────────────────────────────────────
// 퇴직금 계산기
// ────────────────────────────────────────────────────────────────────────────

export interface SeveranceInput {
  avgMonthly3: number     // 최근 3개월 평균 월 급여 (원)
  annualBonus: number     // 직전 1년 연간 상여금 (원, 0이면 미포함)
  startDate: string       // 입사일 (YYYY-MM-DD)
  endDate: string         // 퇴직일 (YYYY-MM-DD)
}

export interface SeveranceResult {
  workDays: number          // 총 재직일수
  workYears: number         // 근속연수 (소수점)
  dailyWage: number         // 1일 평균임금 (원)
  severancePay: number      // 세전 퇴직금 (원)
  isEligible: boolean       // 퇴직금 수급 자격 (1년 이상)
}

export function calcSeverance(input: SeveranceInput): SeveranceResult {
  const { avgMonthly3, annualBonus, startDate, endDate } = input

  const start = new Date(startDate)
  const end = new Date(endDate)
  const workDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const workYears = workDays / 365

  // 1년 미만은 퇴직금 없음
  if (workDays < 365) {
    return { workDays, workYears, dailyWage: 0, severancePay: 0, isEligible: false }
  }

  // 평균임금 계산 (최근 3개월 임금 / 3개월 일수)
  // 상여금은 (연간상여금 × 3/12)을 3개월 임금에 가산
  const threeMonthWage = avgMonthly3 * 3 + (annualBonus * 3 / 12)
  const dailyWage = Math.round(threeMonthWage / 91)  // 3개월 ≈ 91일

  // 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
  const severancePay = Math.round(dailyWage * 30 * (workDays / 365))

  return { workDays, workYears, dailyWage, severancePay, isEligible: true }
}
