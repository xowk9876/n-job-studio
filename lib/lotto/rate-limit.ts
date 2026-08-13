/**
 * 외부 API 프록시 라우트용 경량 고정 윈도(fixed window) 속도 제한.
 *
 * 서버리스 인스턴스 메모리에만 존재하므로 인스턴스 간 공유되지 않는 best-effort 방어다.
 * 목적은 정교한 쿼터 관리가 아니라, 단일 클라이언트가 라우트를 연타해
 * 동행복권 원본 서버로 요청이 증폭되는 것을 막는 것이다.
 */

type Window = { count: number; resetAt: number }

const windows = new Map<string, Window>()

/** 메모리 누수 방지를 위한 추적 키 상한 */
const MAX_TRACKED_KEYS = 5000

function evictExpired(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key)
  }
  // 만료 정리 후에도 상한을 넘으면 (비정상 트래픽) 전체를 비워 무한 증가를 차단한다
  if (windows.size > MAX_TRACKED_KEYS) windows.clear()
}

export type RateLimitResult = {
  allowed: boolean
  /** 재시도까지 남은 초 — 429 응답의 Retry-After에 사용 */
  retryAfterSeconds: number
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  if (windows.size > MAX_TRACKED_KEYS) evictExpired(now)

  const current = windows.get(key)

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  current.count += 1
  if (current.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

/** 프록시 헤더에서 클라이언트 식별자 추출 (없으면 공용 버킷) */
export function getClientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim().slice(0, 64)
  return request.headers.get('x-real-ip')?.slice(0, 64) ?? 'unknown'
}
