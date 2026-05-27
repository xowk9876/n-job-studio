import type { Metadata } from 'next'
import {
  buildGoogleAlternates,
  buildNaverMeta,
} from '@/lib/seo-platform'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app').replace(/\/$/, '')
export const CONTENT_UPDATED_AT = '2026-05-28' as const
export const SEO_UPDATED_AT = CONTENT_UPDATED_AT
export const SITE_NAME = '머니핏 계산기'

/** OG 이미지·푸터 등에 표시할 브랜드 라벨 */
export const OG_BRAND_LINE = SITE_NAME

export const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).host
  } catch {
    return 'n-job-studio.vercel.app'
  }
})()

/** 가이드 태그별 UI·스키마 accent (sitemap/메타와 동기화) */
export const guideTagColors: Record<string, string> = {
  세금: '#6bafff',
  대출: '#5eead4',
  퇴직: '#b8a4fa',
  투자: '#3ee0a5',
  부동산: '#fcc73e',
  복권: '#f590c0',
}
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`

export const guideItems = [
  {
    slug: '2026-salary-tax-guide',
    title: '2026년 연봉 실수령액 완전 가이드',
    description: '4대보험 요율 변경과 간이세액표 개정을 반영한 계산 공식과 실전 예시.',
    tag: '세금',
    calculatorPath: '/salary',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'dsr-stress-test-2026',
    title: '2026 스트레스 DSR 3단계 완전 정리',
    description: '스트레스 금리 1.50%p 적용 구간과 주담대·신용대출 영향 분석.',
    tag: '대출',
    calculatorPath: '/mortgage',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'severance-calculation-guide',
    title: '퇴직금 계산 공식과 실전 예시',
    description: '근로기준법 평균임금과 통상임금 비교, 소급 인상 반영법.',
    tag: '퇴직',
    calculatorPath: '/severance',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'isa-vs-regular-savings',
    title: 'ISA vs 일반계좌 10년 시뮬레이션',
    description: 'ISA 비과세 한도와 9.9% 분리과세의 실제 절세 효과 비교.',
    tag: '투자',
    calculatorPath: '/savings',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'jeonse-safety-2026',
    title: '2026 전세사기 방지 체크리스트',
    description: 'HUG 보증 가입 조건, 등기부등본 읽는 법, 깡통전세 판별 기준.',
    tag: '부동산',
    calculatorPath: '/jeonse',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'lotto-tax-guide',
    title: '로또 당첨금 세금·수령 완전 가이드',
    description: '원천징수 구간, 기타소득 신고, 익명 수령 절차와 유의사항.',
    tag: '복권',
    calculatorPath: '/lotto',
    updatedAt: CONTENT_UPDATED_AT,
  },
] as const

export { calculatorFeedItems, guideRssBodies, calculatorRssBodies, RSS_FEED_URL, SITEMAP_URL } from '@/lib/seo-platform'
export { GOOGLE_SITE_VERIFICATION, NAVER_SITE_VERIFICATION } from '@/lib/seo-platform'

export type GuideItem = (typeof guideItems)[number]

export type SeoLink = { href: string; label: string }

/** 계산기 ↔ 가이드 상호 링크 (내부링크·스키마 연결용) */
export const calculatorRelatedLinks: Record<string, SeoLink[]> = {
  '/salary': [
    { href: '/mortgage', label: '대출 이자' },
    { href: '/severance', label: '퇴직금' },
    { href: '/savings', label: '적금 이자' },
    { href: '/jeonse', label: '전월세 전환' },
  ],
  '/mortgage': [
    { href: '/salary', label: '연봉 실수령액' },
    { href: '/severance', label: '퇴직금' },
    { href: '/savings', label: '적금 이자' },
    { href: '/jeonse', label: '전월세 전환' },
  ],
  '/severance': [
    { href: '/salary', label: '연봉 실수령액' },
    { href: '/mortgage', label: '대출 이자' },
    { href: '/savings', label: '적금 이자' },
    { href: '/jeonse', label: '전월세 전환' },
  ],
  '/savings': [
    { href: '/salary', label: '연봉 실수령액' },
    { href: '/mortgage', label: '대출 이자' },
    { href: '/severance', label: '퇴직금' },
    { href: '/jeonse', label: '전월세 전환' },
  ],
  '/jeonse': [
    { href: '/salary', label: '연봉 실수령액' },
    { href: '/mortgage', label: '대출 이자' },
    { href: '/severance', label: '퇴직금' },
    { href: '/savings', label: '적금 이자' },
  ],
  '/lotto': [
    { href: '/salary', label: '연봉 실수령액' },
    { href: '/savings', label: '적금 이자' },
    { href: '/mortgage', label: '대출 이자' },
    { href: '/severance', label: '퇴직금' },
  ],
}

export function getGuideLinkForCalculator(path: string): SeoLink | undefined {
  const guide = guideItems.find((item) => item.calculatorPath === path)
  if (!guide) return undefined
  return { href: `/guide/${guide.slug}`, label: guide.title }
}

export function getCalculatorLinks(path: string) {
  return {
    related: calculatorRelatedLinks[path] ?? [],
    guide: getGuideLinkForCalculator(path),
  }
}

export function buildFaqJsonLd(items: { q: string; a: string }[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
}

export function buildWebApplicationJsonLd(input: {
  path: string
  name: string
  description: string
  category?: string
  guidePath?: string
}) {
  const url = `${SITE_URL}${input.path}`
  return {
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: input.name,
    url,
    description: input.description,
    applicationCategory: input.category ?? 'FinanceApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    author: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ko-KR',
    dateModified: SEO_UPDATED_AT,
    ...(input.guidePath
      ? {
          subjectOf: {
            '@type': 'Article',
            url: `${SITE_URL}${input.guidePath}`,
          },
        }
      : {}),
  }
}

export function buildCalculatorStructuredData(input: {
  breadcrumb: { name: string; path: string }[]
  webApp: {
    path: string
    name: string
    description: string
    category?: string
    guidePath?: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(input.breadcrumb),
      buildWebApplicationJsonLd(input.webApp),
    ],
  }
}

const googleBotRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** 계산기 페이지 공통 메타데이터 */
export function buildCalculatorMetadata(input: {
  path: string
  title: string
  description: string
  keywords: string[]
  ogImagePath: string
  ogTitle?: string
  ogDescription?: string
  category?: string
}): Metadata {
  const url = `${SITE_URL}${input.path}`
  const ogImage = `${SITE_URL}${input.ogImagePath}`
  const ogTitle = input.ogTitle ?? input.title
  const ogDescription = input.ogDescription ?? input.description
  const fullTitle = `${input.title} | ${SITE_NAME}`

  return {
    metadataBase: new URL(SITE_URL),
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    authors: [{ name: SITE_NAME }],
    category: input.category ?? 'finance',
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} — ${ogTitle}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImage, alt: ogTitle }],
    },
    alternates: buildGoogleAlternates(url),
    robots: googleBotRobots,
    other: buildNaverMeta(fullTitle, input.description),
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  }
}

export function buildGuideMetadata(params: {
  slug: string
  title: string
  description: string
  updatedAt: string
  section?: string
}): Metadata {
  const url = `${SITE_URL}/guide/${params.slug}`
  const image = `${SITE_URL}/guide/opengraph-image`
  const fullTitle = `${params.title} | ${SITE_NAME}`

  return {
    metadataBase: new URL(SITE_URL),
    title: params.title,
    description: params.description,
    keywords: [
      params.title,
      params.section || '재테크 가이드',
      '머니핏 계산기',
      '2026 재테크',
      '무료 계산기',
      '공식 기준',
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    publisher: SITE_NAME,
    category: 'finance',
    alternates: buildGoogleAlternates(url),
    robots: googleBotRobots,
    openGraph: {
      title: params.title,
      description: params.description,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'article',
      publishedTime: params.updatedAt,
      modifiedTime: params.updatedAt,
      section: params.section || '재테크 가이드',
      authors: [SITE_NAME],
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} ${params.title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [{ url: image, alt: `${SITE_NAME} ${params.title}` }],
    },
    other: buildNaverMeta(fullTitle, params.description),
  }
}
