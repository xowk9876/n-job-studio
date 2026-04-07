'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  gradient?: boolean
  glow?: boolean
}

const CustomCard = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ className, hoverable = true, gradient = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl overflow-hidden',
          'bg-[var(--brand-glass-bg)] backdrop-blur-[var(--brand-glass-blur)]',
          'border border-[var(--brand-glass-border)]',
          'shadow-[var(--brand-shadow-md)]',
          'transition-all duration-[var(--brand-transition)]',
          hoverable && [
            'hover:-translate-y-1',
            'hover:border-white/28',
            'hover:shadow-[var(--brand-shadow-lg)]',
          ],
          glow && 'hover:shadow-[var(--brand-shadow-glow)]',
          className
        )}
        {...props}
      >
        {/* 상단 그라데이션 바 */}
        {gradient && (
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: 'var(--brand-gradient)' }}
          />
        )}

        {/* 내부 상단 화이트 하이라이트 */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

        {children}
      </div>
    )
  }
)

CustomCard.displayName = 'CustomCard'

/* ── 서브 컴포넌트 ── */

const CustomCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pt-6 pb-2', className)} {...props} />
))
CustomCardHeader.displayName = 'CustomCardHeader'

const CustomCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
))
CustomCardContent.displayName = 'CustomCardContent'

const CustomCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-6 py-4 border-t border-white/10 flex items-center gap-3',
      className
    )}
    {...props}
  />
))
CustomCardFooter.displayName = 'CustomCardFooter'

export { CustomCard, CustomCardHeader, CustomCardContent, CustomCardFooter }
