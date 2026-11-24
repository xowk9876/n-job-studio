'use client'

import { forwardRef, useState, useId, InputHTMLAttributes } from 'react'

import { parseNumericInput } from '@/lib/numeric-input'
import { MAX_MONEY } from '@/lib/input-validation'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type' | 'defaultValue'> & {
  value: number | ''
  onChange: (v: number) => void
  unit?: '원' | '만원'
  ariaLabel?: string
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
    unit,
    ariaLabel,
    className = '',
    allowDecimal = false,
    min = 0,
    max = MAX_MONEY,
    ...rest
  },
  ref
) {
  const multiplier = unit === '만원' ? 10000 : 1
  const acceptsDecimal = allowDecimal || unit === '만원'

  const errorId = useId()
  const [draft, setDraft] = useState<{ value: number | ''; text: string; error?: string } | null>(null)
  // 사용자가 입력 중인 소수점과 빈칸은 보존하고, 저장값 복원 등 외부 변경 시에는 버린다.
  if (draft && draft.value !== value) setDraft(null)
  const display = draft?.text ?? (typeof value === 'number' ? formatDisplay(value / multiplier, acceptsDecimal) : '')
  const error = draft?.error

  // 호출자 className을 그대로 존중. className이 비어 있으면 기본 glass-input 스타일 적용
  const baseClass = className.trim()
    ? className
    : 'glass-input w-full rounded-xl px-4 py-3 text-[15px] font-semibold'
  const mergedClass = `${baseClass} tabular${unit && !/\bpr-\d+/.test(baseClass) ? ' pr-14' : ''}`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value
    const next = parseNumericInput(rawInput, multiplier, allowDecimal, Number(min), Number(max))
    if (next === null) {
      const hint = unit === '만원' && /\.\d{5,}$/.test(rawInput)
        ? '만원 단위는 소수점 넷째 자리(1원)까지 입력할 수 있습니다.'
        : `${Number(min) / multiplier}~${(Number(max) / multiplier).toLocaleString('ko-KR')}${unit ?? ''} 범위의 숫자를 입력하세요.`
      setDraft({ value, text: rawInput, error: hint + ' 마지막으로 입력한 유효한 값으로 계산합니다.' })
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
          inputMode={acceptsDecimal ? 'decimal' : 'numeric'}
          pattern={acceptsDecimal ? '[0-9.,]*' : '[0-9,]*'}
          autoComplete="off"
          value={display}
          onChange={handleChange}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={[rest['aria-describedby'], error && errorId].filter(Boolean).join(' ') || undefined}
          className={mergedClass}
        />
        {unit && (
          <span
            aria-hidden
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[color:var(--color-sub)] pointer-events-none font-mono"
          >
            {unit}
          </span>
        )}
      </div>
      {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-[color:var(--danger)]">{error}</p>}
    </div>
  )
})

export default NumericInput
