# 빨래큐 (BbalraeQ) — 구현 워크플로우

> PRD v2.3 기반 MVP 구현 계획
>
> 작성일: 2026-03-19

---

## 현재 프로젝트 상태

- Vite + React 19 (JavaScript) 기본 템플릿
- TypeScript 미설정, Tailwind 미설정, shadcn/ui 미설정
- 패키지: react, react-dom만 설치됨
- 폴더: src/ 하위에 App.jsx, main.jsx, index.css, App.css만 존재

---

## 사용 가능한 .agents 스킬

| 스킬 | 설명 | 적용 시점 |
|------|------|-----------|
| `vercel-react-best-practices` | React 성능 최적화 64개 룰 (rerender, bundle, async 등) | Phase 5~6 컴포넌트 구현 시 |
| `web-design-guidelines` | 웹 인터페이스 가이드라인 준수 검증 | Phase 7 UI 마무리 후 리뷰 |

---

## Phase 0: TypeScript 전환 + 기본 설정

**목표**: JSX 프로젝트를 TSX로 전환

- [ ] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` 생성
- [ ] `src/main.jsx` → `src/main.tsx` 변환
- [ ] `src/App.jsx` → `src/App.tsx` 변환
- [ ] `src/App.css` 삭제 (Tailwind로 대체 예정)
- [ ] `index.html` 스크립트 경로 `/src/main.tsx`로 수정
- [ ] `vite.config.js` → `vite.config.ts` 변환
- [ ] `eslint.config.js` TypeScript 호환 확인
- [ ] `src/vite-env.d.ts` 생성

**완료 조건**: `npm run dev` 정상 실행

---

## Phase 1: 핵심 패키지 설치

**목표**: PRD 기술 스택에 명시된 모든 패키지 설치

### dependencies

```bash
npm install react-router-dom @supabase/supabase-js browser-image-compression lucide-react clsx tailwind-merge class-variance-authority
```

| 패키지 | 용도 |
|--------|------|
| react-router-dom | `/q/:qrId` 동적 라우팅 |
| @supabase/supabase-js | DB + Storage |
| browser-image-compression | 바구니 사진 클라이언트 압축 |
| lucide-react | 아이콘 |
| clsx | 조건부 className |
| tailwind-merge | Tailwind 클래스 충돌 방지 |
| class-variance-authority | 컴포넌트 변형 관리 |

### devDependencies

```bash
npm install -D tailwindcss @tailwindcss/vite typescript @types/react @types/react-dom
```

### Tailwind 연결

- [ ] `vite.config.ts`에 `@tailwindcss/vite` 플러그인 추가
- [ ] `src/index.css` 맨 위에 `@import "tailwindcss";` 설정
- [ ] 기존 index.css 내용 정리

**완료 조건**: `npm run dev` + Tailwind 클래스 적용 확인

---

## Phase 2: shadcn/ui 초기화 + 컴포넌트 설치

**목표**: shadcn/ui 세팅 및 필요 컴포넌트 추가

- [ ] `npx shadcn@latest init` 실행
- [ ] `components.json` 생성 확인
- [ ] 필요 컴포넌트 설치:

```bash
npx shadcn@latest add button input card label
```

- [ ] `src/components/ui/` 디렉토리에 컴포넌트 파일 확인
- [ ] `src/lib/utils.ts` (cn 함수) 생성 확인

**완료 조건**: shadcn Button 렌더링 테스트

---

## Phase 3: 프로젝트 폴더 구조 + 타입 정의

**목표**: PRD 섹션 11 기준 폴더/파일 스캐폴딩

### 폴더 구조

```
src/
├── pages/
│   ├── Home.tsx
│   └── QrPage.tsx
├── components/
│   ├── ui/              ← shadcn/ui (Phase 2에서 생성됨)
│   ├── StatusView.tsx
│   ├── RegisterForm.tsx
│   ├── BasketPhoto.tsx
│   └── SuccessMessage.tsx
├── lib/
│   ├── supabase.ts
│   └── imageUtils.ts
└── types/
    └── index.ts
