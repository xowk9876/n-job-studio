'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-out rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:pointer-events-none select-none'

    const variants = {
      default:
        'bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-accent)] text-white shadow-[var(--brand-shadow-md)] hover:scale-[1.02] hover:shadow-[var(--brand-shadow-lg)] active:scale-[0.98]',
      outline:
        'bg-[var(--brand-glass-bg)] backdrop-blur-[var(--brand-glass-blur)] border border-[var(--brand-glass-border)] text-white hover:border-white/30 hover:bg-white/12 hover:scale-[1.02] active:scale-[0.98]',
      ghost:
        'bg-transparent text-white/70 hover:text-white hover:bg-white/10 active:bg-white/15',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-7 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

CustomButton.displayName = 'CustomButton'
export { CustomButton }
