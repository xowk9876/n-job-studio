import type { NextConfig } from 'next'

/**
 * URL 규칙: sitemap·canonical과 동일하게 trailing slash 없음.
 * 커스텀 도메인 전환 시 NEXT_PUBLIC_SITE_URL만 변경하고 proxy가 호스트 308 처리.
 */
const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    // 예: 커스텀 도메인 확정 후 vercel.app → 주 도메인 고정 리다이렉트가 필요하면 여기에 추가
    // { source: '/:path*', has: [{ type: 'host', value: 'n-job-studio.vercel.app' }], destination: 'https://your-domain.com/:path*', permanent: true },
    return []
  },
}

export default nextConfig
