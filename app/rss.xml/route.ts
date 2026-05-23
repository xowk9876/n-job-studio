import {
  calculatorFeedItems,
  calculatorRssBodies,
  CONTENT_UPDATED_AT,
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
  const pubBase = new Date(`${CONTENT_UPDATED_AT}T00:00:00+09:00`).toUTCString()

  const guideXml = guideItems
    .map((guide) => {
      const url = `${SITE_URL}/guide/${guide.slug}`
      const pubDate = new Date(`${guide.updatedAt}T00:00:00+09:00`).toUTCString()
      const body = guideRssBodies[guide.slug] ?? guide.description

      return `
        <item>
          <title>${escapeXml(guide.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(guide.description)}</description>
          <content:encoded>${buildContentEncoded(body, url)}</content:encoded>
          <category>${escapeXml(guide.tag)}</category>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .join('')

  const calculatorXml = calculatorFeedItems
    .map((calc) => {
      const url = `${SITE_URL}${calc.path}`
      const body = calculatorRssBodies[calc.path] ?? calc.description
      return `
        <item>
          <title>${escapeXml(calc.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(calc.description)}</description>
          <content:encoded>${buildContentEncoded(body, url)}</content:encoded>
          <category>계산기</category>
          <pubDate>${pubBase}</pubDate>
        </item>`
    })
    .join('')

  const items = `${guideXml}${calculatorXml}`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(SITE_NAME)} — 계산기·재테크 가이드</title>
        <link>${SITE_URL}</link>
        <description>2026년 최신 세율·법령·공식 기준 재테크 계산기와 가이드 (네이버·Google 공통 RSS)</description>
        <language>ko-KR</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
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
