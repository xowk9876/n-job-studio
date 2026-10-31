'use client'

import { useEffect, useRef, useState } from 'react'
import { Monitor, Share, Smartphone } from 'lucide-react'
import { installFromPrompt, type InstallPrompt } from '@/lib/pwa-install'

type Platform = 'android' | 'ios' | 'desktop'
const guides: Record<Platform, { title: string; steps: string[] }> = {
  android: {
    title: 'Android 홈 화면에 추가',
    steps: ['Chrome에서 머니핏 계산기를 엽니다. 카카오톡 등 앱 안에서는 브라우저로 열기를 먼저 누르세요.', '오른쪽 위 메뉴(⋮)에서 홈 화면에 추가 또는 앱 설치를 선택합니다.', '설치 또는 추가를 누르면 홈 화면에서 머니핏 아이콘을 사용할 수 있습니다.'],
  },
  ios: {
    title: 'iPhone · iPad 홈 화면에 추가',
    steps: ['Safari에서 머니핏 계산기를 엽니다. 다른 앱 안에서 보고 있다면 아래 주소를 복사해 Safari에서 여세요.', '공유 버튼(네모 위 화살표)을 누릅니다. Safari 버전에 따라 더 보기 메뉴 안에 있습니다.', '홈 화면에 추가를 선택합니다. 목록에 없으면 동작 편집에서 추가하세요.', '웹 앱으로 열기를 켠 뒤 추가를 누릅니다. 홈 화면에 머니핏 아이콘이 생깁니다.'],
  },
  desktop: {
    title: 'PC에 머니핏 앱 설치',
    steps: ['Chrome 또는 Edge에서 이 사이트를 엽니다.', '주소창 오른쪽의 설치 아이콘, 또는 브라우저 메뉴에서 앱 설치를 선택합니다.', '설치한 앱을 시작 메뉴·Dock·작업 표시줄에 고정해 바로 열 수 있습니다.'],
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
  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const sync = () => setInstalled(isStandalone())
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

  async function addShortcut(platform: Platform) {
    setPageUrl(window.location.origin)
    setGuide(platform)
    if (installed || busyRef.current) return
    const android = /Android/i.test(navigator.userAgent)
    const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const matchesDevice = platform === 'android' ? android : platform === 'desktop' && !android && !ios
    const event = promptRef.current
    if (!matchesDevice || !event) return
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
      await navigator.clipboard.writeText(pageUrl)
      setStatus('주소를 복사했습니다. Safari 주소창에 붙여넣어 열어주세요.')
    } catch {
      setStatus('자동 복사를 사용할 수 없습니다. 아래 주소를 길게 눌러 복사해주세요.')
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
            <p className="home-app__note !mt-1 !mb-4">{description}</p>
            <button type="button" className="home-app__action" disabled={installed || installing}
              aria-expanded={guide === platform} aria-controls="install-guide" onClick={() => void addShortcut(platform)}>
              {installed ? '앱으로 사용 중' : label}
            </button>
          </article>
        ))}
      </div>
      <p className="home-app__status !mt-3" role="status">{installed ? '머니핏 앱이 설치되어 있습니다.' : status}</p>
      {guide && (
        <div id="install-guide" className="home-trust-card mt-3" role="region" aria-labelledby="install-guide-title">
          <h3 id="install-guide-title" ref={guideRef} tabIndex={-1} className="home-trust-card__title focus:outline-none">{guides[guide].title}</h3>
          <ol className="home-app__steps">{guides[guide].steps.map(step => <li key={step}>{step}</li>)}</ol>
          {guide === 'ios' && <>
            <p className="home-app__note">iPhone에서는 Safari에서 직접 추가를 눌러야 합니다.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" className="home-app__action !w-auto" onClick={() => void copyAddress()}>사이트 주소 복사</button>
              <a href={pageUrl || '/'} className="break-all text-sm text-[color:var(--brand)]">{pageUrl}</a>
            </div>
          </>}
        </div>
      )}
      <p className="home-app__note">설치 메뉴는 기기·브라우저에 따라 다릅니다. 계산기와 최신 정보 조회에는 인터넷 연결이 필요합니다.</p>
    </section>
  )
}
