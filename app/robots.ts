import type { MetadataRoute } from 'next'
import { SITEMAP_URL, SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // Google — 렌더링·모바일 품질 평가
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-News'],
        allow: '/',
        disallow: ['/api/'],
      },
      // 네이버 · 다음 — 국내 검색 수집
      {
        userAgent: ['Yeti', 'NaverBot', 'DaumoaBot'],
        allow: '/',
        disallow: ['/api/'],
      },
      { userAgent: 'Bingbot', allow: '/', disallow: ['/api/'] },
      // AI 검색 요약 수집 허용
      { userAgent: ['GPTBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot'], allow: '/', disallow: ['/api/'] },
    ],
    sitemap: SITEMAP_URL,
    host: SITE_URL,
  }
}
