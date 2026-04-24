import type { Metadata } from 'next';

import { DEFAULT_LOCALE, LOCALES, OPEN_GRAPH_LOCALES, type Locale, getLocalizedPath } from '@/i18n/config';
import { INSTAGRAM_PROFILE_URL } from '@/lib/site';

export const SITE_NAME = 'AFEEL COMPANY';
export const SITE_TITLE_SUFFIX = 'AFEEL COMPANY';
export const DEFAULT_SITE_DESCRIPTION = '브랜드와 셀럽을 잇는 순간을 설계합니다.';
export const DEFAULT_SITE_KEYWORDS = ['AFEEL Company', '어필컴퍼니', '패션 PR', '셀럽 협찬', '스타 마케팅', '스타일링 포트폴리오'];
export const DEFAULT_OG_IMAGE = '/images/og.png';

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

function buildLanguageAlternates(path: string) {
	return {
		...Object.fromEntries(LOCALES.map(locale => [locale, getLocalizedPath(locale, path)])),
		'x-default': getLocalizedPath(DEFAULT_LOCALE, path),
	};
}

export function createPageMetadata({
	title,
	description,
	path,
	keywords = [],
	locale = DEFAULT_LOCALE,
}: {
	title: string;
	description: string;
	path: string;
	keywords?: string[];
	locale?: Locale;
}): Metadata {
	const canonicalPath = path.startsWith('/') ? path : `/${path}`;
	const mergedKeywords = Array.from(new Set([...DEFAULT_SITE_KEYWORDS, ...keywords]));
	const localizedPath = getLocalizedPath(locale, canonicalPath);

	return {
		title,
		description,
		keywords: mergedKeywords,
		alternates: {
			canonical: localizedPath,
			languages: buildLanguageAlternates(canonicalPath),
		},
		openGraph: {
			title,
			description,
			url: localizedPath,
			siteName: SITE_NAME,
			locale: OPEN_GRAPH_LOCALES[locale],
			type: 'website',
			images: [
				{
					url: DEFAULT_OG_IMAGE,
					width: 1200,
					height: 630,
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
