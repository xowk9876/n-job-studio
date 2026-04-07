# N-Job Studio 프라이빗 디자인 시스템 가이드

> AI 협업용 매뉴얼 — 새 페이지/기능 개발 시 이 문서를 참고하여 디자인 일관성을 유지할 것.

---

## 1. Import 경로

```tsx
// 커스텀 컴포넌트
import { CustomButton } from '@/components/ui/custom-button'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomCard, CustomCardHeader, CustomCardContent, CustomCardFooter } from '@/components/ui/custom-card'

// 기존 shadcn/ui (필요 시 병행 사용 가능)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
```

---

## 2. Props 레퍼런스

### CustomButton

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | **default**: 그라데이션 배경, **outline**: 유리 테두리, **ghost**: 투명 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 높이 32/40/48px |
| `loading` | `boolean` | `false` | `true`면 스피너 표시 + 클릭 비활성화 |
| `icon` | `ReactNode` | - | 텍스트 왼쪽에 아이콘 렌더링 |
| `disabled` | `boolean` | `false` | 비활성화 |

### CustomInput

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `label` | `string` | - | 입력 필드 상단 라벨 |
| `suffix` | `string` | - | 오른쪽 단위 텍스트 (예: `"원"`, `"%"`, `"만원"`) |
| `error` | `string` | - | 에러 메시지 (빨간색 표시) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 높이 32/40/48px |

### CustomCard

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `hoverable` | `boolean` | `true` | hover 시 -1px 부상 + 그림자 강화 |
| `gradient` | `boolean` | `false` | 상단 2px 그라데이션 바 표시 |
| `glow` | `boolean` | `false` | hover 시 네온 글로우 효과 |

**서브 컴포넌트**: `CustomCardHeader`, `CustomCardContent`, `CustomCardFooter`

---

## 3. 사용 예시

### 기본 그라데이션 버튼

```tsx
<CustomButton onClick={handleSubmit}>
  계산하기
</CustomButton>
```

### 로딩 상태 + 아이콘 버튼

```tsx
import { Sparkles } from 'lucide-react'

<CustomButton loading={isLoading} icon={<Sparkles className="w-4 h-4" />}>
  AI 생성 중...
</CustomButton>
```

### 아웃라인 & 고스트 버튼

```tsx
<CustomButton variant="outline">초기화</CustomButton>
<CustomButton variant="ghost">취소</CustomButton>
```

### 라벨 + 단위 입력

```tsx
<CustomInput
  label="연봉"
  suffix="만원"
  type="number"
  placeholder="4,800"
  value={salary}
  onChange={(e) => setSalary(e.target.value)}
/>
```

### 에러 상태 입력

```tsx
<CustomInput
  label="이자율"
  suffix="%"
  error="0보다 큰 값을 입력하세요"
  value={rate}
  onChange={(e) => setRate(e.target.value)}
/>
```

### 그라데이션 바 카드

```tsx
<CustomCard gradient>
  <CustomCardHeader>
    <h3 className="text-lg font-bold text-white">연봉 실수령액</h3>
  </CustomCardHeader>
  <CustomCardContent>
    <p className="text-3xl font-bold gradient-text">3,842만원</p>
  </CustomCardContent>
  <CustomCardFooter>
    <CustomButton size="sm" variant="outline">상세보기</CustomButton>
  </CustomCardFooter>
</CustomCard>
```

### 호버 비활성 정적 카드

```tsx
<CustomCard hoverable={false}>
  <CustomCardContent>
    <p className="text-white/60">고정 정보 영역</p>
  </CustomCardContent>
</CustomCard>
```

---

## 4. 디자인 토큰 변수표

> `globals.css`의 `:root`에 정의됨. CSS `var()` 또는 Tailwind 임의값 `[var(--xxx)]`로 사용.

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--brand-primary` | `#60a5fa` | 메인 블루 |
| `--brand-secondary` | `#34d399` | 서브 에메랄드 |
| `--brand-accent` | `#a78bfa` | 액센트 바이올렛 |
| `--brand-gradient` | `linear-gradient(135deg, #60a5fa, #34d399, #a78bfa)` | 3색 그라데이션 |
| `--brand-glass-bg` | `rgba(255,255,255,0.08)` | 글래스 배경 |
| `--brand-glass-border` | `rgba(255,255,255,0.16)` | 글래스 테두리 |
| `--brand-glass-blur` | `20px` | 블러 강도 |
| `--brand-shadow-sm` | `0 2px 8px rgba(0,0,0,0.20)` | 작은 그림자 |
| `--brand-shadow-md` | `0 8px 32px rgba(0,0,0,0.28)` | 중간 그림자 |
| `--brand-shadow-lg` | `0 20px 60px rgba(0,0,0,0.35)` | 큰 그림자 |
| `--brand-transition` | `0.3s cubic-bezier(0.25,0.46,0.45,0.94)` | 애니메이션 이징 |

---

## 5. 기존 유틸리티 클래스

| 클래스명 | 용도 |
|----------|------|
| `glass-card` | 글래스모피즘 카드 스타일 |
| `glass-input` | 글래스모피즘 인풋 스타일 |
| `gradient-text` | 그라데이션 텍스트 |
| `num` | 숫자 전용 폰트 |
| `result-value` | 결과값 강조 스타일 |
| `nav-link` | 네비게이션 링크 |

---

## 6. 개발 규칙

1. **새 페이지 개발 시** `CustomCard` + `CustomInput` + `CustomButton` 조합을 우선 사용할 것
2. **색상은 CSS 변수로** — 하드코딩 금지, `var(--brand-*)` 사용
3. **shadcn 기본 컴포넌트 수정 금지** — CLI 업데이트 시 덮어씌워짐
4. **반응형 필수** — 모바일 우선 (`sm:`, `md:`, `lg:` 브레이크포인트)
5. **다크 테마 기준** — 텍스트는 `text-white/xx`, 배경은 `bg-white/xx` 불투명도 조절
