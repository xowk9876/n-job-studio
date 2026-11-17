import {
  calculatorFeedItems,
  calculatorRssBodies,
  calculatorUpdatedAt,
  SEO_UPDATED_AT,
  guideItems,
  guideRssBodies,
  RSS_FEED_URL,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function cdata(value: string) {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

function buildContentEncoded(body: string, url: string) {
  const html = `<p>${body}</p><p><a href="${url}">전체 보기: ${url}</a></p>`
  return cdata(html)
}

export function GET() {
  const entries = [
    ...guideItems.map(g => ({
      url: `${SITE_URL}/guide/${g.slug}`, title: g.title, description: g.description,
      body: guideRssBodies[g.slug] ?? g.description, category: g.tag, updatedAt: g.updatedAt,
    })),
    ...calculatorFeedItems.map(c => ({
      url: `${SITE_URL}${c.path}`, title: c.title, description: c.description,
      body: calculatorRssBodies[c.path] ?? c.description, category: '계산기', updatedAt: calculatorUpdatedAt[c.path] ?? SEO_UPDATED_AT,
    })),
  ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const lastUpdated = entries[0]?.updatedAt ?? SEO_UPDATED_AT
  const items = entries
    .map(({ url, title, description, body, category, updatedAt }) => {
      const pubDate = new Date(`${updatedAt}T00:00:00+09:00`).toUTCString()
      return `
        <item>
          <title>${escapeXml(title)}</title>
          <link>${escapeXml(url)}</link>
          <guid isPermaLink="true">${escapeXml(url)}</guid>
          <description>${escapeXml(description)}</description>
          <content:encoded>${buildContentEncoded(body, url)}</content:encoded>
          <category>${escapeXml(category)}</category>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(SITE_NAME)} — 계산기·재테크 가이드</title>
        <link>${SITE_URL}</link>
        <description>금융 계산의 예상 금액·적용 기준과 가이드</description>
        <language>ko-KR</language>
        <lastBuildDate>${new Date(`${lastUpdated}T00:00:00+09:00`).toUTCString()}</lastBuildDate>
        <atom:link href="${RSS_FEED_URL}" rel="self" type="application/rss+xml" />
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
