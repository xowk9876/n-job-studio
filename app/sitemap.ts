import type { MetadataRoute } from 'next'
import { SEO_UPDATED_AT, SITE_URL, guideItems } from '@/lib/seo'

// 변경빈도(changeFrequency)는 봇 크롤링 우선순위 힌트 — 실제 갱신 주기에 정직하게 매핑
const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency']; modified?: string }[] = [
  { path: '',           priority: 1.0,  freq: 'weekly',  modified: SEO_UPDATED_AT },
  // 계산기 — 데이터·UX 개선 시 빈번 갱신 → weekly
  { path: '/salary',    priority: 0.95, freq: 'weekly',  modified: SEO_UPDATED_AT },
  { path: '/mortgage',  priority: 0.95, freq: 'weekly',  modified: SEO_UPDATED_AT },
  { path: '/severance', priority: 0.9,  freq: 'weekly',  modified: SEO_UPDATED_AT },
  { path: '/savings',   priority: 0.9,  freq: 'weekly',  modified: SEO_UPDATED_AT },
  { path: '/jeonse',    priority: 0.9,  freq: 'weekly',  modified: SEO_UPDATED_AT },
  { path: '/lotto',     priority: 0.85, freq: 'daily',   modified: SEO_UPDATED_AT },
  // 가이드 인덱스 — 새 가이드 추가 시 갱신 → weekly
  { path: '/guide',     priority: 0.9,  freq: 'weekly',  modified: SEO_UPDATED_AT },
  // 개별 가이드 본문 — 법령·세율 변경 시 갱신 → monthly (실제 갱신 주기 반영, 크롤링 효율 ↑)
  ...guideItems.map((guide) => ({
    path: `/guide/${guide.slug}`,
    priority: 0.85,
    freq: 'monthly' as const,
    modified: guide.updatedAt,
  })),
  // 정보 페이지 — 약관·정책 변경 시만 갱신, lastmod 명시
  { path: '/about',           priority: 0.6, freq: 'yearly', modified: SEO_UPDATED_AT },
  { path: '/contact',         priority: 0.6, freq: 'yearly', modified: SEO_UPDATED_AT },
  { path: '/privacy-policy',  priority: 0.4, freq: 'yearly', modified: SEO_UPDATED_AT },
  { path: '/terms',           priority: 0.4, freq: 'yearly', modified: SEO_UPDATED_AT },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, freq, modified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: modified || SEO_UPDATED_AT,
    changeFrequency: freq,
    priority,
  }))
}
