import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://n-job-studio.vercel.app'

const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',           priority: 1.0, freq: 'monthly' },
  { path: '/salary',    priority: 0.9, freq: 'monthly' },
  { path: '/mortgage',  priority: 0.9, freq: 'monthly' },
  { path: '/severance', priority: 0.8, freq: 'monthly' },
  { path: '/savings',   priority: 0.8, freq: 'monthly' },
  { path: '/jeonse',    priority: 0.8, freq: 'monthly' },
  { path: '/lotto',     priority: 0.7, freq: 'weekly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return routes.map(({ path, priority, freq }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }))
}
