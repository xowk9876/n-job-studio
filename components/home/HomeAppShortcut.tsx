'use client'

import { useEffect, useRef, useState } from 'react'
import { Monitor, Share, Smartphone } from 'lucide-react'
import { getInstallContext, getNaverShortcutUrl, installFromPrompt, type InstallPlatform, type InstallPrompt } from '@/lib/pwa-install'
import { SITE_URL } from '@/lib/seo-platform'

type Platform = InstallPlatform
const guides: Record<Platform, { title: string; steps: string[] }> = {
  android: {
    title: 'Android 홈 화면에 추가',
    steps: ['오른쪽 위 메뉴(⋮)에서 홈 화면에 추가 또는 앱 설치를 선택합니다.', '설치 또는 추가를 누르면 홈 화면에서 머니핏 아이콘을 사용할 수 있습니다.'],
  },
  ios: {
    title: 'iPhone · iPad 홈 화면에 추가',
    steps: ['공유 버튼(네모 위 화살표)을 누릅니다. Safari 버전에 따라 더 보기 메뉴 안에 있습니다.', '홈 화면에 추가를 선택합니다. 목록에 없으면 동작 편집에서 추가하세요.', '웹 앱으로 열기 옵션이 보이면 켠 뒤 추가를 누릅니다. 홈 화면에 머니핏 아이콘이 생깁니다.'],
  },
  desktop: {
    title: 'PC에 머니핏 앱 설치',
    steps: ['주소창 오른쪽의 설치 아이콘, 또는 브라우저 메뉴에서 앱 설치를 선택합니다.', '설치한 앱을 시작 메뉴·Dock·작업 표시줄에 고정해 바로 열 수 있습니다.'],
  },
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
}

export default function HomeAppShortcut() {
  const promptRef = useRef<InstallPrompt | null>(null)
  const busyRef = useRef(false)
  const guideRef = useRef<HTMLHeadingElement>(null)
  const [installed, setInstalled] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [guide, setGuide] = useState<Platform | null>(null)
  const [status, setStatus] = useState('')
  const [inApp, setInApp] = useState(false)
  const [naverShortcutUrl, setNaverShortcutUrl] = useState<string | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const sync = () => {
      setInstalled(isStandalone())
      setNaverShortcutUrl(getNaverShortcutUrl(navigator.userAgent, navigator.platform, navigator.maxTouchPoints))
    }
    sync()
    media.addEventListener('change', sync)
    const onPrompt = (event: Event) => {
      event.preventDefault()
      promptRef.current = event as InstallPrompt
    }
    const onInstalled = () => {
      setInstalled(true)
      promptRef.current = null
      setStatus('설치가 완료됐습니다. 머니핏 아이콘으로 바로 열어보세요.')
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => { if (guide) guideRef.current?.focus() }, [guide])

  async function addShortcut(platform: Platform, naverShortcut = false) {
    if (installed || busyRef.current) return
    const context = getInstallContext(navigator.userAgent, navigator.platform, navigator.maxTouchPoints)
    setInApp(context.inApp)
    setGuide(platform)
    setStatus('')
    const matchesDevice = platform !== 'ios' && platform === context.device
    // 같은 버튼을 다시 눌러도 안내로 이동한다. 설치 이벤트가 없거나 늦게 오는 경우에도 유효하다.
    if (guide === platform) guideRef.current?.focus()
    const event = promptRef.current
    if (!matchesDevice || !event) {
      setStatus(naverShortcut
        ? '네이버 앱에 홈 화면 바로가기 추가를 요청했습니다. 확인 창이 나오면 추가를 눌러주세요. 창이 나오지 않으면 아래 주소 복사와 Chrome 안내를 이용해주세요.'
        : '설치 창이 표시되지 않으면 아래 안내에 따라 브라우저에서 직접 추가해주세요.')
      return
    }
    // 브라우저 설치 이벤트는 취소한 경우에도 한 번만 사용할 수 있다.
    promptRef.current = null
    busyRef.current = true
    setInstalling(true)
    const result = await installFromPrompt(event)
    setStatus(result === 'accepted'
      ? '설치 요청을 수락했습니다. 브라우저의 설치 완료를 기다려주세요.'
      : result === 'dismissed'
        ? '설치를 취소했습니다. 아래 브라우저 메뉴 안내로 다시 추가할 수 있습니다.'
        : '설치 창을 열지 못했습니다. 아래 브라우저 메뉴에서 추가해주세요.')
    busyRef.current = false
    setInstalling(false)
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setStatus(`주소를 복사했습니다. ${guide === 'ios' ? 'Safari' : guide === 'android' ? 'Chrome' : 'Chrome 또는 Edge'} 주소창에 붙여넣어 열어주세요.`)
    } catch {
      setStatus('자동 복사를 사용할 수 없습니다. 아래 사이트 주소를 선택해 직접 복사해주세요.')
    }
  }

  return (
    <section id="install-app" className="home-section home-app scroll-mt-24" aria-labelledby="home-app-title">
      <header className="section-header">
        <p className="section-label">APP SHORTCUT</p>
        <h2 id="home-app-title" className="section-title">홈 화면에서 바로 열기</h2>
      </header>
      <p className="home-app__lead">내 기기에 머니핏 바로가기를 추가하세요. 가입 없이 사용할 수 있고, 입력값은 현재 브라우저에 저장됩니다.</p>
      <div className="home-app-grid">
        {([
          { platform: 'android', title: 'Android', description: 'Chrome에서 앱처럼 빠르게', label: 'Android 홈 화면에 추가', Icon: Smartphone },
          { platform: 'ios', title: 'iPhone · iPad', description: 'Safari에서 홈 화면 바로가기', label: 'iPhone 홈 화면 추가 안내', Icon: Share },
          { platform: 'desktop', title: '데스크톱', description: 'Chrome · Edge에서 별도 창으로', label: 'PC에 앱 설치', Icon: Monitor },
        ] as const).map(({ platform, title, description, label, Icon }) => (
          <article className="home-trust-card home-app__card" key={platform}>
            <Icon size={22} className="text-[color:var(--brand)]" aria-hidden />
            <h3 className="home-trust-card__title mt-3">{title}</h3>
            <p className="home-app__note !mt-1 !mb-4">{platform === 'android' && naverShortcutUrl ? '네이버 앱에서 홈 화면 바로가기' : description}</p>
            {platform === 'android' && naverShortcutUrl && !installed ? (
              <a href={naverShortcutUrl} className="home-app__action" aria-disabled={installing}
                aria-expanded={guide === platform} aria-controls={`install-guide-${platform}`} onClick={event => {
                  if (busyRef.current) { event.preventDefault(); return }
                  // 새 이벤트가 도착한 직후에도 native prompt가 scheme보다 우선한다.
                  if (promptRef.current) {
                    event.preventDefault()
                    void addShortcut(platform)
                    return
                  }
                  // 기본 링크 동작으로 같은 창에서 호출한다. 성공을 추정하지 않고 안내는 유지한다.
                  void addShortcut(platform, true)
                }}>{label}</a>
            ) : (
              <button type="button" className="home-app__action" disabled={installed || installing}
                aria-expanded={guide === platform} aria-controls={`install-guide-${platform}`} onClick={() => void addShortcut(platform)}>
                {installed ? '앱으로 사용 중' : label}
              </button>
            )}
            {platform === 'android' && naverShortcutUrl && !installed && (
              <p className="home-app__note">네이버 앱의 홈 화면 바로가기 추가를 요청합니다. Chrome의 독립 실행형 앱(PWA) 설치와는 다릅니다. 최종 추가는 기기에서 확인해주세요.</p>
            )}
            {guide === platform && (
              <div id={`install-guide-${platform}`} className="home-app__guide mt-4" role="region" aria-labelledby={`install-guide-title-${platform}`}>
                <h4 id={`install-guide-title-${platform}`} ref={guideRef} tabIndex={-1} className="home-trust-card__title scroll-mt-24">{guides[platform].title}</h4>
                <p className="home-app__status !mt-3" role="status">{installed ? '머니핏 앱이 설치되어 있습니다.' : status}</p>
                <p className="home-app__note">{platform === 'android' && naverShortcutUrl
                  ? '네이버 확인 창이 나오지 않거나 Chrome 앱으로 설치하려면 아래 방법을 이용해주세요.'
                  : `${inApp ? '현재 앱 안의 브라우저에서는 설치 창이 지원되지 않을 수 있습니다. ' : ''}네이버·Instagram·카카오톡 등 앱 안에서 보고 있다면 먼저 외부 브라우저로 열어주세요.`}</p>
                <ol className="home-app__steps">
                  <li>앱의 더 보기(⋮·⋯) 또는 공유 메뉴에서 ‘외부 브라우저로 열기’나 ‘브라우저에서 열기’를 찾아 선택하세요. 메뉴 이름과 위치는 앱 버전에 따라 다릅니다.</li>
                  <li>메뉴가 없거나 계속 앱 안에서 열린다면 아래 주소를 복사한 뒤 {platform === 'ios' ? 'Safari' : platform === 'android' ? 'Chrome' : 'Chrome 또는 Edge'} 앱을 직접 실행해 주소창에 붙여넣으세요.</li>
                </ol>
                <div className="mt-3 flex flex-col gap-3">
                  <button type="button" className="home-app__action" onClick={() => void copyAddress()}>사이트 주소 복사</button>
                  <label className="home-app__note !mt-0" htmlFor={`install-url-${platform}`}>직접 복사할 사이트 주소</label>
                  <input id={`install-url-${platform}`} className="w-full min-w-0 rounded border border-[color:var(--line)] bg-transparent p-2 text-xs text-[color:var(--ink)]" readOnly value={SITE_URL} onFocus={event => event.currentTarget.select()} />
                </div>
                <p className="home-app__note">외부 브라우저에서 연 다음</p>
                <ol className="home-app__steps">{guides[platform].steps.map(step => <li key={step}>{step}</li>)}</ol>
                <p className="home-app__note">입력값은 브라우저마다 따로 저장되어 다른 브라우저로 자동 이동하지 않습니다.</p>
                <button type="button" className="home-app__action mt-3" onClick={event => {
                  const trigger = event.currentTarget.closest('article')?.querySelector<HTMLElement>('[aria-expanded]')
                  setGuide(null)
                  setStatus('')
                  trigger?.focus()
                }}>안내 닫기</button>
              </div>
            )}
          </article>
        ))}
      </div>
      <p className="home-app__note">설치 메뉴는 기기·브라우저에 따라 다릅니다. 계산기와 최신 정보 조회에는 인터넷 연결이 필요합니다.</p>
    </section>
  )
}
