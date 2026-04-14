'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  async function handleCreateQueueItem() {
    if (!selectedPortfolioItemId) {
      toast.error('큐에 넣을 포트폴리오 항목을 선택해 주세요.')
      return
    }

    setIsCreating(true)

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
        toast.error(result.error ?? '큐 생성에 실패했습니다.')
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
          return current.map((item) =>
            item.id === nextItem.id ? { ...item, ...nextItem } : item
          )
        }

        return [nextItem, ...current]
      })
      setCaption('')
      toast.success('큐 항목이 저장되었습니다.')
    } catch {
      toast.error('큐 생성에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  async function handlePublish(id: string) {
    setActiveId(id)

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
        toast.error(result.error ?? '게시에 실패했습니다.')
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
      toast.success('게시 요청이 완료되었습니다.')
    } catch {
      setQueue((current) =>
        current.map((item) => (item.id === id ? { ...item, status: 'failed' } : item))
      )
      toast.error('게시에 실패했습니다.')
    } finally {
      setActiveId(null)
    }
  }

  return (
    <Card className="py-0">
      <CardHeader>
        <CardTitle>큐 항목 관리</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 pb-6">
        <Card className="py-0">
          <CardContent className="grid gap-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)_auto]">
            <div className="grid gap-2">
              <Label>포트폴리오 항목</Label>
              <Select
                value={selectedPortfolioItemId}
                onValueChange={(value) => setSelectedPortfolioItemId(value ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="항목 선택" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="queue-caption">캡션</Label>
              <Textarea
                id="queue-caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleCreateQueueItem}
                disabled={isCreating || portfolioOptions.length === 0}
              >
                {isCreating ? '생성 중...' : '큐 추가'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {queue.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground">
            등록된 큐 항목이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((item) => {
              const isPending = activeId === item.id
              const canPublish = item.status === 'draft' || item.status === 'failed'

              return (
                <Card key={item.id} className="py-0">
                  <CardContent className="grid gap-6 py-6 lg:grid-cols-[120px_minmax(0,1fr)_auto]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-md border bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title ?? 'Instagram queue image'}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {item.title ?? '연결된 포트폴리오 없음'}
                        </h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        {item.caption || '캡션 없음'}
                      </p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          게시 시각:{' '}
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleString('ko-KR')
                            : '-'}
                        </p>
                        <p>외부 ID: {item.externalPostId ?? '-'}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Button
                        type="button"
                        onClick={() => handlePublish(item.id)}
                        disabled={!canPublish || isPending}
                      >
                        {isPending ? '게시 중...' : '게시'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: QueueStatus }) {
  if (status === 'published') {
    return <Badge>published</Badge>
  }

  if (status === 'failed') {
    return <Badge variant="destructive">failed</Badge>
  }

  if (status === 'pending') {
    return <Badge variant="secondary">pending</Badge>
  }

  return <Badge variant="outline">draft</Badge>
}
