// ────────────────────────────────────────────────────────────────────────────
// N잡러 부업 세금·건보료 리스크 예측기
// 근거: 소득세법 §55(종합소득세 누진세율), 국민건강보험법(피부양자 자격 기준)
// ────────────────────────────────────────────────────────────────────────────

const TAX_BRACKETS = [
  { limit: 14_000_000,    rate: 0.06, deduction: 0 },
  { limit: 50_000_000,    rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000,    rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000,   rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000,   rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000,   rate: 0.40, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity,      rate: 0.45, deduction: 65_940_000 },
]

// 건보 지역가입자 전환 시 소득 보험료율 (2026)
const REGIONAL_HEALTH_RATE = 0.0719

export type RiskLevel = 'safe' | 'caution' | 'danger'

export interface TaxRiskInput {
  mainJobSalary: number   // 본업 연봉 (만원)
  sideIncome: number      // 부업 연 수익 (만원)
}

export interface TaxRiskResult {
  totalIncome: number
  sideIncomeWon: number
  incomeTax: number
  localIncomeTax: number
  healthInsurance: number
  longTermCare: number
  totalDeduction: number
  netIncome: number
  effectiveTaxRate: number
  riskLevel: RiskLevel
  riskLabel: string
  riskMessage: string
  riskDetail: string
}

function calcGrossTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  for (const b of TAX_BRACKETS) {
    if (taxableIncome <= b.limit) {
      return Math.max(0, taxableIncome * b.rate - b.deduction)
    }
  }
  return 0
}

export function calcTaxRisk(input: TaxRiskInput): TaxRiskResult {
  const mainWon = input.mainJobSalary * 10_000
  const sideWon = input.sideIncome * 10_000
  const totalIncome = mainWon + sideWon

  // 필요경비 공제 (사업소득 단순경비율 근사: 부업 소득의 60%)
  const sideExpenseRate = 0.6
  const sideNetIncome = sideWon * (1 - sideExpenseRate)

  // 종합과세 대상 소득 (본업 근로소득 + 부업 사업소득)
  const taxableIncome = mainWon + sideNetIncome

  const incomeTax = Math.round(calcGrossTax(taxableIncome))
  const localIncomeTax = Math.round(incomeTax * 0.10)

  // 건보 피부양자 탈락 시 지역가입자 보험료 (부업 소득 기준)
  let healthInsurance = 0
  let longTermCare = 0

  if (input.sideIncome > 2000) {
    healthInsurance = Math.round((sideWon * REGIONAL_HEALTH_RATE) / 12) * 12
    longTermCare = Math.round(healthInsurance * 0.1314)
  } else if (input.sideIncome > 500) {
    // 직장가입자 추가 부담 (부업 소득에 대한 건보료)
    healthInsurance = Math.round((sideWon / 12) * 0.03545) * 12
    longTermCare = Math.round(healthInsurance * 0.1314)
  }

  const totalDeduction = incomeTax + localIncomeTax + healthInsurance + longTermCare
  const netIncome = totalIncome - totalDeduction
  const effectiveTaxRate = totalIncome > 0 ? (totalDeduction / totalIncome) * 100 : 0

  // 리스크 판정
  let riskLevel: RiskLevel
  let riskLabel: string
  let riskMessage: string
  let riskDetail: string

  if (input.sideIncome <= 0) {
    riskLevel = 'safe'
    riskLabel = '부업 소득 없음'
    riskMessage = '부업 소득이 없으면 추가 세금 부담이 없습니다.'
    riskDetail = ''
  } else if (input.sideIncome < 500) {
    riskLevel = 'safe'
    riskLabel = '안전'
    riskMessage = '피부양자 자격 유지 가능. 추가 건보료 부담 없습니다.'
    riskDetail = '연 500만원 미만 부업 소득은 대부분 피부양자 자격을 유지할 수 있습니다. 다만 금융소득(이자·배당)과 합산하면 탈락할 수 있으니 주의하세요.'
  } else if (input.sideIncome < 2000) {
    riskLevel = 'caution'
    riskLabel = '주의'
    riskMessage = '금융소득 합산 시 피부양자 탈락 가능. 직장가입자 추가 보험료 발생.'
    riskDetail = `연 부업 소득 ${input.sideIncome.toLocaleString()}만원은 피부양자 자격 경계 구간입니다. 금융소득(이자·배당)과 합산해 연 2,000만원을 넘으면 지역가입자로 전환됩니다.`
  } else {
    riskLevel = 'danger'
    riskLabel = '위험'
    riskMessage = '지역가입자 전환! 건보료 폭탄 가능성.'
    riskDetail = `연 부업 소득 ${input.sideIncome.toLocaleString()}만원은 피부양자 자격 상실 구간입니다. 지역가입자로 전환되면 월 건보료 약 ${Math.round(healthInsurance / 12).toLocaleString()}원이 추가됩니다.`
  }

  return {
    totalIncome,
    sideIncomeWon: sideWon,
    incomeTax,
    localIncomeTax,
    healthInsurance,
    longTermCare,
    totalDeduction,
    netIncome,
    effectiveTaxRate,
    riskLevel,
    riskLabel,
    riskMessage,
    riskDetail,
  }
}
