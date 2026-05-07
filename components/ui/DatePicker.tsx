'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  value?: Date | null
  onChange: (d: Date | null) => void
  ariaLabel?: string
  placeholder?: string
  minYear?: number
  maxYear?: number
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const
const MONTHS_KO = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

function pad2(n: number) { return n < 10 ? `0${n}` : `${n}` }
function fmt(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

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
  const [view, setView] = useState<'day' | 'month' | 'year'>('day')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (value) setCursor(value) }, [value])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) { setOpen(false); setView('day') }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setView('day') }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const startWeekday = first.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev = new Date(year, month, 0).getDate()
    const arr: { date: Date; outside: boolean }[] = []
    for (let i = startWeekday - 1; i >= 0; i--) {
      arr.push({ date: new Date(year, month - 1, daysInPrev - i), outside: true })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ date: new Date(year, month, d), outside: false })
    }
    let d = 1
    while (arr.length < 42) {
      arr.push({ date: new Date(year, month + 1, d++), outside: true })
    }
    return arr
  }, [year, month])

  // Year grid: 12 years per page
  const [yearPageStart, setYearPageStart] = useState(() => Math.floor(year / 12) * 12)
  useEffect(() => {
    if (view === 'year') setYearPageStart(Math.floor(year / 12) * 12)
  }, [view, year])

  const shiftMonth = (delta: number) => setCursor(new Date(year, month + delta, 1))

  const pick = (d: Date) => {
    onChange(d)
    setOpen(false)
    setView('day')
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
        <span className={`text-[14px] tabular-nums ${value ? 'text-white' : 'text-[color:var(--muted)]'}`}>
          {value ? fmt(value) : placeholder}
        </span>
        <svg className="w-4 h-4 text-[color:var(--muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel}
          className="absolute z-40 mt-2 w-[320px] rounded-2xl border border-white/[0.08] bg-[#0c1119]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-4 select-none"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => {
                if (view === 'day') setView('month')
                else if (view === 'month') setView('year')
                else setView('day')
              }}
              className="px-2.5 py-1.5 rounded-lg text-[14px] font-semibold text-white hover:bg-white/[0.06] transition-colors"
            >
              {view === 'year'
                ? `${yearPageStart} – ${yearPageStart + 11}`
                : view === 'month'
                ? `${year}`
                : `${year}년 ${MONTHS_KO[month]}`}
            </button>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  if (view === 'day') shiftMonth(-1)
                  else if (view === 'month') setCursor(new Date(year - 1, month, 1))
                  else setYearPageStart(s => Math.max(minYear, s - 12))
                }}
                aria-label="이전"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[color:var(--ink-2)] hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (view === 'day') shiftMonth(1)
                  else if (view === 'month') setCursor(new Date(year + 1, month, 1))
                  else setYearPageStart(s => Math.min(maxYear - 11, s + 12))
                }}
                aria-label="다음"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[color:var(--ink-2)] hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DAY VIEW */}
          {view === 'day' && (
            <>
              <div className="grid grid-cols-7 mb-1.5">
                {WEEKDAYS.map((w, i) => (
                  <div
                    key={w}
                    className={`h-7 flex items-center justify-center text-[11px] font-medium tracking-wide ${
                      i === 0 ? 'text-[#ef7e7e]' : i === 6 ? 'text-[#7ab0f5]' : 'text-white/40'
                    }`}
                  >
                    {w}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {cells.map(({ date, outside }, idx) => {
                  const selected = value ? isSameDay(date, value) : false
                  const todayMark = isSameDay(date, today)
                  return (
                    <div key={idx} className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => pick(date)}
                        aria-label={fmt(date)}
                        aria-pressed={selected}
                        className={[
                          'relative w-9 h-9 flex items-center justify-center rounded-full text-[13.5px] transition-all duration-150',
                          selected
                            ? 'bg-[color:var(--brand)] text-white font-semibold shadow-[0_4px_14px_rgba(110,168,255,0.4)]'
                            : outside
                            ? 'text-white/25 hover:text-white/50 hover:bg-white/[0.04]'
                            : 'text-white/85 hover:bg-white/[0.07] hover:text-white',
                          !selected && todayMark ? 'font-semibold text-[color:var(--brand)]' : '',
                        ].join(' ')}
                      >
                        {date.getDate()}
                        {!selected && todayMark && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[color:var(--brand)]" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* MONTH VIEW */}
          {view === 'month' && (
            <div className="grid grid-cols-3 gap-1.5 py-2">
              {MONTHS_KO.map((m, i) => {
                const active = i === month
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setCursor(new Date(year, i, 1)); setView('day') }}
                    className={`h-11 rounded-lg text-[13px] transition-colors ${
                      active
                        ? 'bg-[color:var(--brand)]/15 text-[color:var(--brand)] font-semibold ring-1 ring-[color:var(--brand)]/40'
                        : 'text-white/80 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          )}

          {/* YEAR VIEW */}
          {view === 'year' && (
            <div className="grid grid-cols-3 gap-1.5 py-2">
              {Array.from({ length: 12 }, (_, i) => yearPageStart + i).map(y => {
                const active = y === year
                const disabled = y < minYear || y > maxYear
                return (
                  <button
                    key={y}
                    type="button"
                    disabled={disabled}
                    onClick={() => { setCursor(new Date(y, month, 1)); setView('month') }}
                    className={`h-11 rounded-lg text-[13px] tabular-nums transition-colors ${
                      disabled
                        ? 'text-white/15 cursor-not-allowed'
                        : active
                        ? 'bg-[color:var(--brand)]/15 text-[color:var(--brand)] font-semibold ring-1 ring-[color:var(--brand)]/40'
                        : 'text-white/80 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {y}
                  </button>
                )
              })}
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); setView('day') }}
              className="px-2.5 py-1 text-[12.5px] text-white/45 hover:text-[#ef7e7e] transition-colors"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={() => { const t = new Date(); setCursor(t); pick(t) }}
              className="px-2.5 py-1 text-[12.5px] font-medium text-[color:var(--brand)] hover:bg-[color:var(--brand)]/10 rounded-md transition-colors"
            >
              오늘
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
