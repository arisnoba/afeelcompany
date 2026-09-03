import type { MetadataRoute } from 'next';

import { toAbsoluteUrl } from '@/lib/seo';

const AI_CRAWLERS = [
	'OAI-SearchBot',
	'GPTBot',
	'ChatGPT-User',
	'Claude-SearchBot',
	'Claude-User',
	'ClaudeBot',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Baiduspider',
	'Bytespider',
	'PetalBot',
];

const NON_PUBLIC_PATHS = ['/admin', '/api', '/pdf-export'];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: AI_CRAWLERS,
				allow: '/',
				disallow: NON_PUBLIC_PATHS,
			},
			{
				userAgent: '*',
				allow: '/',
				disallow: NON_PUBLIC_PATHS,
			},
		],
		sitemap: toAbsoluteUrl('/sitemap.xml'),
	};
}
