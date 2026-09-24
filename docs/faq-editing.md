# FAQ 편집 안내

공개 페이지는 `/faq`, `/en/faq`, `/zh/faq`입니다. 메뉴는 포트폴리오 다음에 표시됩니다.

## 편집 파일

`src/content/faq.ts`에서 질문과 답변, 공개 여부를 관리합니다. DB나 관리자 페이지 변경은 필요하지 않습니다.

- `FAQ_ENTRIES`: 질문과 답변입니다. `content.ko`, `content.en`, `content.zh`에 언어별 문구가 들어 있습니다.
- `published: false`: 해당 항목을 모든 언어의 화면과 FAQPage 구조화 데이터에서 숨깁니다. 삭제하지 않고 검토용으로 남길 수 있습니다.
- `answer`: 문자열 하나가 문단 하나입니다. 두 문단을 합치거나 나눌 수 있습니다. HTML 대신 일반 텍스트를 작성합니다.
- `category`: 질문이 속한 주제입니다. 같은 주제 안에서는 배열에 적힌 순서대로 표시합니다.
- `id`: 항목의 고유값입니다. 중복되지 않게 유지합니다. 화면 주소의 `#question-id`에도 쓰입니다.
- `reviewNote`: 작성자 확인용 메모입니다. 공개 화면과 구조화 데이터에는 표시하지 않습니다.
- `FAQ_CATEGORIES`: 주제 이름과 순서입니다. 공개 항목이 없는 주제는 자동으로 숨깁니다.
- `FAQ_PAGE_COPY`: 페이지 제목과 소개 문구입니다.
- 하단 CTA는 ABOUT과 같은 `CollaborationCta` 컴포넌트를 사용합니다. 문구는 `src/i18n/site-copy.ts`의 언어별 `about.collaborationEyebrow`, `about.collaborationBody`, `about.collaborationCta`에서 함께 관리합니다.

예를 들어 보장형 PPL 설명이 필요하지 않으면 `id: 'placement-types'` 항목의 `published`를 `false`로 변경하세요. 다른 파일의 구조화 데이터를 따로 수정할 필요는 없습니다.

## 우선 검토할 항목

| 항목 ID | 질문 주제 | 확인할 내용 |
| --- | --- | --- |
| brand-fit | 적합한 브랜드 | 취급 카테고리와 실제 협업 조건 |
| new-brands | 신생 브랜드 상담 | 수용 조건, 샘플과 자료 요건 |
| pricing | 비용 | 계약 방식, 최소 예산, 포함 업무 |
| placement-types | 협찬과 PPL 차이 | 해당 질문 유지 여부, PPL 취급 여부 |
| workflow | 과정과 기간 | 실제 샘플 운영 절차와 일정 안내 범위 |
| agency-selection | 대행사 선택 기준 | 자사 FAQ에서 유지할 필요가 있는지 |
| image-usage | 사진 사용 | 권리 확인 지원 및 라이선스 업무 제공 여부 |
| reporting | 성과 확인 | 보고 항목, 유입과 구매 데이터 분석 제공 여부 |

원문의 고정 가격, 평균 소요 기간, 특정 아티스트와의 직접 네트워크, 쇼룸 운영, 매출 보장, 바이럴 집행은 확인된 서비스 약속으로 사용하지 않았습니다. 실제 제공 범위가 정해지면 해당 답변에 반영하세요.

## 검증과 반영

수정 후 `npx tsc --noEmit`과 `npx eslint src/content/faq.ts src/views/site/faq-page.tsx`를 실행하고, 개발 서버에서 문구와 펼침 동작을 확인합니다. 언어별 문구를 함께 검토해 주세요.

파일 수정은 로컬에만 반영됩니다. 운영 사이트 반영에는 별도 배포가 필요합니다.

## 작성 참고

FAQPage는 화면에 있는 공개 질문과 답변에서 생성합니다. 구조화 데이터 추가만으로 검색 노출이나 AI 인용이 보장되지는 않습니다.

사진 사용 답변은 특정 계약에 대한 법률 판단이 아니라 사용 전 권리 확인을 안내합니다. 출처 표시나 SNS 공유 기능만으로 모든 재사용이 허용된다고 안내하지 않습니다.

- [Google 검색의 FAQ 구조화 데이터 변경 안내](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [한국저작권위원회 FAQ](https://www.copyright.or.kr/customer-center/faq/list.do?portalcode=04)
