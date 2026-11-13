import type { Metadata } from 'next'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app').replace(/\/$/, '')
export const SITE_NAME = '머니핏 계산기'

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
  '2026-salary-tax-guide': `2026년 국민연금·건강보험·장기요양·고용보험과 공식 근로소득 간이세액표를 반영합니다. 월 급여의 비과세액과 본인 포함 공제대상 가족 수, 간이세액표상 8~20세 자녀 수로 월 원천징수 100% 기준을 계산합니다. 실제 보험료는 신고 보수·가입 조건에 따라 달라질 수 있습니다.`,
  'dsr-stress-test-2026': '스트레스 DSR은 실제 이자에 더해지지 않는 심사용 가산금리입니다. 은행연합회 2026년 하반기 공시를 11월 13일 확인했으며 변동형 주담대는 수도권·규제지역 3.0%p, 지방 비규제지역 0.75%p(12월 31일까지)입니다. 신용대출은 총잔액 1억원 초과 시 적용하며, 신용·기타 대출의 고정금리 상품은 만기 5년 이상 미적용, 3년 이상 5년 미만 0.90%p입니다. 오피스텔 담보대출은 주담대 방식을 따릅니다. 가이드에서 금리 유형·경과규정과 같은 조건의 한도 비교 예시를 확인하세요.',
  'severance-calculation-guide': '퇴직금은 계속근로 1년 이상, 4주 평균 주 소정근로시간 15시간 이상인 근로자에게 적용됩니다. 1일 평균임금 × 30 × (재직일수 ÷ 365)로 계산하며 평균임금이 통상임금보다 낮으면 통상임금을 적용합니다. 상여금과 연차수당의 반영 범위, 세전 계산 예시, 지급 기한과 IRP 이전 시 유의사항을 정리합니다.',
  'isa-vs-regular-savings': 'ISA는 요건을 충족하면 계좌 내 과세 대상 순이익 중 일반형 200만원, 서민형·농어민형 400만원까지 비과세하며 초과분은 지방소득세 포함 9.9% 분리과세합니다. 연 납입한도 2,000만원, 총 1억원, 의무가입기간 3년 등의 조건이 있습니다. 가이드에서는 동일한 과세 대상 수익 1,000만원을 일반계좌와 비교합니다. 계산기의 ISA 비교는 일반형의 단순 세금 가정이며 가입 가능 여부나 실제 계좌 정산을 판정하지 않습니다.',
  'jeonse-safety-2026': '전세 계약 전후 등기·선순위 권리·체납 정보를 확인하고, HUG 전세보증금반환보증의 가입 조건과 신청 기한을 확인하세요. 주택 인도와 전입신고를 갖춘 다음 날 대항력이 발생하고 우선변제권에는 확정일자도 필요합니다. 시세 대비 보증금 비율만으로 안전이나 보증 가입을 판정할 수 없습니다. 보증금의 월차임 전환 상한은 연 10%와 한국은행 기준금리 + 2%p 중 낮은 비율이며, 월세를 전세로 역산한 금액은 협의용 참고치입니다.',
  'lotto-tax-guide': '로또 당첨금은 200만원 이하 비과세, 200만원 초과~3억원 이하 구간 22%, 3억원 초과분 33%의 지방소득세 포함 원천징수율을 적용합니다. 구매 방식과 당첨 금액에 따라 지급처와 준비 서류가 다르므로 동행복권의 공식 안내를 확인해야 합니다. 지급 기한은 지급 개시일부터 1년이며 마지막 날이 휴일이면 다음 영업일까지입니다. 실물 복권 원본을 보관하고 신원·계좌 정보를 공개하지 마세요.',
}

/** 네이버 RSS — 계산기 페이지 본문 요약 */
export const calculatorRssBodies: Record<string, string> = {
  '/salary':
    '2026년 4대보험 요율과 근로소득 간이세액표의 100% 원천징수 기준으로 연봉·월급 실수령액을 계산합니다. 비과세 수당, 본인을 포함한 가족 수와 8~20세 자녀 수를 입력할 수 있습니다. 금융 입력값은 브라우저에서 계산·저장됩니다.',
  '/mortgage':
    '원리금균등·원금균등·만기일시 상환 방식별 월 납입금과 총 이자를 비교합니다. DSR 한도는 입력한 연소득·기존 상환액·가산금리에 따른 원리금균등 가정이며 실제 대출 승인 금액과 다를 수 있습니다.',
  '/severance':
    '입사일·마지막 근무일·월급·상여금을 입력해 평균임금과 통상임금 기준의 세전 퇴직금을 예상합니다. 연차수당과 평균임금 산정 제외 기간은 자동 반영하지 않으며, DC형 적립금이나 퇴직소득세를 계산하지 않습니다.',
  '/savings':
    '예금·적금의 단리·월복리 이자와 세후 만기 예상액을 계산합니다. 동일한 과세 대상 이자에 일반과세 15.4%와 ISA 일반형 비과세 200만원·초과분 9.9%를 적용한 세금 가정도 비교할 수 있습니다.',
  '/jeonse':
    '입력한 전환율로 전세 보증금과 월세를 환산하고 보증금 차이에 따른 비용을 비교합니다. 보증금의 월차임 전환 시 법정 상한을 안내하며, 역산 결과와 전세가율 구간은 협의·확인용 참고 정보입니다.',
  '/lotto':
    '동행복권 최신 회차 당첨번호를 조회하고 6/45 로또 번호를 생성합니다. 1~5등 당첨 조건, 수령 절차, 기타소득세 원천징수 구간을 안내합니다.',
}

export const calculatorFeedItems = [
  { path: '/salary', title: '연봉 실수령액 계산기', description: '2026년 4대보험·근로소득세 기준 세후 월급 계산' },
  { path: '/mortgage', title: '주택담보대출 이자 계산기', description: '원리금균등·원금균등·만기일시 상환 비교' },
  { path: '/severance', title: '퇴직금 계산기', description: '평균임금·통상임금 기준 세전 퇴직금 예상' },
  { path: '/savings', title: '적금·예금 이자 계산기', description: '세후 이자·ISA 비과세 비교' },
  { path: '/jeonse', title: '전월세 전환 계산기', description: '전환율 입력·보증금과 월세 환산' },
  { path: '/lotto', title: '로또 번호 생성기', description: '최신 당첨번호 조회 및 6/45 번호 생성' },
] as const
