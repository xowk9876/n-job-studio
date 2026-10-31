import { parseCalendarDate } from '../input-validation'
import { isValidNumberSet } from './pattern'
import { TOTAL_COMBINATIONS } from './stats'
import type { LottoStats } from './types'

/** 생성기에 필요한 API 필드를 검증한다. 잘못된 응답으로 생성 버튼이 멈추지 않게 한다. */
export function isLottoStats(value: unknown): value is LottoStats {
  if (!value || typeof value !== 'object') return false
  const stats = value as LottoStats
  return Number.isSafeInteger(stats.dataThrough) && stats.dataThrough > 0
    && stats.totalDraws === stats.dataThrough
    && typeof stats.latestDrawDate === 'string' && !!parseCalendarDate(stats.latestDrawDate)
    && (stats.origin === 'live' || stats.origin === 'snapshot')
    && Array.isArray(stats.pastCombinationRanks)
    && stats.pastCombinationRanks.length === stats.totalDraws
    && stats.pastCombinationRanks.every(rank => Number.isInteger(rank) && rank >= 0 && rank < TOTAL_COMBINATIONS)
    && Array.isArray(stats.recentDraws) && stats.recentDraws.length > 0
    && stats.recentDraws[0]?.round === stats.dataThrough
    && stats.recentDraws[0]?.drawDate === stats.latestDrawDate
    && stats.recentDraws.every(draw => draw && Number.isInteger(draw.round) && draw.round > 0
      && draw.round <= stats.dataThrough && typeof draw.drawDate === 'string' && !!parseCalendarDate(draw.drawDate)
      && Array.isArray(draw.numbers) && isValidNumberSet(draw.numbers)
      && Number.isInteger(draw.bonusNumber) && draw.bonusNumber >= 1 && draw.bonusNumber <= 45
      && !draw.numbers.includes(draw.bonusNumber))
    && Array.isArray(stats.numbers) && stats.numbers.length === 45
    && stats.numbers.every((stat, i) => stat && stat.number === i + 1
      && [stat.count, stat.recentCount, stat.gap].every(n => Number.isSafeInteger(n) && n >= 0))
}

export async function fetchLottoStats(signal: AbortSignal, force = false): Promise<LottoStats> {
  const response = await fetch(force ? '/api/lotto/stats?refresh=1' : '/api/lotto/stats', {
    cache: 'no-store', signal,
  })
  if (!response.ok) throw new Error('당첨 데이터 조회에 실패했습니다.')
  const payload: unknown = await response.json()
  if (!isLottoStats(payload)) throw new Error('당첨 데이터 응답을 확인할 수 없습니다.')
  return payload
}

/** 장애 시 더 오래된 스냅샷이 이미 확인한 최신 회차를 덮어쓰지 않도록 한다. */
export function preserveNewerStats(current: LottoStats | null, incoming: LottoStats): LottoStats {
  return current && current.dataThrough > incoming.dataThrough ? current : incoming
}
