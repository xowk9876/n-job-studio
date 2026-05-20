# 머니핏 계산기

2026년 최신 세율·법령 기준으로 연봉 실수령액, 퇴직금, 대출 이자, 적금·예금, 전월세 전환, 로또 번호를 계산하는 무료 재테크 웹앱입니다.

## 기술 스택

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Zustand (계산기 입력값 localStorage persist)

## 로컬 실행

```powershell
Set-Location -LiteralPath 'd:\개발\부업\머니핏 계산기'
npm.cmd install
npm.cmd run dev
```

브라우저에서 http://localhost:3000 접속

## 환경 변수

`.env.local` 예시는 `.env.example` 참고.

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 사이트맵·canonical URL (미설정 시 Vercel 기본 도메인) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense 퍼블리셔 ID |

## 배포

Vercel 프로젝트에 연결되어 있습니다.

```powershell
npm.cmd run build
npx.cmd vercel deploy --prod --yes
```

프로덕션: https://n-job-studio.vercel.app

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
