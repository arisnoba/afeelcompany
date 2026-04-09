import type { Metadata } from 'next';

import { ClientLogoMarquee } from '@/components/site/ClientLogoMarquee';
import { PortfolioPreviewGrid } from '@/components/site/PortfolioPreviewGrid';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { ShaderGodrays } from '@/components/ui/shader-godrays';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { createPageMetadata } from '@/lib/seo';
import { getFeaturedPortfolio, getSiteClientBrands, getSiteCompanyProfile } from '@/lib/site';

const FALLBACK_ABOUT = '브랜드와 셀럽의 접점을 설계하고, 한 번 정리한 포트폴리오를 웹과 소개서, 소셜까지 이어 붙이는 패션 PR 스튜디오입니다.';

export const metadata: Metadata = createPageMetadata({
	title: '패션 PR 에이전시와 셀럽 협업 포트폴리오',
	description: '브랜드와 셀럽을 연결하는 패션 PR 에이전시 AFEEL Company의 대표 포트폴리오와 협업 브랜드를 확인할 수 있습니다.',
	path: '/',
	keywords: ['패션 PR 에이전시', '셀럽 협업', '브랜드 포트폴리오'],
});

export default async function HomePage() {
	const [profile, featuredItems, clientBrands] = await Promise.all([getSiteCompanyProfile(), getFeaturedPortfolio(6), getSiteClientBrands()]);

	const heroBody = profile.aboutText || FALLBACK_ABOUT;
	const clientLogoBrands = getBrandsWithLogos(clientBrands);

	return (
		<>
			<section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden bg-stone-900/8 pb-16 pt-36 sm:pb-24 sm:pt-40 lg:pb-32 lg:pt-44">
				<ShaderGodrays className="opacity-90 [mask-image:radial-gradient(120%_90%_at_50%_4%,black_0%,black_48%,transparent_100%)]" />
				<div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(117,90,62,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
				<div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
				<div className="absolute inset-x-[18%] top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,251,245,0.88),transparent_72%)] blur-2xl" />

				<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
					<div className="relative z-10 grid gap-20 py-10 sm:py-14 lg:py-16">
						<div className="flex items-center gap-4">
							<span className="h-px w-14 bg-[#715a3e]" />
							<span className="text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-[#715a3e]"> Fashion PR Agency</span>
						</div>

						<div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.42fr)] lg:items-end">
							<AnimatedPageTitle
								lines={[{ text: 'The Architect of' }, { text: 'Spotlight.' }]}
								className="max-w-5xl text-[clamp(3.4rem,9vw,7.8rem)] font-light leading-[0.93] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)]"
							/>

							<div className="grid gap-8 md:grid-cols-12 md:items-end">
								<div className="grid gap-6 md:col-span-12">
									<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">{heroBody}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="grid gap-24 py-6 sm:gap-28 sm:py-8 lg:gap-32 lg:py-40">
				<section className="grid gap-12">
					<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div>
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-stone-400">Selected Portfolio</p>
							<AnimatedPageTitle
								as="h2"
								lines={[{ text: 'The work speaks for itself.' }]}
								delay={0.04}
								duration={0.42}
								className="mt-4 text-4xl tracking-[-0.06em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl md:text-6xl"
							/>
						</div>
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-stone-400">Selected Campaigns</p>
					</div>

					{featuredItems.length === 0 ? (
						<div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">표시할 포트폴리오가 아직 없습니다.</div>
					) : (
						<PortfolioPreviewGrid items={featuredItems} gridClassName="xl:grid-cols-4" />
					)}
				</section>

				<section className="grid gap-12 border-t border-stone-900/8 pt-20">
					<div className="grid justify-items-center gap-4 text-center">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-stone-400">Social Proof</p>
						<AnimatedPageTitle
							as="h2"
							lines={[{ text: 'Collaborated Brands' }]}
							delay={0.04}
							duration={0.42}
							className="text-4xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
						/>
					</div>

					<ClientLogoMarquee
						brands={clientLogoBrands}
						className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
						trackClassName="home-marquee-track flex min-w-max items-center gap-16 whitespace-nowrap py-4"
						logoClassName="relative h-12 w-36 shrink-0 opacity-70 transition hover:opacity-100"
						imageClassName="object-contain grayscale"
					/>
				</section>

				{/* <section className="grid justify-items-center gap-8 py-6 text-center sm:py-10">
					<h2 className="text-5xl italic tracking-[-0.06em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl">Inquire</h2>
					<p className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg">브랜드 협업, 포트폴리오 제안, PR 운영 문의는 아래 링크로 바로 연결할 수 있습니다.</p>
					<Link
						href="/contact"
						className="inline-flex h-12 items-center justify-center bg-stone-950 px-8 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-stone-800">
						Get In Touch
					</Link>
				</section> */}
			</div>
		</>
	);
}
