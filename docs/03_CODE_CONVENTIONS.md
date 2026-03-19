# 03. 코드 컨벤션

> 빨래큐 (BbalraeQ) MVP 코딩 규칙 정의

---

## 언어 및 도구

| 항목 | 선택 |
|------|------|
| 언어 | TypeScript (strict) |
| 프레임워크 | React 19 |
| 빌드 도구 | Vite |
| 스타일링 | Tailwind CSS |
| UI 컴포넌트 | shadcn/ui |
| 린팅 | ESLint |
| 패키지 매니저 | npm |

---

## TypeScript

### 타입 정의

- **인터페이스** (`interface`): 객체 형태 정의에 사용
- **타입 별칭** (`type`): 유니온, 유틸리티 타입에 사용
- `any` 사용 금지 — `unknown`으로 대체 후 타입 가드 적용

```ts
// Good
interface Registration {
  id: string;
  qr_id: string;
  nickname: string;
  image_url: string;
  created_at: string;
}

// Good
type ViewMode = "status" | "register" | "success";

// Bad
const data: any = response;
```

### Props 타입

컴포넌트 Props는 해당 컴포넌트 파일 내에 정의한다.

```ts
interface StatusViewProps {
  registration: Registration | null;
  onRegister: () => void;
  onComplete: () => void;
}

export function StatusView({ registration, onRegister, onComplete }: StatusViewProps) {
  // ...
}
```

---

## React 컴포넌트

### 함수 선언

- **named export** + **function 선언문** 사용
- `default export` 사용하지 않음 (리팩터링 시 추적 용이)

```ts
// Good
export function QrPage() {
  return <div>...</div>;
}

// Bad
export default function QrPage() { ... }
const QrPage = () => { ... };
```

### 컴포넌트 구조 순서

하나의 컴포넌트 파일 내 코드 순서:

```ts
// 1. import
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. 타입 정의
interface Props { ... }

// 3. 컴포넌트 함수
export function MyComponent({ ... }: Props) {
  // 3a. hooks
  const [state, setState] = useState();

  // 3b. 파생 값
  const isReady = state !== null;

  // 3c. 이벤트 핸들러
  function handleClick() { ... }

  // 3d. 조건부 early return
  if (!isReady) return <Loading />;

  // 3e. JSX return
  return <div>...</div>;
}
```

### 이벤트 핸들러 네이밍

- 컴포넌트 내부: `handle` 접두사 — `handleClick`, `handleSubmit`
- Props 콜백: `on` 접두사 — `onClick`, `onSubmit`

```ts
// 부모
<RegisterForm onSubmit={handleRegister} />

// 자식
function RegisterForm({ onSubmit }: Props) {
  function handleSubmit() {
    // 검증 로직 등
    onSubmit(data);
  }
}
```

---

## 스타일링

### Tailwind CSS

- 인라인 Tailwind 클래스 직접 사용 (별도 CSS 파일 작성 금지)
- 조건부 클래스는 `cn()` 유틸리티 사용

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "rounded-lg p-4",
  isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
)} />
```

### 모바일 퍼스트

- 기본 스타일 = 모바일
- `sm:`, `md:` 등 브레이크포인트는 필요한 경우에만

```tsx
// Good: 모바일 기본, 데스크톱 확장
<div className="px-4 max-w-md mx-auto">

// Bad: 데스크톱 기본, 모바일 축소
<div className="px-8 md:px-4">
```

### shadcn/ui 사용

- `src/components/ui/` 파일은 직접 수정하지 않음
- 커스텀 필요 시 래퍼 컴포넌트 생성하거나 className으로 확장

```tsx
// Good: className으로 확장
<Button className="w-full" size="lg">등록 완료!</Button>

// Bad: ui/button.tsx 직접 수정
```

---

## 비동기 처리

### Supabase 호출

- `async/await` 사용
- 에러는 Supabase 응답의 `error` 객체로 처리

```ts
async function fetchRegistration(qrId: string) {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("qr_id", qrId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}
```

> `PGRST116`은 "결과 없음" 에러 코드 — 비어있는 정상 상태이므로 무시

### 이미지 업로드

- 압축 → 업로드 → URL 획득 순서로 처리
- 압축은 `imageUtils.ts`의 함수로 위임

---

## import 경로

### Path Alias

`@/`를 `src/`로 매핑하여 사용한다.

```ts
// Good
import { supabase } from "@/lib/supabase";
import { Registration } from "@/types";
import { Button } from "@/components/ui/button";

// Bad
import { supabase } from "../../../lib/supabase";
```

`tsconfig.json`과 `vite.config.ts`에서 설정:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 네이밍 규칙 요약

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `StatusView`, `RegisterForm` |
| 함수 | camelCase | `fetchRegistration`, `compressImage` |
| 변수 | camelCase | `isLoading`, `qrId` |
| 상수 | camelCase 또는 UPPER_SNAKE | `MAX_FILE_SIZE` |
| 타입/인터페이스 | PascalCase | `Registration`, `ViewMode` |
| 파일 (컴포넌트) | PascalCase.tsx | `QrPage.tsx` |
| 파일 (유틸리티) | camelCase.ts | `imageUtils.ts` |
| 환경변수 | VITE_UPPER_SNAKE | `VITE_SUPABASE_URL` |
| CSS 클래스 | Tailwind 유틸리티 | `bg-green-50 rounded-lg` |

---

## Git 커밋 메시지

```
<type>: <description>

[optional body]
```

### Type

| Type | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩터링 (기능 변화 없음) |
| `style` | 스타일/포맷 변경 |
| `docs` | 문서 변경 |
| `chore` | 빌드/설정 변경 |

### 예시

```
feat: QR 스캔 후 세탁물 상태 표시

chore: shadcn/ui 초기화 및 Button 컴포넌트 추가

fix: 닉네임 2자 미만 입력 시 검증 누락
```

---

_— End of Document —_
