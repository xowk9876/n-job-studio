import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── 연봉 계산기 ───────────────────────────────────────────────────────────
interface SalaryStore {
  annualSalary: number
  dependents: number
  children: number
  set: (v: Partial<Omit<SalaryStore, 'set'>>) => void
}
export const useSalaryStore = create<SalaryStore>()(
  persist(
    (set) => ({
      annualSalary: 40_000_000,
      dependents: 1,
      children: 0,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    { name: 'mf-salary' }
  )
)

// ─── 대출 계산기 ───────────────────────────────────────────────────────────
import type { RepaymentType } from '@/lib/mortgage'
interface MortgageStore {
  principal: number
  annualRate: number
  years: number
  type: RepaymentType
  set: (v: Partial<Omit<MortgageStore, 'set'>>) => void
}
export const useMortgageStore = create<MortgageStore>()(
  persist(
    (set) => ({
      principal: 300_000_000,
      annualRate: 3.5,
      years: 30,
      type: 'equal-payment' as RepaymentType,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    { name: 'mf-mortgage' }
  )
)

// ─── 퇴직금 계산기 ────────────────────────────────────────────────────────
interface SeveranceStore {
  avgMonthly3: number
  annualBonus: number
  startDate: string
  endDate: string
  set: (v: Partial<Omit<SeveranceStore, 'set'>>) => void
}
export const useSeveranceStore = create<SeveranceStore>()(
  persist(
    (set) => ({
      avgMonthly3: 3_500_000,
      annualBonus: 0,
      startDate: '2020-01-01',
      endDate: new Date().toISOString().split('T')[0],
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    { name: 'mf-severance' }
  )
)

// ─── 적금/예금 계산기 ─────────────────────────────────────────────────────
import type { SavingsType, InterestType } from '@/lib/savings'
interface SavingsStore {
  type: SavingsType
  amount: number
  annualRate: number
  months: number
  interestType: InterestType
  set: (v: Partial<Omit<SavingsStore, 'set'>>) => void
}
export const useSavingsStore = create<SavingsStore>()(
  persist(
    (set) => ({
      type: 'savings' as SavingsType,
      amount: 500_000,
      annualRate: 3.5,
      months: 12,
      interestType: 'simple' as InterestType,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    { name: 'mf-savings' }
  )
)

// ─── 전월세 계산기 ────────────────────────────────────────────────────────
import type { ConversionDirection } from '@/lib/jeonse'
import { DEFAULT_CONVERSION_RATE } from '@/lib/jeonse'
interface JeonseStore {
  direction: ConversionDirection
  jeonsDeposit: number
  wolseDeposit: number
  currentWolse: number
  currentWolseDeposit: number
  conversionRate: number
  set: (v: Partial<Omit<JeonseStore, 'set'>>) => void
}
export const useJeonseStore = create<JeonseStore>()(
  persist(
    (set) => ({
      direction: 'jeonse-to-wolse' as ConversionDirection,
      jeonsDeposit: 300_000_000,
      wolseDeposit: 50_000_000,
      currentWolse: 800_000,
      currentWolseDeposit: 50_000_000,
      conversionRate: DEFAULT_CONVERSION_RATE,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    { name: 'mf-jeonse' }
  )
)
