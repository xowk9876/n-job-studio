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
      // AI 검색 요약·인용 수집 허용 (2026 AI 검색 엔진 인용률 ↑)
      // - GPTBot: ChatGPT 학습 / OAI-SearchBot: SearchGPT 실시간 검색 / ChatGPT-User: 사용자 요청 fetch
      // - Google-Extended: Gemini · AI Overviews / ClaudeBot: Claude / PerplexityBot: Perplexity
      // - Applebot-Extended: Apple Intelligence / CCBot: Common Crawl (다수 LLM 학습 데이터)
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
