import type { Metadata } from 'next';

import { BrandLogoGrid } from '@/components/site/BrandLogoGrid';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { createPageMetadata } from '@/lib/seo';
import { getSiteClientBrands } from '@/lib/site';

export const metadata: Metadata = createPageMetadata({
	title: '파트너',
	description: '함께한 브랜드 파트너를 소개합니다.',
	path: '/partner',
	keywords: ['브랜드 파트너', '협업 브랜드'],
});

export default async function PartnerPage() {
	const brands = getBrandsWithLogos(await getSiteClientBrands());

	return (
		<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
			<div className="grid gap-14 py-12 sm:gap-16 sm:py-16 lg:gap-20 lg:py-20">
				<section className="block space-y-6">
					<div>
						{/* <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Partner Archive</p> */}
						<AnimatedPageTitle
							lines={[{ text: 'Brands' }, { text: 'we worked with.' }]}
							className="mt-5 text-5xl font-light leading-none tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl"
						/>
					</div>

					<p className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">가장 좋은 신뢰 신호는 함께 일하고 있는 얼굴입니다.</p>
				</section>

				<section className="grid gap-6 p-6 sm:p-8 lg:p-10 bg-white">
					{/* <div className="flex items-center justify-between gap-3">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-stone-400">Active Partners</p>
						<span className="text-sm text-muted-foreground">{brands.length}개</span>
					</div> */}

					<BrandLogoGrid brands={brands} />
				</section>
			</div>
		</div>
	);
}
