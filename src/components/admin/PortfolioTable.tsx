'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PORTFOLIO_CATEGORIES, type PortfolioAdminItem, type PortfolioCategory } from '@/types/portfolio'

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
    <Card className="rounded-[32px] border-0 bg-white shadow-sm ring-1 ring-stone-950/8">
      <CardHeader className="gap-4 md:flex md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle>운영 테이블</CardTitle>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            `showOnWeb`, `showOnPdf`, `sortOrder`는 DB 필드와 1:1로 연결됩니다.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveOrder}
          disabled={isSavingOrder || items.length === 0}
          className="rounded-full bg-stone-950 px-4 text-white hover:bg-stone-800"
        >
          {isSavingOrder ? '정렬 저장 중...' : '정렬 저장'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {feedback ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center text-sm text-stone-500">
            아직 업로드된 포트폴리오 항목이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.18em] text-stone-500">
                <tr>
                  <th className="px-3 py-2">Thumbnail</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Brand</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">showOnWeb</th>
                  <th className="px-3 py-2">showOnPdf</th>
                  <th className="px-3 py-2">sortOrder</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const isRowPending = activeRowId === item.id

                  return (
                    <tr key={item.id} className="rounded-[28px] bg-stone-50">
                      <td className="px-3 py-3 align-top">
                        <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-stone-200">
                          <Image
                            src={item.thumbnailUrl ?? item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </td>
                      <td className="min-w-52 px-3 py-3 align-top">
                        <div className="grid gap-2">
                          <Input
                            value={item.title}
                            onChange={(event) =>
                              updateItem(item.id, { title: event.target.value })
                            }
                            className="rounded-2xl border-stone-300 bg-white"
                          />
                          <Input
                            value={item.celebrityName ?? ''}
                            onChange={(event) =>
                              updateItem(item.id, { celebrityName: event.target.value || null })
                            }
                            placeholder="셀럽명"
                            className="rounded-2xl border-stone-300 bg-white"
                          />
                        </div>
                      </td>
                      <td className="min-w-44 px-3 py-3 align-top">
                        <Input
                          value={item.brandName}
                          onChange={(event) =>
                            updateItem(item.id, { brandName: event.target.value })
                          }
                          className="rounded-2xl border-stone-300 bg-white"
                        />
                      </td>
                      <td className="px-3 py-3 align-top">
                        <select
                          value={item.category}
                          onChange={(event) =>
                            updateItem(item.id, {
                              category: event.target.value as PortfolioCategory,
                            })
                          }
                          className="h-8 rounded-2xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none focus:border-stone-500"
                        >
                          {PORTFOLIO_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <label className="inline-flex items-center gap-2 text-sm text-stone-700">
                          <input
                            type="checkbox"
                            checked={item.showOnWeb}
                            onChange={(event) =>
                              updateItem(item.id, { showOnWeb: event.target.checked })
                            }
                          />
                          사용
                        </label>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <label className="inline-flex items-center gap-2 text-sm text-stone-700">
                          <input
                            type="checkbox"
                            checked={item.showOnPdf}
                            onChange={(event) =>
                              updateItem(item.id, { showOnPdf: event.target.checked })
                            }
                          />
                          사용
                        </label>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="grid gap-2">
                          <span className="inline-flex h-8 items-center justify-center rounded-2xl bg-white px-3 text-sm text-stone-700">
                            {item.sortOrder}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => reorderLocally(item.id, -1)}
                              disabled={index === 0}
                            >
                              위
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => reorderLocally(item.id, 1)}
                              disabled={index === items.length - 1}
                            >
                              아래
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="grid gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSave(item.id)}
                            disabled={isRowPending}
                            className="rounded-full bg-stone-950 px-4 text-white hover:bg-stone-800"
                          >
                            {isRowPending ? '저장 중...' : '저장'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={isRowPending}
                            className="rounded-full"
                          >
                            삭제
                          </Button>
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
