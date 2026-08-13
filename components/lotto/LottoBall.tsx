/**
 * 동행복권 공식 볼 색상 체계 (dhlottery.co.kr 기준)
 * 1-10 노랑 · 11-20 파랑 · 21-30 빨강 · 31-40 회색 · 41-45 초록
 */

export type BallPalette = { bg: string; text: string; shadow: string }

export const LOTTO_BALL_COLORS: Record<'yellow' | 'blue' | 'red' | 'gray' | 'green', BallPalette> = {
  yellow: { bg: '#FBC400', text: '#6B4C00', shadow: 'rgba(251,196,0,0.35)' },
  blue: { bg: '#69C8F2', text: '#1A3A5C', shadow: 'rgba(105,200,242,0.35)' },
  red: { bg: '#FF7272', text: '#5C1A1A', shadow: 'rgba(255,114,114,0.35)' },
  gray: { bg: '#AAAAAA', text: '#2A2A2A', shadow: 'rgba(170,170,170,0.35)' },
  green: { bg: '#B0D840', text: '#3A4C00', shadow: 'rgba(176,216,64,0.35)' },
}

export function getLottoBallStyle(n: number): BallPalette {
  if (n <= 10) return LOTTO_BALL_COLORS.yellow
  if (n <= 20) return LOTTO_BALL_COLORS.blue
  if (n <= 30) return LOTTO_BALL_COLORS.red
  if (n <= 40) return LOTTO_BALL_COLORS.gray
  return LOTTO_BALL_COLORS.green
}

export type BallSize = 'xl' | 'lg' | 'md' | 'sm'

/** 모바일 320px에서도 공 7개 + 보너스가 한 줄에 들어가도록 뷰포트 비례 크기를 사용한다 */
const SIZE_CLASS: Record<BallSize, string> = {
  // 생성 결과용 — 번호 가독성을 최우선으로 두고 공 6개가 한 줄에 들어가는 최대 크기
  xl: 'h-[clamp(34px,11.5vw,56px)] w-[clamp(34px,11.5vw,56px)] text-[clamp(14px,4.2vw,24px)]',
  lg: 'h-[clamp(26px,7.2vw,52px)] w-[clamp(26px,7.2vw,52px)] text-[clamp(10px,2.8vw,16px)]',
  md: 'w-8 h-8 min-[390px]:w-9 min-[390px]:h-9 md:w-11 md:h-11 text-[12px] min-[390px]:text-[13px] md:text-[15px]',
  sm: 'w-7 h-7 text-[11px]',
}

/** 공 한 줄 컨테이너 — 줄바꿈 없이 가로 정렬 */
export const BALL_ROW_CLASS =
  'flex flex-nowrap items-center justify-center gap-[clamp(3px,1vw,12px)] w-full max-w-full'

/** 생성 결과 공 한 줄 — xl 사이즈 6개 기준 간격 */
export const BALL_ROW_XL_CLASS =
  'flex flex-nowrap items-center justify-center gap-[clamp(3px,1vw,10px)] w-full max-w-full'

export function LottoBall({
  number,
  size = 'md',
  highlighted = false,
  bonus = false,
  className = '',
}: {
  number: number
  size?: BallSize
  /** 강조 링 (예: 최신 회차 당첨번호와 일치) */
  highlighted?: boolean
  /** 보너스 번호 표시 */
  bonus?: boolean
  className?: string
}) {
  const palette = getLottoBallStyle(number)

  return (
    <span
      className={[
        SIZE_CLASS[size],
        'shrink-0 rounded-full inline-flex items-center justify-center font-extrabold tabular',
        bonus ? 'ring-2 ring-ink/20' : '',
        highlighted ? 'ring-2 ring-[#FBC400]/70' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        boxShadow: `0 3px 8px ${palette.shadow}`,
      }}
    >
      {number}
    </span>
  )
}
