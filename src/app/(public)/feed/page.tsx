import type { Metadata } from 'next';

import { InstagramFeedGrid } from '@/components/site/InstagramFeedGrid';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { getDisplayFeed } from '@/lib/instagram';
import { createPageMetadata } from '@/lib/seo';
import { INSTAGRAM_PROFILE_URL } from '@/lib/site';

export const metadata: Metadata = createPageMetadata({
	title: '인스타그램 아카이브',
	description: 'AFEEL Company가 큐레이션한 스타일링 현장과 브랜드 비주얼 아카이브를 인스타그램 피드 형식으로 확인할 수 있습니다.',
	path: '/feed',
	keywords: ['인스타그램 아카이브', '스타일링 아카이브', '패션 비주얼'],
});

export default async function FeedPage() {
	const posts = await getDisplayFeed();

	return (
		<div className="grid gap-16 py-10 sm:gap-20 sm:py-14 lg:gap-24 lg:py-20">
			<section className="grid gap-8 border-b border-stone-900/10 pb-12 md:grid-cols-[minmax(0,1.3fr)_auto] md:items-end md:gap-12 md:pb-16">
				<div className="grid gap-8">
					<p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#5f7b6b]">Social Archive</p>
					<div className="grid gap-4">
						<AnimatedPageTitle
							lines={[{ text: '@a_feel_company' }]}
							className="text-5xl font-light leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]"
						/>
						{/* <p className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg">큐레이션된 비주얼 내러티브와 스타일링 현장의 무드를 아카이브로 정리합니다.</p> */}
					</div>
				</div>

				<div className="grid gap-5 md:justify-items-end">
					<a
						href={INSTAGRAM_PROFILE_URL}
						target="_blank"
						rel="noreferrer"
						className="inline-flex min-h-14 items-center justify-center bg-[#274133] px-8 text-sm font-semibold uppercase tracking-[0.28em] text-[#ccead6] transition hover:bg-[#324c3e]">
						Follow Us
					</a>
					<div className="grid gap-2 text-sm leading-7 text-stone-500 md:max-w-xs md:text-right">
						{/* <p>{lastSync ? `마지막 동기화: ${formatLastSync(lastSync)}` : '캐시된 인스타그램 데이터가 아직 없습니다.'}</p> */}
						<p>큐레이션된 비주얼 내러티브와 스타일링 현장의 무드를 아카이브로 정리합니다.</p>
					</div>
				</div>
			</section>

			<InstagramFeedGrid posts={posts} />

			<div className="flex justify-center">
				<a
					href={INSTAGRAM_PROFILE_URL}
					target="_blank"
					rel="noreferrer"
					className="group inline-flex items-center gap-4 border-b border-stone-300/70 px-2 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-stone-900 transition hover:border-stone-950">
					Explore More Archive
					<span aria-hidden="true" className="text-sm transition group-hover:translate-x-1">
						↗
					</span>
				</a>
			</div>
		</div>
	);
}
