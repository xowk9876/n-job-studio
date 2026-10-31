'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchLottoStats, preserveNewerStats } from '@/lib/lotto/stats-client'
import type { LottoStats } from '@/lib/lotto/types'

const REFRESH_INTERVAL_MS = 5 * 60_000
const REQUEST_TIMEOUT_MS = 20_000

/** 보이는 동안 5분마다, 탭 복귀·재연결 시 재조회한다. 생성된 번호는 변경하지 않는다. */
export function useLottoStats() {
  const [stats, setStats] = useState<LottoStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refreshRef = useRef<() => void>(() => {})

  useEffect(() => {
    let disposed = false
    let controller: AbortController | null = null
    let current: LottoStats | null = null
    let lastAttempt = 0
    let timeout: ReturnType<typeof setTimeout> | undefined

    async function load(force = false) {
      if (disposed || controller) return
      controller = new AbortController()
      lastAttempt = Date.now()
      setIsLoading(true)
      timeout = setTimeout(() => controller?.abort(), REQUEST_TIMEOUT_MS)
      try {
        const payload = await fetchLottoStats(controller.signal, force)
        if (disposed) return
        const next = preserveNewerStats(current, payload)
        current = next
        setStats(next)
        setError(next !== payload ? '최신 조회가 완료되지 않아 이전에 확인한 데이터를 유지합니다.' : null)
      } catch {
        if (!disposed) setError('데이터를 불러오지 못했습니다. 연결을 확인하고 다시 시도하세요.')
      } finally {
        clearTimeout(timeout)
        controller = null
        if (!disposed) setIsLoading(false)
      }
    }

    const refreshIfDue = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastAttempt >= REFRESH_INTERVAL_MS) void load()
    }
    const reconnect = () => { void load() }
    refreshRef.current = () => { void load(true) }
    void load()
    const interval = setInterval(refreshIfDue, REFRESH_INTERVAL_MS)
    document.addEventListener('visibilitychange', refreshIfDue)
    window.addEventListener('focus', refreshIfDue)
    window.addEventListener('online', reconnect)

    return () => {
      disposed = true
      controller?.abort()
      clearTimeout(timeout)
      clearInterval(interval)
      document.removeEventListener('visibilitychange', refreshIfDue)
      window.removeEventListener('focus', refreshIfDue)
      window.removeEventListener('online', reconnect)
      refreshRef.current = () => {}
    }
  }, [])

  const refresh = useCallback(() => refreshRef.current(), [])
  return { stats, isLoading, error, refresh }
}
