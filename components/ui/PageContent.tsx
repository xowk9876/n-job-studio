import Link from 'next/link'

/** 섹션 타이틀 (번호 + 제목 에디토리얼 스타일) */
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <span className="font-mono text-[11px] text-[color:var(--color-muted)] tracking-widest">{num}</span>
      <h2 className="font-display text-[22px] md:text-[26px] font-bold text-[color:var(--color-ink)]">
        {title}
      </h2>
    </div>
  )
}

/** FAQ (details/summary, 접근성 기본 제공, 자동 JSON-LD) */
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
        <SectionHeader num="FAQ" title={title} />
      </div>
      <div className="editorial-card divide-y divide-[color:var(--color-line)]">
        {items.map(({ q, a }) => (
          <details key={q} className="group p-5 md:p-6 [&[open]]:bg-[color:var(--color-paper)]/60">
            <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
              <h3 className="font-semibold text-[15px] text-[color:var(--color-ink)] leading-snug">
                {q}
              </h3>
              <span
                aria-hidden
                className="shrink-0 font-mono text-[color:var(--color-sub)] text-lg leading-none mt-1 transition-transform group-open:rotate-45"
              >
                ＋
              </span>
            </summary>
            <p className="mt-3 text-[14px] text-[color:var(--color-sub)] leading-relaxed whitespace-pre-line">
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

/** 실제 사용 예시 */
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
        <SectionHeader num="CASE" title={title} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(({ label, input, result, note }) => (
          <div key={label} className="editorial-card p-5 md:p-6">
            <p className="text-[11px] font-mono text-[color:var(--color-warm)] tracking-widest mb-2">CASE</p>
            <h3 className="font-display text-[17px] font-bold text-[color:var(--color-ink)] mb-3 leading-snug">
              {label}
            </h3>
            <dl className="space-y-1.5 text-[13.5px]">
              <div className="flex gap-2">
                <dt className="text-[color:var(--color-muted)] min-w-[3.2rem]">입력</dt>
                <dd className="text-[color:var(--color-ink-2)]">{input}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-[color:var(--color-muted)] min-w-[3.2rem]">결과</dt>
                <dd className="text-[color:var(--color-ink)] font-semibold tabular-nums">{result}</dd>
              </div>
              {note && (
                <div className="flex gap-2 pt-1.5 mt-1.5 border-t border-[color:var(--color-line)]">
                  <dt className="text-[color:var(--color-muted)] min-w-[3.2rem]">근거</dt>
                  <dd className="text-[color:var(--color-sub)] font-mono text-[12.5px]">{note}</dd>
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

/** 팁 / 체크리스트 */
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
        <SectionHeader num="TIPS" title={title} />
      </div>
      <ul className="editorial-card p-5 md:p-7 space-y-5">
        {items.map((t, i) => (
          <li key={t.title} className="flex gap-4">
            <span className="shrink-0 font-mono text-[12px] text-[color:var(--color-warm)] mt-1 w-7">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-[14.5px] text-[color:var(--color-ink)] mb-1">{t.title}</p>
              <p className="text-[13.5px] text-[color:var(--color-sub)] leading-relaxed">{t.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 관련 계산기 */
export function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="관련 계산기">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="inline-reset text-[13px] px-3.5 py-2 rounded-md border border-[color:var(--color-line-strong)] text-[color:var(--color-sub)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-2)] transition-colors"
        >
          → {label} 계산기
        </Link>
      ))}
    </div>
  )
}
