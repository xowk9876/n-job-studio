import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getCanonicalHost(): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!siteUrl) return null
  try {
    return new URL(siteUrl).host
  } catch {
    return null
  }
}

/**
 * NEXT_PUBLIC_SITE_URL 호스트와 다른 Host로 접속 시 308 → canonical (커스텀 도메인 전환용).
 * Preview 배포(VERCEL_ENV=preview)는 리다이렉트하지 않음.
 */
export function proxy(request: NextRequest) {
  if (process.env.VERCEL_ENV === 'preview') {
    return NextResponse.next()
  }

  const canonicalHost = getCanonicalHost()
  if (!canonicalHost) {
    return NextResponse.next()
  }

  const host = request.headers.get('host') ?? ''
  if (!host || host === canonicalHost) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.host = canonicalHost
  url.protocol = 'https:'
  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.svg|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)$).*)',
  ],
}
