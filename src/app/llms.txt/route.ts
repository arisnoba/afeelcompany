import { toAbsoluteUrl } from '@/lib/seo';
import { INSTAGRAM_PROFILE_URL, NAVER_BLOG_URL } from '@/lib/site';

export const dynamic = 'force-static';

const llmsText = [
	'# AFEEL COMPANY',
	'',
	'> AFEEL COMPANY is a fashion PR agency connecting fashion brands with celebrities through styling sponsorship, media exposure, and collaboration archives.',
	'',
	'## Content Scope',
	'- AFEEL COMPANY is a Seoul-based fashion PR agency.',
	'- Public site languages: Korean, English, and Simplified Chinese.',
	'- Service workflow: brand analysis, artist matching, placement execution, public exposure tracking, and post-campaign reporting.',
	'- Excluded: /feed is temporarily disabled; admin, API, upload, and PDF export routes are not public content.',
	'',
	'## Docs',
	`- [Home](${toAbsoluteUrl('/')}): Introduces AFEEL COMPANY as a fashion PR agency for celebrity styling sponsorship and brand exposure.`,
	`- [About](${toAbsoluteUrl('/about')}): Explains the agency process, including strategy, artist matching, execution, exposure tracking, and reporting.`,
	`- [Portfolio](${toAbsoluteUrl('/portfolio')}): Shows celebrity styling placements, brand collaboration cases, and media exposure records by category.`,
	`- [Partner](${toAbsoluteUrl('/partner')}): Lists fashion brand partners and client logos associated with AFEEL COMPANY collaborations.`,
	`- [Contact](${toAbsoluteUrl('/contact')}): Provides the collaboration inquiry form, office address, phone number, and email contact path.`,
	'',
	'## Localized Resources',
	`- [English Home](${toAbsoluteUrl('/en')}): English introduction to AFEEL COMPANY's fashion PR, styling sponsorship, and collaboration work.`,
	`- [English About](${toAbsoluteUrl('/en/about')}): English overview of the agency workflow, service areas, and collaboration strengths.`,
	`- [English Portfolio](${toAbsoluteUrl('/en/portfolio')}): English access to public celebrity styling and fashion brand collaboration examples.`,
	'',
	'## China Brand Resources',
	`- [Chinese Home](${toAbsoluteUrl('/zh')}): Simplified Chinese introduction for brands exploring Korean celebrity placement and fashion PR.`,
	`- [Chinese About](${toAbsoluteUrl('/zh/about')}): Simplified Chinese overview of the agency, service scope, workflow, and frequently asked questions.`,
	`- [Chinese Portfolio](${toAbsoluteUrl('/zh/portfolio')}): Public collaboration archive available in Simplified Chinese.`,
	`- [Chinese Contact](${toAbsoluteUrl('/zh/contact')}): Simplified Chinese collaboration inquiry path.`,
	`- [Chinese K-pop Celebrity Placement](${toAbsoluteUrl('/zh/kpop-celebrity-placement')}): Explains Korean local execution for Chinese fashion brands exploring K-pop celebrity styling collaboration.`,
	'',
	'## Official Channels',
	`- [Instagram](${INSTAGRAM_PROFILE_URL}): Official Instagram profile for current styling placements, brand exposure examples, and visual collaboration updates.`,
	`- [Naver Blog](${NAVER_BLOG_URL}): Official Naver blog for additional company updates and Korean-language brand communication.`,
	`- [Contact](${toAbsoluteUrl('/contact')}): Official website inquiry form and company contact details.`,
	'',
].join('\n');

export function GET() {
	return new Response(llmsText, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
