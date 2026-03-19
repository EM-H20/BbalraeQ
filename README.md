# 빨래큐 (BbalraeQ)

종근당 학사 공용 세탁실 QR 기반 세탁물 식별 서비스

## 소개

세탁기에 붙인 QR을 스캔하면 누구의 세탁물인지 + 바구니가 뭔지 바로 확인할 수 있는 웹 서비스입니다.

### 핵심 기능

- QR 스캔 → 세탁물 등록 (닉네임 + 바구니 사진)
- 다른 사람이 QR 스캔 → 바구니 확인 → 세탁물을 바구니에 넣어줌
- 세탁물 회수 완료 → 데이터 자동 삭제
- 24시간 미변경 시 자동 만료

### 설계 원칙

- 관리자 없음 (로그인, 관리자 페이지 없음)
- DB 사전 등록 없음 (QR URL만 있으면 작동)
- 세탁기 증감 자유 (QR 스티커 출력/부착/제거만으로 완결)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 19 + TypeScript + Vite |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 라우팅 | React Router v6 |
| DB + Storage | Supabase (PostgreSQL + Storage) |
| 이미지 압축 | browser-image-compression |

## 시작하기

### 환경 설정

```bash
# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 Supabase URL과 anon key 입력
```

### 환경변수

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

### 개발 서버

```bash
npm run dev
```

`http://localhost:5173` 에서 확인 가능

### 빌드

```bash
npm run build
npm run preview
```

## 라우팅

| URL | 화면 |
|-----|------|
| `/` | 서비스 안내 (Home) |
| `/q/:qrId` | QR 스캔 후 페이지 (모든 QR ID 처리) |

## QR 코드 생성

아무 무료 QR 사이트에서 URL을 입력해 QR 스티커를 출력합니다.

```
세탁기 1호 → https://your-domain/q/W1
세탁기 2호 → https://your-domain/q/W2
건조기 1호 → https://your-domain/q/D1
```

QR ID 네이밍은 자유입니다. URL로 유효한 문자열이면 전부 작동합니다.

## 문서

- [PRD v2.3](docs/PRD.md)
- [아키텍처](docs/01_ARCHITECTURE.md)
- [폴더 구조](docs/02_FOLDER_STRUCTURE.md)
- [코드 컨벤션](docs/03_CODE_CONVENTIONS.md)
- [구현 워크플로우](docs/WORKFLOW.md)

---

<!-- AUTO-VERSION-SECTION: DO NOT EDIT MANUALLY -->
## 최신 버전 : v0.0.0

[전체 버전 기록 보기](CHANGELOG.md)
