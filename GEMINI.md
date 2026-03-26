<!-- GSD:project-start source:PROJECT.md -->
## Project

**AFEEL Company Site (MVP)**

패션 스타마케팅 전문 PR 에이전시 '어필컴퍼니(AFEEL Company, 2018~)'의 온라인 MVP 웹사이트입니다. 현재 수동으로 PDF 소개서를 만들어 패션 브랜드(잠재 클라이언트)에게 전달하고 있는 업무를 디지털화합니다. 내부 관리자가 포트폴리오 이미지를 업로드하면 웹 갤러리에 반영되고, 인스타그램 연동 및 가로형 PDF 회사 소개서 다운로드까지 한 곳에서 제어할 수 있는 플랫폼입니다.

**Core Value:** 관리자가 포트폴리오 이미지를 한 번 업로드하면 웹 갤러리 · 인스타그램 · PDF 소개서에 모두 반영되는 '원소스 멀티유즈(One Source, Multi Use)' 경험을 제공하는 것.

### Constraints

- **서버 인프라**: Vercel Hobby — Serverless 10초 타임아웃, 50MB 번들 제한
- **저장소 용량**: Vercel Blob 500MB (Hobby). 초과 시 Pro($20/월) 전환 필요
- **DB**: Vercel Postgres 256MB, 60h 컴퓨트 (Hobby)
- **인스타그램**: Meta Graph API Development Mode — 비즈니스/크리에이터 계정 + Facebook Page 연결 필수, 토큰 60일 만료
- **디자인**: MVP 단계에서는 기능 동작 검증에 집중. 브랜드 디자인은 별도 Phase
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
