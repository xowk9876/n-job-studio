'use client'

import { useEffect, useState } from 'react'

type PersistedStore = {
  persist?: {
    rehydrate: () => void | Promise<void>
    onFinishHydration: (cb: () => void) => () => void
  }
}

/** SSR/첫 렌더는 같은 상태로 시작한다. 저장소 접근 실패도 복원 시도의 완료로 처리한다. */
export function usePersistRehydrate(store: PersistedStore) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    let active = true
    const finish = () => { if (active) setHydrated(true) }
    const unsubscribe = store.persist?.onFinishHydration(finish)
    // JSON 손상·저장소 차단 시 Zustand는 복원 완료 이벤트를 발생시키지 않을 수 있다.
    // 복원 Promise가 끝나면 유효한 기본 상태로 페이지를 사용할 수 있게 한다.
    Promise.resolve().then(() => store.persist?.rehydrate()).then(finish, finish)
    return () => { active = false; unsubscribe?.() }
  }, [store])
  return hydrated
}
