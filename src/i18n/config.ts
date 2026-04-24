export const LOCALES = ['ko', 'en', 'zh'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

export const LOCALE_LABELS: Record<Locale, string> = {
	ko: 'KR',
	en: 'EN',
	zh: 'CN',
};

export const LOCALE_LANG_TAGS: Record<Locale, string> = {
	ko: 'ko',
	en: 'en',
	zh: 'zh-Hans',
};

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
	ko: 'ko_KR',
	en: 'en_US',
	zh: 'zh_CN',
};

export function isLocale(value: string): value is Locale {
	return LOCALES.includes(value as Locale);
}

export function getLocalizedPath(locale: Locale, path: string) {
	const normalizedPath = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;

	if (locale === DEFAULT_LOCALE) {
		return normalizedPath;
	}

	return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export function stripLocaleFromPathname(pathname: string) {
	const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

	for (const locale of LOCALES) {
		if (locale === DEFAULT_LOCALE) {
			continue;
		}

		if (normalizedPath === `/${locale}`) {
			return '/';
		}

		if (normalizedPath.startsWith(`/${locale}/`)) {
			return normalizedPath.slice(locale.length + 1);
		}
	}

	return normalizedPath;
}

export function getPathnameLocale(pathname: string): Locale {
	const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

	for (const locale of LOCALES) {
		if (locale === DEFAULT_LOCALE) {
			continue;
		}

		if (normalizedPath === `/${locale}` || normalizedPath.startsWith(`/${locale}/`)) {
			return locale;
		}
	}

	return DEFAULT_LOCALE;
}
