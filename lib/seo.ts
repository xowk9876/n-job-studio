import type { Metadata } from 'next'
import { buildGoogleAlternates, formatPageTitle, SITE_NAME, SITE_URL } from '@/lib/seo-platform'

export { SITE_NAME, SITE_URL }
export const CONTENT_UPDATED_AT = '2026-10-31' as const
export const SEO_UPDATED_AT = '2026-11-06' as const
export const COPY_UPDATED_AT = '2026-11-13' as const
export const calculatorUpdatedAt: Record<string, string> = {
  '/salary': COPY_UPDATED_AT,
  '/mortgage': COPY_UPDATED_AT,
  '/severance': COPY_UPDATED_AT,
  '/savings': COPY_UPDATED_AT,
  '/jeonse': COPY_UPDATED_AT,
  '/lotto': COPY_UPDATED_AT,
}
export const SALARY_GUIDE_UPDATED_AT = '2026-11-06' as const

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

export const salaryGuide = {
  slug: '2026-salary-tax-guide',
  title: '2026년 연봉 실수령액표와 세후 월급 계산 기준',
  description: '연봉 3천만~1억 원의 예상 세후 월급을 같은 조건으로 비교하세요. 4대보험과 근로소득세가 어떻게 공제되는지 연봉 5천만 원 사례로 설명합니다.',
  tag: '세금',
  calculatorPath: '/salary',
  updatedAt: SALARY_GUIDE_UPDATED_AT,
} as const

export const guideItems = [
  salaryGuide,
  {
    slug: 'dsr-stress-test-2026',
    title: '2026 스트레스 DSR 적용 기준과 계산 예시',
    description: '스트레스 금리가 실제 이자와 다른 이유, 지역·금리 유형별 적용 조건과 원리금균등 기준 한도 예시를 설명합니다.',
    tag: '대출',
    calculatorPath: '/mortgage',
    updatedAt: COPY_UPDATED_AT,
  },
  {
    slug: 'severance-calculation-guide',
    title: '퇴직금 계산 공식과 실전 예시',
    description: '퇴직금 지급 요건, 평균임금·통상임금 비교, 상여금·연차수당 반영 범위와 세전 계산 예시를 정리합니다.',
    tag: '퇴직',
    calculatorPath: '/severance',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'isa-vs-regular-savings',
    title: 'ISA 비과세 조건과 일반계좌 세금 비교',
    description: 'ISA 가입·납입·비과세 조건과 중도해지 주의사항을 확인하고, 같은 과세 대상 수익의 세금을 비교합니다.',
    tag: '투자',
    calculatorPath: '/savings',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'jeonse-safety-2026',
    title: '전세 계약 전후 보증금 확인 체크리스트',
    description: '등기·선순위 권리·반환보증을 확인하고, 입주 후 대항력과 우선변제권을 갖추는 절차를 정리합니다.',
    tag: '부동산',
    calculatorPath: '/jeonse',
    updatedAt: CONTENT_UPDATED_AT,
  },
  {
    slug: 'lotto-tax-guide',
    title: '로또 당첨금 세금과 수령 절차',
    description: '200만원 과세최저한, 22%·33% 원천징수 구간, 구매 방식별 지급처와 수령 기한을 확인합니다.',
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
    isPartOf: { '@id': `${SITE_URL}/#website` },
    isAccessibleForFree: true,
    inLanguage: 'ko-KR',
    dateModified: calculatorUpdatedAt[input.path] ?? SEO_UPDATED_AT,
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
  ogImagePath: string
  category?: string
}): Metadata {
  const url = `${SITE_URL}${input.path}`
  const ogImage = `${SITE_URL}${input.ogImagePath}`
  const fullTitle = formatPageTitle(input.title)

  return {
    metadataBase: new URL(SITE_URL),
    title: input.title,
    description: input.description,
    authors: [{ name: SITE_NAME }],
    category: input.category ?? 'finance',
    openGraph: {
      title: fullTitle,
      description: input.description,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: input.description,
      images: [{ url: ogImage, alt: fullTitle }],
    },
    alternates: buildGoogleAlternates(url),
    robots: googleBotRobots,
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
  const fullTitle = formatPageTitle(params.title)

  return {
    metadataBase: new URL(SITE_URL),
    title: params.title,
    description: params.description,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    publisher: SITE_NAME,
    category: 'finance',
    alternates: buildGoogleAlternates(url),
    robots: googleBotRobots,
    openGraph: {
      title: fullTitle,
      description: params.description,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'article',
      modifiedTime: params.updatedAt,
      section: params.section || '재테크 가이드',
      authors: [SITE_NAME],
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} ${params.title}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: params.description,
      images: [{ url: image, alt: `${SITE_NAME} ${params.title}` }],
    },
  }
}
