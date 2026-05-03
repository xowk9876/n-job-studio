/**
 * 금액 포맷 공용 유틸
 * - formatKRW(123456) → "123,456원"
 * - formatManwon(12345678) → "1,234만원"
 * - formatEok(1234567890) → "12.3억"
 */
export function formatKRW(n: number): string {
  if (!Number.isFinite(n)) return '0원'
  return Math.round(n).toLocaleString('ko-KR') + '원'
}

export function formatManwon(n: number, withUnit: boolean = true): string {
  if (!Number.isFinite(n)) return withUnit ? '0만원' : '0'
  const man = Math.round(n / 10_000)
  const body = man.toLocaleString('ko-KR')
  return withUnit ? `${body}만원` : body
}

export function formatEok(n: number): string {
  if (!Number.isFinite(n) || n === 0) return '0'
  const eok = n / 100_000_000
  if (Math.abs(eok) >= 10) return `${eok.toFixed(1)}억`
  if (Math.abs(eok) >= 1) return `${eok.toFixed(2)}억`
  return formatManwon(n)
}

export function formatPct(n: number, digits: number = 2): string {
  if (!Number.isFinite(n)) return '0%'
  return `${n.toFixed(digits)}%`
}
