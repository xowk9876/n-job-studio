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
  const [hydrated, setHydrated] = useState<boolean>(() => !store.persist)

  useEffect(() => {
    const persist = store.persist
    if (!persist) return

    const unsub = persist.onFinishHydration(() => setHydrated(true))
    persist.rehydrate()
    // 외부 store(zustand persist) 상태 동기화 — 의도된 setState
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (persist.hasHydrated()) setHydrated(true)

    return unsub
    // store는 모듈 싱글톤 — 의존성 생략
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return hydrated
}
