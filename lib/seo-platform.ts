import type { Metadata } from 'next'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app').replace(/\/$/, '')
const SITE_NAME = '머니핏 계산기'

/** Google Search Console 소유 확인 */
export const GOOGLE_SITE_VERIFICATION = 'nCoNcuMFFK-0Pu8G3aVSRSeEH4jXNT6ZjRAFURfpmfY'

/** 네이버 서치어드바이저 HTML 태그 소유 확인 */
export const NAVER_SITE_VERIFICATION = 'c2a79ddedc551ab5b59880ec8987955d4b2240d5'

/** Google · 네이버 공통 — 브라우저 탭 title (layout template 적용 전 페이지 title) */
export function formatPageTitle(pageTitle: string) {
  return `${pageTitle} | ${SITE_NAME}`
}

/** Google — hreflang·canonical (국내 단일 언어 사이트) */
export function buildGoogleAlternates(canonical: string) {
  return {
    canonical,
    languages: {
      'ko-KR': canonical,
      'x-default': canonical,
    },
  }
}

/**
 * 네이버 검색로봇(Yeti)은 `<title>` 외에 `meta name="title"`, `meta name="subject"`,
 * `meta name="keywords"`, `meta name="author"`를 함께 참고합니다.
 * (서치어드바이저 「검색엔진 최적화 가이드」 — 페이지 메타 명확화 권고)
 *
 * 모든 값은 head 영역에만 출력되며 JS·body 내 마크업은 검증에서 제외되므로 Next Metadata API로 주입.
 */
export function buildNaverMeta(
  fullTitle: string,
  description: string,
  options?: {
    keywords?: string[]
    subject?: string
    author?: string
  },
): NonNullable<Metadata['other']> {
  const out: NonNullable<Metadata['other']> = {
    title: fullTitle,
    description,
  }
  if (options?.subject) out.subject = options.subject
  if (options?.keywords?.length) out.keywords = options.keywords.join(', ')
  if (options?.author) out.author = options.author
  return out
}

/** Google · 네이버 공통 verification 메타 */
export function buildSiteVerifications(): Metadata['verification'] {
  return {
    google: GOOGLE_SITE_VERIFICATION,
    other: {
      'naver-site-verification': NAVER_SITE_VERIFICATION,
    },
  }
}

