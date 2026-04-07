import { InstagramFeedGrid } from '@/components/site/InstagramFeedGrid';
import { getDisplayFeed } from '@/lib/instagram';
import { INSTAGRAM_PROFILE_URL } from '@/lib/site';

function formatLastSync(value: string | null) {
	if (!value) {
		return null;
	}

	return new Intl.DateTimeFormat('ko-KR', {
		dateStyle: 'long',
		timeStyle: 'short',
	}).format(new Date(value));
}

export default async function FeedPage() {
	const posts = await getDisplayFeed();
	const lastSync = posts[0]?.fetched_at ?? null;

	return (
		<div className="grid gap-16 py-10 sm:gap-20 sm:py-14 lg:gap-24 lg:py-20">
			<section className="grid gap-8 border-b border-stone-900/10 pb-12 md:grid-cols-[minmax(0,1.3fr)_auto] md:items-end md:gap-12 md:pb-16">
				<div className="grid gap-8">
					<p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#5f7b6b]">Social Archive</p>
					<div className="grid gap-4">
						<h1 className="text-5xl font-light leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]">@a_feel_company</h1>
						{/* <p className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              큐레이션된 비주얼 내러티브와 스타일링 현장의 무드를, 캐시된 인스타그램
              아카이브로 차분하게 정리해 보여줍니다.
            </p> */}
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
						<p>{lastSync ? `마지막 동기화: ${formatLastSync(lastSync)}` : '캐시된 인스타그램 데이터가 아직 없습니다.'}</p>
						{/* <p>
              방문자 페이지는 관리자 화면에서 동기화한 인스타그램 캐시만 노출하며,
              페이지 진입 시 실시간 API 호출은 하지 않습니다.
            </p> */}
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
