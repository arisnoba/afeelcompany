import Image from 'next/image'
import { getCachedFeed } from '@/lib/instagram'
import type { CachedPost } from '@/types/instagram'
import { SyncButton } from './_components/SyncButton'

// Force dynamic rendering — page reads DB on every request (D-08: cache-first, no build-time fetch)
export const dynamic = 'force-dynamic'

export default async function InstagramTestPage() {
  const posts: CachedPost[] = await getCachedFeed()
  const lastSync = posts[0]?.fetched_at ?? null

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        Instagram Feed — Spike Test
      </h1>
      <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
        {lastSync
          ? `Last synced: ${new Date(lastSync).toLocaleString('ko-KR')}`
          : 'No data yet — click Sync Now to fetch from API'}
      </p>

      <SyncButton />

      {posts.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#999', border: '1px dashed #ccc', borderRadius: '8px' }}>
          <p>No cached posts found.</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Click &quot;Sync Now&quot; above to fetch from Instagram API.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {posts.map((post) => {
            const isVideo = post.media_url.includes('.mp4')
            return (
            <div
              key={post.post_id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                {isVideo ? (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '13px',
                  }}>
                    📹 Video
                  </div>
                ) : (
                  <Image
                    src={post.media_url}
                    alt={post.caption ?? 'Instagram post'}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              {post.caption && (
                <div style={{ padding: '12px', fontSize: '13px', color: '#374151' }}>
                  <p
                    style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.caption}
                  </p>
                </div>
              )}
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
