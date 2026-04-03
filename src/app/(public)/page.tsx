import Link from 'next/link';

import { PortfolioPreviewGrid } from '@/components/site/PortfolioPreviewGrid';
import { getFeaturedPortfolio, getSiteCompanyProfile } from '@/lib/site';

const FALLBACK_ABOUT = '브랜드와 셀럽의 접점을 설계하고, 한 번 정리한 포트폴리오를 웹과 소개서, 소셜까지 이어 붙이는 패션 PR 스튜디오입니다.';

export default async function HomePage() {
	const [profile, featuredItems] = await Promise.all([getSiteCompanyProfile(), getFeaturedPortfolio(6)]);

	const heroBody = profile.aboutText || FALLBACK_ABOUT;

	return (
		<div className="grid gap-8 py-8 sm:gap-10 sm:py-10 lg:gap-14 lg:py-14">
			<section className="overflow-hidden rounded-[2rem] border border-stone-900/10 bg-stone-950 px-6 py-8 text-stone-50 shadow-[0_32px_120px_rgba(26,18,10,0.18)] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_280px] lg:items-end">
					<div className="grid gap-6">
						<p className="text-xs uppercase tracking-[0.42em] text-stone-300">Fashion PR Agency</p>
						<div className="grid gap-4">
							<h1 className="max-w-4xl text-[clamp(3rem,9vw,7rem)] leading-[0.92] tracking-[-0.05em]">AFEEL Company</h1>
							<p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">패션 스타마케팅 포트폴리오를 가장 선명하게 전달하는 공개 아카이브.</p>
						</div>
						<p className="max-w-3xl text-sm leading-7 text-stone-200/88 sm:text-base">{heroBody}</p>
					</div>

					<div className="grid gap-4 rounded-[1.75rem] border border-white/12 bg-white/6 p-5 text-sm text-stone-200 backdrop-blur-sm">
						<div>
							<p className="text-[0.7rem] uppercase tracking-[0.35em] text-stone-400">Highlights</p>
							<p className="mt-2 text-3xl tracking-[-0.05em] text-white">{featuredItems.length.toString().padStart(2, '0')}</p>
						</div>
						<p className="leading-6 text-stone-300">최신 스타일링 사례와 브랜드 협업 결과를 압축해서 먼저 보여줍니다.</p>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Link href="/portfolio" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-stone-950 transition hover:bg-stone-200">
								PORTFOLIO 보기
							</Link>
							<Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full border border-white/18 px-5 text-sm font-medium text-white transition hover:bg-white/8">
								CONTACT
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="grid gap-5 rounded-[2rem] border border-stone-900/8 bg-white/70 px-6 py-7 shadow-[0_22px_60px_rgba(56,36,19,0.08)] backdrop-blur-sm sm:px-8 sm:py-8">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.36em] text-stone-500">Home Edit</p>
						<h2 className="mt-3 text-3xl tracking-[-0.05em] text-stone-950 sm:text-4xl">최신 포트폴리오</h2>
					</div>
					<Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 transition hover:text-stone-950">
						전체 작업 보기
						<span aria-hidden="true">→</span>
					</Link>
				</div>

				<PortfolioPreviewGrid items={featuredItems} />
			</section>
		</div>
	);
}
