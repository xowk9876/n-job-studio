import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TaxRiskStore {
  mainJobSalary: number
  sideIncome: number
  set: (v: Partial<Omit<TaxRiskStore, 'set'>>) => void
}

export const useTaxRiskStore = create<TaxRiskStore>()(
  persist(
    (set) => ({
      mainJobSalary: 4000,
      sideIncome: 0,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    { name: 'mf-tax-risk' },
  ),
)
