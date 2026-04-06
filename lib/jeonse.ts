// ────────────────────────────────────────────────────────────────────────────
// 전세↔월세 전환 계산기
// 법정 전월세 전환율 상한: 기준금리 + 2%
// 2026 기준 기준금리 2.5% → 전환율 상한 4.5%
// ────────────────────────────────────────────────────────────────────────────

export const DEFAULT_BASE_RATE = 2.5     // 기준금리 (%, 한국은행 2026.01 동결 확인)
export const LEGAL_PREMIUM = 2.0         // 법정 가산 (%)
export const DEFAULT_CONVERSION_RATE = DEFAULT_BASE_RATE + LEGAL_PREMIUM  // 4.5%

// 기회비용 비교 기준금리 (예금·적금 평균 시장금리 근사값 — 2026)
const OPPORTUNITY_RATE = 3.0  // %

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
  breakEvenRate: number       // 손익분기 기준 전환율 (%)
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

    // 손익분기 전환율: 보증금 차액의 기회비용(예금금리 기준)과 비교
    // 전환율 > 예금금리 → 전세 유지가 유리 (월세가 더 비쌈)
    // 전환율 ≤ 예금금리 → 월세 전환도 고려할만 (기회비용 대비 저렴)
    const breakEvenRate = OPPORTUNITY_RATE

    const suggestion = conversionRate > OPPORTUNITY_RATE
      ? `전환율(${conversionRate}%)이 예금금리(${OPPORTUNITY_RATE}%)보다 높아 전세 유지가 유리합니다. 보증금을 묶어두는 기회비용보다 월세 부담이 더 큽니다.`
      : `전환율(${conversionRate}%)이 예금금리(${OPPORTUNITY_RATE}%) 이하로 낮아 월세 전환도 고려할만 합니다.`

    return { monthlyRent, annualCost, breakEvenRate, suggestion }
  }

  // 월세→전세
  const currentWolse = input.currentWolse ?? 0
  const currentWolseDeposit = input.currentWolseDeposit ?? 0

  // 전세 보증금 = 월세 보증금 + (월세 × 12 / 전환율)
  const additionalDeposit = Math.round((currentWolse * 12) / rate)
  const jeonseDeposit = currentWolseDeposit + additionalDeposit
  const annualCost = currentWolse * 12

  // 추가 보증금의 기회비용(예금금리 기준) vs 현재 월세 비교
  // 기회비용 연간 = additionalDeposit × 예금금리
  const opportunityCostAnnual = additionalDeposit * (OPPORTUNITY_RATE / 100)
  const breakEvenRate = OPPORTUNITY_RATE

  const suggestion = opportunityCostAnnual < annualCost
    ? `전세 전환 시 추가 보증금의 기회비용(연 ${Math.round(opportunityCostAnnual / 10000).toLocaleString()}만원)이 현재 월세 합계(연 ${Math.round(annualCost / 10000).toLocaleString()}만원)보다 낮아 전세 전환이 유리합니다.`
    : `전세 전환 시 추가 보증금의 기회비용이 월세 절감액보다 클 수 있습니다. 전세 자금 대출 금리도 함께 비교해보세요.`

  return { jeonseDeposit, annualCost, breakEvenRate, suggestion }
}
