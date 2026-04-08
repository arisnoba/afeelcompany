import { PortfolioGalleryClient } from '@/components/site/PortfolioGalleryClient';
import { getPublicPortfolioItems } from '@/lib/site';

export default async function PortfolioPage() {
	const items = await getPublicPortfolioItems();

	return (
		<div className="grid gap-14 py-12 sm:gap-16 sm:py-16 lg:gap-20 lg:py-20">
			<section className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
				<div className="max-w-3xl">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Archives</p>
					<h1 className="mt-5 text-5xl font-light leading-none tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl">
						Select work.
						<br />
						Made together.
					</h1>
				</div>
			</section>

			<PortfolioGalleryClient items={items} />
		</div>
	);
}