```

### 타입 정의 (`src/types/index.ts`)

```ts
export interface Registration {
  id: string;
  qr_id: string;
  nickname: string;
  image_url: string;
  created_at: string;
}
```

### 환경변수 (`.env`) — 이미 설정됨

```
SUPABASE_DB_PASSWORD=***
VITE_SUPABASE_URL=https://oaktehjutwaadnhtqtyo.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=***
```

**완료 조건**: 모든 파일/폴더 생성, 타입 에러 없음

---

## Phase 4: 라우터 + Supabase 클라이언트 설정

**목표**: 앱 뼈대 완성 (라우팅 + DB 연결)

### App.tsx — React Router v6

```
/           → Home.tsx       (서비스 안내)
/q/:qrId   → QrPage.tsx     (QR 스캔 후 페이지)
```

### src/utils/supabase.ts (이미 생성됨)

- Supabase 클라이언트 초기화 완료
- 환경변수: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Project ID: `oaktehjutwaadnhtqtyo`
- Region: Northeast Asia (Seoul)

### src/lib/imageUtils.ts

- `compressImage()` 함수: browser-image-compression 래퍼
- 최대 파일 크기, 최대 너비/높이 설정

### Supabase MCP 연결

개발 중 Supabase MCP 서버를 통해 DB 직접 조작 가능:

- **Direct Connection**: `postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.oaktehjutwaadnhtqtyo.supabase.co:5432/postgres`
- 용도: 테이블 생성, RLS 정책 설정, 데이터 확인 등 개발 시 활용

**완료 조건**: `/q/test` 접속 시 QrPage 컴포넌트 렌더링

> Phase 3과 Phase 4는 병렬 작업 가능

---

## Phase 5: QrPage 핵심 로직 구현

**목표**: QR 스캔 후 상태 분기 (사용 중 / 비어있음)

> `.agents` 스킬 `vercel-react-best-practices` 참조하여 구현

### QrPage.tsx

- `useParams()`로 `qrId` 추출
- Supabase에서 `registrations` 테이블 조회
- 로딩 / 에러 / 데이터 상태 관리

### StatusView.tsx

- **사용 중**: 닉네임 + 바구니 사진 + "내 세탁물 등록하기" + "세탁물 회수 완료" 버튼
- **비어있음**: "지금 사용할 수 있어요!" + "내 세탁물 등록하기" 버튼

### BasketPhoto.tsx

- 바구니 사진 표시 (이미지 URL → img 태그)
- "이 바구니에 넣어주세요!" 안내 텍스트

### 마이크로카피 (PRD 섹션 4)

| 상태 | 텍스트 |
|------|--------|
| 사용 중 | "현재 사용 중이에요" / "{닉네임}님의 세탁물이에요" |
| 비어있음 | "지금 사용할 수 있어요!" |

**완료 조건**: `/q/test` 접속 시 비어있음 화면 정상 표시

---

## Phase 6: RegisterForm + 세탁물 등록/회수 로직

**목표**: 세탁물 등록·회수 CRUD 완성

> `.agents` 스킬 `vercel-react-best-practices` 참조하여 구현

### RegisterForm.tsx

- 닉네임 입력 (2~10자 클라이언트 검증)
- 바구니 사진 촬영/선택 (카메라 + 갤러리)
- 이미지 압축 (`imageUtils.ts`)
- Supabase Storage 업로드 (`baskets/{qr_id}/{filename}`)

### 등록 흐름

1. 기존 `qr_id` 레코드 있으면 → 기존 사진 Storage 삭제 + 레코드 DELETE
2. 새 사진 업로드
3. 새 레코드 INSERT (`qr_id`, `nickname`, `image_url`, `created_at`)

### 회수 완료 흐름

1. "세탁물 회수 완료" 버튼 클릭
2. 해당 `qr_id` 레코드 DELETE + Storage 사진 삭제
3. 페이지 → "비어있음" 상태 전환

### SuccessMessage.tsx

- "등록되었어요! 바구니를 세탁기 옆에 두세요" 피드백

**완료 조건**: 등록 → 확인 → 회수 전체 플로우 동작

---

## Phase 7: Home 페이지 + 모바일 퍼스트 UI 마무리

**목표**: 서비스 안내 페이지 + 전체 UI 완성

### Home.tsx

- 빨래큐 서비스 소개
- QR 스캔 안내
- 사용법 간단 설명

### UI 스타일링

- 모바일 퍼스트 (max-w-md 중앙 정렬)
- PRD 와이어프레임(섹션 7) 기준 레이아웃
- Tailwind + shadcn/ui 일관된 디자인

### 검증

- [ ] `npm run build` 성공
- [ ] `npm run preview`로 빌드 결과 확인
- [ ] `.agents/web-design-guidelines` 스킬로 UI 코드 리뷰

**완료 조건**: 빌드 성공 + 모바일 뷰에서 전체 플로우 정상 동작

---

## 의존성 그래프

```
Phase 0 (TS 전환)
  └→ Phase 1 (패키지 설치)
       └→ Phase 2 (shadcn/ui)
            ├→ Phase 3 (폴더 구조 + 타입)  ─┐
            └→ Phase 4 (라우터 + Supabase) ─┤ 병렬 가능
                                             └→ Phase 5 (QrPage)
                                                  └→ Phase 6 (등록/회수)
                                                       └→ Phase 7 (Home + UI)
```

---

## Supabase 사전 준비

### 프로젝트 정보

| 항목 | 값 |
|------|------|
| Project Name | BbalraeQ |
| Project ID | `oaktehjutwaadnhtqtyo` |
| Region | Northeast Asia (Seoul) |
| Direct Connection | `postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.oaktehjutwaadnhtqtyo.supabase.co:5432/postgres` |

### 테이블 생성 SQL

```sql
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Storage 버킷

- 버킷 이름: `baskets`
- 공개 접근 허용 (이미지 URL 직접 접근용)

### RLS 정책

- `registrations`: SELECT / INSERT / DELETE 모두 허용 (anon)
- `baskets` 버킷: SELECT / INSERT / DELETE 모두 허용 (anon)

> 로그인 없는 서비스이므로 anon 키로 전체 접근 허용

---

## Supabase MCP 서버 연결

개발 중 Claude Code에서 Supabase DB를 직접 조작하기 위해 MCP 서버를 사용한다.

### 설정 (완료)

프로젝트 루트 `.mcp.json`에 설정됨:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref", "oaktehjutwaadnhtqtyo"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "***"
      }
    }
  }
}
```

- `.mcp.json`은 `.gitignore`에 포함 (토큰 보호)
- `SUPABASE_ACCESS_TOKEN`은 `.env`에도 보관

### 용도

- 테이블 생성/수정 (SQL 실행)
- RLS 정책 설정
- Storage 버킷 관리
- 개발 중 데이터 확인/디버깅

---

_— End of Workflow —_
