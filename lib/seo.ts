import type { Metadata } from 'next'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app').replace(/\/$/, '')
export const SEO_UPDATED_AT = '2026-05-20'
export const SITE_NAME = '머니핏 계산기'
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

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export type CalculatorDef = {
  path: `/${string}`
  title: string
  shortTitle: string
  description: string
  seoIntro: string
  keywords: string[]
  applicationCategory: 'FinanceApplication' | 'GameApplication'
  breadcrumbName: string
}

export const calculatorItems: CalculatorDef[] = [
  {
    path: '/salary',
    title: '연봉 실수령액 계산기 — 2026년 4대보험·근로소득세 세후 월급',
    shortTitle: '연봉 실수령액 계산기',
    description:
      '2026년 국민연금·건강보험·고용보험·장기요양보험과 근로소득세를 반영해 월·연 실수령액을 계산합니다. 부양가족·자녀세액공제, 비과세 식대·교통비까지 입력 가능.',
    seoIntro:
      '2026년 고시 4대보험 요율과 소득세법 간이세액표를 기준으로 연봉·비과세 수당·부양가족 수를 입력하면 세후 월급과 연간 실수령액을 즉시 확인할 수 있습니다. 모든 계산은 브라우저에서만 처리됩니다.',
    keywords: [
      '연봉 실수령액 계산기',
      '2026 연봉 계산기',
      '세후 월급 계산',
      '4대보험 계산',
      '근로소득세 계산',
      '실수령액',
    ],
    applicationCategory: 'FinanceApplication',
    breadcrumbName: '연봉 실수령액 계산기',
  },
  {
    path: '/mortgage',
    title: '주택담보대출 이자 계산기 — 원리금·원금균등·DSR 한도',
    shortTitle: '대출 이자 계산기',
    description:
      '주택담보대출 원리금균등·원금균등·만기일시 상환 방식별 월 납입금·총 이자를 비교하고, 2026 스트레스 DSR 기준 대출 한도를 추정합니다.',
    seoIntro:
      '대출 원금, 금리, 기간, 상환 방식을 입력하면 월 상환액·총 이자·상환 스케줄을 비교할 수 있습니다. 연소득·기존 대출·DSR 상한·스트레스 금리 가산을 함께 넣으면 대출 가능 한도도 참고할 수 있습니다.',
    keywords: [
      '주담대 계산기',
      '대출 이자 계산',
      '원리금균등',
      '원금균등',
      'DSR 계산기',
      '스트레스 DSR',
    ],
    applicationCategory: 'FinanceApplication',
    breadcrumbName: '대출 이자 계산기',
  },
  {
    path: '/severance',
    title: '퇴직금 계산기 — 근로기준법 평균임금·근속연수 기준',
    shortTitle: '퇴직금 계산기',
    description:
      '최근 3개월 평균임금, 상여·연차수당, 근속기간을 입력하면 근로기준법 제34조 기준 퇴직금(세전)을 계산합니다. 통상임금 보정 안내 포함.',
    seoIntro:
      '퇴사일·입사일·3개월 평균 임금·연간 상여를 입력하면 근속연수와 평균임금을 반영한 예상 퇴직금을 산출합니다. 실제 지급액은 회사 규정·소득세·퇴직소득세에 따라 달라질 수 있습니다.',
    keywords: [
      '퇴직금 계산기',
      '평균임금 계산',
      '근로기준법 퇴직금',
      '퇴직금 세금',
      '근속연수',
    ],
    applicationCategory: 'FinanceApplication',
    breadcrumbName: '퇴직금 계산기',
  },
  {
    path: '/savings',
    title: '적금·예금 이자 계산기 — 단리·복리·ISA 세후 수익',
    shortTitle: '적금·예금 계산기',
    description:
      '정기적금·정기예금의 단리·복리 이자를 계산하고 이자소득세 15.4% 차감 후 만기 수령액을 확인합니다. ISA 비과세 한도 비교 안내.',
    seoIntro:
      '납입 방식, 금액, 금리, 기간, 이자 계산 방식(단리·복리)을 선택하면 세전·세후 이자와 만기 수령액을 계산합니다. 금융기관 약관·우대금리는 반영되지 않을 수 있습니다.',
    keywords: [
      '적금 이자 계산기',
      '예금 이자 계산',
      '복리 계산기',
      '이자소득세 15.4%',
      'ISA 비과세',
    ],
    applicationCategory: 'FinanceApplication',
    breadcrumbName: '적금·예금 계산기',
  },
  {
    path: '/jeonse',
    title: '전월세 전환 계산기 — 법정 전환율·전세↔월세 환산',
    shortTitle: '전월세 전환 계산기',
    description:
      '주택임대차보호법 법정 전월세 전환율(기준금리+2%p)로 전세→월세·월세→전세 보증금을 양방향 환산합니다. HUG 보증·전세사기 예방 가이드 연결.',
    seoIntro:
      '전세 보증금·월세·전환율을 입력하면 법정 기준에 따른 전월세 환산액을 확인할 수 있습니다. 지역·계약 조건·임대인 협의에 따라 실제 전환 조건은 달라질 수 있습니다.',
    keywords: [
      '전월세 전환 계산기',
      '전세 월세 전환',
      '전환율 계산',
      '법정 전환율',
      '전세사기 예방',
    ],
    applicationCategory: 'FinanceApplication',
    breadcrumbName: '전월세 전환 계산기',
  },
  {
    path: '/lotto',
    title: '로또 번호 생성기 — 무작위 6/45 + 당첨 등위 안내',
    shortTitle: '로또 번호 생성기',
    description:
      '로또 6/45 무작위 번호를 생성하고 1~5등 당첨 조건·수령 절차·당첨금 세금 가이드를 확인합니다. 최신 추첨 회차 정보 제공.',
    seoIntro:
      '암호학적 난수로 1~45 중복 없는 번호 조합을 만들고, 동행복권 기준 당첨 등위·판매 마감·추첨 일정을 안내합니다. 당첨 확률을 높이는 도구가 아니며 오락·참고용입니다.',
    keywords: [
      '로또 번호 생성기',
      '로또 번호 추천',
      '로또 당첨 등위',
      '로또 세금',
      '6/45 로또',
    ],
    applicationCategory: 'GameApplication',
    breadcrumbName: '로또 번호 생성기',
  },
]

