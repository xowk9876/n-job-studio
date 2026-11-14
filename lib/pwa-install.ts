import { SITE_URL } from '@/lib/seo-platform'

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

/** 네이버 공식 Android 바로가기 scheme. PWA 설치나 완료 여부를 의미하지 않는다.
 * https://developers.naver.com/docs/utils/mobileapp/ (2.4)
 * 사용자 클릭의 동일 창 링크에서만 사용하며 iframe·자동 리다이렉트는 사용하지 않는다.
 */
export function getNaverShortcutUrl(userAgent: string, platform: string, maxTouchPoints: number): string | null {
  if (getInstallContext(userAgent, platform, maxTouchPoints).device !== 'android' || !/\bNAVER\s*\((?:inapp|higgs)\s*;\s*search\s*;/i.test(userAgent)) return null
  // 주소는 현재 페이지/query가 아니라 프로젝트의 신뢰된 운영 canonical을 사용한다.
  const url = new URL(SITE_URL)
  if (url.protocol !== 'https:') return null
  const params = {
    url: SITE_URL,
    icon: new URL('/icon-192.png', url).href,
    title: '머니핏 계산기',
    serviceCode: 'moneyfit',
    version: '7',
  }
  return `naversearchapp://addshortcut?${Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}`
}
