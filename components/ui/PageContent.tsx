import Link from 'next/link'

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-[22px] md:text-[26px] font-bold text-[color:var(--ink)] tracking-tight">
        {title}
      </h2>
      {sub && <p className="mt-1 text-[13.5px] text-[color:var(--sub)]">{sub}</p>}
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
        <SectionHeader title={title} />
      </div>
      <div className="card divide-y divide-[color:var(--line)]">
        {items.map(({ q, a }) => (
          <details key={q} className="group p-5 md:p-6 [&[open]]:bg-[color:var(--bg-subtle)] transition-colors">
            <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
              <h3 className="font-semibold text-[15px] text-[color:var(--ink)] leading-snug">
                {q}
              </h3>
              <span
                aria-hidden
                className="shrink-0 w-6 h-6 rounded-full bg-[color:var(--bg-elev)] text-[color:var(--sub)] flex items-center justify-center text-[14px] leading-none mt-0.5 transition-transform group-open:rotate-45 group-open:bg-[color:var(--brand-soft)] group-open:text-[color:var(--brand)]"
              >
                ＋
              </span>
            </summary>
            <p className="mt-3 text-[14px] text-[color:var(--sub)] leading-relaxed whitespace-pre-line">
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

type ExampleItem = {
  label: string
  input: string
  result: string
  note?: string
}

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
        <SectionHeader title={title} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(({ label, input, result, note }) => (
          <div key={label} className="card p-5 md:p-6">
            <span className="chip chip-brand mb-3 text-[10.5px]">CASE</span>
            <h3 className="font-display text-[16.5px] font-semibold text-[color:var(--ink)] mb-3 leading-snug">
              {label}
            </h3>
            <dl className="space-y-2 text-[13.5px]">
              <div className="flex gap-3">
                <dt className="text-[color:var(--muted)] min-w-[2.8rem] shrink-0">입력</dt>
                <dd className="text-[color:var(--ink-2)]">{input}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-[color:var(--muted)] min-w-[2.8rem] shrink-0">결과</dt>
                <dd className="text-[color:var(--brand-strong)] font-semibold tabular-nums">{result}</dd>
              </div>
              {note && (
                <div className="flex gap-3 pt-2 mt-2 border-t border-[color:var(--line)]">
                  <dt className="text-[color:var(--muted)] min-w-[2.8rem] shrink-0">근거</dt>
                  <dd className="text-[color:var(--sub)] text-[12.5px] tabular-nums">{note}</dd>
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
        <SectionHeader title={title} />
      </div>
      <ul className="card p-5 md:p-7 space-y-5">
        {items.map((t, i) => (
          <li key={t.title} className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)] flex items-center justify-center font-semibold text-[13px]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-[14.5px] text-[color:var(--ink)] mb-1">{t.title}</p>
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
          className="inline-reset text-[13px] px-3.5 py-2 rounded-md border border-[color:var(--line-strong)] text-[color:var(--sub)] hover:text-[color:var(--brand-strong)] hover:bg-[color:var(--brand-soft)] hover:border-[color:var(--brand-soft)] transition-colors"
        >
          → {label} 계산기
        </Link>
      ))}
    </div>
  )
}
