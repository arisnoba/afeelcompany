import { InstagramFeedGrid } from '@/components/site/InstagramFeedGrid'
import { getCachedFeed } from '@/lib/instagram'

export default async function FeedPage() {
  const posts = await getCachedFeed()
  const lastSync = posts[0]?.fetched_at ?? null

  return (
    <div className="grid gap-8 py-8 sm:gap-10 sm:py-10 lg:gap-14 lg:py-14">
      <section className="grid gap-6 rounded-[2rem] border border-stone-900/10 bg-stone-950 px-6 py-8 text-stone-50 shadow-[0_30px_90px_rgba(26,18,10,0.18)] sm:px-8 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.36em] text-stone-400">
            Feed
          </p>
          <h1 className="mt-4 text-4xl tracking-[-0.05em] text-white sm:text-5xl">
            FEED
          </h1>
        </div>

        <div className="grid gap-3 text-sm leading-7 text-stone-300 sm:text-base">
          {lastSync ? (
            <p>마지막 동기화: {new Date(lastSync).toLocaleString('ko-KR')}</p>
          ) : (
            <p>캐시된 인스타그램 데이터가 아직 없습니다.</p>
          )}
          <p>
            방문자 페이지에서는 관리자 화면에서 동기화된 캐시만 노출합니다. 실시간 API 호출은 하지 않습니다.
          </p>
        </div>
      </section>

      <InstagramFeedGrid posts={posts} />
    </div>
  )
}
