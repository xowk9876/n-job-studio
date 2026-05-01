import type { NextConfig } from 'next'

// ─── Content Security Policy ───────────────────────────────────────────
// AdSense 가 필요한 모든 엔드포인트를 화이트리스트.
// (pagead2 = 광고 스크립트, tpc/securepubads = 광고 렌더, googleads = 클릭 트래킹,
//  googlesyndication.com = 이미지/ads.txt)
const ADSENSE_DOMAINS = {
  script: [
    'https://pagead2.googlesyndication.com',
    'https://tpc.googlesyndication.com',
    'https://securepubads.g.doubleclick.net',
    'https://www.googletagservices.com',
  ],
  frame: [
    'https://googleads.g.doubleclick.net',
    'https://tpc.googlesyndication.com',
    'https://www.google.com',
  ],
  img: [
    'https://pagead2.googlesyndication.com',
    'https://tpc.googlesyndication.com',
    'https://googleads.g.doubleclick.net',
    'https://www.google.com',
    'https://www.google-analytics.com',
  ],
  connect: [
    'https://pagead2.googlesyndication.com',
    'https://googleads.g.doubleclick.net',
    'https://www.google.com',
  ],
}

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${ADSENSE_DOMAINS.script.join(' ')}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `img-src 'self' data: blob: ${ADSENSE_DOMAINS.img.join(' ')}`,
  `connect-src 'self' ${ADSENSE_DOMAINS.connect.join(' ')}`,
  `frame-src ${ADSENSE_DOMAINS.frame.join(' ')}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Content-Security-Policy', value: csp },
]

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // 정적 자산 장기 캐싱
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff2?)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
