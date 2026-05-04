import Link from 'next/link'

function SectionHeader({ num, title }: { num?: string; title: string }) {
  return (
    <div className="mb-6">
      {num && (
        <p className="font-mono text-[10.5px] text-[color:var(--muted)] tracking-[0.2em] mb-2">{num}</p>
      )}
      <h2 className="font-display text-[22px] md:text-[28px] font-bold tracking-tight text-white">
        {title}
      </h2>
    </div>
  )
}

/** FAQ — details/summary + JSON-LD */
export function FAQSection({
  items,
  title = '자주 묻는 질문',
}: {
  items: { q: string; a: string }[]
  title?: string
}) {
  return (
    <section aria-labelledby="faq-heading">
      <div id="faq-heading">
        <SectionHeader num="FAQ · 자주 묻는 질문" title={title} />
      </div>
      <div className="card divide-y divide-[color:var(--line)] overflow-hidden">
        {items.map(({ q, a }) => (
          <details key={q} className="group p-5 md:p-6 [&[open]]:bg-white/[0.02] transition-colors">
            <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
              <h3 className="font-semibold text-[15px] text-white leading-snug">
                {q}
              </h3>
              <span
                aria-hidden
                className="shrink-0 w-6 h-6 rounded-full bg-white/5 border border-[color:var(--line-strong)] text-[color:var(--sub)] flex items-center justify-center text-[13px] leading-none mt-0.5 transition-all group-open:rotate-45 group-open:bg-[color:var(--brand-soft)] group-open:border-[rgba(110,168,255,0.4)] group-open:text-[color:var(--brand)]"
              >
                ＋
              </span>
            </summary>
            <p className="mt-4 text-[14px] text-[color:var(--sub)] leading-relaxed whitespace-pre-line">
              {a}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />
    </section>
  )
}

type ExampleItem = { label: string; input: string; result: string; note?: string }

export function ExamplesSection({
  items,
  title = '실제 사용 예시',
}: {
  items: ExampleItem[]
  title?: string
}) {
  return (
    <section aria-labelledby="examples-heading">
      <div id="examples-heading">
        <SectionHeader num="CASE · 예시" title={title} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(({ label, input, result, note }) => (
          <div key={label} className="card p-5 md:p-6">
            <span className="chip chip-brand mb-3 text-[10.5px]">CASE</span>
            <h3 className="font-display text-[16.5px] font-semibold text-white mb-3 leading-snug tracking-tight">
              {label}
            </h3>
            <dl className="space-y-2 text-[13.5px]">
              <div className="flex gap-3">
                <dt className="text-[color:var(--muted)] min-w-[2.8rem] shrink-0">입력</dt>
                <dd className="text-[color:var(--ink-2)]">{input}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-[color:var(--muted)] min-w-[2.8rem] shrink-0">결과</dt>
                <dd className="text-gradient font-bold tabular-nums text-[14.5px]">{result}</dd>
              </div>
              {note && (
                <div className="flex gap-3 pt-2 mt-2 border-t border-[color:var(--line)]">
                  <dt className="text-[color:var(--muted)] min-w-[2.8rem] shrink-0">근거</dt>
                  <dd className="text-[color:var(--sub)] text-[12.5px] font-mono tabular-nums">{note}</dd>
                </div>
              )}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}

type TipItem = { title: string; desc: string }

export function TipsSection({
  items,
  title = '꼭 알아두세요',
}: {
  items: TipItem[]
  title?: string
}) {
  return (
    <section aria-labelledby="tips-heading">
      <div id="tips-heading">
        <SectionHeader num="TIPS · 체크리스트" title={title} />
      </div>
      <ul className="card p-6 md:p-8 space-y-6">
        {items.map((t, i) => (
          <li key={t.title} className="flex gap-4">
            <span
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[12px] font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(110,168,255,0.22) 0%, rgba(167,139,250,0.18) 100%)',
                color: '#6ea8ff',
                border: '1px solid rgba(110,168,255,0.28)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-[14.5px] text-white mb-1.5">{t.title}</p>
              <p className="text-[13.5px] text-[color:var(--sub)] leading-relaxed">{t.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="관련 계산기">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="inline-reset text-[13px] px-3.5 py-2 rounded-md border border-[color:var(--line-strong)] bg-white/[0.03] text-[color:var(--ink-2)] hover:text-[color:var(--brand)] hover:bg-[color:var(--brand-soft)] hover:border-[rgba(110,168,255,0.3)] transition-colors backdrop-blur"
        >
          → {label} 계산기
        </Link>
      ))}
    </div>
  )
}
