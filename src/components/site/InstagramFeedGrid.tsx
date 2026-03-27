import Image from 'next/image'

import type { CachedPost } from '@/types/instagram'

interface InstagramFeedGridProps {
  posts: CachedPost[]
}

export function InstagramFeedGrid({ posts }: InstagramFeedGridProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/72 px-6 py-16 text-center text-sm text-stone-500 shadow-[0_22px_60px_rgba(56,36,19,0.08)] backdrop-blur-sm">
        동기화된 인스타그램 피드가 아직 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => {
        const isVideo = post.media_url.includes('.mp4')

        return (
          <article
            key={post.post_id}
            className="overflow-hidden rounded-[1.75rem] border border-stone-900/8 bg-white/72 shadow-[0_18px_48px_rgba(56,36,19,0.06)] backdrop-blur-sm"
          >
            <div className="relative aspect-square bg-stone-200">
              {isVideo ? (
                <div className="grid h-full w-full place-items-center bg-stone-950 text-sm uppercase tracking-[0.34em] text-stone-50">
                  VIDEO
                </div>
              ) : (
                <Image
                  src={post.media_url}
                  alt={post.caption ?? 'Instagram post'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              )}
            </div>

            <div className="grid gap-3 px-5 py-5">
              <p className="text-sm leading-7 text-stone-700">
                {post.caption || '캡션이 없는 게시물입니다.'}
              </p>
              {post.permalink ? (
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-950"
                >
                  Instagram에서 보기
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
