# 홈 화면 앱 바로가기

모바일 홈 화면(또는 컴퓨터 앱)에서 주소창 없이 머니핏 계산기를 열게 하는 절차.
계산 로직은 바꾸지 않는다. 페이지를 캐시하지 않는다.

## 사용자에게 보이는 것

메인 페이지 `components/home/HomeAppShortcut.tsx`

- Chrome·Edge가 설치 이벤트를 주면 **홈 화면에 추가** 버튼이 나온다.
- 버튼이 없어도 iPhone(Safari)과 Android(Chrome) 순서는 항상 보인다.
- 이미 앱으로 열린 화면(`display-mode: standalone`)이면 그 사실을 알린다.
- 홈 화면 아이콘을 길게 누르면 연봉·대출·퇴직금·적금으로 간다. 이 목록은 `app/manifest.ts` `shortcuts`다.

## 설치가 되려면

브라우저(Chrome)는 아래가 모두 있어야 설치 버튼·배너를 준다. iPhone Safari는 이 버튼을 주지 않고, 공유 메뉴만 된다.

| 조건 | 위치 |
|------|------|
| 매니페스트 `name`, `start_url`, `display: standalone` | `app/manifest.ts` |
| PNG 아이콘 192·512, maskable 512 | `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png` |
| Apple 터치 아이콘 180 | `public/apple-touch-icon.png`, `app/layout.tsx` `appleWebApp` |
| `fetch` 핸들러가 있는 서비스 워커 | `public/sw.js` |
| HTTPS (로컬호스트 포함) | 배포 도메인 |

서비스 워커는 응답을 저장하지 않는다. 요율·당첨번호가 옛 화면으로 남으면 안 된다.

## 아이콘을 다시 만들 때

파비콘(`public/favicon.svg`)을 바꾸면 PNG도 다시 만든다. `sharp`는 Next.js가 이미 설치한 것을 쓰고, 새 패키지는 추가하지 않는다. `favicon.svg`를 192·512·180으로 늘리고, maskable은 꽉 찬 사각형 그라데이션 가운데에 ₩를 둔다. 만든 파일은 `public/`에 커밋한다.

- Why: Chrome은 SVG와 1200×630 이미지만으로는 홈 화면 설치를 허용하지 않는다.
- Expected Output: `icon-192.png` 192×192, `icon-512.png`와 `icon-maskable-512.png` 512×512, `apple-touch-icon.png` 180×180.

## 점검

```powershell
Set-Location "d:\개발\부업\머니핏 계산기"
npm.cmd run build
npm.cmd run start -- -p 3125
```

다른 터미널:

```powershell
$base = 'http://localhost:3125'
(Invoke-WebRequest "$base/manifest.webmanifest").Content
foreach ($p in '/icon-192.png','/icon-512.png','/icon-maskable-512.png','/apple-touch-icon.png','/sw.js') {
  $r = Invoke-WebRequest ($base + $p) -UseBasicParsing
  Write-Output "$p $($r.StatusCode) $($r.Headers['Content-Type'])"
}
```

- Expected Output: 매니페스트에 192·512 PNG. 아이콘은 `image/png`, `sw.js`는 200이고 본문에 `fetch`가 있다.
- 브라우저: 메인에 "홈 화면에서 바로 열기"가 보이고, iPhone·Android 순서가 읽힌다. 모바일 너비에서도 카드가 잘리지 않는다.
- Chrome 설치 오류: DevTools `Page.getInstallabilityErrors`가 비어 있다. 설치 버튼은 사이트 방문 횟수 조건 때문에 바로 안 나올 수 있다. 버튼이 없어도 안내 순서가 보이면 된다.

## 고치면 안 되는 것

- `sw.js`에서 HTML·JSON을 캐시하지 않는다.
- `app/manifest.ts`의 `id`를 바꾸지 않는다. 바꾸면 이미 설치한 사람에게 다른 앱으로 보인다.
- "당첨 보장" 같은 문구를 설치 안내에 넣지 않는다.
