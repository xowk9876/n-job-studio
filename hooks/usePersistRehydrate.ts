'use client'

import { useEffect, useState } from 'react'

type PersistApi = {
  rehydrate: () => void
  hasHydrated: () => boolean
  onFinishHydration: (cb: () => void) => () => void
}

type PersistedStore = {
  persist?: PersistApi
}

/** localStorage 복원 전까지 기본값으로 SSR·첫 페인트를 맞춥니다. */
export function usePersistRehydrate(store: PersistedStore) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const persist = store.persist
    if (!persist) {
      setHydrated(true)
      return
    }

    const unsub = persist.onFinishHydration(() => setHydrated(true))
    persist.rehydrate()
    if (persist.hasHydrated()) setHydrated(true)

    return unsub
    // store는 모듈 싱글톤 — 의존성 생략
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return hydrated
}
