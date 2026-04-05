import type { MetadataRoute } from 'next'

const BASE = 'https://moneyfit-calc.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,               lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/salary`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/mortgage`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/severance`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/savings`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/jeonse`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
