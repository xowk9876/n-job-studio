# 머니핏 계산기

2026년 최신 세율·법령 기준으로 연봉 실수령액, 퇴직금, 대출 이자, 적금·예금, 전월세 전환, 로또 번호를 계산하는 무료 재테크 웹앱입니다.

## 기술 스택

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Zustand (계산기 입력값 localStorage persist)

## 로컬 실행

```powershell
Set-Location -LiteralPath 'D:\개발\n-job-studio'
npm.cmd ci
npm.cmd run dev
```

브라우저에서 http://localhost:3000 접속

## 환경 변수

선택적인 변수는 프로젝트 루트의 `.env.local` 또는 Vercel 환경 변수에 설정합니다. 아래 두 변수 없이도 기본 운영 주소와 공개 광고 ID로 실행됩니다.

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 사이트맵·canonical URL (미설정 시 Vercel 기본 도메인) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense 퍼블리셔 ID |

## 배포

Vercel `n-job-studio` 프로젝트는 GitHub `main`에 연결되어 있습니다. Node.js 24에서 검증 후 push하면 자동 배포됩니다.

```powershell
npm.cmd run check
git status --short
git diff --check
git diff
# 의도한 변경만 커밋한 뒤:
git push origin main
```

프로덕션: https://n-job-studio.vercel.app

`build`는 `prebuild`에서 회귀 테스트를 먼저 실행합니다. `check`는 테스트 → 프로덕션 빌드(TypeScript 포함) → ESLint → 의존성 보안 검사 순서입니다. 배포 후에는 Vercel의 **Production / READY / 커밋 SHA**와 실제 페이지를 확인해야 완료입니다.

- [운영·업데이트 매뉴얼](docs/MAINTENANCE.md): 사용법, 점검, Windows 명령, 배포 확인, 복구
- [2026-11-13 점검·업데이트 기록](docs/UPDATE_2026-11-13.md)

## 라우트

| 경로 | 설명 |
|------|------|
| `/salary` | 연봉 실수령액 |
| `/severance` | 퇴직금 |
| `/mortgage` | 대출 이자·DSR |
| `/savings` | 적금·예금·ISA |
| `/jeonse` | 전월세 전환 |
| `/lotto` | 로또 번호·당첨 정보 |
| `/guide/*` | SEO 가이드 6종 |
