import Link from 'next/link'
import type { ReactNode } from 'react'
import { SITE_URL, jsonLd } from '@/lib/seo'

type Props = {
  slug: string
  title: string
  description: string
  tag: string
  tagColor: string
  updatedAt: string
  children: ReactNode
  related?: { href: string; label: string }[]
}

export default function GuideArticle({
  slug,
  title,
  description,
  tag,
  tagColor,
  updatedAt,
  children,
  related = [],
}: Props) {
  // 엔티티 통합: layout.tsx의 #organization 노드를 재사용해 시그널 분산 방지 (Entity-based ranking)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${SITE_URL}/guide/${slug}#article`,
        headline: title,
        name: title,
        description,
        articleBody: description,
        image: [`${SITE_URL}/guide/opengraph-image`],
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/guide/${slug}` },
        articleSection: tag,
        keywords: [title, tag, '머니핏 계산기', '2026 재테크', '재테크 가이드'].join(', '),
        inLanguage: 'ko-KR',
        isAccessibleForFree: true,
        datePublished: updatedAt,
        dateModified: updatedAt,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/guide/${slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: '재테크 실전 가이드', item: `${SITE_URL}/guide` },
          { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}/guide/${slug}` },
        ],
      },
    ],
  }

  return (
    <article className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <nav className="mb-6 text-[12.5px] text-[color:var(--muted)]">
        <Link href="/" className="hover:text-[color:var(--brand)]">홈</Link>
        <span className="mx-1.5">›</span>
        <Link href="/guide" className="hover:text-[color:var(--brand)]">가이드</Link>
      </nav>
      <header className="mb-8">
        <span
          className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-full mb-4"
          style={{
            color: tagColor,
            background: `${tagColor}14`,
            border: `1px solid ${tagColor}28`,
          }}
        >
          {tag}
        </span>
        <h1 className="guide-article__title font-display text-[26px] md:text-[34px] font-bold text-white tracking-tight leading-[1.2]">
          {title}
        </h1>
        <p className="mt-4 text-[14.5px] text-[color:var(--sub)] leading-relaxed">{description}</p>
        <p className="mt-4 text-[11.5px] text-[color:var(--muted)]">최종 업데이트: {updatedAt}</p>
      </header>

      <div className="guide-body space-y-7 text-[14.5px] text-[color:var(--sub)] leading-[1.85]">
        {children}
      </div>

      {related.length > 0 && (
        <section className="mt-12 pt-6 border-t border-[color:var(--line)]">
          <p className="font-mono text-[10.5px] tracking-[0.22em] text-[color:var(--muted)] mb-3">
            RELATED
          </p>
          <div className="flex flex-wrap gap-2">
            {related.map(r => (
              <Link
                key={r.href}
                href={r.href}
                className="inline-flex items-center px-3.5 py-2 rounded-lg text-[12.5px] border border-[color:var(--line-strong)] bg-white/[0.03] text-[color:var(--ink-2)] hover:text-[color:var(--brand)] hover:border-[color:var(--brand)] transition-colors"
              >
                {r.label} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
