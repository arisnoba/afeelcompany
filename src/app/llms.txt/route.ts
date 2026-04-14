import { toAbsoluteUrl } from '@/lib/seo';

const llmsText = [
	'# AFEEL Company',
	'',
	'> AFEEL Company official website for company introduction, portfolio, and contact.',
	'',
	'## Public Pages',
	`- Home: ${toAbsoluteUrl('/')}`,
	`- About: ${toAbsoluteUrl('/about')}`,
	`- Portfolio: ${toAbsoluteUrl('/portfolio')}`,
	`- Contact: ${toAbsoluteUrl('/contact')}`,
	'',
	'## Notes',
	'- /feed is temporarily disabled and should not be indexed or treated as public content.',
	'- Admin, API, and PDF export routes are not public content.',
].join('\n');

export function GET() {
	return new Response(llmsText, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
