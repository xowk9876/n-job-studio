'use client'

import { useEffect, useState } from 'react'
import { Share, Smartphone } from 'lucide-react'

type InstallPrompt = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone() {
  const ios = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return window.matchMedia('(display-mode: standalone)').matches || ios
}

export default function HomeAppShortcut() {
  const [promptEvent, setPromptEvent] = useState<InstallPrompt | null>(null)
  const [installed, setInstalled] = useState(false)
  const [outcome, setOutcome] = useState<'accepted' | 'dismissed' | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const sync = () => setInstalled(isStandalone())
    sync()
    media.addEventListener('change', sync)

    const onPrompt = (event: Event) => {
      event.preventDefault()
      setPromptEvent(event as InstallPrompt)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
      setOutcome('accepted')
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    }

    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function install() {
    if (!promptEvent) return
    await promptEvent.prompt()
    const choice = await promptEvent.userChoice
    setOutcome(choice.outcome)
    if (choice.outcome === 'accepted') setPromptEvent(null)
  }

  const status = installed
    ? '이미 앱으로 열려 있습니다. 다음부터는 홈 화면의 머니핏 계산기 아이콘을 누르면 됩니다.'
    : outcome === 'accepted'
      ? '홈 화면에 추가했습니다. 아이콘을 누르면 주소창 없이 열립니다.'
      : outcome === 'dismissed'
        ? '추가를 건너뛰었습니다. 아래 순서로 다시 넣을 수 있습니다.'
        : null

  return (
    <section className="home-section home-app" aria-labelledby="home-app-title">
      <header className="section-header">
        <p className="section-label">APP</p>
        <h2 id="home-app-title" className="section-title">홈 화면에서 바로 열기</h2>
      </header>
      <p className="home-app__lead">
        브라우저 주소창 없이 계산기로 들어갑니다. 설치해도 가입은 없고, 입력값은 이 기기에만 남습니다.
        홈 화면 아이콘을 길게 누르면 연봉·대출·퇴직금·적금으로 바로 이동합니다.
      </p>

      {promptEvent && (
        <button type="button" className="btn-hero-primary home-app__install" onClick={install}>
          <Smartphone size={18} aria-hidden />
          <span>홈 화면에 추가</span>
        </button>
      )}

      {status && (
        <p className="home-app__status" role="status">{status}</p>
      )}

      <div className="home-app-grid">
        <article className="home-trust-card">
          <div className="home-trust-card__icon" style={{ color: '#6bafff' }}>
            <Share size={20} strokeWidth={1.7} aria-hidden />
          </div>
          <h3 className="home-trust-card__title">iPhone · iPad</h3>
          <ol className="home-app__steps">
            <li>Safari로 이 페이지를 엽니다. Chrome 등 다른 앱에서는 추가 메뉴가 없을 수 있습니다.</li>
            <li>화면 아래 공유 버튼(네모와 화살표)을 누릅니다.</li>
            <li>홈 화면에 추가를 고르고, 오른쪽 위 추가를 누릅니다.</li>
          </ol>
        </article>
        <article className="home-trust-card">
          <div className="home-trust-card__icon" style={{ color: '#3ee0a5' }}>
            <Smartphone size={20} strokeWidth={1.7} aria-hidden />
          </div>
          <h3 className="home-trust-card__title">Android</h3>
          <ol className="home-app__steps">
            <li>위쪽에 홈 화면에 추가 버튼이 있으면 그 버튼으로 설치합니다.</li>
            <li>버튼이 없으면 Chrome 오른쪽 위 메뉴(⋮)에서 홈 화면에 추가 또는 앱 설치를 누릅니다.</li>
            <li>설치 후 홈 화면 아이콘으로 엽니다. 아이콘을 길게 누르면 계산기 바로가기가 나옵니다.</li>
          </ol>
        </article>
      </div>
      <p className="home-app__note">컴퓨터 Chrome·Edge는 주소창 오른쪽 설치 아이콘, 또는 메뉴의 앱 설치로 같은 앱을 추가합니다.</p>
    </section>
  )
}
