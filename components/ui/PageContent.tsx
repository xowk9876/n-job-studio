import React from 'react'

/* ── FAQ 아코디언 (HTML details/summary — 상태 불필요) ── */
export interface FAQItem { q: string; a: string }

export function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="font-bold text-white text-lg mb-5">자주 묻는 질문 (FAQ)</h2>
      <div className="flex flex-col gap-2">
        {items.map(({ q, a }, i) => (
          <details key={i} className="group rounded-xl border border-white/10 overflow-hidden">
            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer text-sm font-semibold text-white/85 hover:bg-white/5 transition-colors list-none select-none">
              <span className="flex items-center gap-2">
                <span className="text-blue-400 shrink-0">Q.</span>
                {q}
              </span>
              <span className="text-white/40 text-xs shrink-0 group-open:rotate-45 transition-transform duration-200">＋</span>
            </summary>
            <div className="px-5 pb-4 pt-2 text-sm text-white/60 leading-relaxed border-t border-white/10">
              <span className="text-emerald-400 font-semibold mr-1">A.</span>{a}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

/* ── 계산 예시 카드 ── */
export interface ExampleItem { label: string; input: string; result: string; note?: string }

export function ExamplesSection({ title, items }: { title?: string; items: ExampleItem[] }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="font-bold text-white text-lg mb-5">{title ?? '계산 예시'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ label, input, result, note }) => (
          <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-2">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">{label}</p>
            <p className="text-xs text-white/50">{input}</p>
            <p className="text-base font-bold text-white">{result}</p>
            {note && <p className="text-xs text-white/35">{note}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 팁 섹션 ── */
export interface TipItem { title: string; desc: string }

export function TipsSection({ title, items }: { title?: string; items: TipItem[] }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="font-bold text-white text-lg mb-5">{title ?? '절세 & 실용 팁'}</h2>
      <div className="flex flex-col gap-4">
        {items.map(({ title: t, desc }, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">{t}</p>
              <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 관련 계산기 링크 ── */
export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ href, label }) => (
        <a key={href} href={href}
          className="text-sm px-4 py-2 rounded-lg glass-card text-white/60 hover:text-white transition-colors">
          → {label}
        </a>
      ))}
    </div>
  )
}
