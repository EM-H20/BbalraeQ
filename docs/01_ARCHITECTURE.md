# 01. 아키텍처

> 빨래큐 (BbalraeQ) MVP 아키텍처 정의

---

## 아키텍처 패턴: Layered Architecture

React SPA + Supabase BaaS 구조에 맞는 **계층형 아키텍처**를 채택한다.

### MVC를 선택하지 않은 이유

| 비교 | MVC | Layered (채택) |
|------|-----|----------------|
| Controller 역할 | 별도 컨트롤러 계층 필요 | React 컴포넌트가 자연스럽게 담당 |
| Model 역할 | 별도 모델 계층 필요 | Supabase가 DB+API 역할을 대체 |
| 적합한 프로젝트 | 서버 렌더링, 복잡한 상태 관리 | SPA + BaaS, 단순한 CRUD |
| 복잡도 | 이 규모에선 과잉 | MVP에 적합한 최소 구조 |

React에서는 컴포넌트 자체가 View + Controller 역할을 하므로, MVC의 명시적 분리가 오히려 불필요한 보일러플레이트를 만든다.

---

## 계층 정의

```
┌─────────────────────────────────────────┐
│              Pages (라우팅 계층)           │
│  URL → 페이지 컴포넌트 매핑               │
│  데이터 fetch 오케스트레이션               │
├─────────────────────────────────────────┤
│           Components (UI 계층)            │
│  순수 표현 컴포넌트                        │
│  Props로 데이터 수신, 이벤트 위임          │
├─────────────────────────────────────────┤
│           Lib / Services (서비스 계층)     │
│  Supabase 클라이언트, 이미지 압축          │
│  비즈니스 로직 캡슐화                      │
├─────────────────────────────────────────┤
│           Types (데이터 계약 계층)         │
│  TypeScript 인터페이스/타입 정의           │
└─────────────────────────────────────────┘
```

### 각 계층의 역할과 규칙

#### 1. Pages (라우팅 계층)

- **역할**: URL과 컴포넌트 매핑, 데이터 fetch 시작점
- **위치**: `src/pages/`
- **규칙**:
  - 라우트당 하나의 페이지 컴포넌트
  - Supabase 조회/삽입/삭제는 이 계층에서 호출
  - 상태 관리의 최상위 소유자

#### 2. Components (UI 계층)

- **역할**: UI 렌더링, 사용자 인터랙션 처리
- **위치**: `src/components/`
- **규칙**:
  - Props로 데이터를 받고, 콜백으로 이벤트를 위임
  - 직접 Supabase를 호출하지 않음
  - 재사용 가능한 단위로 분리
  - `ui/` 하위는 shadcn/ui 전용

#### 3. Lib / Services (서비스 계층)

- **역할**: 외부 서비스 통신, 유틸리티 함수
- **위치**: `src/lib/`
- **규칙**:
  - Supabase 클라이언트 초기화 및 export
  - 이미지 압축 등 순수 유틸리티 함수
  - React에 의존하지 않는 순수 함수/객체

#### 4. Types (데이터 계약 계층)

- **역할**: 전체 앱에서 사용하는 타입 정의
- **위치**: `src/types/`
- **규칙**:
  - DB 스키마와 1:1 매핑되는 인터페이스
  - 컴포넌트 Props 타입은 각 컴포넌트 파일에 정의

---

## 데이터 흐름

```
[QR 스캔] → URL 접속 (/q/:qrId)
              │
              ▼
         QrPage.tsx (Pages 계층)
              │
              ├── useParams()로 qrId 추출
              ├── supabase.ts 통해 DB 조회 (Lib 계층)
              │
              ▼
         상태 분기
         ├── 데이터 있음 → StatusView (사용 중)
         │                    ├── BasketPhoto (사진 표시)
         │                    ├── [등록하기] → RegisterForm
         │                    └── [회수 완료] → supabase DELETE
         │
         └── 데이터 없음 → StatusView (비어있음)
                              └── [등록하기] → RegisterForm
                                                 │
                                                 ├── 닉네임 검증
                                                 ├── 이미지 압축 (Lib 계층)
                                                 ├── Storage 업로드 (Lib 계층)
                                                 └── DB INSERT (Lib 계층)
```

---

## 외부 시스템 의존성

```
┌──────────────┐     HTTPS      ┌──────────────────┐
│              │ ◄────────────► │  Supabase         │
│  React SPA   │                │  ├── PostgreSQL   │
│  (Vercel)    │                │  ├── Storage      │
│              │                │  └── REST API     │
└──────────────┘                └──────────────────┘
       ▲
       │ QR 스캔
       │
  ┌────────┐
  │ 모바일  │
  │ 브라우저 │
  └────────┘
```

- **Supabase**: DB (registrations 테이블) + Storage (baskets 버킷) + 자동 생성 REST API
  - Project ID: `oaktehjutwaadnhtqtyo`
  - Region: Northeast Asia (Seoul)
  - Direct Connection: `postgresql://postgres:***@db.oaktehjutwaadnhtqtyo.supabase.co:5432/postgres`
- **Supabase MCP**: 개발 중 Claude Code에서 DB 직접 조작 (테이블 생성, RLS, 데이터 확인)
- **Vercel**: 정적 빌드 배포 (SPA)
- **모바일 브라우저**: QR 스캔 → URL 접속 (주 사용 환경)

---

## 상태 관리 전략

| 상태 종류 | 관리 방법 | 이유 |
|-----------|-----------|------|
| 서버 상태 (DB 데이터) | `useState` + `useEffect` | 단일 테이블 조회뿐, 전역 상태 라이브러리 불필요 |
| UI 상태 (로딩, 모달 등) | 컴포넌트 로컬 `useState` | 컴포넌트 간 공유 불필요 |
| URL 상태 (qrId) | React Router `useParams` | URL이 유일한 진실 공급원 |

전역 상태 관리 도구(Redux, Zustand 등)는 **사용하지 않는다.** 테이블 1개, 화면 3개인 MVP에서는 과잉이다.

---

_— End of Document —_
