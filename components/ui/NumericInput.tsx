'use client'

import { useState, useEffect, useRef, InputHTMLAttributes } from 'react'

interface NumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: number
  onChange: (n: number) => void
  defaultValue?: number
  allowDecimal?: boolean
  className?: string
}

export default function NumericInput({
  value,
  onChange,
  defaultValue = 0,
  allowDecimal = false,
  className = '',
  ...rest
}: NumericInputProps) {
  const [localStr, setLocalStr] = useState(String(value))
  const prevExternal = useRef(value)

  // 외부 값(스토어 rehydration 등)이 바뀌면 로컬 문자열 동기화
  useEffect(() => {
    if (value !== prevExternal.current) {
      setLocalStr(String(value))
      prevExternal.current = value
    }
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value

    // 허용 문자 필터링: 정수는 숫자만, 소수는 숫자+점 1개
    let filtered: string
    if (allowDecimal) {
      filtered = raw.replace(/[^0-9.]/g, '')
      // 소수점 2개 이상 방지
      const parts = filtered.split('.')
      if (parts.length > 2) filtered = parts[0] + '.' + parts.slice(1).join('')
    } else {
      filtered = raw.replace(/[^0-9]/g, '')
    }

    setLocalStr(filtered)

    const num = parseFloat(filtered)
    if (filtered !== '' && !isNaN(num)) {
      prevExternal.current = num
      onChange(num)
    }
  }

  function handleBlur() {
    const num = parseFloat(localStr)
    if (localStr === '' || isNaN(num)) {
      setLocalStr(String(defaultValue))
      prevExternal.current = defaultValue
      onChange(defaultValue)
    }
  }

  return (
    <input
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      pattern={allowDecimal ? '[0-9]*\\.?[0-9]*' : '[0-9]*'}
      value={localStr}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      {...rest}
    />
  )
}
