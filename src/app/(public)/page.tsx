import Image from 'next/image';
import Link from 'next/link';

import { ClientLogoMarquee } from '@/components/site/ClientLogoMarquee';
import { ShaderGodrays } from '@/components/ui/shader-godrays';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { getFeaturedPortfolio, getSiteClientBrands, getSiteCompanyProfile } from '@/lib/site';
import { formatPortfolioCategories } from '@/types/portfolio';

const FALLBACK_ABOUT = '브랜드와 셀럽의 접점을 설계하고, 한 번 정리한 포트폴리오를 웹과 소개서, 소셜까지 이어 붙이는 패션 PR 스튜디오입니다.';

export default async function HomePage() {
	const [profile, featuredItems, clientBrands] = await Promise.all([getSiteCompanyProfile(), getFeaturedPortfolio(6), getSiteClientBrands()]);

	const heroBody = profile.aboutText || FALLBACK_ABOUT;
	const clientLogoBrands = getBrandsWithLogos(clientBrands);

	return (
		<>
			<section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden bg-stone-900/8 py-16 sm:py-20 lg:py-24">
				<ShaderGodrays className="opacity-90 [mask-image:radial-gradient(120%_90%_at_50%_4%,black_0%,black_48%,transparent_100%)]" />
				<div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(117,90,62,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
				<div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
				<div className="absolute inset-x-[18%] top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,251,245,0.88),transparent_72%)] blur-2xl" />

				<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
					<div className="relative z-10 grid gap-12 px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
						<div className="flex items-center gap-4">
							<span className="h-px w-14 bg-[#715a3e]" />
							<span className="text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-[#715a3e]"> Fashion PR Agency</span>
						</div>

						<div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.42fr)] lg:items-end">
							<div className="grid gap-8">
								<h1 className="max-w-5xl text-[clamp(3.4rem,9vw,7.8rem)] font-light leading-[0.93] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)]">
									The Architect of <span className="italic">Spotlight</span>.
								</h1>

								<div className="grid gap-8 md:grid-cols-12 md:items-end">
									<div className="grid gap-6 md:col-span-12">
										<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">{heroBody}</p>

										<div className="flex flex-wrap items-center gap-6">
											<Link
												href="/contact"
												className="group inline-flex items-center gap-4 border-b border-stone-950 pb-2 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-stone-950 transition hover:border-[#715a3e] hover:text-[#715a3e]">
												Inquire Now
												<span aria-hidden="true" className="text-base transition-transform group-hover:translate-x-1.5">
													→
												</span>
											</Link>
											<Link href="/portfolio" className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-stone-500 transition hover:text-stone-950">
												Latest Portfolio
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="grid gap-24 py-6 sm:gap-28 sm:py-8 lg:gap-32 lg:py-10">
				<section className="grid gap-12">
					<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div>
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-stone-400">Latest Work</p>
							<h2 className="mt-4 text-4xl tracking-[-0.06em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl md:text-6xl">
								수많은 스타. 수많은 브랜드.
								<br /> 그 사이를 잇는 단 하나의 안목.
							</h2>
						</div>
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-stone-400">Selected Campaigns</p>
					</div>

					{featuredItems.length === 0 ? (
						<div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">표시할 포트폴리오가 아직 없습니다.</div>
					) : (
						<div className="grid gap-px overflow-hidden bg-stone-900/8 md:grid-cols-2 xl:grid-cols-3">
							{featuredItems.map(item => (
								<article key={item.id} className="group relative aspect-square overflow-hidden bg-stone-200">
									<Image
										src={item.imageUrl}
										alt={item.title}
										fill
										className="object-cover grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
										sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
									/>
									{item.hoverImageUrl ? (
										<Image
											src={item.hoverImageUrl}
											alt={`${item.title} hover`}
											fill
											className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
											sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
										/>
									) : null}
									<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.64))]" />
									<div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
										<Link href="/portfolio" className="border border-white/40 bg-black/45 px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm">
											View Portfolio
										</Link>
									</div>
									<div className="absolute inset-x-0 bottom-0 grid gap-2 px-5 py-5 text-white sm:px-6">
										<p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/72">{formatPortfolioCategories(item.category)}</p>
										<p className="text-xl tracking-[-0.04em] [font-family:var(--font-newsreader)]">{item.title}</p>
										<p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/70">{item.brandName}</p>
									</div>
								</article>
							))}
						</div>
					)}
				</section>

				<section className="grid gap-12 border-t border-stone-900/8 pt-20">
					<div className="grid justify-items-center gap-4 text-center">
						<h2 className="text-4xl italic tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">Clients</h2>
						<div className="h-px w-12 bg-[#715a3e]/40" />
					</div>

					<ClientLogoMarquee
						brands={clientLogoBrands}
						className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
						trackClassName="home-marquee-track flex min-w-max items-center gap-16 whitespace-nowrap py-4"
						logoClassName="relative h-12 w-36 shrink-0 opacity-70 transition hover:opacity-100"
						imageClassName="object-contain grayscale"
					/>
				</section>

				<section className="grid justify-items-center gap-8 py-6 text-center sm:py-10">
					<h2 className="text-5xl italic tracking-[-0.06em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl">Inquire</h2>
					<p className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg">브랜드 협업, 포트폴리오 제안, PR 운영 문의는 아래 링크로 바로 연결할 수 있습니다.</p>
					<Link
						href="/contact"
						className="inline-flex h-12 items-center justify-center bg-stone-950 px-8 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-stone-800">
						Get In Touch
					</Link>
				</section>
			</div>
		</>
	);
}
