export const PUBLIC_ABOUT_COPY = '브랜드와 셀럽을 연결하여 실질적인 노출을 만듭니다.';

const LEGACY_PUBLIC_ABOUT_COPIES = new Set([
	'브랜드와 셀럽의 접점을 설계하고, 한 번 정리한 포트폴리오를 웹과 소개서, 소셜까지 이어 붙이는 패션 PR 스튜디오입니다.',
	'어필컴퍼니는 패션 브랜드와 셀럽을 연결하는 PR 에이전시입니다. 브랜드의 톤과 제품 맥락에 맞는 스타일링 포트폴리오를 큐레이션하고, 소개서와 웹, 인스타그램까지 하나의 흐름으로 연결합니다.',
]);

export function resolvePublicAboutCopy(value?: string | null) {
	const copy = value?.trim() ?? '';

	if (!copy || LEGACY_PUBLIC_ABOUT_COPIES.has(copy)) {
		return PUBLIC_ABOUT_COPY;
	}

	return copy;
}
