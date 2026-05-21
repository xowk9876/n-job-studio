# 정기 점검 (머니핏 계산기)

## 의존성

```powershell
Set-Location "d:\개발\부업\머니핏 계산기"
npm.cmd outdated
npm.cmd update
npm.cmd audit
npm.cmd run lint
npm.cmd run build
```

- **유지:** `eslint` 9.x, `lucide-react` 0.468.x (메이저 업 시 호환 확인 후)
- **선택:** `@types/node` 25, `eslint` 10, `lucide-react` 1.x — 빌드·린트 통과 확인 필수

## Next.js

- 호스트 canonical: 루트 `proxy.ts` (`NEXT_PUBLIC_SITE_URL`)
- URL 규칙: `next.config.ts` → `trailingSlash: false`

## SEO

- 배포 후: `docs/SEARCH_CONSOLE.md` 체크리스트
- 메타 갱신 시: `lib/seo.ts` → `SEO_UPDATED_AT` 날짜 수정

## AI 규칙

- 레포 루트 `AGENTS.md` (Cloud Agent·Cursor 공통)
