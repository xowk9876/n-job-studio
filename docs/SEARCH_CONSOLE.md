# Google·네이버 검색 등록과 수집 요청

대상: `https://n-job-studio.vercel.app/`. 기준일: 2026-11-13.

## 배포 전 확인

- `npm.cmd run check` 통과 후 배포한다. Vercel Production/READY와 Git SHA를 대조한다.
- `/sitemap.xml`의 18개 공개 페이지, `/robots.txt`, `/rss.xml`이 정상 응답해야 한다.
- 첫 HTML의 제목·설명·canonical·H1과 내부 링크를 확인한다. JS·CSS·공유 이미지의 수집을 막지 않는다.
- 날짜는 실제 내용 변경을 반영한다. RSS 계산기 날짜는 `calculatorUpdatedAt`, 가이드 날짜는 `guideItems.updatedAt`과 사이트맵을 함께 사용한다.

## Google Search Console

1. 기존 HTTPS 속성을 선택한다. Sitemaps에서 `sitemap.xml`을 제출하고 표시 상태를 확인한다.
2. 상단 URL 검사에 최종 canonical URL을 입력한다. 최신 내용의 공개 페이지에 필요할 때만 **색인 생성 요청**을 사용한다.
3. 2026-11-09 보고서의 발견됨 6개는 `/about`, `/contact`, `/guide/lotto-tax-guide`, `/guide/severance-calculation-guide`, `/privacy-policy`, `/terms`다. 유용한 본문과 내부 링크를 확인하고 주요 가이드·소개부터 요청한다.
4. 크롤링됨 3개 중 `/severance/opengraph-image`, `/opengraph-image?...`는 공유 이미지다. `/jeonse/`는 최종 `/jeonse`로 이동하는 과거 주소다. 이 항목들에 무조건 수정 결과 확인을 실행하거나 이미지 수집을 막지 않는다.
5. HTTP→HTTPS, 끝 슬래시→최종 주소 리디렉션은 정상일 수 있다. 목적지의 응답·canonical을 확인한다.

요청 접수와 실제 색인은 별도다. 일일 한도가 표시되면 반복 제출하지 않는다. 변경하지 않은 사이트맵을 하루에 여러 번 제출하지 않는다.

## 네이버 서치어드바이저

1. 웹마스터 도구에서 기존 등록 사이트를 선택한다.
2. 요청 → 사이트맵 제출: `sitemap.xml`. 이미 등록된 피드는 자동 재방문하므로 재등록을 위해 삭제하지 않는다.
3. 요청 → RSS 제출: `https://n-job-studio.vercel.app/rss.xml`. 계산기·가이드 12개 항목과 올바른 날짜를 확인한다.
4. 요청 → 웹 페이지 수집: 홈, 갱신한 계산기, 주요 가이드의 최종 경로를 요청한다. 처리 결과에서 요청 접수·수집 성공·검색 반영을 구분한다.
5. 로그인이나 보안문자가 나오면 계정 소유자가 해당 단계만 처리한다.

## 도메인 변경

Vercel 연결 → `NEXT_PUBLIC_SITE_URL` 변경 → 메타데이터·사이트맵·RSS·리디렉션 검증 → 새 도메인 소유 확인 → 새 피드 제출 순서로 진행한다. 기존 주소의 canonical만 바꾸고 배포 확인을 생략하지 않는다.

## 공식 참고

- [Google 재수집 요청](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Google 사이트맵과 수정일](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [네이버 RSS·사이트맵 제출](https://searchadvisor.naver.com/guide/request-feed)
