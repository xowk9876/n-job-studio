'use client'

import { forwardRef, useState, useEffect, InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  value: number | ''
  onChange: (v: number) => void
  suffix?: string
  ariaLabel?: string
  /** @deprecated 초기값이 있어도 내부에서 사용하지 않음 (상태는 외부 value로 제어) */
  defaultValue?: number
  /** @deprecated 단위 배수는 외부에서 처리 */
  unitMultiplier?: number
  /** 소수점 허용 (전환율 등) */
  allowDecimal?: boolean
}

/**
 * 숫자 입력 — 3자리 콤마 자동 포맷 + tabular-nums
 * 내부 표시값: string(콤마 포함), 외부 값: number
 */
const NumericInput = forwardRef<HTMLInputElement, Props>(function NumericInput(
  {
    value,
    onChange,
    suffix,
    ariaLabel,
    className = '',
    defaultValue: _dv,
    unitMultiplier: _um,
    allowDecimal = false,
    ...rest
  },
  ref
) {
  // 기존 페이지들이 넘기던 glass-input 클래스를 무시하고 항상 field 스타일 적용
  const mergedClass = `field ${suffix ? 'pr-14' : ''} ${
    className.includes('glass-input') ? '' : className
  }`

  const formatNumber = (n: number) => {
    if (!Number.isFinite(n)) return ''
    if (allowDecimal) {
      const s = n.toString()
      const [intPart, dec] = s.split('.')
      const withComma = parseInt(intPart || '0', 10).toLocaleString('ko-KR')
      return dec !== undefined ? `${withComma}.${dec}` : withComma
    }
    return Math.round(n).toLocaleString('ko-KR')
  }

  const [display, setDisplay] = useState<string>(
    typeof value === 'number' && Number.isFinite(value) ? formatNumber(value) : ''
  )

  useEffect(() => {
    const next =
      typeof value === 'number' && Number.isFinite(value) ? formatNumber(value) : ''
    setDisplay(prev => (prev.replace(/,/g, '') === next.replace(/,/g, '') ? prev : next))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value
    const cleanPattern = allowDecimal ? /[^\d.]/g : /[^\d]/g
    let raw = rawInput.replace(cleanPattern, '')
    if (allowDecimal) {
      // 소수점 중복 제거
      const firstDot = raw.indexOf('.')
      if (firstDot !== -1) {
        raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '')
      }
    }
    const n = raw === '' || raw === '.' ? 0 : parseFloat(raw)
    if (raw === '') setDisplay('')
    else if (allowDecimal && raw.endsWith('.')) setDisplay(formatNumber(parseInt(raw, 10) || 0) + '.')
    else setDisplay(formatNumber(n))
    onChange(Number.isFinite(n) ? n : 0)
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        inputMode={allowDecimal ? 'decimal' : 'numeric'}
        pattern={allowDecimal ? '[0-9.,]*' : '[0-9,]*'}
        autoComplete="off"
        value={display}
        onChange={handleChange}
        aria-label={ariaLabel}
        className={mergedClass}
        {...rest}
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
  )
})

export default NumericInput
