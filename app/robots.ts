import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      // 주요 검색엔진 봇 명시 허용
      { userAgent: ['Googlebot', 'Yeti', 'Bingbot', 'DaumoaBot'], allow: '/', disallow: ['/api/', '/_next/'] },
      // AI 크롤러도 계산기 컨텐츠 인덱싱 허용 (마케팅 가치 ↑)
      { userAgent: ['GPTBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot'], allow: '/', disallow: ['/api/', '/_next/'] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
