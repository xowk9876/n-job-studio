import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * PWA Manifest — 모바일 검색·홈 추가·Google Mobile-Friendly 신호 강화.
 * Next 16 App Router 표준 파일 컨벤션 (output → /manifest.webmanifest).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '머니핏 계산기 — 2026 한국 재테크 계산기',
    short_name: '머니핏 계산기',
    description:
      '2026년 최신 세율·4대보험 요율·법령 기준 한국 재테크 계산기. 연봉 실수령액, 대출 이자, 퇴직금, 적금, 전월세, 로또까지 무료.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#06070b',
    theme_color: '#06070b',
    lang: 'ko-KR',
    dir: 'ltr',
    categories: ['finance', 'productivity', 'utilities'],
    id: SITE_URL,
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/opengraph-image',
        sizes: '1200x630',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: '연봉 실수령액 계산',
        short_name: '연봉',
        description: '2026년 4대보험·소득세 기준 세후 월급 즉시 계산',
        url: '/salary',
      },
      {
        name: '주담대 이자 계산',
        short_name: '주담대',
        description: '원리금균등·원금균등·만기일시 + 스트레스 DSR',
        url: '/mortgage',
      },
      {
        name: '퇴직금 계산',
        short_name: '퇴직금',
        description: '근로기준법 평균임금 기준 자동 산출',
        url: '/severance',
      },
      {
        name: '적금·예금 이자 계산',
        short_name: '적금',
        description: '세후 이자 + ISA 비과세 비교',
        url: '/savings',
      },
    ],
  }
}
