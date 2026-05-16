// ────────────────────────────────────────────────────────────────────────────
// 적금/예금 만기 이자 계산기 + ISA 절세 비교
// 근거: 소득세법 §129 (이자소득 원천징수 14% + 지방소득세 1.4%)
//      조세특례제한법 §91의18 (ISA 비과세 200만원 + 초과분 9.9% 분리과세)
// ────────────────────────────────────────────────────────────────────────────

const TAX_RATE = 0.154            // 일반 이자소득세 15.4% (소득세14% + 지방세1.4%)
// ISA 일반형 비과세 한도 (조특법 §91의18, 2026년 개편)
// 일반형 500만원 / 서민형 1,000만원 — 여기서는 일반형 기준
const ISA_TAX_EXEMPT_LIMIT = 5_000_000
const ISA_TAX_RATE = 0.099        // ISA 초과분 분리과세 9.9%

export type SavingsType = 'deposit' | 'savings'        // 예금 / 적금
export type InterestType = 'simple' | 'compound'       // 단리 / 복리

export interface SavingsInput {
  type: SavingsType
  amount: number          // 예금: 원금 / 적금: 월 납입액 (원)
  annualRate: number      // 연이율 (%)
  months: number          // 기간 (개월)
  interestType: InterestType
}

export interface IsaComparison {
  normalTax: number       // 일반계좌 세금
  normalNet: number       // 일반계좌 세후 이자
  normalMaturity: number  // 일반계좌 세후 수령액
  isaTax: number          // ISA 세금
  isaNet: number          // ISA 세후 이자
  isaMaturity: number     // ISA 세후 수령액
  savedAmount: number     // ISA 절세액 (= normalTax - isaTax)
}

export interface SavingsResult {
  principal: number       // 원금 합계
  grossInterest: number   // 세전 이자
  taxAmount: number       // 이자소득세 (일반계좌 기준)
  netInterest: number     // 세후 이자 (일반계좌 기준)
  maturityAmount: number  // 만기 수령액 (일반계좌 기준)
  effectiveRate: number   // 실효 수익률 (%)
  isa: IsaComparison      // ISA 절세 비교
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

  // ── ISA 절세 비교 ──
  // 비과세 200만원 한도 → 초과분만 9.9% 분리과세
  const isaTaxable = Math.max(0, grossInterest - ISA_TAX_EXEMPT_LIMIT)
  const isaTax = Math.round(isaTaxable * ISA_TAX_RATE)
  const isaNet = grossInterest - isaTax
  const isaMaturity = principal + isaNet

  const isa: IsaComparison = {
    normalTax: taxAmount,
    normalNet: netInterest,
    normalMaturity: maturityAmount,
    isaTax,
    isaNet,
    isaMaturity,
    savedAmount: taxAmount - isaTax,
  }

  return { principal, grossInterest, taxAmount, netInterest, maturityAmount, effectiveRate, isa }
}
