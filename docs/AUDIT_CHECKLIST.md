# 기능 점검 매뉴얼 (디자인 제외)

버그·계산·입력·시점 민감 수치·외부 API·의존성을 한 번에 점검하는 체크리스트.
UI 스타일·레이아웃 변경은 범위 밖이다.

## 점검 주기

| 시점 | 대상 |
|------|------|
| 매년 1월 · 7월 | 1. 시점 민감 수치 (4대보험·국민연금 기준소득월액·최저임금·세법 개정) |
| 매년 6월 · 12월 | 1. 스트레스 DSR 단계·유예 기한 |
| 한국은행 금통위 직후 (연 8회) | 1. 기준금리 → 전월세 전환율 |
| 매월 | 5. `npm audit` (critical·high는 즉시) |
| 분기 1회 | 4. 로또 정적 스냅샷 갱신, 전체 체크리스트 |

## 1. 시점 민감 수치

공식 출처로만 확인한다 (기억·블로그 금지). 값이 바뀌면 코드·FAQ·예시 문구를 함께 고친다.

| 항목 | 코드 위치 | 공식 출처 |
|------|-----------|-----------|
| 기준금리 | `lib/jeonse.ts` `DEFAULT_BASE_RATE` | 한국은행 통화정책방향 |
| 전월세 전환율 가산 (+2%p) | `lib/jeonse.ts` `LEGAL_PREMIUM` | 주택임대차보호법 시행령 제9조 |
| 국민연금 요율·상하한 | `lib/salary.ts` `PENSION_*` | 국민연금공단 (매년 7월 기준소득월액 변경) |
| 건강보험·장기요양 요율 | `lib/salary.ts` `HEALTH_RATE`, `CARE_RATE` | 국민건강보험공단 |
| 고용보험 요율 | `lib/salary.ts` `EMPLOYMENT_RATE` | 고용노동부 |
| 최저임금 | `lib/salary.ts` `MIN_HOURLY_WAGE_*` | 최저임금위원회 고시 |
| 소득세 구간·세액공제 | `lib/salary.ts` `TAX_BRACKETS`, 공제 함수 | 국세청 · 소득세법 |
| 비과세 식대·자가운전보조금 | `lib/salary.ts` | 소득세법 시행령 제12조 |
| 스트레스 DSR 가산금리 | `lib/mortgage.ts` `STRESS_DSR_RATES`, `app/mortgage/page.tsx` 안내 문구 | 금융위원회 보도자료 |
| 이자소득세 · ISA 비과세 | `lib/savings.ts` | 소득세법 · 조세특례제한법 |

**규칙**

- `DEFAULT_BASE_RATE`가 바뀌면 `store/index.ts` 전월세 store의 `version`을 올린다. 올리지 않으면 기존 방문자 브라우저에 저장된 옛 전환율이 남는다.
- 다른 store도 기본값 의미가 바뀌면 `version`과 `migrate`를 함께 갱신한다.
- 수치 변경 시 `lib/seo.ts` `CONTENT_UPDATED_AT`을 오늘 날짜로 갱신한다.

## 2. 계산 로직

| 계산기 | 확인 기준 |
|--------|-----------|
| 연봉 (`lib/salary.ts`) | 실수령액이 음수가 되지 않는다. 국민연금은 상·하한 안에서 계산된다. 비과세 수당은 과세표준에서만 빠진다. |
| 퇴직금 (`lib/severance.ts`) | 재직일수는 입사일·퇴직일 양끝 포함 (+1). 365일 미만이면 미지급. 3개월 일수는 말일 보정. 날짜는 UTC로 파싱해 시간대 영향이 없다. |
| 대출 (`lib/mortgage.ts`) | 마지막 회차에서 잔액이 정확히 0. 금리 0%에서 0으로 나누지 않는다. DSR 한도는 스트레스 가산 후 금리로 계산한다. |
| 적금·예금 (`lib/savings.ts`) | 세율 15.4% · ISA 200만 원 초과분 9.9%. 기간·금액 0이면 결과 0 (NaN·Infinity 없음). |
| 전월세 (`lib/jeonse.ts`) | 전환율 0 이하 방어. 전세가율 80%·90% 경고 경계값. |

