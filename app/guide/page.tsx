import type { Metadata } from 'next'
import Script from 'next/script'
import GuideCardList from '@/components/guide/GuideCardList'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, guideItems, jsonLd } from '@/lib/seo'
import { buildGoogleAlternates, buildNaverMeta, formatPageTitle } from '@/lib/seo-platform'

const pageTitle = '재테크 실전 가이드'
const description =
  '연봉·대출·퇴직금·ISA·전세·로또의 계산 기준과 적용 조건을 설명하는 가이드 6편. 공식 출처와 확인 기준일을 함께 제공합니다.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: pageTitle,
  description,
  keywords: ['재테크 가이드', '2026 세금 가이드', 'DSR 가이드', '퇴직금 계산 방법', 'ISA 절세', '전세사기 예방', '로또 세금'],
  alternates: buildGoogleAlternates(`${SITE_URL}/guide`),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    title: '재테크 실전 가이드 · 계산 기준과 적용 조건',
    description: '연봉·대출·퇴직금·ISA·전월세·로또까지 공식 기준으로 정리한 머니핏 가이드 모음.',
    url: `${SITE_URL}/guide`,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: '머니핏 재테크 실전 가이드' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '재테크 실전 가이드 · 계산 기준과 적용 조건',
    description: '공식 법령·고시 기반 재테크 가이드 모음.',
    images: [{ url: DEFAULT_OG_IMAGE, alt: '머니핏 재테크 실전 가이드' }],
  },
  other: buildNaverMeta(formatPageTitle(pageTitle), description),
}

function GuideIndexStructuredData() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/guide#collection`,
        name: '재테크 실전 가이드',
        description: '연봉·대출·퇴직·ISA·전세·로또의 계산 기준과 적용 조건 안내',
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
            계산 결과를 읽는 방법과 적용 조건을 주제별로 정리했습니다.
            각 글의 확인 기준일과 공식 출처를 함께 확인하세요.
          </p>
        </header>

        <GuideCardList variant="full" />
      </div>
    </>
  )
}
