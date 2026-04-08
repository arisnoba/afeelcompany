import type { Metadata } from 'next';

import { INSTAGRAM_PROFILE_URL } from '@/lib/site';

export const SITE_NAME = 'AFEEL Company';
export const SITE_TITLE_SUFFIX = 'AFEEL Company';
export const DEFAULT_SITE_DESCRIPTION =
	'브랜드와 셀럽의 접점을 설계하고 포트폴리오, 소개서, 소셜 아카이브까지 연결하는 패션 PR 에이전시 AFEEL Company 공식 사이트.';
export const DEFAULT_SITE_KEYWORDS = ['AFEEL Company', '어필컴퍼니', '패션 PR', '셀럽 협찬', '스타 마케팅', '스타일링 포트폴리오'];
export const DEFAULT_OG_IMAGE = '/pdf-fixtures/cover-hero.png';

function normalizeSiteUrl(value?: string | null) {
	if (!value) {
		return null;
	}

	const trimmed = value.trim();

	if (!trimmed) {
		return null;
	}

	const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

	try {
		return new URL(normalized);
	} catch {
		return null;
	}
}

export const SITE_URL =
	normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
	normalizeSiteUrl(process.env.SITE_URL) ??
	normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
	normalizeSiteUrl(process.env.VERCEL_URL) ??
	new URL('https://afeelcompany.com');

export function toAbsoluteUrl(path = '/') {
	return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
	title,
	description,
	path,
	keywords = [],
}: {
	title: string;
	description: string;
	path: string;
	keywords?: string[];
}): Metadata {
	const canonicalPath = path.startsWith('/') ? path : `/${path}`;
	const mergedKeywords = Array.from(new Set([...DEFAULT_SITE_KEYWORDS, ...keywords]));

	return {
		title,
		description,
		keywords: mergedKeywords,
		alternates: {
			canonical: canonicalPath,
		},
		openGraph: {
			title,
			description,
			url: canonicalPath,
			siteName: SITE_NAME,
			locale: 'ko_KR',
			type: 'website',
			images: [
				{
					url: DEFAULT_OG_IMAGE,
					width: 1500,
					height: 1125,
					alt: `${SITE_NAME} 대표 이미지`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [DEFAULT_OG_IMAGE],
		},
	};
}

export function createNoIndexMetadata(title?: string): Metadata {
	return {
		title,
		robots: {
			index: false,
			follow: false,
			googleBot: {
				index: false,
				follow: false,
				noimageindex: true,
			},
		},
	};
}

export const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: SITE_NAME,
	url: toAbsoluteUrl('/'),
	logo: toAbsoluteUrl('/images/logo.svg'),
	sameAs: [INSTAGRAM_PROFILE_URL],
};

export const websiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_NAME,
	url: toAbsoluteUrl('/'),
	inLanguage: 'ko-KR',
};
