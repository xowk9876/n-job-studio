// ────────────────────────────────────────────────────────────────────────────
// 전세↔월세 전환 계산기
// 법정 전월세 전환율 상한: 기준금리 + 2%
// 2026 기준 기준금리 2.5% → 전환율 상한 4.5%
// ────────────────────────────────────────────────────────────────────────────

export const DEFAULT_BASE_RATE = 2.5     // 기준금리 (%, 한국은행 2025.05~ 동결)
export const LEGAL_PREMIUM = 2.0         // 법정 가산 (%)
export const DEFAULT_CONVERSION_RATE = DEFAULT_BASE_RATE + LEGAL_PREMIUM  // 4.5%

export type ConversionDirection = 'jeonse-to-wolse' | 'wolse-to-jeonse'

export interface JeonseInput {
  direction: ConversionDirection
  // 전세→월세
  jeonsDeposit?: number       // 전세 보증금 (원)
  wolseDeposit?: number       // 월세 보증금 (원, 전세→월세 시 목표 보증금)
  // 월세→전세
  currentWolse?: number       // 현재 월세 (원)
  currentWolseDeposit?: number // 현재 월세 보증금 (원)
  // 공통
  conversionRate: number      // 전환율 (%)
}

export interface JeonseResult {
  // 전세→월세
  monthlyRent?: number        // 전환 후 월세 (원)
  // 월세→전세
  jeonseDeposit?: number      // 전환 후 전세 보증금 (원)
  // 비교 분석
  annualCost: number          // 연간 주거비용 (원)
  breakEvenRate: number       // 손익분기 전환율 (%)
  suggestion: string          // 유리한 방향 설명
}

export function calcJeonse(input: JeonseInput): JeonseResult {
  const { direction, conversionRate } = input
  const rate = conversionRate / 100

  if (direction === 'jeonse-to-wolse') {
    const jeonseDeposit = input.jeonsDeposit ?? 0
    const wolseDeposit = input.wolseDeposit ?? 0
    const diff = jeonseDeposit - wolseDeposit

    // 월세 = (전세 보증금 - 월세 보증금) × 전환율 / 12
    const monthlyRent = Math.round((diff * rate) / 12)
    const annualCost = monthlyRent * 12

    // 손익분기: 전환율이 이 값 이상이면 전세가 유리
    const breakEvenRate = diff > 0 ? (annualCost / diff) * 100 : 0

    const suggestion = conversionRate > breakEvenRate
      ? `전환율(${conversionRate}%)이 손익분기(${breakEvenRate.toFixed(1)}%)보다 높아 전세 유지가 유리합니다.`
      : `전환율(${conversionRate}%)이 낮아 월세 전환이 상대적으로 유리합니다.`

    return { monthlyRent, annualCost, breakEvenRate, suggestion }
  }

  // 월세→전세
  const currentWolse = input.currentWolse ?? 0
  const currentWolseDeposit = input.currentWolseDeposit ?? 0

  // 전세 보증금 = 월세 보증금 + (월세 × 12 / 전환율)
  const additionalDeposit = Math.round((currentWolse * 12) / rate)
  const jeonseDeposit = currentWolseDeposit + additionalDeposit
  const annualCost = currentWolse * 12

  const breakEvenRate = additionalDeposit > 0
    ? (annualCost / additionalDeposit) * 100
    : 0

  const suggestion = conversionRate > breakEvenRate
    ? `월세 전환율(${conversionRate}%)이 높아 전세 전환 시 이자 비용 절감 효과가 있습니다.`
    : `현재 월세 수준이면 전세 전환 자금 마련 이자가 더 클 수 있습니다.`

  return { jeonseDeposit, annualCost, breakEvenRate, suggestion }
}
