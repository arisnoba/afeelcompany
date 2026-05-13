import type { MetadataRoute } from 'next';

import { LOCALES, type Locale, getLocalizedPath } from '@/i18n/config';
import { toAbsoluteUrl } from '@/lib/seo';

const PUBLIC_ROUTES: Array<{
	path: string;
	changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
	priority: number;
	locales?: Locale[];
}> = [
	{ path: '/', changeFrequency: 'weekly', priority: 1 },
	{ path: '/about', changeFrequency: 'monthly', priority: 0.8 },
	{ path: '/partner', changeFrequency: 'weekly', priority: 0.85 },
	{ path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
	{ path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
	{ path: '/kpop-celebrity-placement', changeFrequency: 'monthly', priority: 0.72, locales: ['zh'] },
];

export default function sitemap(): MetadataRoute.Sitemap {
	return PUBLIC_ROUTES.flatMap(route =>
		(route.locales ?? LOCALES).map(locale => ({
			url: toAbsoluteUrl(getLocalizedPath(locale, route.path)),
			changeFrequency: route.changeFrequency,
			priority: route.priority,
		})),
	);
}
