import { inRange, MAX_MONEY } from './input-validation'

/** 화면의 문자열을 저장 단위로 변환한 뒤 범위를 검사한다. */
export function parseNumericInput(text: string, multiplier = 1, decimal = false, min = 0, max = MAX_MONEY): number | null {
  const raw = text.replace(/,/g, '')
  if (!(decimal ? /^\d*(\.\d*)?$/ : /^\d*$/).test(raw)) return null
  const number = raw === '' || raw === '.' ? 0 : Number(raw)
  const scaled = number * multiplier
  const value = decimal && multiplier === 1 ? scaled : Math.round(scaled)
  return inRange(value, min, max) && Number.isSafeInteger(Math.trunc(value)) ? value : null
}