export const calculatorByPath = Object.fromEntries(
  calculatorItems.map((c) => [c.path, c]),
) as Record<CalculatorDef['path'], CalculatorDef>

export function buildCalculatorMetadata(calc: CalculatorDef): Metadata {
  const url = `${SITE_URL}${calc.path}`
  const image = `${SITE_URL}${calc.path}/opengraph-image`

  return {
    metadataBase: new URL(SITE_URL),
    title: calc.title,
    description: calc.description,
    keywords: [...calc.keywords, SITE_NAME, '2026 재테크', '무료 계산기'],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    publisher: SITE_NAME,
    category: calc.applicationCategory === 'GameApplication' ? 'entertainment' : 'finance',
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
      title: calc.shortTitle,
      description: calc.description,
      url,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} — ${calc.shortTitle}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: calc.shortTitle,
      description: calc.description,
      images: [{ url: image, alt: calc.shortTitle }],
    },
  }
}

export function buildCalculatorStructuredData(calc: CalculatorDef) {
  const url = `${SITE_URL}${calc.path}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: calc.shortTitle,
        url,
        description: calc.description,
        applicationCategory: calc.applicationCategory,
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
        author: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'ko-KR',
        keywords: calc.keywords.join(', '),
        datePublished: '2025-12-01',
        dateModified: SEO_UPDATED_AT,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: calc.breadcrumbName, item: url },
        ],
      },
    ],
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
