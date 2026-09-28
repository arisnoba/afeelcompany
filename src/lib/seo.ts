import type { Metadata } from 'next';

import { DEFAULT_LOCALE, LOCALES, LOCALE_LANG_TAGS, OPEN_GRAPH_LOCALES, type Locale, getLocalizedPath } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import { INSTAGRAM_PROFILE_URL, NAVER_BLOG_URL } from '@/lib/site';

export const SITE_NAME = 'AFEEL COMPANY';
export const SITE_KOREAN_NAME = '어필컴퍼니';
export const SITE_TITLE_SUFFIX = `${SITE_KOREAN_NAME} ${SITE_NAME}`;
export const DEFAULT_SITE_DESCRIPTION = getSiteDictionary(DEFAULT_LOCALE).home.metadata.description;
export const DEFAULT_SITE_KEYWORDS = [SITE_NAME, 'afeelcompany', SITE_KOREAN_NAME, '패션 PR', '셀럽 협찬', '스타 마케팅', '스타일링 포트폴리오'];
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
		...Object.fromEntries(LOCALES.map(locale => [LOCALE_LANG_TAGS[locale], getLocalizedPath(locale, path)])),
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
	const siteName = locale === DEFAULT_LOCALE ? SITE_TITLE_SUFFIX : `${SITE_NAME} (${SITE_KOREAN_NAME})`;
	const pageTitle = canonicalPath === '/' ? title : `${title} | ${siteName}`;

	return {
		title: { absolute: pageTitle },
		description,
		keywords: mergedKeywords,
		alternates: {
			canonical: localizedPath,
			languages: buildLanguageAlternates(canonicalPath),
		},
		openGraph: {
			title: pageTitle,
			description,
			url: localizedPath,
			siteName,
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
			title: pageTitle,
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

export const ORGANIZATION_ID = `${toAbsoluteUrl('/')}#organization`;
export const WEBSITE_ID = `${toAbsoluteUrl('/')}#website`;

export const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': ORGANIZATION_ID,
	name: SITE_NAME,
	alternateName: [SITE_KOREAN_NAME, 'AFEELCOMPANY', 'afeelcompany'],
	url: toAbsoluteUrl('/'),
	logo: toAbsoluteUrl('/images/logo.svg'),
	description: DEFAULT_SITE_DESCRIPTION,
	sameAs: [INSTAGRAM_PROFILE_URL, NAVER_BLOG_URL],
	areaServed: [
		{ '@type': 'Country', name: 'South Korea' },
		{ '@type': 'Country', name: 'China' },
	],
	knowsAbout: ['Fashion public relations', 'Celebrity styling placement', 'Brand positioning', 'Media exposure tracking', 'Collaboration archive management'],
};

export const websiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	name: SITE_NAME,
	alternateName: [SITE_KOREAN_NAME, 'AFEELCOMPANY', 'afeelcompany'],
	url: toAbsoluteUrl('/'),
	inLanguage: Object.values(LOCALE_LANG_TAGS),
	publisher: {
		'@id': ORGANIZATION_ID,
	},
};
