'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type QueueStatus = 'draft' | 'pending' | 'published' | 'failed'

interface QueueItem {
  id: string
  portfolioItemId: string | null
  caption: string
  status: QueueStatus
  publishedAt: string | null
  externalPostId: string | null
  title: string | null
  imageUrl: string | null
}

interface PortfolioOption {
  id: string
  label: string
}

interface InstagramQueueTableProps {
  initialQueue: QueueItem[]
  portfolioOptions: PortfolioOption[]
}

export function InstagramQueueTable({
  initialQueue,
  portfolioOptions,
}: InstagramQueueTableProps) {
  const [queue, setQueue] = useState(initialQueue)
  const [selectedPortfolioItemId, setSelectedPortfolioItemId] = useState(
    portfolioOptions[0]?.id ?? ''
  )
  const [caption, setCaption] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreateQueueItem() {
    if (!selectedPortfolioItemId) {
      setError('큐에 넣을 포트폴리오 항목을 선택해 주세요.')
      return
    }

    setIsCreating(true)
    setFeedback(null)
    setError(null)

    try {
      const response = await fetch('/api/instagram/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioItemId: selectedPortfolioItemId,
          caption,
        }),
      })
      const result = (await response.json()) as {
        success: boolean
        data?: QueueItem
        error?: string
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? '큐 생성에 실패했습니다.')
        return
      }

      const selected = portfolioOptions.find((item) => item.id === selectedPortfolioItemId)
      const existing = queue.findIndex((item) => item.id === result.data?.id)
      const nextItem: QueueItem = {
        ...result.data,
        title: selected?.label ?? result.data.title,
      }

      setQueue((current) => {
        if (existing >= 0) {
          return current.map((item) => (item.id === nextItem.id ? { ...item, ...nextItem } : item))
        }

        return [nextItem, ...current]
      })
      setCaption('')
      setFeedback('큐 항목이 저장되었습니다.')
    } catch {
      setError('큐 생성에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  async function handlePublish(id: string) {
    setActiveId(id)
    setFeedback(null)
    setError(null)

    setQueue((current) =>
      current.map((item) => (item.id === id ? { ...item, status: 'pending' } : item))
    )

    try {
      const response = await fetch(`/api/instagram/publish/${id}`, {
        method: 'POST',
      })
      const result = (await response.json()) as {
        success: boolean
        data?: { externalPostId: string }
        error?: string
      }

      if (!response.ok || !result.success || !result.data) {
        setQueue((current) =>
          current.map((item) => (item.id === id ? { ...item, status: 'failed' } : item))
        )
        setError(result.error ?? '게시에 실패했습니다.')
        return
      }

      setQueue((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'published',
                publishedAt: new Date().toISOString(),
                externalPostId: result.data?.externalPostId ?? null,
              }
            : item
        )
      )
      setFeedback('게시 요청이 완료되었습니다.')
    } catch {
      setQueue((current) =>
        current.map((item) => (item.id === id ? { ...item, status: 'failed' } : item))
      )
      setError('게시에 실패했습니다.')
    } finally {
      setActiveId(null)
    }
  }

  return (
    <Card className="rounded-[32px] border-0 bg-white shadow-sm ring-1 ring-stone-950/8">
      <CardHeader>
        <CardTitle>InstagramQueueTable</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-4 rounded-[28px] border border-stone-200 bg-stone-50 p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)_auto]">
            <label className="grid gap-2 text-sm font-medium text-stone-800">
              포트폴리오 항목
              <select
                value={selectedPortfolioItemId}
                onChange={(event) => setSelectedPortfolioItemId(event.target.value)}
                className="h-11 rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-900 outline-none focus:border-stone-500"
              >
                {portfolioOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-stone-800">
              캡션
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={3}
                className="rounded-[28px] border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-500"
              />
            </label>

            <Button
              type="button"
              onClick={handleCreateQueueItem}
              disabled={isCreating || portfolioOptions.length === 0}
              className="h-11 self-end rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"
            >
              {isCreating ? '생성 중...' : '큐 추가'}
            </Button>
          </div>
        </div>

        {feedback ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        {queue.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center text-sm text-stone-500">
            등록된 큐 항목이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.18em] text-stone-500">
                <tr>
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Caption</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">PublishedAt</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => {
                  const isPending = activeId === item.id
                  const canPublish = item.status === 'draft' || item.status === 'failed'

                  return (
                    <tr key={item.id} className="bg-stone-50">
                      <td className="px-3 py-3 align-top">
                        <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-stone-200">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title ?? 'Instagram queue image'}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top text-stone-800">
                        {item.title ?? '연결된 포트폴리오 없음'}
                      </td>
                      <td className="min-w-72 px-3 py-3 align-top text-stone-700">
                        <p className="whitespace-pre-wrap leading-6">{item.caption}</p>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <span className="inline-flex rounded-full bg-white px-3 py-2 text-xs font-medium text-stone-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 align-top text-stone-600">
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleString('ko-KR')
                          : '-'}
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="grid gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handlePublish(item.id)}
                            disabled={!canPublish || isPending}
                            className="rounded-full bg-stone-950 text-white hover:bg-stone-800"
                          >
                            {isPending ? '게시 중...' : '게시'}
                          </Button>
                          {item.externalPostId ? (
                            <span className="text-xs text-stone-500">
                              ID: {item.externalPostId}
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
