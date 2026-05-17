import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // Google/Naver/Daum/Bing이 CSS·JS까지 렌더링할 수 있어야 모바일 품질 평가에 유리합니다.
      { userAgent: ['Googlebot', 'Yeti', 'Bingbot', 'DaumoaBot'], allow: '/', disallow: ['/api/'] },
      // 공개 계산기·가이드 콘텐츠는 AI 검색 요약 수집도 허용합니다.
      { userAgent: ['GPTBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot'], allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
