import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, guideItems, guideTagColors, jsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '재테크 가이드 | 머니핏 계산기',
  description:
    '2026년 최신 세율·법령을 반영한 연봉·대출·퇴직금·적금·전세·로또 실전 가이드. 공식 법령 조항을 근거로 작성된 독창적 콘텐츠.',
  keywords: ['재테크 가이드', '2026 세금 가이드', 'DSR 가이드', '퇴직금 계산 방법', 'ISA 절세', '전세사기 예방', '로또 세금'],
  alternates: { canonical: `${SITE_URL}/guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: '재테크 실전 가이드 — 2026년 최신 공식 기준',
    description: '연봉·대출·퇴직금·ISA·전월세·로또까지 공식 기준으로 정리한 머니핏 가이드 모음.',
    url: `${SITE_URL}/guide`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: '머니핏 재테크 실전 가이드' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '재테크 실전 가이드 — 2026년 최신 공식 기준',
    description: '공식 법령·고시 기반 재테크 가이드 모음.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: '머니핏 재테크 실전 가이드' }],
  },
}

function GuideIndexStructuredData() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/guide#collection`,
        name: '재테크 실전 가이드',
        description: '2026년 최신 세율·법령 기준 연봉·대출·퇴직·적금·전세·로또 가이드 모음',
        url: `${SITE_URL}/guide`,
        inLanguage: 'ko-KR',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'ItemList',
        name: '머니핏 재테크 가이드 목록',
        numberOfItems: guideItems.length,
        itemListElement: guideItems.map((guide, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: guide.title,
          description: guide.description,
          url: `${SITE_URL}/guide/${guide.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: '재테크 가이드', item: `${SITE_URL}/guide` },
        ],
      },
    ],
  }

  return (
    <Script
      id="guide-index-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(ld) }}
    />
  )
}

export default function GuideIndexPage() {
  return (
    <>
      <GuideIndexStructuredData />
      <div className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-16">
        <header className="mb-10">
          <p className="font-mono text-[11px] tracking-[0.28em] text-[color:var(--muted)] mb-3">GUIDES</p>
          <h1 className="font-display text-[30px] md:text-[38px] font-bold text-white tracking-tight">
            재테크 실전 가이드
          </h1>
          <p className="mt-4 text-[14.5px] text-[color:var(--sub)] leading-relaxed max-w-xl">
            2026년 최신 법령·세율을 근거로 작성된 독창 콘텐츠입니다. 계산기 결과를 실무에 어떻게
            적용해야 하는지, 자주 놓치는 예외 상황이 무엇인지 짚어드립니다.
          </p>
        </header>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {guideItems.map((g) => {
            const color = guideTagColors[g.tag] ?? '#6bafff'
            return (
              <Link key={g.slug} href={`/guide/${g.slug}`} className="card card-hover p-5 inline-reset">
                <span
                  className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-full mb-3"
                  style={{
                    color,
                    background: `${color}14`,
                    border: `1px solid ${color}28`,
                  }}
                >
                  {g.tag}
                </span>
                <h2 className="font-display text-[16px] font-semibold text-white tracking-tight mb-1.5">
                  {g.title}
                </h2>
                <p className="text-[12.5px] text-[color:var(--sub)] leading-relaxed">{g.description}</p>
                <p className="mt-2.5 text-[10.5px] text-[color:var(--muted)] font-mono">
                  UPDATED {g.updatedAt}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
