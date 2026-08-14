import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── 연봉 계산기 ───────────────────────────────────────────────────────────
interface SalaryStore {
  annualSalary: number
  dependents: number
  children: number
  overtimeHours: number
  nightHours: number
  holidayHours: number
  mealAllowance: number
  transportAllowance: number
  set: (v: Partial<Omit<SalaryStore, 'set'>>) => void
}
export const useSalaryStore = create<SalaryStore>()(
  persist(
    (set) => ({
      annualSalary: 40_000_000,
      dependents: 1,
      children: 0,
      overtimeHours: 0,
      nightHours: 0,
      holidayHours: 0,
      mealAllowance: 200_000,
      transportAllowance: 0,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    {
      name: 'mf-salary',
      skipHydration: true,
      // NumericInput 만원 단위 회귀 복구 — 원 단위로 잘못 저장된 재방문자 입력값을 초기화
      version: 1,
    }
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
    {
      name: 'mf-mortgage',
      skipHydration: true,
      version: 1,
    }
  )
)

// ─── 퇴직금 계산기 ────────────────────────────────────────────────────────
interface SeveranceStore {
  avgMonthly3: number
  annualBonus: number
  startDate: string
  endDate: string
  regularHourlyWage: number  // 통상시급 (선택, 0이면 미적용)
  set: (v: Partial<Omit<SeveranceStore, 'set'>>) => void
}
export const useSeveranceStore = create<SeveranceStore>()(
  persist(
    (set) => ({
      avgMonthly3: 3_500_000,
      annualBonus: 0,
      startDate: '2020-01-01',
      // SSR hydration 안정성: 고정 초기값, 클라이언트 마운트 시 오늘 날짜로 덮어씀
      endDate: '2026-05-22',
      regularHourlyWage: 0,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    {
      name: 'mf-severance',
      skipHydration: true,
      version: 1,
    }
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
    {
      name: 'mf-savings',
      skipHydration: true,
      version: 1,
    }
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
  marketPrice: number  // 매매 시세 (선택, 0이면 깡통전세 분석 미표시)
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
      marketPrice: 0,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    {
      name: 'mf-jeonse',
      skipHydration: true,
      // 기준금리 인상(2026.7.16, 2.50%→2.75%)으로 법정 전환율 상한이 4.5%→4.75%로 변경됐다.
      // 버전을 올려 이전 값을 저장한 재방문자에게도 갱신된 법정 상한이 적용되도록 한다.
      version: 1,
      migrate: (persisted) => ({
        ...(persisted as JeonseStore),
        conversionRate: DEFAULT_CONVERSION_RATE,
      }),
    }
  )
)
