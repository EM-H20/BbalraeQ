# 02. 폴더 구조

> 빨래큐 (BbalraeQ) MVP 디렉토리 구조 정의

---

## 전체 구조

```
bbalraeq/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                     ← 앱 진입점
│   ├── App.tsx                      ← 라우터 설정
│   ├── index.css                    ← Tailwind 글로벌 스타일
│   ├── vite-env.d.ts                ← Vite 타입 선언
│   │
│   ├── pages/                       ← 라우팅 계층
│   │   ├── Home.tsx                    서비스 안내 페이지
│   │   └── QrPage.tsx                  QR 스캔 후 메인 페이지
│   │
│   ├── components/                  ← UI 계층
│   │   ├── ui/                         shadcn/ui 컴포넌트 (자동 생성)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── label.tsx
│   │   ├── StatusView.tsx              사용 중 / 비어있음 표시
│   │   ├── RegisterForm.tsx            닉네임 + 사진 등록 폼
│   │   ├── BasketPhoto.tsx             바구니 사진 표시
│   │   └── SuccessMessage.tsx          등록 완료 피드백
│   │
│   ├── utils/                       ← 서비스 계층
│   │   └── supabase.ts                 Supabase 클라이언트 초기화
│   ├── lib/                         ← 유틸리티
│   │   ├── imageUtils.ts               이미지 압축 유틸리티
│   │   └── utils.ts                    cn() 함수 (shadcn/ui용)
│   │
│   └── types/                       ← 데이터 계약 계층
│       └── index.ts                    Registration 타입 등
│
├── docs/                            ← 프로젝트 문서
│   ├── PRD.md
│   ├── WORKFLOW.md
│   ├── 01_ARCHITECTURE.md
│   ├── 02_FOLDER_STRUCTURE.md
│   └── 03_CODE_CONVENTIONS.md
│
├── .env                             ← 환경변수 (git 제외)
├── .gitignore
├── components.json                  ← shadcn/ui 설정
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 디렉토리별 상세 설명

### `src/pages/`

라우트와 1:1 매핑되는 페이지 컴포넌트.

| 파일 | 라우트 | 역할 |
|------|--------|------|
| `Home.tsx` | `/` | 서비스 소개, QR 스캔 안내 |
| `QrPage.tsx` | `/q/:qrId` | 모든 QR ID를 처리하는 핵심 페이지 |

- 페이지 컴포넌트는 데이터 fetch의 시작점
- 하위 컴포넌트에 데이터를 Props로 전달

### `src/components/`

재사용 가능한 UI 컴포넌트.

| 파일 | 역할 | 사용 위치 |
|------|------|-----------|
| `StatusView.tsx` | 세탁기 상태 표시 (사용 중/비어있음) | QrPage |
| `RegisterForm.tsx` | 닉네임 입력 + 사진 업로드 폼 | QrPage |
| `BasketPhoto.tsx` | 바구니 사진 이미지 표시 | StatusView |
| `SuccessMessage.tsx` | 등록 완료 피드백 메시지 | QrPage |

### `src/components/ui/`

shadcn/ui로 자동 생성되는 기본 UI 컴포넌트. **직접 수정하지 않는다.** 커스텀이 필요하면 래퍼 컴포넌트를 만든다.

### `src/utils/`

외부 서비스 클라이언트.

| 파일 | 역할 |
|------|------|
| `supabase.ts` | Supabase 클라이언트 인스턴스 생성 및 export |

### `src/lib/`

React에 의존하지 않는 순수 유틸리티 함수.

| 파일 | 역할 |
|------|------|
| `imageUtils.ts` | `browser-image-compression` 래퍼 (압축 옵션 설정) |
| `utils.ts` | `cn()` 함수 — `clsx` + `tailwind-merge` 조합 (shadcn/ui 필수) |

### `src/types/`

앱 전체에서 공유하는 TypeScript 타입 정의.

| 파일 | 내용 |
|------|------|
| `index.ts` | `Registration` 인터페이스 (DB 스키마 매핑) |

---

## 컴포넌트 의존성 트리

```
App.tsx
├── Home.tsx
└── QrPage.tsx
    ├── StatusView.tsx
    │   ├── BasketPhoto.tsx
    │   ├── Button (shadcn)
    │   └── Card (shadcn)
    ├── RegisterForm.tsx
    │   ├── Input (shadcn)
    │   ├── Label (shadcn)
    │   ├── Button (shadcn)
    │   └── imageUtils.ts
    └── SuccessMessage.tsx
```

---

## 파일 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 페이지 컴포넌트 | PascalCase | `QrPage.tsx` |
| UI 컴포넌트 | PascalCase | `StatusView.tsx` |
| shadcn/ui 컴포넌트 | kebab-case (shadcn 기본값) | `button.tsx` |
| 유틸리티/서비스 | camelCase | `supabase.ts`, `imageUtils.ts` |
| 타입 파일 | camelCase | `index.ts` |
| 환경변수 | UPPER_SNAKE + VITE_ 접두사 | `VITE_SUPABASE_URL` |

---

_— End of Document —_
