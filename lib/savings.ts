// ────────────────────────────────────────────────────────────────────────────
// 적금/예금 만기 이자 계산기
// ────────────────────────────────────────────────────────────────────────────

const TAX_RATE = 0.154  // 이자소득세 15.4% (소득세14% + 지방소득세1.4%)

export type SavingsType = 'deposit' | 'savings'        // 예금 / 적금
export type InterestType = 'simple' | 'compound'       // 단리 / 복리

export interface SavingsInput {
  type: SavingsType
  amount: number          // 예금: 원금 / 적금: 월 납입액 (원)
  annualRate: number      // 연이율 (%)
  months: number          // 기간 (개월)
  interestType: InterestType
}

export interface SavingsResult {
  principal: number       // 원금 합계
  grossInterest: number   // 세전 이자
  taxAmount: number       // 이자소득세
  netInterest: number     // 세후 이자
  maturityAmount: number  // 만기 수령액 (세후)
  effectiveRate: number   // 실효 수익률 (%)
}

export function calcSavings(input: SavingsInput): SavingsResult {
  const { type, amount, annualRate, months, interestType } = input
  const r = annualRate / 100

  let principal = 0
  let grossInterest = 0

  if (type === 'deposit') {
    // 정기예금
    principal = amount
    if (interestType === 'simple') {
      grossInterest = amount * r * (months / 12)
    } else {
      // 복리 (월 복리)
      const monthlyRate = r / 12
      grossInterest = amount * (Math.pow(1 + monthlyRate, months) - 1)
    }
  } else {
    // 정기적금 (매월 납입)
    principal = amount * months
    if (interestType === 'simple') {
      // 단리 적금: 각 납입월의 이자를 합산
      // 이자 = Σ (납입액 × 연이율 × 잔여개월/12)
      let interest = 0
      for (let m = 1; m <= months; m++) {
        interest += amount * r * ((months - m + 1) / 12)
      }
      grossInterest = interest
    } else {
      // 복리 적금 (월 복리)
      const monthlyRate = r / 12
      let total = 0
      for (let m = 1; m <= months; m++) {
        total += amount * Math.pow(1 + monthlyRate, months - m + 1)
      }
      grossInterest = total - principal
    }
  }

  grossInterest = Math.round(grossInterest)
  const taxAmount = Math.round(grossInterest * TAX_RATE)
  const netInterest = grossInterest - taxAmount
  const maturityAmount = principal + netInterest
  const effectiveRate = principal > 0
    ? (netInterest / principal) * (12 / months) * 100
    : 0

  return { principal, grossInterest, taxAmount, netInterest, maturityAmount, effectiveRate }
}