export const RSS_FEED_URL = `${SITE_URL}/rss.xml`
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`

/** 네이버 RSS 제출용 — 가이드 본문(독립 readable 텍스트) */
export const guideRssBodies: Record<string, string> = {
  '2026-salary-tax-guide': `2026년 연봉 실수령액은 국민연금(근로자 4.75%), 건강보험(3.595%), 장기요양(건보료의 13.14%), 고용보험(0.9%)과 근로소득세·지방소득세를 공제한 뒤 산출합니다. 국민연금은 기준소득월액 상한 637만 원(2025.7~2026.6) 기준 월 공제 상한 302,575원입니다. 비과세 식대(연 240만 원), 부양가족 수, 2026년 자녀세액공제(첫째 25만·둘째 30만·셋째 이후 40만)에 따라 같은 연봉이라도 실수령액 차이가 큽니다. 연봉 5,000만 원·독신·식대 240만 원 반영 시 월 실수령액은 약 340만 원대입니다. 머니핏 연봉 계산기에서 바로 시뮬레이션할 수 있습니다.`,
  'dsr-stress-test-2026': `스트레스 DSR은 금융위원회가 2024년 2월 도입한 규제로, 대출 심사 시 실제 금리에 가산금리(스트레스 금리)를 더해 상환능력을 평가합니다. 2026년 현재 3단계가 적용 중이며, 주택담보대출·신용대출 한도가 단계별로 축소됩니다. 신용대출 잔액 1억 원 초과분에는 스트레스 금리가 부과되며, 수도권 주담대는 더 강한 기준이 적용됩니다. 대출 한도를 미리 확인하려면 머니핏 주담대 이자·DSR 계산기와 함께 본 가이드를 참고하세요.`,
  'severance-calculation-guide': `퇴직금은 근로기준법 제34조에 따라 1일 평균임금 × 30 × (재직일수 ÷ 365)로 계산합니다. 평균임금은 퇴직일 직전 3개월 임금총액을 해당 일수로 나눈 금액이며, 정기상여금·연장수당 등이 포함됩니다. 평균임금이 통상임금보다 낮으면 통상임금을 적용합니다. 퇴직금은 퇴직일로부터 14일 이내 지급이 원칙이며, 퇴직소득세는 근속연수공제 후 연분연승법으로 별도 과세됩니다.`,
  'isa-vs-regular-savings': `2026년 ISA(개인종합자산관리계좌)는 일반형 비과세 한도 500만 원, 서민형·농어민형 1,000만 원까지 이자·배당이 비과세이고 초과분은 9.9% 분리과세됩니다. 일반 계좌는 15.4% 원천징수가 적용되어 10년 복리 시 ISA가 수백만 원 유리할 수 있습니다. 납입한도는 연 4,000만 원·총 2억 원, 의무가입 3년입니다. 머니핏 적금 계산기에서 ISA 비교 시뮬레이션을 함께 확인하세요.`,
  'jeonse-safety-2026': `전세사기 예방을 위해 계약 전 등기부등본에서 근저당·가압류·신탁 여부를 확인하고, HUG 전세보증금반환보증 가입 가능 여부를 점검해야 합니다. 전세 보증금이 시세 대비 과도하게 높으면(깡통전세) 위험합니다. 확정일자·전입신고·전세권 설정 순서를 지키고, 등기부등본은 계약 직전 최신본을 재열람하세요. 전월세 전환율은 주택임대차보호법상 한국은행 기준금리+2%가 상한입니다.`,
  'lotto-tax-guide': `로또 당첨금은 소득세법상 기타소득으로, 200만 원 이하는 비과세, 200만 원 초과~3억 원 이하는 22%(소득세 20%+지방세 2%), 3억 원 초과분은 33% 원천징수됩니다. 1등 당첨금은 동행복권 본사에서 수령하며, 200만 원 이하는 일부 은행·편의점에서도 가능합니다. 당첨금은 예금자보호 1인당 1억 원(2025.9.1~) 한도를 고려해 분산 보관하는 것이 안전합니다.`,
}

/** 네이버 RSS — 계산기 페이지 본문 요약 */
export const calculatorRssBodies: Record<string, string> = {
  '/salary':
    '2026년 4대보험 요율과 근로소득 간이세액표를 반영해 연봉·월급 실수령액을 계산합니다. 비과세 식대, 부양가족, 자녀세액공제를 반영할 수 있으며 입력값은 브라우저에서만 처리됩니다.',
  '/mortgage':
    '주택담보대출 원리금균등·원금균등·만기일시 상환 방식별 월 납입금과 총 이자를 비교합니다. DSR 한도 계산과 스트레스 DSR 3단계 영향을 함께 확인할 수 있습니다.',
  '/severance':
    '근로기준법 제34조 평균임금 기준으로 퇴직금을 산출합니다. 입사일·퇴직일·월급·상여금을 입력하면 1일 평균임금과 예상 퇴직금을 계산합니다.',
  '/savings':
    '예금·적금 단리·복리 이자와 15.4% 이자소득세 차감 후 세후 만기 수령액을 계산합니다. 2026년 ISA 일반형 500만 원·서민형 1,000만 원 비과세 한도 비교가 가능합니다.',
  '/jeonse':
    '주택임대차보호법 법정 전환율(기준금리+2%) 기준으로 전세↔월세를 양방향 환산합니다. 손익분기 전환율과 전세 리스크 분석을 지원합니다.',
  '/lotto':
    '동행복권 최신 회차 당첨번호를 조회하고 6/45 로또 번호를 생성합니다. 1~5등 당첨 조건, 수령 절차, 기타소득세 원천징수 구간을 안내합니다.',
}

export const calculatorFeedItems = [
  { path: '/salary', title: '연봉 실수령액 계산기', description: '2026년 4대보험·근로소득세 기준 세후 월급 계산' },
  { path: '/mortgage', title: '주택담보대출 이자 계산기', description: '원리금균등·원금균등·만기일시 상환 비교' },
  { path: '/severance', title: '퇴직금 계산기', description: '근로기준법 평균임금 기준 퇴직금 산출' },
  { path: '/savings', title: '적금·예금 이자 계산기', description: '세후 이자·ISA 비과세 비교' },
  { path: '/jeonse', title: '전월세 전환 계산기', description: '법정 전환율 기준 전세↔월세 환산' },
  { path: '/lotto', title: '로또 번호 생성기', description: '최신 당첨번호 조회 및 6/45 번호 생성' },
] as const
