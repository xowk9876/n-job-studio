'use client'

import { forwardRef, useState, useId, InputHTMLAttributes } from 'react'

import { parseNumericInput } from '@/lib/numeric-input'
import { MAX_MONEY } from '@/lib/input-validation'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  value: number | ''
  onChange: (v: number) => void
  suffix?: string
  ariaLabel?: string
  /** @deprecated 초기값이 있어도 내부에서 사용하지 않음 (상태는 외부 value로 제어) */
  defaultValue?: number
  /**
   * 표시 단위 배수. 스토어는 원 단위를 유지한다.
   * 10000이면 입력칸은 만원, onChange는 원(×10000)으로 내보낸다.
   */
  unitMultiplier?: number
  /** 소수점 허용 (전환율 등) */
  allowDecimal?: boolean
}

function formatDisplay(n: number, allowDecimal: boolean) {
  if (!Number.isFinite(n)) return ''
  if (allowDecimal) return n.toLocaleString('ko-KR', { maximumSignificantDigits: 21 })
  return Math.round(n).toLocaleString('ko-KR')
}

/**
 * 숫자 입력 — 3자리 콤마 자동 포맷 + tabular-nums
 * 내부 표시값: string(콤마 포함), 외부 값: number (원 등 스토어 단위)
 */
const NumericInput = forwardRef<HTMLInputElement, Props>(function NumericInput(
  {
    value,
    onChange,
    suffix,
    ariaLabel,
    className = '',
    defaultValue: _dv,
    unitMultiplier = 1,
    allowDecimal = false,
    min = 0,
    max = MAX_MONEY,
    ...rest
  },
  ref
) {
  const multiplier = unitMultiplier > 0 ? unitMultiplier : 1

  const errorId = useId()
  const [draft, setDraft] = useState<{ value: number | ''; text: string; error?: string } | null>(null)
  // 사용자가 입력 중인 소수점과 빈칸은 보존하고, 저장값 복원 등 외부 변경 시에는 버린다.
  if (draft && draft.value !== value) setDraft(null)
  const display = draft?.text ?? (typeof value === 'number' ? formatDisplay(value / multiplier, allowDecimal) : '')
  const error = draft?.error

  // 호출자 className을 그대로 존중. className이 비어 있으면 기본 glass-input 스타일 적용
  const baseClass = className.trim()
    ? className
    : 'glass-input w-full rounded-xl px-4 py-3 text-[15px] font-semibold'
  const mergedClass = `${baseClass} tabular${suffix && !/\bpr-\d+/.test(baseClass) ? ' pr-14' : ''}`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value
    const next = parseNumericInput(rawInput, multiplier, allowDecimal, Number(min), Number(max))
    if (next === null) {
      setDraft({ value, text: rawInput, error: `${Number(min) / multiplier}~${(Number(max) / multiplier).toLocaleString('ko-KR')} 범위의 숫자를 입력해주세요. 이전 정상 입력값으로 계산 중입니다.` })
      return
    }
    const raw = rawInput.replace(/,/g, '')
    const [integer, fraction] = raw.split('.')
    const text = raw === '' ? '' : `${formatDisplay(Number(integer || 0), false)}${fraction !== undefined ? `.${fraction}` : ''}`
    setDraft({ value: next, text })
    onChange(next)
  }

  return (
    <div>
      <div className="relative">
      <input
        {...rest}
        ref={ref}
        type="text"
        inputMode={allowDecimal ? 'decimal' : 'numeric'}
        pattern={allowDecimal ? '[0-9.,]*' : '[0-9,]*'}
        autoComplete="off"
        value={display}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={[rest['aria-describedby'], error && errorId].filter(Boolean).join(' ') || undefined}
        className={mergedClass}
        min={min}
        max={max}
      />
      {suffix && (
        <span
          aria-hidden
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[color:var(--color-sub)] pointer-events-none font-mono"
        >
          {suffix}
        </span>
      )}
      </div>
      {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-[color:var(--danger)]">{error}</p>}
    </div>
  )
})

export default NumericInput
