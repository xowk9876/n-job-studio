# 홈 화면 앱 바로가기

모바일 홈 화면(또는 컴퓨터 앱)에서 주소창 없이 머니핏 계산기를 열게 하는 절차.
계산 로직은 바꾸지 않는다. 페이지를 캐시하지 않는다.

## 사용자에게 보이는 것

메인 페이지 `components/home/HomeAppShortcut.tsx`

- 메인 상단의 **Android · iPhone 홈 화면에 추가** 링크에서 설치 영역으로 이동한다.
- **Android 홈 화면에 추가**, **iPhone 홈 화면 추가 안내**, **PC에 앱 설치** 버튼은 항상 표시한다.
- Android/PC의 지원 브라우저에서 설치 이벤트가 준비되면 해당 버튼이 네이티브 설치 창을 연다.
- iPhone 버튼은 Safari 공유 → 홈 화면에 추가 → 웹 앱으로 열기 → 추가 안내를 펼친다. 사이트 주소 복사도 제공한다. 웹사이트가 iPhone 아이콘을 자동으로 추가할 수는 없다.
- 설치 이벤트는 수락·취소·실패와 관계없이 한 번만 소비한다. 설치 완료는 `appinstalled` 또는 standalone 상태로 확인한다.
- 아이콘 길게 누르기 계산기 바로가기는 manifest shortcuts를 지원하는 기기에서 제공한다.

## 설치가 되려면

설치 동작은 브라우저의 설치 가능 판단과 사용자 설정에 따라 달라진다. 프로젝트에서 확인할 리소스는 아래와 같다. iPhone Safari는 이 버튼을 주지 않고, 공유 메뉴만 된다.

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
- 브라우저: 메인 3개 버튼과 기기별 안내·주소 복사·설치 취소 후 재안내를 확인한다. 모바일 너비에서도 카드가 잘리지 않아야 한다.
- Chrome 설치 오류: DevTools `Page.getInstallabilityErrors`가 비어 있다. 설치 버튼은 사이트 방문 횟수 조건 때문에 바로 안 나올 수 있다. 버튼이 없어도 안내 순서가 보이면 된다.

## 고치면 안 되는 것

- `sw.js`에서 HTML·JSON을 캐시하지 않는다.
- `app/manifest.ts`의 `id`를 바꾸지 않는다. 바꾸면 이미 설치한 사람에게 다른 앱으로 보인다.
- "당첨 보장" 같은 문구를 설치 안내에 넣지 않는다.
