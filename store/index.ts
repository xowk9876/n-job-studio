import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mergeStoredInputs, migrateSalaryInputs } from '@/lib/input-validation'

function calculatorStorage<T>() {
  return createJSONStorage<T>(() => {
    const storage = window.localStorage
    // 할당량 초과 등으로 저장되지 않은 입력은 현재 탭에서만 보존한다.
    const unsaved = new Map<string, string | null>()
    function write(name: string, value: string | null) {
      try {
        if (value === null) storage.removeItem(name)
        else storage.setItem(name, value)
        unsaved.delete(name)
      } catch {
        unsaved.set(name, value)
      }
    }
    return {
      getItem: (name) => unsaved.has(name) ? unsaved.get(name) ?? null : storage.getItem(name),
      setItem: write,
      removeItem: (name) => write(name, null),
    }
  })
}

// ─── 연봉 계산기 ───────────────────────────────────────────────────────────
interface SalaryStore {
  annualSalary: number
  dependents: number
  children: number
  overtimeHours: number
  nightHours: number
  holidayHours: number
  holidayOver8Hours: number
  holidayReviewRequired: boolean
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
      holidayOver8Hours: 0,
      holidayReviewRequired: false,
      mealAllowance: 200_000,
      transportAllowance: 0,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    {
      name: 'mf-salary',
      storage: calculatorStorage(),
      skipHydration: true,
      version: 2,
      migrate: migrateSalaryInputs,
      merge: mergeStoredInputs,
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
      storage: calculatorStorage(),
      merge: mergeStoredInputs,
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
      // 저장값 복원이 끝난 뒤 빈 값에만 오늘 날짜를 채운다.
      endDate: '',
      regularHourlyWage: 0,
      set: (v) => set((s) => ({ ...s, ...v })),
    }),
    {
      name: 'mf-severance',
      storage: calculatorStorage(),
      merge: mergeStoredInputs,
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
      storage: calculatorStorage(),
      merge: mergeStoredInputs,
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
      storage: calculatorStorage(),
      merge: mergeStoredInputs,
      skipHydration: true,
      // 구 기본값(4.75%)만 갱신하고 직접 입력한 전환율은 보존한다.
      version: 2,
      migrate: (persisted) => {
        if (!persisted || typeof persisted !== 'object') return {}
        const saved = persisted as Partial<JeonseStore>
        return saved.conversionRate === 4.75 ? { ...saved, conversionRate: DEFAULT_CONVERSION_RATE } : saved
      },
    }
  )
)
