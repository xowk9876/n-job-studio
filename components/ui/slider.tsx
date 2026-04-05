"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  onValueChange?: (value: number[]) => void
}

function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  onValueChange,
}: SliderProps) {
  const initial = value ?? defaultValue ?? [min]
  const [internal, setInternal] = React.useState<number[]>(initial)

  const current = value ?? internal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = [Number(e.target.value)]
    if (!value) setInternal(next)
    onValueChange?.(next)
  }

  const pct = ((current[0] - min) / (max - min)) * 100

  return (
    <div
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      data-slot="slider"
    >
      {/* 트랙 배경 */}
      <div className="relative h-1.5 w-full grow rounded-full bg-slate-200 overflow-hidden">
        {/* 채워진 트랙 */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-100"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 네이티브 range input (thumb 렌더링 담당) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current[0]}
        disabled={disabled}
        onChange={handleChange}
        className={cn(
          "absolute inset-0 w-full cursor-pointer opacity-0 h-full",
          // 접근성: 포커스 시 thumb 시각화를 위해 opacity는 0이지만 실제 조작 가능
        )}
      />

      {/* 커스텀 thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full border-2 border-primary bg-white shadow-md ring-ring/50 transition-[box-shadow] pointer-events-none"
        style={{ left: `${pct}%` }}
      />
    </div>
  )
}

export { Slider }
