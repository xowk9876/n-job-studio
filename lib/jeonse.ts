// ────────────────────────────────────────────────────────────────────────────
// 전세↔월세 전환 계산기 + 깡통전세 위험도 진단
// 근거: 주택임대차보호법 §7의2 (전월세 전환율 = 기준금리 + 2%)
// 모든 수치는 최근 고시 기준이며 한국은행·시장 동향에 따라 변동됩니다.
// ────────────────────────────────────────────────────────────────────────────

// 한국은행 기준금리 3.00% (2026.8.27 금통위 0.25%p 인상, 10.22 동결)
import { inRange, MAX_RATE } from './input-validation'

export const DEFAULT_BASE_RATE = 3.0
// 주택임대차보호법 §7의2 법정 가산
export const LEGAL_PREMIUM = 2.0
// 법정 전월세 전환율 상한 (기준금리 + 2%)
export const DEFAULT_CONVERSION_RATE = DEFAULT_BASE_RATE + LEGAL_PREMIUM

// 기회비용 비교용 고정 가정. 시장 평균 또는 사용자 실제 조달금리가 아니다.
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
  error?: string
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
      label: '전세가율 90% 이상',
      message: '보증금이 입력 시세에 근접하거나 초과합니다. 시세 하락·선순위 권리에 따른 회수 위험을 확인하세요. 이 비율은 보증기관의 인정 주택가격이나 가입 심사 결과가 아닙니다.',
    }
  }
  if (ratio >= 80) {
    return {
      ratio,
      level: 'caution',
      label: '전세가율 80~90%',
      message: '전세가율 80~90%는 시세 하락 시 보증금 회수 위험이 있습니다. HUG 반환보증 한도와 선순위 채권을 반드시 확인하세요.',
    }
  }
  return {
    ratio,
    level: 'safe',
    label: '전세가율 80% 미만',
    message: '전세가율만으로 보증금 회수를 보장할 수 없습니다. 선순위 채권·임대인 세금 체납·주택가격 산정과 반환보증 가입 가능 여부를 함께 확인하세요.',
  }
}

export function calcJeonse(input: JeonseInput): JeonseResult {
  const { direction, conversionRate, marketPrice } = input
  const rate = conversionRate / 100

  // 0 또는 음수 전환율 가드 (Division by Zero 방지)
  if (!inRange(conversionRate, 0.001, MAX_RATE) || !['jeonse-to-wolse', 'wolse-to-jeonse'].includes(direction) ||
      ![input.jeonsDeposit ?? 0, input.wolseDeposit ?? 0, input.currentWolse ?? 0, input.currentWolseDeposit ?? 0, marketPrice ?? 0].every(v => inRange(v))) {
    return {
      error: '금액은 0~1조원, 전환율은 0.001~100% 범위로 입력해주세요.',
      monthlyRent: direction === 'jeonse-to-wolse' ? 0 : undefined,
      jeonseDeposit: direction === 'wolse-to-jeonse' ? 0 : undefined,
      annualCost: 0,
      breakEvenRate: OPPORTUNITY_RATE,
      suggestion: '전환율은 0%보다 커야 합니다. 보증금을 월세로 전환할 때의 법정 상한과 적용 범위를 확인해주세요.',
    }
  }

  if (direction === 'jeonse-to-wolse') {
    const jeonseDeposit = input.jeonsDeposit ?? 0
    const wolseDeposit = input.wolseDeposit ?? 0
    // 월세 보증금이 전세 보증금보다 큰 비정상 입력 가드 (음수 월세 차단)
    const diff = Math.max(0, jeonseDeposit - wolseDeposit)

    // 월세 = (전세 보증금 - 월세 보증금) × 전환율 / 12
    const monthlyRent = Math.round((diff * rate) / 12)
    const annualCost = monthlyRent * 12
    const breakEvenRate = OPPORTUNITY_RATE

    const suggestion = conversionRate > OPPORTUNITY_RATE
      ? `전환율(${conversionRate}%)이 비교 가정 금리(${OPPORTUNITY_RATE}%)보다 높아 전세 유지가 유리할 수 있습니다. 보증금을 묶어두는 기회비용보다 월세 부담이 더 큽니다.`
      : `전환율(${conversionRate}%)이 비교 가정 금리(${OPPORTUNITY_RATE}%) 이하로 낮아 월세 전환도 고려할 만합니다.`

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
  if (!Number.isSafeInteger(jeonseDeposit)) {
    return { error: '계산 결과가 지원 범위를 넘습니다. 금액·전환율을 확인해주세요.', jeonseDeposit: 0, annualCost: 0, breakEvenRate: OPPORTUNITY_RATE, suggestion: '입력을 확인해주세요.' }
  }
  const annualCost = currentWolse * 12

  const opportunityCostAnnual = additionalDeposit * (OPPORTUNITY_RATE / 100)
  const breakEvenRate = OPPORTUNITY_RATE

  const suggestion = opportunityCostAnnual < annualCost
    ? `전세 전환 시 추가 보증금의 기회비용(연 ${Math.round(opportunityCostAnnual / 10000).toLocaleString()}만원)이 현재 월세 합계(연 ${Math.round(annualCost / 10000).toLocaleString()}만원)보다 낮아 이 가정에서는 전세 전환의 비용이 낮습니다. 실제 대출금리·세후 운용수익·보증료는 별도로 비교하세요.`
    : `전세 전환 시 추가 보증금의 기회비용이 월세 절감액보다 클 수 있습니다. 전세 자금 대출 금리도 함께 비교해보세요.`

  return {
    jeonseDeposit,
    annualCost,
    breakEvenRate,
    suggestion,
    risk: buildRisk(jeonseDeposit, marketPrice),
  }
}
