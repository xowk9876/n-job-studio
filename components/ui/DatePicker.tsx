'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

type Props = {
  value?: Date | null
  onChange: (d: Date | null) => void
  ariaLabel?: string
  placeholder?: string
  minYear?: number
  maxYear?: number
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}
function fmt(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * DatePicker — 다크 테마 캘린더 (머니핏 디자인 시스템)
 * - 연도 헤더 + 월 선택 드롭다운 + 월 이동 화살표
 * - 일/월/화/수/목/금/토 한국어 헤더 (일=빨강, 토=파랑)
 * - 하단 액션: 삭제 / 오늘
 */
export default function DatePicker({
  value,
  onChange,
  ariaLabel = '날짜 선택',
  placeholder = 'YYYY-MM-DD',
  minYear = 1970,
  maxYear = new Date().getFullYear() + 10,
}: Props) {
  const [open, setOpen] = useState(false)
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState<Date>(() => value ?? today)
  const [yearMenu, setYearMenu] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) setCursor(value)
  }, [value])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setYearMenu(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setYearMenu(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const year = cursor.getFullYear()
  const month = cursor.getMonth() // 0-11

  // Build 6x7 grid
  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const startWeekday = first.getDay() // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev = new Date(year, month, 0).getDate()

    const arr: { date: Date; outside: boolean }[] = []
    // prev month tail
    for (let i = startWeekday - 1; i >= 0; i--) {
      arr.push({ date: new Date(year, month - 1, daysInPrev - i), outside: true })
    }
    // current
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ date: new Date(year, month, d), outside: false })
    }
    // next month head — pad to 42
    let d = 1
    while (arr.length < 42) {
      arr.push({ date: new Date(year, month + 1, d++), outside: true })
    }
    return arr
  }, [year, month])

  const years = useMemo(() => {
    const a: number[] = []
    for (let y = maxYear; y >= minYear; y--) a.push(y)
    return a
  }, [minYear, maxYear])

  const shiftMonth = (delta: number) => {
    setCursor(new Date(year, month + delta, 1))
  }

  const pick = (d: Date) => {
    onChange(d)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-[color:var(--line-strong)] hover:border-[color:var(--brand)]/60 focus:outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/25 transition-colors text-left"
      >
        <span
          className={`text-[14px] tabular-nums ${
            value ? 'text-white' : 'text-[color:var(--muted)]'
          }`}
        >
          {value ? fmt(value) : placeholder}
        </span>
        <svg
          className="w-4 h-4 text-[color:var(--muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel}
          className="absolute z-40 mt-2 w-[280px] rounded-xl border border-[color:var(--line-strong)] bg-[#0b0f16] shadow-2xl shadow-black/50 p-3 select-none"
        >
          {/* Header title: YYYY-MM-DD of current selection or cursor */}
          <div className="px-1 pb-2 mb-2 border-b border-[color:var(--line)]">
            <p className="text-[13px] font-semibold text-white tabular-nums">
              {fmt(value ?? cursor)}
            </p>
          </div>

          {/* Nav row */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setYearMenu(v => !v)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[13px] font-semibold text-white hover:bg-white/[0.05] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={yearMenu}
            >
              <span className="tabular-nums">{year}년</span>
              <span className="tabular-nums">{pad2(month + 1)}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="이전 달"
                className="w-7 h-7 flex items-center justify-center rounded-md text-[color:var(--ink-2)] hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="다음 달"
                className="w-7 h-7 flex items-center justify-center rounded-md text-[color:var(--ink-2)] hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Year dropdown overlay */}
          {yearMenu && (
            <div className="mb-2 max-h-40 overflow-y-auto rounded-md border border-[color:var(--line)] bg-[#0e131c] p-1 grid grid-cols-3 gap-1">
              {years.map(y => (
                <button
                  type="button"
                  key={y}
                  onClick={() => {
                    setCursor(new Date(y, month, 1))
                    setYearMenu(false)
                  }}
                  className={`px-2 py-1 rounded text-[12px] tabular-nums transition-colors ${
                    y === year
                      ? 'bg-[color:var(--brand)]/20 text-[color:var(--brand)]'
                      : 'text-[color:var(--ink-2)] hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div
                key={w}
                className={`h-7 flex items-center justify-center text-[11.5px] font-medium ${
                  i === 0
                    ? 'text-[#f87171]'
                    : i === 6
                    ? 'text-[#60a5fa]'
                    : 'text-[color:var(--muted)]'
                }`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map(({ date, outside }, idx) => {
              const selected = value ? isSameDay(date, value) : false
              const isToday = isSameDay(date, today)
              const dow = date.getDay()
              const base =
                'h-8 w-full flex items-center justify-center text-[13px] tabular-nums rounded-md transition-colors'
              let color = 'text-[color:var(--ink-2)]'
              if (outside) color = 'text-white/20'
              else if (dow === 0) color = 'text-[#f87171]'
              else if (dow === 6) color = 'text-[#60a5fa]'
              else color = 'text-white'

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => pick(date)}
                  className={`${base} ${
                    selected
                      ? 'bg-[color:var(--brand)] text-white font-semibold'
                      : `${color} hover:bg-white/[0.07] ${
                          isToday && !selected
                            ? 'ring-1 ring-[color:var(--brand)]/60'
                            : ''
                        }`
                  }`}
                  aria-label={fmt(date)}
                  aria-pressed={selected}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Footer actions */}
          <div className="mt-2 pt-2 border-t border-[color:var(--line)] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
              className="px-2 py-1 text-[12.5px] text-[color:var(--muted)] hover:text-[#f87171] transition-colors"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={() => {
                const t = new Date()
                setCursor(t)
                pick(t)
              }}
              className="px-2 py-1 text-[12.5px] text-[color:var(--brand)] hover:underline"
            >
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
