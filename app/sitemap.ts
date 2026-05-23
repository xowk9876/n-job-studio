import type { MetadataRoute } from 'next'
import { SEO_UPDATED_AT, SITE_URL, guideItems } from '@/lib/seo'

const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency']; modified?: string }[] = [
  { path: '',           priority: 1.0, freq: 'weekly', modified: SEO_UPDATED_AT },
  { path: '/salary',    priority: 0.95, freq: 'weekly', modified: SEO_UPDATED_AT },
  { path: '/mortgage',  priority: 0.95, freq: 'weekly', modified: SEO_UPDATED_AT },
  { path: '/severance', priority: 0.9, freq: 'weekly', modified: SEO_UPDATED_AT },
  { path: '/savings',   priority: 0.9, freq: 'weekly', modified: SEO_UPDATED_AT },
  { path: '/jeonse',    priority: 0.9, freq: 'weekly', modified: SEO_UPDATED_AT },
  { path: '/lotto',     priority: 0.85, freq: 'weekly', modified: SEO_UPDATED_AT },
  { path: '/guide',     priority: 0.9, freq: 'weekly', modified: SEO_UPDATED_AT },
  ...guideItems.map((guide) => ({
    path: `/guide/${guide.slug}`,
    priority: 0.85,
    freq: 'weekly' as const,
    modified: guide.updatedAt,
  })),
  // Information
  { path: '/about',           priority: 0.6, freq: 'yearly' },
  { path: '/contact',         priority: 0.6, freq: 'yearly' },
  { path: '/privacy-policy',  priority: 0.4, freq: 'yearly' },
  { path: '/terms',           priority: 0.4, freq: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, freq, modified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: modified || SEO_UPDATED_AT,
    changeFrequency: freq,
    priority,
  }))
}
