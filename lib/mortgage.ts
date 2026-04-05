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
