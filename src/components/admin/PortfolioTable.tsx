'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioAdminItem,
  type PortfolioCategory,
} from '@/types/portfolio'

interface PortfolioTableProps {
  initialItems: PortfolioAdminItem[]
}

export function PortfolioTable({ initialItems }: PortfolioTableProps) {
  const [items, setItems] = useState<PortfolioAdminItem[]>(initialItems)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [activeRowId, setActiveRowId] = useState<string | null>(null)

  function updateItem(id: string, patch: Partial<PortfolioAdminItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  function reorderLocally(id: string, direction: -1 | 1) {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id)
      const nextIndex = index + direction

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current
      }

      const nextItems = [...current]
      const [moved] = nextItems.splice(index, 1)
      nextItems.splice(nextIndex, 0, moved)

      return nextItems.map((item, order) => ({
        ...item,
        sortOrder: order,
      }))
    })
  }

  async function handleSave(id: string) {
    const target = items.find((item) => item.id === id)

    if (!target) {
      return
    }

    setActiveRowId(id)
    setError(null)
    setFeedback(null)

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: target.title,
          brandName: target.brandName,
          celebrityName: target.celebrityName,
          category: target.category,
          showOnWeb: target.showOnWeb,
          showOnPdf: target.showOnPdf,
          sortOrder: target.sortOrder,
        }),
      })

      const result = (await response.json()) as {
        success: boolean
        data?: PortfolioAdminItem
        error?: string
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? '저장에 실패했습니다.')
        return
      }

      updateItem(id, result.data)
      setFeedback('항목이 저장되었습니다.')
    } catch {
      setError('저장에 실패했습니다.')
    } finally {
      setActiveRowId(null)
    }
  }

  async function handleDelete(id: string) {
    setActiveRowId(id)
    setError(null)
    setFeedback(null)

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      })
      const result = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !result.success) {
        setError(result.error ?? '삭제에 실패했습니다.')
        return
      }

      setItems((current) =>
        current
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            sortOrder: index,
          }))
      )
      setFeedback('항목이 삭제되었습니다.')
    } catch {
      setError('삭제에 실패했습니다.')
    } finally {
      setActiveRowId(null)
    }
  }

  async function handleSaveOrder() {
    setIsSavingOrder(true)
    setError(null)
    setFeedback(null)

    try {
      const response = await fetch('/api/portfolio/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            sortOrder: item.sortOrder,
          })),
        }),
      })
      const result = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !result.success) {
        setError(result.error ?? '정렬 저장에 실패했습니다.')
        return
      }

      setFeedback('정렬 순서가 저장되었습니다.')
    } catch {
      setError('정렬 저장에 실패했습니다.')
    } finally {
      setIsSavingOrder(false)
    }
  }

  return (
    <Card className="py-0">
      <CardHeader className="gap-4 md:flex md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle>포트폴리오 항목</CardTitle>
          <p className="text-sm text-muted-foreground">
            각 항목을 개별 저장하거나, 정렬 순서를 한 번에 저장할 수 있습니다.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveOrder}
          disabled={isSavingOrder || items.length === 0}
        >
          {isSavingOrder ? '정렬 저장 중...' : '정렬 저장'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        {feedback ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground">
            아직 업로드된 포트폴리오 항목이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => {
              const isRowPending = activeRowId === item.id

              return (
                <Card key={item.id} className="py-0">
                  <CardContent className="grid gap-6 py-6 lg:grid-cols-[140px_minmax(0,1fr)]">
                    <div className="space-y-3">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={item.thumbnailUrl ?? item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="140px"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">순서 {item.sortOrder}</Badge>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor={`title-${item.id}`}>제목</Label>
                          <Input
                            id={`title-${item.id}`}
                            value={item.title}
                            onChange={(event) =>
                              updateItem(item.id, { title: event.target.value })
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`brand-${item.id}`}>브랜드명</Label>
                          <Input
                            id={`brand-${item.id}`}
                            value={item.brandName}
                            onChange={(event) =>
                              updateItem(item.id, { brandName: event.target.value })
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`celebrity-${item.id}`}>셀럽명</Label>
                          <Input
                            id={`celebrity-${item.id}`}
                            value={item.celebrityName ?? ''}
                            onChange={(event) =>
                              updateItem(item.id, {
                                celebrityName: event.target.value || null,
                              })
                            }
                            placeholder="선택 입력"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>카테고리</Label>
                          <Select
                            value={item.category}
                            onValueChange={(value) => {
                              if (!value) {
                                return
                              }

                              updateItem(item.id, {
                                category: value as PortfolioCategory,
                              })
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {PORTFOLIO_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`web-${item.id}`}
                              checked={item.showOnWeb}
                              onCheckedChange={(checked) =>
                                updateItem(item.id, { showOnWeb: Boolean(checked) })
                              }
                            />
                            <Label htmlFor={`web-${item.id}`}>웹 노출</Label>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`pdf-${item.id}`}
                              checked={item.showOnPdf}
                              onCheckedChange={(checked) =>
                                updateItem(item.id, { showOnPdf: Boolean(checked) })
                              }
                            />
                            <Label htmlFor={`pdf-${item.id}`}>PDF 노출</Label>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => reorderLocally(item.id, -1)}
                            disabled={index === 0}
                          >
                            위로
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => reorderLocally(item.id, 1)}
                            disabled={index === items.length - 1}
                          >
                            아래로
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSave(item.id)}
                            disabled={isRowPending}
                          >
                            {isRowPending ? '저장 중...' : '저장'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={isRowPending}
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
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
