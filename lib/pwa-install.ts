export type InstallPrompt = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** 호출자는 이벤트를 먼저 소비해야 한다. 실패·취소 후에도 같은 이벤트를 재사용하지 않는다. */
export async function installFromPrompt(event: InstallPrompt): Promise<'accepted' | 'dismissed' | 'failed'> {
  try {
    await event.prompt()
    return (await event.userChoice).outcome
  } catch {
    return 'failed'
  }
}

export type InstallPlatform = 'android' | 'ios' | 'desktop'

/** UA는 안내 문구에만 사용하며 실제 설치 가능 여부는 브라우저 이벤트로 판단한다. */
export function getInstallContext(userAgent: string, platform: string, maxTouchPoints: number) {
  const ios = /iPhone|iPad|iPod/i.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1)
  const device: InstallPlatform = ios ? 'ios' : /Android/i.test(userAgent) ? 'android' : 'desktop'
  const inApp = /NAVER|Instagram|KAKAOTALK|FBAN|FBAV|; wv\)/i.test(userAgent)
  return { device, inApp }
}
