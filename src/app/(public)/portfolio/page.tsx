import type { Metadata } from 'next';

import { PortfolioGalleryClient } from '@/components/site/PortfolioGalleryClient';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { createPageMetadata } from '@/lib/seo';
import { getPublicPortfolioItems } from '@/lib/site';

export const metadata: Metadata = createPageMetadata({
	title: '포트폴리오',
	description: '셀럽 스타일링과 브랜드 협업 중심의 AFEEL Company 포트폴리오를 한눈에 확인할 수 있습니다.',
	path: '/portfolio',
	keywords: ['포트폴리오', '스타일링 포트폴리오', '브랜드 협업 사례'],
});

export default async function PortfolioPage() {
	const items = await getPublicPortfolioItems();

	return (
		<div className="grid gap-14 py-12 sm:gap-16 sm:py-16 lg:gap-20 lg:py-20">
			<section className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
				<div className="max-w-3xl">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Archives</p>
					<AnimatedPageTitle
						lines={[{ text: 'Select work.' }, { text: 'Made together.' }]}
						className="mt-5 text-5xl font-light leading-none tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl"
					/>
				</div>
			</section>

			<PortfolioGalleryClient items={items} />
		</div>
	);
}
