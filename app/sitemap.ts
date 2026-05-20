import type { MetadataRoute } from 'next'
import { SEO_UPDATED_AT, SITE_URL, guideItems } from '@/lib/seo'

const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency']; modified?: string }[] = [
  { path: '',           priority: 1.0, freq: 'weekly' },
  { path: '/salary',    priority: 0.9, freq: 'monthly' },
  { path: '/mortgage',  priority: 0.9, freq: 'monthly' },
  { path: '/severance', priority: 0.8, freq: 'monthly' },
  { path: '/savings',   priority: 0.8, freq: 'monthly' },
  { path: '/jeonse',    priority: 0.8, freq: 'monthly' },
  { path: '/lotto',     priority: 0.7, freq: 'weekly', modified: SEO_UPDATED_AT },
  // Guides
  { path: '/guide',                                    priority: 0.8, freq: 'weekly'  },
  ...guideItems.map((guide) => ({
    path: `/guide/${guide.slug}`,
    priority: guide.slug.includes('2026') || guide.slug.includes('dsr') || guide.slug.includes('jeonse') ? 0.75 : 0.7,
    freq: 'monthly' as const,
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
