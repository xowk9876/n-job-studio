/*
 * 머니핏 계산기 서비스 워커.
 * 홈 화면 설치 조건(fetch 핸들러)만 충족하고, 계산 페이지는 캐시하지 않는다.
 * 네트워크가 기본 경로다. 요율·당첨번호가 옛 화면으로 고정되면 안 된다.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {
  // 응답을 가로채지 않는다.
})
