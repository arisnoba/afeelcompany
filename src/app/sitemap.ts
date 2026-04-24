import type { MetadataRoute } from 'next';

import { DEFAULT_LOCALE, LOCALES, LOCALE_LANG_TAGS, getLocalizedPath } from '@/i18n/config';
import { toAbsoluteUrl } from '@/lib/seo';

const PUBLIC_ROUTES: Array<{
	path: string;
	changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
	priority: number;
}> = [
	{ path: '/', changeFrequency: 'weekly', priority: 1 },
	{ path: '/about', changeFrequency: 'monthly', priority: 0.8 },
	{ path: '/partner', changeFrequency: 'weekly', priority: 0.85 },
	{ path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
	{ path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
	return PUBLIC_ROUTES.map(route => ({
		url: toAbsoluteUrl(getLocalizedPath(DEFAULT_LOCALE, route.path)),
		changeFrequency: route.changeFrequency,
		priority: route.priority,
		alternates: {
			languages: {
				...Object.fromEntries(LOCALES.map(locale => [LOCALE_LANG_TAGS[locale], toAbsoluteUrl(getLocalizedPath(locale, route.path))])),
				'x-default': toAbsoluteUrl(getLocalizedPath(DEFAULT_LOCALE, route.path)),
			},
		},
	}));
}
