// ────────────────────────────────────────────────────────────────────────────
// 주택담보대출 이자 계산기
// ────────────────────────────────────────────────────────────────────────────

export type RepaymentType = 'equal-payment' | 'equal-principal' | 'bullet'

export interface MortgageInput {
  principal: number       // 대출금액 (원)
  annualRate: number      // 연이율 (%)
  years: number           // 대출기간 (년)
  type: RepaymentType     // 상환방식
}

export interface MonthlySchedule {
  month: number
  payment: number         // 월 납입액
  principal: number       // 원금
  interest: number        // 이자
  remaining: number       // 잔여 원금
}

export interface MortgageResult {
  monthlyPayment: number       // 월 납입액 (원리금균등 기준, 또는 첫 달)
  totalPayment: number         // 총 납입액
  totalInterest: number        // 총 이자
  interestRatio: number        // 이자 비율 (%)
  schedule: MonthlySchedule[]  // 월별 상환 스케줄
}

export function calcMortgage(input: MortgageInput): MortgageResult {
  const { principal, annualRate, years, type } = input
  const monthlyRate = annualRate / 100 / 12
  const totalMonths = years * 12
  const schedule: MonthlySchedule[] = []

  // 입력 가드: 대출금·기간이 0 이하이면 빈 결과 반환 (NaN/Infinity 방지)
  if (principal <= 0 || totalMonths <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, interestRatio: 0, schedule }
  }

  if (type === 'bullet') {
    // 만기일시상환
    const monthlyInterest = Math.round(principal * monthlyRate)
    let totalInterest = 0
    for (let m = 1; m <= totalMonths; m++) {
      const interest = monthlyInterest
      const pmt = m === totalMonths ? principal + interest : interest
      totalInterest += interest
      schedule.push({
        month: m,
        payment: pmt,
        principal: m === totalMonths ? principal : 0,
        interest,
        remaining: m === totalMonths ? 0 : principal,
      })
    }
    return {
      monthlyPayment: monthlyInterest,
      totalPayment: principal + totalInterest,
      totalInterest,
      interestRatio: (totalInterest / principal) * 100,
      schedule,
    }
  }

  if (type === 'equal-payment') {
    // 원리금균등상환
    let monthlyPayment: number
    if (monthlyRate === 0) {
      monthlyPayment = principal / totalMonths
    } else {
      monthlyPayment = Math.round(
        principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      )
    }
    let remaining = principal
    let totalInterest = 0
    for (let m = 1; m <= totalMonths; m++) {
      const interest = Math.round(remaining * monthlyRate)
      const principalPmt = monthlyPayment - interest
      remaining = Math.max(0, remaining - principalPmt)
      totalInterest += interest
      schedule.push({ month: m, payment: monthlyPayment, principal: principalPmt, interest, remaining })
    }
    return {
      monthlyPayment,
      totalPayment: monthlyPayment * totalMonths,
      totalInterest,
      interestRatio: (totalInterest / principal) * 100,
      schedule,
    }
  }

  // 원금균등상환
  const monthlyPrincipal = Math.round(principal / totalMonths)
  let remaining = principal
  let totalInterest = 0
  for (let m = 1; m <= totalMonths; m++) {
    const interest = Math.round(remaining * monthlyRate)
    const payment = monthlyPrincipal + interest
    remaining = Math.max(0, remaining - monthlyPrincipal)
    totalInterest += interest
    schedule.push({ month: m, payment, principal: monthlyPrincipal, interest, remaining })
  }
  const firstPayment = schedule[0]?.payment ?? 0
  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0)
  return {
    monthlyPayment: firstPayment,
    totalPayment,
    totalInterest,
    interestRatio: (totalInterest / principal) * 100,
    schedule,
  }
}

// ────────────────────────────────────────────────────────────────────────────
// DSR / 스트레스 DSR 한도 산출
// 근거: 금융위 「DSR 산정·운용 모범규준」 (총부채원리금상환비율)
//      스트레스 DSR — 가산금리는 금융위 단계 발표에 따라 변동 (사용자 입력)
//      DSR 한도: 은행권 40% / 제2금융권 50% — 차주 단위 적용
// ────────────────────────────────────────────────────────────────────────────

export interface DsrInput {
  annualIncome: number        // 연 소득 (원, 세전)
  existingDebtMonthlyPmt: number  // 기존 부채 월 상환액 (원)
  annualRate: number          // 신규 대출 금리 (%)
  years: number               // 만기 (년)
  stressBps: number           // 스트레스 가산금리 (%, 0~3.0 사용자 입력)
  dsrCap: number              // DSR 한도 (%, 보통 40 또는 50)
}

export interface DsrResult {
  stressedRate: number        // 가산 적용 금리 (%)
  maxMonthlyPmt: number       // 신규 대출 월 한도 (= 소득 × cap/12 − 기존부채)
  maxPrincipal: number        // 신규 대출 원금 한도 (원)
  monthlyIncome: number       // 월 소득 (원)
  utilization: number         // 기존 부채만으로 차지하는 DSR (%)
}

export function calcDsrLimit(input: DsrInput): DsrResult {
  const { annualIncome, existingDebtMonthlyPmt, annualRate, years, stressBps, dsrCap } = input

  // 가드: 입력 음수·0 방어
  if (annualIncome <= 0 || years <= 0 || dsrCap <= 0) {
    return {
      stressedRate: annualRate + stressBps,
      maxMonthlyPmt: 0,
      maxPrincipal: 0,
      monthlyIncome: 0,
      utilization: 0,
    }
  }

  const monthlyIncome = annualIncome / 12
  const monthlyCap = monthlyIncome * (dsrCap / 100)
  const maxMonthlyPmt = Math.max(0, Math.floor(monthlyCap - existingDebtMonthlyPmt))

  // 스트레스 가산금리 적용한 원리금균등 역산
  const stressedRate = annualRate + stressBps
  const monthlyRate = stressedRate / 100 / 12
  const n = years * 12

  let maxPrincipal = 0
  if (maxMonthlyPmt > 0) {
    if (monthlyRate === 0) {
      maxPrincipal = maxMonthlyPmt * n
    } else {
      // 원리금균등 공식 역산: P = PMT × [(1+r)^n − 1] / [r × (1+r)^n]
      const factor = (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n))
      maxPrincipal = Math.floor(maxMonthlyPmt * factor)
    }
  }

  const utilization = monthlyIncome > 0
    ? Math.min(100, (existingDebtMonthlyPmt / monthlyIncome) * 100)
    : 0

  return {
    stressedRate,
    maxMonthlyPmt,
    maxPrincipal,
    monthlyIncome: Math.round(monthlyIncome),
    utilization,
  }
}
