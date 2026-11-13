# 머니핏 사용·운영·업데이트 매뉴얼

기준일: 2026-11-13. 저장소 `xowk9876/n-job-studio`, Vercel 팀 `xowk9876s-projects`, 프로젝트 `n-job-studio`, 운영 브랜치 `main`.

[운영 사이트](https://n-job-studio.vercel.app/) · [이번 점검 기록](UPDATE_2026-11-13.md) · [상세 기능 검사](AUDIT_CHECKLIST.md) · [문구 검사](COPY_CHECKLIST.md) · [검색 등록](SEARCH_CONSOLE.md) · [홈 화면 추가](APP_SHORTCUT.md)

## 1. 계산기 사용

| 화면 | 입력·결과 | 확인할 점 |
| --- | --- | --- |
| 연봉 | 연봉·가족·수당 → 예상 월 실수령액 | 공제 자녀 수와 가족 수, 휴일 8시간 초과분을 구분 |
| 퇴직금 | 입사일·마지막 근무일·급여 → 세전 퇴직금 | 고용노동부 계산기의 퇴직일은 마지막 근무일 다음 날 |
| 대출 | 원금·금리·기간·방식 → 월 상환·총 이자 | DSR은 가정 비교이며 실제 승인 한도가 아님 |
| 적금·예금 | 납입액·금리·기간·단리/월복리 → 세후 수령액 | 만원 입력은 원 단위로 변환. ISA는 일반형 세금 가정 비교 |
| 전월세 | 보증금·월세·전환율 → 비교 금액 | 남기는 보증금과 전환 차액, 사용자 입력 전환율 확인 |
| 로또 | 회차/날짜 조회·번호 생성 | live/snapshot, 기준 회차 확인. 당첨 보장 없음 |

금액 입력은 표시 단위를 확인한다. 범위 밖 입력은 경고를 표시하며 이전 정상값으로 계산한다. 입력은 해당 브라우저에 저장되며 저장소 차단 시 새로고침 이후 보존은 보장되지 않는다.

## 2. 설치·실행

**이유:** 운영과 같은 Node.js 24 및 잠금 파일로 재현한다. 경로는 실제 복제 위치로 바꾼다.

```powershell
# 처음 복제할 때만 git clone 실행
Set-Location -LiteralPath 'D:\개발'
git clone https://github.com/xowk9876/n-job-studio.git
Set-Location -LiteralPath 'D:\개발\n-job-studio'
node --version
npm.cmd ci
npm.cmd run dev
```

**정상 결과:** Node `v24.x`, 설치 성공, `http://localhost:3000`에 계산기 표시.

선택적 환경 변수는 README의 표와 `lib/seo-platform.ts`를 참고한다. canonical 주소는 `NEXT_PUBLIC_SITE_URL`, 광고 ID는 `NEXT_PUBLIC_ADSENSE_CLIENT`다. Preview에서 `proxy.ts`는 운영 주소로 리다이렉트하지 않는다. `NEXT_PUBLIC_*`는 브라우저에 공개되므로 시크릿을 넣지 않는다. 인증 값은 Vercel 환경 변수로 관리하고 `.env.local`을 커밋하지 않는다.

## 3. 업데이트 판단

**이유:** 취약점, 호환 패치, 정책 변경, 데이터 갱신을 근거별로 확인한다.

```powershell
Set-Location -LiteralPath 'D:\개발\n-job-studio'
git status --short --branch
# 변경이 있으면 별도 커밋/보관한 다음 pull
git pull --ff-only origin main
npm.cmd ci
npm.cmd audit
npm.cmd outdated
npm.cmd view next@16 version
```

**정상 결과:** 작업 트리 깨끗함, audit 취약점 0건. `outdated`의 종료 코드 1은 후보가 있다는 뜻이다. 고정 버전의 패치는 `npm view`와 공식 릴리스도 확인한다.

검토한 버전만 지정해 설치하고 package.json·잠금 파일의 diff를 함께 검토한다. Next와 eslint-config-next, Tailwind와 @tailwindcss/postcss는 버전을 맞춘다. 직접 의존성이 최신이어도 하위 패키지의 호환 업데이트가 남을 수 있으므로 `npm.cmd outdated --all`도 확인한다. `npm.cmd update` 후 변경된 버전·플랫폼별 잠금 항목을 검토하고 5절의 검사를 다시 실행한다.

2026-11-13 확인: eslint-plugin-react 7.37.5와 eslint-plugin-jsx-a11y 6.10.2의 peer 범위는 ESLint 9까지이며, @typescript-eslint/parser 8.72.2는 TypeScript `<6.1.0`을 요구한다. ESLint 10·TypeScript 7을 강제로 설치하지 않는다. ESLint 9 지원 종료 경고는 남아 있으므로 해당 플러그인의 지원이 추가되면 전환을 검토한다. lucide 1은 아이콘/API 호환 검토 대상이며 Node 타입은 운영 Node 24에 맞춰 24를 유지한다. `npm audit fix --force`와 `--legacy-peer-deps`로 제약을 우회하지 않는다.

`outdated --all`의 각 소비자별 wanted는 전체 프로젝트의 호환성을 보장하지 않는다. 또한 Tailwind oxide WASM 패키지 안의 wasm-runtime·wasm-util·tslib는 `inBundle` 항목으로 배포자가 함께 묶은 파일이다. 루트 tslib와 별개이며, 묶인 파일을 직접 덮어쓰지 않고 Tailwind의 후속 릴리스로 갱신한다.

## 4. 금융 기준·로또 데이터

**이유:** 코드가 빌드돼도 외부 기준이나 데이터가 오래될 수 있다.

| 시점 | 점검 |
| --- | --- |
| 매년 1월 전후 | 최저임금·보험료율·세액표 및 시행일 |
| 매년 7월 | 국민연금 기준소득월액 상·하한 |
| 한국은행 금리 결정 직후 | lib/jeonse.ts 기본금리·전환율 |
| 금융위 DSR 변경 시, 6월·12월 | 지역·대출 유형·유예기간·가산금리 |
| 토요일 추첨 발표 이후 | 로또 API와 스냅샷 최신 회차 비교 |

`lib/content-sources.ts`의 공식 기관 원문과 시행일을 확인한다. 시행 전 수치를 현재값에 즉시 적용하지 않는다. 기본값이 바뀌면 `store/index.ts`의 version·migrate로 기존 저장값을 검토하고 사용자 지정값은 보존한다. 실제 계산 기준/FAQ를 바꿀 때만 관련 `lib/seo.ts` 날짜를 갱신한다.

전체 로또 스냅샷 갱신:

```powershell
node scripts/fetch-lotto-history.mjs
if ($LASTEXITCODE -ne 0) { throw '수집 실패: 기존 스냅샷 유지' }
npm.cmd test
git diff -- data/lotto-history.json
```

**정상 결과:** 수집 스크립트의 무결성 검증 성공, 최신 회차/날짜가 공식 API와 일치, 스냅샷 테스트 통과. API 실패 시 번호를 추정해서 채우지 않는다. 실시간 통계 병합에는 회차 수 제한이 있으므로 장기간 스냅샷을 방치하지 않는다.

## 5. 배포 전 필수 검증

**이유:** 회귀 테스트·빌드·린트 실패가 운영에 올라가지 않도록 한다.

```powershell
npm.cmd run check
if ($LASTEXITCODE -ne 0) { throw '검증 실패: 배포 중단' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'diff 검사 실패' }
git status --short
git diff --stat
git diff
```

**정상 결과:** 테스트 58개(추후 증가 가능), Next 프로덕션 빌드·TypeScript 검사 통과, ESLint 오류 0, audit 취약점 0. build의 prebuild에서 테스트를 자동 실행하므로 Vercel 기본 `npm run build`도 테스트 실패 시 중단된다.

`npm.cmd start -- --hostname 127.0.0.1 --port 4174`로 로컬 프로덕션 빌드를 연다. 여섯 계산기의 입력·결과, 새로고침 후 저장 복원, 소수 금리, 날짜, 오류 문구, 로또 생성/조회·폴백을 확인한다. 외부 API는 운영 환경에서도 별도로 확인한다.

## 6. 배포·확인

**이유:** 서비스가 테스트한 커밋을 실행하는지 확인한다.

```powershell
# 실제 수정한 파일만 지정
git add package.json package-lock.json data/lotto-history.json tests/lotto-snapshot.test.cjs README.md docs/MAINTENANCE.md docs/AUDIT_CHECKLIST.md docs/UPDATE_2026-11-13.md
git diff --cached --check
git diff --cached
git commit -m "chore: 검증된 유지보수 업데이트"
git push origin main
git rev-parse HEAD
```

**정상 결과:** push 성공. Vercel → xowk9876s-projects → n-job-studio → Deployments에서 해당 SHA의 **Production / READY** 확인. 운영 도메인도 그 배포를 가리켜야 한다. 실패 시 첫 오류를 수정하고 5절을 다시 수행한다.

배포 후 여섯 계산기, 가이드, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/api/lotto/latest`, `/api/lotto/round?round=1249`, `/api/lotto/stats`를 확인한다. 1249는 이번 기준 회차이므로 이후 발표 회차로 바꾼다. 응답의 회차·번호·origin도 확인한다. 잘못된 회차 입력은 400이어야 한다. Runtime Logs 오류 수는 조회 시간 범위와 함께 기록한다.

## 7. 장애·복구·정기 점검

| 증상 | 확인·대응 | 정상 결과 |
| --- | --- | --- |
| 빌드 하위 프로세스 오류 | Node 24, 잠금 파일 설치, 최초 오류 확인. 환경 제한과 패키지 문제 구분 | 기본 build 통과 |
| 로또 갱신 실패 | 공식 API 상태, 스냅샷 최신 회차, 타임아웃 확인 | 폴백과 기준 회차 표시 |
| 입력 복원 오류 | 저장 데이터 version·migration·JSON 오류 확인 | 기본값 또는 검증된 사용자값 복원 |
| 잘못된 주소 이동 | Vercel 환경과 NEXT_PUBLIC_SITE_URL 확인 | 운영 canonical / Preview 접근 정상 |

서비스 장애는 Vercel 정상 배포로 **Instant Rollback**한다. 롤백 후 자동 운영 도메인 할당이 중지될 수 있으므로 수정 배포를 검증하고 **Promote to Production**으로 정상화한다. 코드 복구는 `git revert <실제-문제-커밋-SHA>` → `npm.cmd run check` → push 순서이며 강제 push는 사용하지 않는다.

현재 API rate limit은 인스턴스별 메모리 방어이며 전역 쿼터가 아니다. 실제 남용/트래픽 증가가 확인되면 공유 저장소·방화벽을 별도 설계한다. 매월 의존성 검사, 변경마다 전체 검증을 진행하고 날짜·SHA·통과/실패·미검증 항목을 남긴다.