**확인 방법:** 경계값(0, 최소, 최대, 소수, 매우 큰 수)을 넣어 결과에 `NaN`, `Infinity`, 음수 금액이 나오지 않는지 본다.

## 3. 입력·상태

| 대상 | 확인 기준 |
|------|-----------|
| `components/ui/NumericInput.tsx` | 소수 입력 `3.05`, `4.50`을 한 글자씩 쳐도 값이 그대로 들어간다. 만원 단위 필드는 표시 ÷ 10,000, 저장 × 10,000. 빈 칸은 0. |
| `components/ui/DatePicker.tsx` | 로컬 날짜 기준 (UTC로 하루 밀리지 않음). "오늘" 버튼이 오늘 날짜를 고른다. |
| `store/index.ts` | 모든 store `skipHydration: true` + 페이지의 `usePersistRehydrate` 호출 (하이드레이션 경고 없음). |
| 퇴직금 페이지 | 예전 기본 퇴직일(`2026-01-01`, `2026-05-22`, `2026-05-24`)은 오늘로 교체된다. |

## 4. 로또·외부 API

| 대상 | 확인 기준 |
|------|-----------|
| `lib/lotto/dhlottery.ts` | 응답 검증 (회차 정수, 날짜 8자리, 번호 1~45 중복 없음 7개). 타임아웃 6초. 실패 시 null. |
| `app/api/lotto/*/route.ts` | 파라미터 정규식 검증, 고정 윈도 rate limit (분당 60), 실패 시 정적 스냅샷 폴백. |
| `data/lotto-history.json` | 최신 회차와의 차이가 크면 갱신한다. 통계 API의 실시간 병합은 최대 80회차까지만 가능하다. |
| 문구 | "당첨 보장"·"확률 상승" 같은 표현 금지. |

**스냅샷 갱신**

```powershell
Set-Location "d:\개발\부업\머니핏 계산기"
node scripts/fetch-lotto-history.mjs
```

- Why: 외부 API 장애 시 폴백 데이터와 통계 기준을 최신으로 유지한다.
- Expected Output: `[3/3] 무결성 검증 통과 — 1~N회 연속, 추첨 간격 7일 일정` 후 `data/lotto-history.json` 갱신.

## 5. 의존성·보안

```powershell
Set-Location "d:\개발\부업\머니핏 계산기"
npm.cmd audit
npm.cmd outdated
```

- Why: 알려진 취약점(CVE)과 뒤처진 패치를 찾는다.
- Expected Output: `found 0 vulnerabilities`. 남으면 영향 범위(런타임 vs 개발 도구)를 적고 판단한다.

**규칙**

- 같은 메이저 안의 patch·minor는 적용한다 (`npm.cmd update`, 보안 수정이 필요한 패키지는 `package.json` 최소 버전도 올린다).
- 메이저 업그레이드 (`eslint` 10, `typescript` 7, `lucide-react` 1.x, `@types/node` 26)는 별도 작업으로 호환성 확인 후 진행한다.
- 새 패키지 추가 금지 (`AGENTS.md`).
- 시크릿은 `.env.local`에만 둔다. `git diff`에 키·토큰이 없는지 확인한다.

## 6. SEO·콘텐츠 날짜

- 계산 수치·FAQ를 고치면 `lib/seo.ts` `CONTENT_UPDATED_AT`을 갱신한다.
- 배포 후 `docs/SEARCH_CONSOLE.md` 체크리스트를 따른다.

## 7. 배포 게이트

```powershell
Set-Location "d:\개발\부업\머니핏 계산기"
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
git status
git diff
```

- Why: 타입·린트·빌드 실패 상태로 Vercel 프로덕션에 올라가는 것을 막는다.
- Expected Output: 세 명령 모두 오류 없음, `git diff`에는 의도한 파일만 있음.

통과 후 커밋·푸시하고 커밋 해시와 빌드·린트 결과를 기록한다 (`AGENTS.md` 배포 전 점검).
