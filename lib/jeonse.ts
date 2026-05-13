// ────────────────────────────────────────────────────────────────────────────
// 전세↔월세 전환 계산기 + 깡통전세 위험도 진단
// 근거: 주택임대차보호법 §7의2 (전월세 전환율 = 기준금리 + 2%)
// 모든 수치는 최근 고시 기준이며 한국은행·시장 동향에 따라 변동됩니다.
// ────────────────────────────────────────────────────────────────────────────

// 한국은행 기준금리 2.50% (최근 고시 기준)
export const DEFAULT_BASE_RATE = 2.5
// 주택임대차보호법 §7의2 법정 가산
export const LEGAL_PREMIUM = 2.0
// 법정 전월세 전환율 상한 (기준금리 + 2%)
export const DEFAULT_CONVERSION_RATE = DEFAULT_BASE_RATE + LEGAL_PREMIUM

// 기회비용 비교 기준 (시장 평균 예금금리 근사값)
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
  // 깡통전세 진단 (선택)
  marketPrice?: number        // 매매 시세 (원)
}

export type JeonseRiskLevel = 'safe' | 'caution' | 'danger'

export interface JeonseRisk {
  ratio: number               // 전세가율 (%)
  level: JeonseRiskLevel
  label: string
  message: string
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
  // 깡통전세 위험도 (시세 입력 시에만)
  risk?: JeonseRisk
}

function buildRisk(deposit: number, marketPrice?: number): JeonseRisk | undefined {
  if (!marketPrice || marketPrice <= 0 || deposit <= 0) return undefined
  const ratio = (deposit / marketPrice) * 100
  if (ratio >= 90) {
    return {
      ratio,
      level: 'danger',
      label: '깡통전세 위험',
      message: '전세가율이 90%를 넘으면 HUG 전세보증금반환보증 가입 조건을 충족하지 못할 가능성이 큽니다. 계약 전 등기부등본·근저당 확인과 보증보험 가입을 반드시 검토하세요.',
    }
  }
  if (ratio >= 80) {
    return {
      ratio,
      level: 'caution',
      label: '주의 구간',
      message: '전세가율 80~90%는 시세 하락 시 보증금 회수 위험이 있습니다. HUG 반환보증 한도와 선순위 채권을 반드시 확인하세요.',
    }
  }
  return {
    ratio,
    level: 'safe',
    label: '안전 구간',
    message: '전세가율이 80% 미만으로 비교적 안전한 구간입니다. 그래도 등기부등본·임대인 세금 체납·HUG 보증 가입은 점검하세요.',
  }
}

export function calcJeonse(input: JeonseInput): JeonseResult {
  const { direction, conversionRate, marketPrice } = input
  const rate = conversionRate / 100

  // 0 또는 음수 전환율 가드 (Division by Zero 방지)
  if (rate <= 0) {
    return {
      monthlyRent: direction === 'jeonse-to-wolse' ? 0 : undefined,
      jeonseDeposit: direction === 'wolse-to-jeonse' ? 0 : undefined,
      annualCost: 0,
      breakEvenRate: OPPORTUNITY_RATE,
      suggestion: '전환율은 0%보다 커야 합니다. 법정 상한(기준금리 + 2%)을 확인해주세요.',
    }
  }

  if (direction === 'jeonse-to-wolse') {
    const jeonseDeposit = input.jeonsDeposit ?? 0
    const wolseDeposit = input.wolseDeposit ?? 0
    const diff = jeonseDeposit - wolseDeposit

    // 월세 = (전세 보증금 - 월세 보증금) × 전환율 / 12
    const monthlyRent = Math.round((diff * rate) / 12)
    const annualCost = monthlyRent * 12
    const breakEvenRate = OPPORTUNITY_RATE

    const suggestion = conversionRate > OPPORTUNITY_RATE
      ? `전환율(${conversionRate}%)이 시장 예금금리 근사값(${OPPORTUNITY_RATE}%)보다 높아 전세 유지가 유리할 수 있습니다. 보증금을 묶어두는 기회비용보다 월세 부담이 더 큽니다.`
      : `전환율(${conversionRate}%)이 시장 예금금리 근사값(${OPPORTUNITY_RATE}%) 이하로 낮아 월세 전환도 고려할 만합니다.`

    return {
      monthlyRent,
      annualCost,
      breakEvenRate,
      suggestion,
      risk: buildRisk(jeonseDeposit, marketPrice),
    }
  }

  // 월세→전세
  const currentWolse = input.currentWolse ?? 0
  const currentWolseDeposit = input.currentWolseDeposit ?? 0

  // 전세 보증금 = 월세 보증금 + (월세 × 12 / 전환율)
  const additionalDeposit = Math.round((currentWolse * 12) / rate)
  const jeonseDeposit = currentWolseDeposit + additionalDeposit
  const annualCost = currentWolse * 12

  const opportunityCostAnnual = additionalDeposit * (OPPORTUNITY_RATE / 100)
  const breakEvenRate = OPPORTUNITY_RATE

  const suggestion = opportunityCostAnnual < annualCost
    ? `전세 전환 시 추가 보증금의 기회비용(연 ${Math.round(opportunityCostAnnual / 10000).toLocaleString()}만원)이 현재 월세 합계(연 ${Math.round(annualCost / 10000).toLocaleString()}만원)보다 낮아 전세 전환이 유리합니다.`
    : `전세 전환 시 추가 보증금의 기회비용이 월세 절감액보다 클 수 있습니다. 전세 자금 대출 금리도 함께 비교해보세요.`

  return {
    jeonseDeposit,
    annualCost,
    breakEvenRate,
    suggestion,
    risk: buildRisk(jeonseDeposit, marketPrice),
  }
}
