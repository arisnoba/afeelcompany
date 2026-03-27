---
phase: 3
slug: data-layer-admin
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-27
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none - build/lint plus manual admin workflow review |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | AUTH-01 | build | `npm run build` | ✅ | ✅ green |
| 03-01-02 | 01 | 1 | AUTH-02~04 | manual + build | `npm run build` | ✅ | ✅ green |
| 03-02-01 | 02 | 2 | UPLD-01~04 | build | `npm run build` | ✅ | ✅ green |
| 03-02-02 | 02 | 2 | UPLD-05~06 | manual + build | `npm run build` | ✅ | ✅ green |
| 03-03-01 | 03 | 3 | PORT-01~03 | build | `npm run build` | ✅ | ✅ green |
| 03-03-02 | 03 | 3 | PORT-04~05 | manual + build | `npm run build` | ✅ | ✅ green |
| 03-04-01 | 04 | 3 | PROF-01~02 | build | `npm run build` | ✅ | ✅ green |
| 03-04-02 | 04 | 3 | PROF-03 | manual + build | `npm run build` | ✅ | ✅ green |
| 03-05-01 | 05 | 4 | INST-04 | build | `npm run build` | ✅ | ✅ green |
| 03-05-02 | 05 | 4 | INST-05 | manual + build | `npm run build` | ✅ | ✅ green |
| 03-06-01 | 06 | 5 | AUTH-01~04 | manual | `npm run lint && npm run build` | ✅ | ✅ green |
| 03-06-02 | 06 | 5 | UPLD-01~06 | manual | `npm run lint && npm run build` | ✅ | ✅ green |
| 03-06-03 | 06 | 5 | PORT-01~05, PROF-01~03, INST-04~05 | manual | `npm run lint && npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `ADMIN_PASSWORD` 환경변수가 로컬/배포 환경에 존재한다
- [x] `POSTGRES_URL` 또는 Vercel Postgres 연결이 실제 CRUD 가능한 상태다
- [x] `BLOB_READ_WRITE_TOKEN` 환경변수가 존재한다
- [x] `next.config.ts`에 Vercel Blob URL 표시를 위한 이미지 설정이 추가되거나 plain `<img>` 전략이 명시된다
- [x] 고해상도 이미지 업로드를 4.5MB 이하로 줄이는 클라이언트 리사이즈 경로가 구현된다

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 로그인/로그아웃 흐름 | AUTH-01~04 | 쿠키, redirect, 보호 레이아웃 동작 확인 필요 | `/admin/login` 로그인 후 `/admin` 접근, 로그아웃 후 다시 차단 확인 |
| 업로드 피드백과 실제 저장 | UPLD-01~06 | 파일 선택/드래그, 진행 상태, Blob 저장은 브라우저 상호작용 필요 | 이미지 업로드 후 Blob URL과 DB row 생성 확인 |
| 포트폴리오 순서 변경/삭제 | PORT-04~05 | drag/reorder 또는 정렬 입력과 삭제 후 목록 반영 확인 필요 | 관리자 목록에서 순서 변경 후 새로고침, 삭제 후 row/blob 제거 확인 |
| 회사 프로필/브랜드 로고 관리 | PROF-01~03 | 로고 업로드와 편집 결과가 `/pdf-export`/공개 페이지에 반영되는지 확인 필요 | 프로필 저장, 로고 추가/삭제/순서변경 후 렌더링 확인 |
| 인스타 큐 publish 버튼 | INST-04~05 | 외부 Meta 전제조건과 게시 결과 확인이 자동화 불가 | 큐에서 게시 버튼 실행, 상태 및 `external_post_id` 확인 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved
