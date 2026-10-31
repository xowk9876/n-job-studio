/** 계산기 공통 범위. 금액은 원 단위로 검사하며 저장된 값에도 같은 기준을 적용한다. */
export const MAX_MONEY = 1_000_000_000_000
export const MAX_RATE = 100

export function inRange(value: number, min = 0, max = MAX_MONEY): boolean {
  return Number.isFinite(value) && value >= min && value <= max
}

export function parseCalendarDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null
}

/** JSON 상태를 복원할 때 함수·알 수 없는 키·범위 밖 숫자로 현재 store를 덮어쓰지 않는다. */
export function mergeStoredInputs<T extends object>(persisted: unknown, current: T): T {
  if (!persisted || typeof persisted !== 'object') return current
  const saved = persisted as Record<string, unknown>
  const result = { ...current }
  const ranges: Record<string, [number, number]> = {
    annualRate: [0, MAX_RATE], conversionRate: [0, MAX_RATE],
    years: [1, 50], months: [1, 600], dependents: [1, 11], children: [0, 10],
    overtimeHours: [0, 80], nightHours: [0, 40], holidayHours: [0, 248], holidayOver8Hours: [0, 248],
  }
  const enums: Record<string, readonly string[]> = {
    type: ['deposit', 'savings'].includes(String((current as Record<string, unknown>).type))
      ? ['deposit', 'savings'] : ['equal-payment', 'equal-principal', 'bullet'],
    interestType: ['simple', 'compound'], direction: ['jeonse-to-wolse', 'wolse-to-jeonse'],
  }
  for (const key of Object.keys(current) as (keyof T & string)[]) {
    const value = saved[key]
    if (typeof current[key] === 'function' || typeof value !== typeof current[key]) continue
    if (typeof value === 'number') {
      const [min, max] = ranges[key] ?? [0, MAX_MONEY]
      if (!inRange(value, min, max)) continue
      if (['years', 'months', 'dependents', 'children'].includes(key) && !Number.isInteger(value)) continue
    }
    if (typeof value === 'string') {
      if (key.endsWith('Date') && value !== '' && !parseCalendarDate(value)) continue
      if (enums[key] && !enums[key].includes(value)) continue
    }
    result[key] = value as T[typeof key]
  }
  const family = result as Record<string, unknown>
  if (typeof family.children === 'number' && typeof family.dependents === 'number') {
    family.children = Math.min(family.children, family.dependents - 1)
  }
  return result
}

/** 원리금균등 현가계수. 0에 가까운 금리에서도 뺄셈 오차가 발생하지 않는다. */
export function annuityFactor(monthlyRate: number, months: number): number {
  return monthlyRate === 0 ? months : -Math.expm1(-months * Math.log1p(monthlyRate)) / monthlyRate
}

export function migrateSalaryInputs(persisted: unknown, version: number): unknown {
  if (!persisted || typeof persisted !== 'object') return {}
  if (version >= 2) return persisted
  if (version < 1) return {}
  const saved = persisted as Record<string, unknown>
  // 구 버전은 월 합계만 저장하여 하루별 8시간 초과분을 복원할 수 없다.
  return { ...saved, holidayHours: 0, holidayOver8Hours: 0, holidayReviewRequired: Number(saved.holidayHours) > 0 }
}
