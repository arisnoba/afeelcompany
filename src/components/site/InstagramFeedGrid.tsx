import Image from 'next/image'

import type { CachedPost } from '@/types/instagram'

interface InstagramFeedGridProps {
  posts: CachedPost[]
}

function getCaptionPreview(caption: string | null) {
  if (!caption) {
    return 'Instagram archive'
  }

  const normalized = caption.replace(/\s+/g, ' ').trim()

  if (normalized.length <= 84) {
    return normalized
  }

  return `${normalized.slice(0, 81)}...`
}

function formatPostDate(value: string | null) {
  if (!value) {
    return 'ARCHIVED'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export function InstagramFeedGrid({ posts }: InstagramFeedGridProps) {
  if (posts.length === 0) {
    return (
      <div className="grid min-h-80 place-items-center border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm leading-7 text-stone-500">
        동기화된 인스타그램 피드가 아직 없습니다.
      </div>
    )
  }

  return (
    <section
      id="instagram-grid"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3 xl:gap-8"
    >
      {posts.map((post, index) => {
        const isVideo = post.media_url.includes('.mp4')
        const preview = getCaptionPreview(post.caption)
        const dateLabel = formatPostDate(post.post_timestamp)

        return (
          <article
            key={post.post_id}
            className="group relative overflow-hidden bg-stone-100"
          >
            {post.permalink ? (
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#274133] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fcf9f8]"
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
                      unoptimized
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/18 opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 grid gap-3 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-5 py-5 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid gap-2">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/70">
                          Post {String(index + 1).padStart(2, '0')}
                        </p>
                        <p className="max-w-[18rem] text-sm leading-6 text-white">
                          {preview}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="pt-1 text-base transition group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        ↗
                      </span>
                    </div>
                    <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/65">
                      {dateLabel}
                    </p>
                  </div>
                </div>
              </a>
            ) : (
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
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 grid gap-2 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-5 py-5 text-white">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/70">
                    Post {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="max-w-[18rem] text-sm leading-6 text-white">
                    {preview}
                  </p>
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/65">
                    {dateLabel}
                  </p>
                </div>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
