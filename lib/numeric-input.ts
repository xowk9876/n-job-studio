import { inRange, MAX_MONEY } from './input-validation'

/** 만원 입력은 소수점 넷째 자리(1원)까지 정수로 변환한다. */
export function parseNumericInput(text: string, multiplier: 1 | 10000 = 1, decimal = false, min = 0, max = MAX_MONEY): number | null {
  const raw = text.replace(/,/g, '')
  let value: number
  if (multiplier === 10000) {
    if (!/^\d*(?:\.\d{0,4})?$/.test(raw)) return null
    const [whole, fraction = ''] = raw.split('.')
    value = Number(whole) * multiplier + Number(fraction.padEnd(4, '0'))
  } else {
    if (!(decimal ? /^\d*(?:\.\d*)?$/ : /^\d*$/).test(raw)) return null
    value = raw === '.' ? 0 : Number(raw)
  }
  return inRange(value, min, max) && Number.isSafeInteger(Math.trunc(value)) ? value : null
}
