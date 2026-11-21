'use client'

import { useEffect, useState } from 'react'
import { nextRegularDraw } from '@/lib/lotto/schedule'

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', weekday: 'short',
})

function remainingTime(milliseconds: number) {
  const minutes = Math.ceil(milliseconds / 60_000)
  const hours = Math.floor(minutes / 60)
  if (hours >= 24) return `${Math.floor(hours / 24)}일 ${hours % 24}시간`
  if (hours > 0) return `${hours}시간 ${minutes % 60}분`
  return `${minutes}분`
}

export default function LottoDrawSchedule() {
  const [label, setLabel] = useState('정규 추첨 방송은 매주 토요일 20:35경입니다 (한국시간).')

  useEffect(() => {
    let timer: number
    function update() {
      window.clearTimeout(timer)
      if (document.hidden) return
      const now = Date.now()
      const { round, startsAt } = nextRegularDraw(now)
      setLabel(`제${round}회 정규 방송 예정 · ${dateFormat.format(startsAt)} 20:35경 (한국시간) · ${remainingTime(startsAt - now)} 남음`)
      timer = window.setTimeout(update, 60_000 - now % 60_000)
    }
    update()
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return <p className="mt-1 text-[12.5px] text-[color:var(--sub)]">{label}</p>
}
