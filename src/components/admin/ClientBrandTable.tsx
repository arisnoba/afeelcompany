'use client'

import Image from 'next/image'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { ExternalLink, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { ClientBrandAdminItem } from '@/types/client-brand'

interface ClientBrandTableProps {
  initialItems: ClientBrandAdminItem[]
}

interface ClientBrandMutationResponse {
  success: boolean
  data?: ClientBrandAdminItem
  error?: string
}

type ClientSheetState =
  | { mode: 'create' }
  | { mode: 'edit'; itemId: string }
  | null

const EMPTY_FORM = {
  name: '',
  brandUrl: '',
  isActive: true,
}

function sortItems(items: ClientBrandAdminItem[]) {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder)
}

function formatUrlLabel(value: string) {
  return value.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function ClientBrandTable({ initialItems }: ClientBrandTableProps) {
  const [items, setItems] = useState<ClientBrandAdminItem[]>(sortItems(initialItems))
  const [sheetState, setSheetState] = useState<ClientSheetState>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedItem = useMemo(() => {
    if (!sheetState || sheetState.mode !== 'edit') {
      return null
    }

    return items.find((item) => item.id === sheetState.itemId) ?? null
  }, [items, sheetState])

  function openCreateSheet() {
    setSheetState({ mode: 'create' })
    setFeedback(null)
    setError(null)
  }

  function openEditSheet(itemId: string) {
    setSheetState({ mode: 'edit', itemId })
    setFeedback(null)
    setError(null)
  }

  function handleCreateSuccess(item: ClientBrandAdminItem) {
    setItems((current) => sortItems([...current, item]))
    setSheetState({ mode: 'edit', itemId: item.id })
    setFeedback('새 클라이언트가 등록되었습니다.')
    setError(null)
  }

  function handleSaveSuccess(item: ClientBrandAdminItem) {
    setItems((current) =>
      sortItems(current.map((entry) => (entry.id === item.id ? item : entry)))
    )
    setFeedback('클라이언트 정보가 저장되었습니다.')
    setError(null)
  }

  function handleDeleteSuccess(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId))
    setSheetState(null)
    setFeedback('클라이언트가 삭제되었습니다.')
    setError(null)
  }

  return (
    <>
      <Card className="overflow-hidden border-black/6 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <CardHeader className="flex flex-col gap-4 border-b border-black/6 bg-[linear-gradient(135deg,rgba(24,226,153,0.08),rgba(255,255,255,0.92)_48%,rgba(255,255,255,1))] px-6 py-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl font-semibold tracking-[-0.03em]">
                클라이언트 리스트
              </CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-6">
                브랜드 이름, 로고, URL, 활성 여부를 한 테이블에서 확인하고 필요한 항목만
                패널에서 수정할 수 있습니다.
              </CardDescription>
            </div>

            <Button type="button" variant="outline" onClick={openCreateSheet}>
              <Plus data-icon="inline-start" />
              새 클라이언트 등록
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full border-[#18e299]/30 bg-white">
              총 {items.length}개 항목
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 px-6 py-6">
          {feedback ? (
            <div className="rounded-2xl border border-[#18e299]/25 bg-[#18e299]/10 px-4 py-3 text-sm text-[#0f7b54]">
              {feedback}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {items.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-black/10 bg-[#fbfdfb] px-6 py-14 text-center text-sm text-muted-foreground">
              아직 등록된 클라이언트가 없습니다. 우측 패널에서 첫 항목을 등록하세요.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-black/6">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-[#f7fbf8] text-left text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-4">브랜드 이름</th>
                      <th className="px-4 py-4">로고</th>
                      <th className="px-4 py-4">브랜드 URL</th>
                      <th className="px-4 py-4">활성</th>
                      <th className="px-4 py-4 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-t border-black/6 bg-white">
                        <td className="px-4 py-4 align-middle font-medium text-foreground">
                          {item.name}
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="relative flex h-14 w-28 items-center justify-center overflow-hidden rounded-2xl border border-black/6 bg-[#fbfdfb]">
                            {item.logoUrl ? (
                              <Image
                                src={item.logoUrl}
                                alt={item.name}
                                fill
                                className="object-contain p-3"
                                sizes="112px"
                              />
                            ) : (
                              <span className="px-3 text-xs text-muted-foreground">
                                로고 없음
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-middle text-muted-foreground">
                          {item.brandUrl ? (
                            <a
                              href={item.brandUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-foreground underline-offset-4 hover:underline"
                            >
                              <span className="max-w-[16rem] truncate">
                                {formatUrlLabel(item.brandUrl)}
                              </span>
                              <ExternalLink className="size-3.5 shrink-0" />
                            </a>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <Badge
                            variant="outline"
                            className={
                              item.isActive
                                ? 'rounded-full border-[#18e299]/30 bg-[#18e299]/10 text-[#0f7b54]'
                                : 'rounded-full border-black/6'
                            }
                          >
                            {item.isActive ? '활성' : '비활성'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 align-middle text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openEditSheet(item.id)}
                          >
                            열기
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetState !== null} onOpenChange={(open) => !open && setSheetState(null)}>
        <SheetContent
          side="right"
          className="data-[side=right]:w-full data-[side=right]:max-w-none border-black/6 bg-[#fcfffd] p-0 sm:data-[side=right]:w-[min(52rem,42vw)] sm:data-[side=right]:max-w-[min(52rem,42vw)]"
        >
          <SheetHeader className="border-b border-black/6 bg-white px-6 py-5">
            <SheetTitle>
              {sheetState?.mode === 'create' ? '새 클라이언트 등록' : '클라이언트 상세 설정'}
            </SheetTitle>
            <SheetDescription>
              {sheetState?.mode === 'create'
                ? '포트폴리오 등록 패널과 같은 흐름으로 브랜드명, 로고, URL, 활성 상태를 입력합니다.'
                : '선택한 클라이언트의 기본 정보와 로고를 수정합니다.'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
            <ClientBrandSheetForm
              mode={sheetState?.mode === 'create' ? 'create' : 'edit'}
              item={selectedItem}
              onCreateSuccess={handleCreateSuccess}
              onSaveSuccess={handleSaveSuccess}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface ClientBrandSheetFormProps {
  mode: 'create' | 'edit'
  item: ClientBrandAdminItem | null
  onCreateSuccess: (item: ClientBrandAdminItem) => void
  onSaveSuccess: (item: ClientBrandAdminItem) => void
  onDeleteSuccess: (itemId: string) => void
}

function ClientBrandSheetForm({
  mode,
  item,
  onCreateSuccess,
  onSaveSuccess,
  onDeleteSuccess,
}: ClientBrandSheetFormProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && item) {
      setForm({
        name: item.name,
        brandUrl: item.brandUrl ?? '',
        isActive: item.isActive,
      })
      setSelectedLogo(null)
      setPreviewUrl(item.logoUrl)
      setError(null)
      return
    }

    setForm(EMPTY_FORM)
    setSelectedLogo(null)
    setPreviewUrl(null)
    setError(null)
  }, [item, mode])

  useEffect(() => {
    return () => {
      if (selectedLogo && previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, selectedLogo])

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    setSelectedLogo(file)
    setError(null)

    setPreviewUrl((current) => {
      if (current?.startsWith('blob:')) {
        URL.revokeObjectURL(current)
      }

      if (file) {
        return URL.createObjectURL(file)
      }

      return item?.logoUrl ?? null
    })
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError('브랜드 이름을 입력해 주세요.')
      return
    }

    if (mode === 'create' && !selectedLogo) {
      setError('브랜드 로고를 업로드해 주세요.')
      return
    }

    if (mode === 'edit' && !item) {
      setError('수정할 클라이언트 정보를 찾지 못했습니다.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload = new FormData()
      payload.set('name', form.name.trim())
      payload.set('brandUrl', form.brandUrl.trim())
      payload.set('isActive', String(form.isActive))

      if (selectedLogo) {
        payload.set('logo', selectedLogo)
      }

      const response = await fetch(
        mode === 'create' ? '/api/client-brands' : `/api/client-brands/${item!.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          body: payload,
        }
      )
      const result = (await response.json()) as ClientBrandMutationResponse

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? '클라이언트 저장에 실패했습니다.')
        return
      }

      if (mode === 'create') {
        onCreateSuccess(result.data)
        return
      }

      onSaveSuccess(result.data)
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : '클라이언트 저장에 실패했습니다.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!item) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/client-brands/${item.id}`, {
        method: 'DELETE',
      })
      const result = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !result.success) {
        setError(result.error ?? '클라이언트 삭제에 실패했습니다.')
        return
      }

      onDeleteSuccess(item.id)
    } catch {
      setError('클라이언트 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const previewAlt = form.name || '클라이언트 로고 미리보기'

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-[24px] border border-black/6 bg-white p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">기본 정보</p>
          <p className="text-xs text-muted-foreground">
            목록과 외부 노출에 공통으로 쓰는 항목입니다.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="client-name">브랜드 이름</Label>
            <Input
              id="client-name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              disabled={isSubmitting || isDeleting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="client-brand-url">브랜드 URL</Label>
            <Input
              id="client-brand-url"
              value={form.brandUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, brandUrl: event.target.value }))
              }
              placeholder="https://example.com"
              disabled={isSubmitting || isDeleting}
            />
            <p className="text-xs text-muted-foreground">
              선택 입력입니다. 도메인만 입력하면 자동으로 `https://`를 붙여 저장합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="client-active"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((current) => ({ ...current, isActive: Boolean(checked) }))
              }
              disabled={isSubmitting || isDeleting}
            />
            <Label htmlFor="client-active">활성 클라이언트</Label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-black/6 bg-[#fbfdfb] p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">로고 업로드</p>
          <p className="text-xs text-muted-foreground">
            {mode === 'create'
              ? '새 클라이언트 등록에는 로고 파일이 필요합니다.'
              : '새 파일을 선택하면 기존 로고를 교체합니다.'}
          </p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="client-logo">로고 파일</Label>
          <Input
            id="client-logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoChange}
            disabled={isSubmitting || isDeleting}
          />
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-black/6 bg-white">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={previewAlt}
              fill
              unoptimized={previewUrl.startsWith('blob:')}
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 520px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              업로드한 로고가 여기에 표시됩니다.
            </div>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting || isDeleting}
        >
          {isSubmitting
            ? mode === 'create'
              ? '등록 중...'
              : '저장 중...'
            : mode === 'create'
              ? '클라이언트 등록'
              : '클라이언트 저장'}
        </Button>

        {mode === 'edit' ? (
          <Button
            type="button"
            size="lg"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? '삭제 중...' : '클라이언트 삭제'}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
