'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  suffix?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, suffix, error, size = 'md', id, ...props }, ref) => {
    const inputId = id || React.useId()

    const sizes = {
      sm: 'h-8 text-xs px-3',
      md: 'h-10 text-sm px-4',
      lg: 'h-12 text-base px-5',
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {/* 포커스 시 그라데이션 글로우 테두리 */}
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-accent)] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-[1px]" />
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'relative w-full rounded-xl bg-[var(--brand-glass-bg)] border border-[var(--brand-glass-border)] text-white placeholder:text-white/35',
              'backdrop-blur-[var(--brand-glass-blur)]',
              'transition-all duration-200',
              'focus:outline-none focus:border-transparent focus:bg-white/12',
              suffix && 'pr-14',
              sizes[size],
              error && 'border-red-400/60',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/45 font-medium pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'
export { CustomInput }
