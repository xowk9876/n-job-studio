import type { Metadata } from 'next'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app').replace(/\/$/, '')
export const SEO_UPDATED_AT = '2026-05-22'
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
    updatedAt: '2026-01-05',
  },
  {
    slug: 'dsr-stress-test-2026',
    title: '2026 스트레스 DSR 3단계 완전 정리',
    description: '스트레스 금리 1.50%p 적용 구간과 주담대·신용대출 영향 분석.',
    tag: '대출',
    updatedAt: '2026-05-16',
  },
  {
    slug: 'severance-calculation-guide',
    title: '퇴직금 계산 공식과 실전 예시',
    description: '근로기준법 평균임금과 통상임금 비교, 소급 인상 반영법.',
    tag: '퇴직',
    updatedAt: '2026-01-06',
  },
  {
    slug: 'isa-vs-regular-savings',
    title: 'ISA vs 일반계좌 10년 시뮬레이션',
    description: 'ISA 비과세 한도와 9.9% 분리과세의 실제 절세 효과 비교.',
    tag: '투자',
    updatedAt: '2026-01-07',
  },
  {
    slug: 'jeonse-safety-2026',
    title: '2026 전세사기 방지 체크리스트',
    description: 'HUG 보증 가입 조건, 등기부등본 읽는 법, 깡통전세 판별 기준.',
    tag: '부동산',
    updatedAt: '2026-05-16',
  },
  {
    slug: 'lotto-tax-guide',
    title: '로또 당첨금 세금·수령 완전 가이드',
    description: '원천징수 구간, 기타소득 신고, 익명 수령 절차와 유의사항.',
    tag: '복권',
    updatedAt: '2026-05-16',
  },
] as const

export type GuideItem = (typeof guideItems)[number]

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
    alternates: { canonical: url },
    robots: { index: true, follow: true },
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
  const image = `${SITE_URL}/opengraph-image`

  return {
    metadataBase: new URL(SITE_URL),
    title: `${params.title} | ${SITE_NAME}`,
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
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
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
  }
}
