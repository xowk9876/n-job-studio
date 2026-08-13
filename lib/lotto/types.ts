/**
 * 로또 6/45 도메인 타입.
 *
 * 런타임 의존성이 없는 순수 타입 모듈이다. 클라이언트 컴포넌트가 `data/lotto-history.json`
 * (약 81KB)을 번들에 끌어오지 않고 API 응답 타입만 참조할 수 있도록 분리해 둔다.
 */

/** 회차 1건의 추첨 결과 (번호는 오름차순 6개) */
export type LottoDraw = {
  round: number
  /** ISO 날짜 (YYYY-MM-DD) */
  drawDate: string
  numbers: number[]
  bonusNumber: number
}

/** 데이터 출처 — 동행복권 실시간 조회 / 저장소에 커밋된 정적 스냅샷 */
export type LottoDataOrigin = 'live' | 'snapshot'

/** 당첨금 정보까지 포함한 회차 상세 */
export type LottoRoundResult = LottoDraw & {
  firstWinnerCount: number
  /** 1등 1명당 당첨금 (원) */
  firstPrizeAmount: number
  /** 해당 회차 총 판매금액 (원) */
  totalSalesAmount: number
  origin: LottoDataOrigin
}

/** 번호 1개(1~45)의 출현 통계 */
export type LottoNumberStat = {
  number: number
  /** 전 회차 누적 출현 횟수 (보너스 제외) */
  count: number
  /** 최근 N회 출현 횟수 */
  recentCount: number
  /** 마지막으로 나온 회차 — 한 번도 안 나왔으면 null */
  lastRound: number | null
  /** 마지막 출현 이후 경과 회차 수 (장기 미출현 판단용) */
  gap: number
}

/** `/api/lotto/stats` 응답 */
export type LottoStats = {
  /** 통계에 반영된 마지막 회차 */
  dataThrough: number
  /** dataThrough 회차의 추첨일 (YYYY-MM-DD) */
  latestDrawDate: string
  /** 집계에 사용한 총 회차 수 */
  totalDraws: number
  /** recentCount 집계 구간 (회차 수) */
  recentWindow: number
  /** 1~45번 전체 통계 (번호 오름차순) */
  numbers: LottoNumberStat[]
  /** 최근 구간 출현이 많은 번호 (내림차순) */
  hot: number[]
  /** 최근 구간 출현이 적은 번호 (오름차순) */
  cold: number[]
  /** 미출현 기간이 긴 번호 (내림차순) */
  overdue: number[]
  /** 역대 1등 조합의 사전식 순번 — 완전 일치 조합 회피용 */
  pastCombinationRanks: number[]
  /** 최근 회차 목록 (내림차순) */
  recentDraws: LottoDraw[]
  /** 'live' = 동행복권 조회로 최신 회차까지 확인 · 'snapshot' = 조회 실패로 정적 스냅샷 기준 */
  origin: LottoDataOrigin
}
