import type { MetadataRoute } from 'next';

import { toAbsoluteUrl } from '@/lib/seo';

const PUBLIC_ROUTES: Array<{
	path: string;
	changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
	priority: number;
}> = [
	{ path: '/', changeFrequency: 'weekly', priority: 1 },
	{ path: '/about', changeFrequency: 'monthly', priority: 0.8 },
	{ path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
	{ path: '/feed', changeFrequency: 'daily', priority: 0.7 },
	{ path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
	return PUBLIC_ROUTES.map(route => ({
		url: toAbsoluteUrl(route.path),
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}));
}
