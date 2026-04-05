'use client'

import { useState, useEffect, useRef, InputHTMLAttributes } from 'react'

interface NumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: number           // 스토어값 (항상 "원" 단위)
  onChange: (n: number) => void  // 스토어에 저장 (항상 "원" 단위)
  defaultValue?: number   // 복원값 (원 단위)
  unitMultiplier?: number // 10000 = 만원 입력, 1 = 원 입력 (기본값 1)
  allowDecimal?: boolean
  className?: string
}

export default function NumericInput({
  value,
  onChange,
  defaultValue = 0,
  unitMultiplier = 1,
  allowDecimal = false,
  className = '',
  ...rest
}: NumericInputProps) {
  // 표시값 = 원 단위 ÷ unitMultiplier
  const toDisplay = (raw: number) => String(raw / unitMultiplier)
  const prevExternal = useRef(value)
  const [localStr, setLocalStr] = useState(toDisplay(value))

  // 외부 값 변경 시 동기화 (스토어 rehydration 등)
  useEffect(() => {
    if (value !== prevExternal.current) {
      setLocalStr(toDisplay(value))
      prevExternal.current = value
    }
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value

    let filtered: string
    if (allowDecimal) {
      filtered = raw.replace(/[^0-9.]/g, '')
      const parts = filtered.split('.')
      if (parts.length > 2) filtered = parts[0] + '.' + parts.slice(1).join('')
    } else {
      filtered = raw.replace(/[^0-9]/g, '')
    }

    setLocalStr(filtered)

    const num = parseFloat(filtered)
    if (filtered !== '' && !isNaN(num)) {
      const storeVal = Math.round(num * unitMultiplier)
      prevExternal.current = storeVal
      onChange(storeVal)
    }
  }

  function handleBlur() {
    const num = parseFloat(localStr)
    if (localStr === '' || isNaN(num)) {
      setLocalStr(toDisplay(defaultValue))
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
