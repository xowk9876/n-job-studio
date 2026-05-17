import { SITE_NAME, SITE_URL, guideItems } from '@/lib/seo'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const items = guideItems
    .map((guide) => {
      const url = `${SITE_URL}/guide/${guide.slug}`
      const pubDate = new Date(`${guide.updatedAt}T00:00:00+09:00`).toUTCString()

      return `
        <item>
          <title>${escapeXml(guide.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(guide.description)}</description>
          <category>${escapeXml(guide.tag)}</category>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(SITE_NAME)} 재테크 실전 가이드</title>
        <link>${SITE_URL}/guide</link>
        <description>2026년 최신 세율·법령·공식 기준 재테크 가이드</description>
        <language>ko-KR</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
