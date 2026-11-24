import Link from 'next/link'
import { buildFaqJsonLd, jsonLd, SITE_URL } from '@/lib/seo'
import type { OfficialSource } from '@/lib/content-sources'

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="mb-6 font-display text-[22px] md:text-[28px] font-bold tracking-tight text-white">
      {title}
    </h2>
  )
}

/** FAQ — details/summary + FAQPage JSON-LD */
export function FAQSection({
  items,
  title = '자주 묻는 질문',
  pagePath,
}: {
  items: { q: string; a: string }[]
  title?: string
  pagePath?: string
}) {
  const faqLd = pagePath ? buildFaqJsonLd(items, `${SITE_URL}${pagePath}`) : null

  return (
    <section aria-labelledby="faq-heading">
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqLd) }}
        />
      )}
      <SectionHeader id="faq-heading" title={title} />
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
      <SectionHeader id="examples-heading" title={title} />
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(({ label, input, result, note }) => (
          <div key={label} className="card p-5 md:p-6">
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
      <SectionHeader id="tips-heading" title={title} />
      <ul className="card p-6 md:p-8 space-y-6">
        {items.map(t => (
          <li key={t.title}>
            <p className="font-semibold text-[14.5px] text-white mb-1.5">{t.title}</p>
            <p className="text-[13.5px] text-[color:var(--sub)] leading-relaxed">{t.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function OfficialSourcesSection({
  sources,
  note = '확인 기준일: 2026-10-31. 실제 적용 조건과 이후 변경 사항은 해당 기관의 원문에서 확인하세요.',
}: {
  sources: readonly OfficialSource[]
  note?: string | null
}) {
  return (
    <section aria-labelledby="official-sources-heading">
      <SectionHeader id="official-sources-heading" title="계산 기준과 데이터 출처" />
      <div className="card p-6 md:p-8">
        <ul className="grid gap-2 text-[13.5px] text-[color:var(--ink-2)]">
          {sources.map(source => (
            <li key={source.href} className="flex gap-2 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand)]" aria-hidden />
              <a href={source.href} className="underline underline-offset-4 hover:text-[color:var(--brand)]">{source.label}</a>
            </li>
          ))}
        </ul>
        {note && (
          <p className="mt-5 border-t border-[color:var(--line)] pt-4 text-[12.5px] leading-relaxed text-[color:var(--muted)]">
            {note}
          </p>
        )}
      </div>
    </section>
  )
}

export function RelatedLinks({
  links,
  guideLink,
}: {
  links: { href: string; label: string }[]
  guideLink?: { href: string; label: string }
}) {
  return (
    <section className="space-y-4" aria-label="관련 링크">
      {guideLink && (
        <div>
          <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-2">
            관련 가이드
          </p>
          <Link
            href={guideLink.href}
            className="inline-reset text-[13px] px-3.5 py-2 rounded-md border border-[rgba(146,156,248,0.35)] bg-[rgba(146,156,248,0.08)] text-[#c4cbff] hover:text-white hover:bg-[rgba(146,156,248,0.16)] transition-colors"
          >
            {guideLink.label}
          </Link>
        </div>
      )}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-2">
          관련 계산기
        </p>
        <div className="flex flex-wrap gap-2" role="navigation" aria-label="관련 계산기">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-reset text-[13px] px-3.5 py-2 rounded-md border border-[color:var(--line-strong)] bg-white/[0.03] text-[color:var(--ink-2)] hover:text-[color:var(--brand)] hover:bg-[color:var(--brand-soft)] hover:border-[rgba(110,168,255,0.3)] transition-colors backdrop-blur"
            >
              {label} 계산기
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
