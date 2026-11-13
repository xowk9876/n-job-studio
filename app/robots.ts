import type { MetadataRoute } from 'next'
import { SITEMAP_URL, SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // Google — 렌더링·모바일 품질 평가·이미지·뉴스 (Search Central 권고 user-agent)
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-News', 'Googlebot-Video', 'AdsBot-Google', 'Mediapartners-Google'],
        allow: '/',
        disallow: ['/api/'],
      },
      // 네이버 · 다음 — 국내 검색 수집 (서치어드바이저 공식 user-agent: Yeti)
      {
        userAgent: ['Yeti', 'NaverBot', 'Daumoa'],
        allow: '/',
        disallow: ['/api/'],
      },
      { userAgent: ['Bingbot', 'Slurp', 'DuckDuckBot'], allow: '/', disallow: ['/api/'] },
      // 기존 크롤러 접근 정책. 수집 허용이 검색 노출이나 AI 인용을 보장하지는 않는다.
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'Google-Extended',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Applebot',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: SITEMAP_URL,
    host: SITE_URL,
  }
}
