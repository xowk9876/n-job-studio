import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

const UPDATED = '2026-05-16'

const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency']; modified?: string }[] = [
  { path: '',           priority: 1.0, freq: 'weekly' },
  { path: '/salary',    priority: 0.9, freq: 'monthly' },
  { path: '/mortgage',  priority: 0.9, freq: 'monthly' },
  { path: '/severance', priority: 0.8, freq: 'monthly' },
  { path: '/savings',   priority: 0.8, freq: 'monthly' },
  { path: '/jeonse',    priority: 0.8, freq: 'monthly' },
  { path: '/lotto',     priority: 0.7, freq: 'weekly'  },
  // Guides
  { path: '/guide',                                    priority: 0.8, freq: 'weekly'  },
  { path: '/guide/2026-salary-tax-guide',              priority: 0.75, freq: 'monthly' },
  { path: '/guide/dsr-stress-test-2026',               priority: 0.75, freq: 'monthly' },
  { path: '/guide/severance-calculation-guide',        priority: 0.7, freq: 'monthly' },
  { path: '/guide/isa-vs-regular-savings',             priority: 0.7, freq: 'monthly' },
  { path: '/guide/jeonse-safety-2026',                 priority: 0.75, freq: 'monthly' },
  { path: '/guide/lotto-tax-guide',                    priority: 0.65, freq: 'monthly' },
  // Information
  { path: '/about',           priority: 0.6, freq: 'yearly' },
  { path: '/contact',         priority: 0.6, freq: 'yearly' },
  { path: '/privacy-policy',  priority: 0.4, freq: 'yearly' },
  { path: '/terms',           priority: 0.4, freq: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, freq, modified }) => ({
    url: `${BASE}${path}`,
    lastModified: modified || UPDATED,
    changeFrequency: freq,
    priority,
  }))
}
