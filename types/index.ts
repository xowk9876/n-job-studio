// ─── Offense (창) ───────────────────────────────────────────────
export type ProductCategory =
  | 'electronics'
  | 'beauty'
  | 'health'
  | 'fashion'
  | 'food'
  | 'other'

export type WritingTone = 'professional' | 'friendly' | 'humorous'

export interface ProductSpec {
  productName: string
  category: ProductCategory
  price: number
  specs: string
  pros: string[]
  cons: string[]
  targetAudience: string
  tone: WritingTone
}

export interface GenerationHistory {
  id: string
  createdAt: string
  productName: string
  output: string
}

// ─── Defense (방패) ──────────────────────────────────────────────
export interface TaxInput {
  mainJobSalary: number // 본업 연봉 (만원)
  sideIncome: number   // 부업 연 수익 (만원)
}

export type RiskLevel = 'safe' | 'caution' | 'danger'

export interface TaxResult {
  totalIncome: number
  incomeTax: number
  localIncomeTax: number
  healthInsurance: number
  longTermCare: number
  totalDeduction: number
  netIncome: number
  riskLevel: RiskLevel
  riskMessage: string
  riskDetail: string
}
