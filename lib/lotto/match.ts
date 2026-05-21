/** 생성 번호 vs 최신 당첨번호 일치 (참고용, 과거 회차 기준) */
export type LottoMatchTier = 0 | 3 | 4 | 5 | '5+bonus' | 6

export function countMatches(
  pick: number[],
  winning: number[],
  bonus: number,
): { main: number; hasBonus: boolean } {
  const main = pick.filter(n => winning.includes(n)).length
  const hasBonus = pick.includes(bonus)
  return { main, hasBonus }
}

export function getMatchTier(
  pick: number[],
  winning: number[],
  bonus: number,
): LottoMatchTier {
  const { main, hasBonus } = countMatches(pick, winning, bonus)
  if (main === 6) return 6
  if (main === 5 && hasBonus) return '5+bonus'
  if (main === 5) return 5
  if (main === 4) return 4
  if (main === 3) return 3
  return 0
}

export function tierLabel(tier: LottoMatchTier): string | null {
  switch (tier) {
    case 6:
      return '1등 조건 일치(참고)'
    case '5+bonus':
      return '2등 조건 일치(참고)'
    case 5:
      return '3등 조건 일치(참고)'
    case 4:
      return '4등 조건 일치(참고)'
    case 3:
      return '5등 조건 일치(참고)'
    default:
      return null
  }
}
