# Google Search Console 색인 대응

## 확인된 리다이렉트 (정상 동작)

| 요청 URL | 응답 | GSC 표기 |
|----------|------|----------|
| `http://n-job-studio.vercel.app/` | **308** → `https://n-job-studio.vercel.app/` | 리디렉션이 포함된 페이지 |
| `https://n-job-studio.vercel.app/guide/` | **308** → `/guide` | 리디렉션이 포함된 페이지 |

최종 URL(https, 슬래시 없음)만 색인 대상입니다. 위 알림은 **버그가 아닙니다.**

## 배포 후 Search Console 체크리스트

1. **Sitemaps** → `https://n-job-studio.vercel.app/sitemap.xml` 제출·재크롤
2. **URL 검사** → 아래 URL 각각 「색인 생성 요청」
   - `https://n-job-studio.vercel.app/`
   - `https://n-job-studio.vercel.app/salary`
   - `https://n-job-studio.vercel.app/guide`
   - `https://n-job-studio.vercel.app/about`
   - `https://n-job-studio.vercel.app/contact`
3. **색인 생성 → 페이지** → 「크롤링됨 - 현재 색인이 생성되지 않음」 예시 URL 확인 후 동일하게 색인 요청
4. 리디렉션 사유 URL이 `http://` 또는 끝 `/` 뿐이면 **수정 시작** 불필요

## 커스텀 도메인 전환 시

1. Vercel에 도메인 연결
2. `NEXT_PUBLIC_SITE_URL`을 새 URL로 변경 후 재배포
3. Search Console에 **새 속성** 추가, sitemap 재제출
4. (선택) `next.config.ts` `redirects`에 vercel.app → 주 도메인 301 추가
