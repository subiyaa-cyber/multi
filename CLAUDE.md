# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## 프로젝트 개요

**고구마마켓** — 중고 물품을 사고팔 수 있는 웹 서비스.

## 기술 스택

- **Next.js 16** (App Router, `src/` 디렉토리 구조)
- **TypeScript** (strict 모드)
- **Supabase** — 데이터베이스(PostgreSQL), 인증, 스토리지
- **Tailwind CSS v4**

## MCP

**Supabase MCP 연결됨** — DB 스키마 변경, 데이터 조작, 마이그레이션은 MCP 도구를 통해 직접 수행합니다.

## 규칙

- UI 언어: 한국어
- 가격 표시: 원화 `₩10,000` 형태
- 모바일 반응형 필수
- 디자인: 깔끔하고 모던한 스타일, 색상 테마는 주황색 계열 (고구마 컨셉)

## 주요 기능

- 상품 목록 (메인 페이지)
- 상품 등록 / 상세 / 수정 / 삭제
- 소셜 로그인 (카카오 / 구글)
- 결제 (토스페이먼츠)

## 주요 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 환경 변수

`.env.local`에 아래 값을 설정해야 앱이 동작합니다. Supabase 프로젝트 대시보드 > Settings > API에서 확인.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 아키텍처

### Supabase 클라이언트 분리

`@supabase/ssr` 패키지를 사용하며, 호출 위치에 따라 클라이언트를 구분합니다.

| 파일 | 사용 위치 |
|------|-----------|
| `src/lib/supabase/client.ts` | Client Component (`"use client"`) |
| `src/lib/supabase/server.ts` | Server Component, Route Handler, Server Action |

### 미들웨어 (`src/middleware.ts`)

모든 요청에서 Supabase 세션 쿠키를 갱신합니다. `matcher`에서 정적 파일은 제외됩니다. 인증이 필요한 경로 보호 로직은 이 파일에 추가합니다.

### 라우팅 구조 (`src/app/`)

App Router 기반. 레이아웃은 `layout.tsx`, 각 페이지는 `page.tsx`로 구성합니다.

- 인증 관련: `src/app/auth/` 아래에 구성 예정
- 거래 목록/상세: `src/app/(market)/` 아래에 구성 예정

### 타입 정의 (`src/types/`)

Supabase 테이블 타입은 `supabase gen types typescript` 명령으로 생성 후 이 디렉토리에 저장합니다.

## 데이터베이스

스키마는 추후 작성 예정. 변경 시 Supabase MCP를 통해 직접 적용합니다.
