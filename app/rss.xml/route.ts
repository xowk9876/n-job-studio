import { CONTENT_UPDATED_AT, SITE_NAME, SITE_URL, guideItems } from '@/lib/seo'

const calculatorFeedItems = [
  { path: '/salary', title: '연봉 실수령액 계산기', description: '2026년 4대보험·근로소득세 기준 세후 월급 계산' },
  { path: '/mortgage', title: '주택담보대출 이자 계산기', description: '원리금균등·원금균등·만기일시 상환 비교' },
  { path: '/severance', title: '퇴직금 계산기', description: '근로기준법 평균임금 기준 퇴직금 산출' },
  { path: '/savings', title: '적금·예금 이자 계산기', description: '세후 이자·ISA 비과세 비교' },
  { path: '/jeonse', title: '전월세 전환 계산기', description: '법정 전환율 기준 전세↔월세 환산' },
  { path: '/lotto', title: '로또 번호 생성기', description: '최신 당첨번호 조회 및 6/45 번호 생성' },
] as const

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const pubBase = new Date(`${CONTENT_UPDATED_AT}T00:00:00+09:00`).toUTCString()

  const guideXml = guideItems
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

  const calculatorXml = calculatorFeedItems
    .map((calc) => {
      const url = `${SITE_URL}${calc.path}`
      return `
        <item>
          <title>${escapeXml(calc.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(calc.description)}</description>
          <category>계산기</category>
          <pubDate>${pubBase}</pubDate>
        </item>`
    })
    .join('')

  const items = `${guideXml}${calculatorXml}`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(SITE_NAME)} — 계산기·재테크 가이드</title>
        <link>${SITE_URL}</link>
        <description>2026년 최신 세율·법령·공식 기준 재테크 계산기와 가이드</description>
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
