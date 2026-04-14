'use client'

import Image from 'next/image'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { ExternalLink, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
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

  const selectedItem = useMemo(() => {
    if (!sheetState || sheetState.mode !== 'edit') {
      return null
    }

    return items.find((item) => item.id === sheetState.itemId) ?? null
  }, [items, sheetState])

  function openCreateSheet() {
    setSheetState({ mode: 'create' })
  }

  function openEditSheet(itemId: string) {
    setSheetState({ mode: 'edit', itemId })
  }

  function handleCreateSuccess(item: ClientBrandAdminItem) {
    setItems((current) => sortItems([...current, item]))
    setSheetState({ mode: 'edit', itemId: item.id })
    toast.success('새 파트너가 등록되었습니다.')
  }

  function handleSaveSuccess(item: ClientBrandAdminItem) {
    setItems((current) =>
      sortItems(current.map((entry) => (entry.id === item.id ? item : entry)))
    )
    toast.success('파트너 정보가 저장되었습니다.')
  }

  function handleDeleteSuccess(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId))
    setSheetState(null)
    toast.success('파트너가 삭제되었습니다.')
  }

  return (
    <>
      {/* 페이지 타이틀 + 액션 */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">파트너 리스트</h1>
        <span className="text-sm text-muted-foreground tabular-nums">{items.length}개</span>
        <div className="ml-auto">
          <Button type="button" variant="outline" size="sm" onClick={openCreateSheet}>
            <Plus data-icon="inline-start" />
            새 파트너
          </Button>
        </div>
      </div>

      {/* 피드백 */}
      {/* 테이블 */}
      <div className="overflow-hidden rounded-xl border border-black/6 bg-white shadow-[0_1px_6px_rgba(15,23,42,0.04)]">
        {items.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-muted-foreground">
            아직 등록된 파트너가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-[#fafafa] text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">브랜드 이름</th>
                  <th className="px-4 py-3">로고</th>
                  <th className="px-4 py-3">브랜드 URL</th>
                  <th className="px-4 py-3">활성</th>
                  <th className="px-4 py-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-black/6 hover:bg-[#f7fdf9] transition-colors">
                    <td className="px-4 py-3 align-middle font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="relative flex h-12 w-24 items-center justify-center overflow-hidden rounded-xl border border-black/6 bg-[#fbfdfb]">
                        {item.logoUrl ? (
                          <Image
                            src={item.logoUrl}
                            alt={item.name}
                            fill
                            className="object-contain p-3"
                            sizes="96px"
                          />
                        ) : (
                          <span className="px-3 text-xs text-muted-foreground">없음</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-muted-foreground">
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
                        <span className="text-black/25">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className={item.isActive ? 'text-xs font-medium text-[#0f7b54]' : 'text-xs text-muted-foreground'}>
                        {item.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
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
        )}
      </div>

      <Sheet open={sheetState !== null} onOpenChange={(open) => !open && setSheetState(null)}>
        <SheetContent
          side="right"
          className="data-[side=right]:w-full data-[side=right]:max-w-none border-black/6 bg-[#fcfffd] p-0 sm:data-[side=right]:w-[min(52rem,42vw)] sm:data-[side=right]:max-w-[min(52rem,42vw)]"
        >
          <SheetHeader className="border-b border-black/6 bg-white px-6 py-5">
            <SheetTitle>
              {sheetState?.mode === 'create' ? '새 파트너 등록' : '파트너 수정'}
            </SheetTitle>
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
      return
    }

    setForm(EMPTY_FORM)
    setSelectedLogo(null)
    setPreviewUrl(null)
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
      toast.error('브랜드 이름을 입력해 주세요.')
      return
    }

    if (mode === 'create' && !selectedLogo) {
      toast.error('브랜드 로고를 업로드해 주세요.')
      return
    }

    if (mode === 'edit' && !item) {
      toast.error('수정할 파트너 정보를 찾지 못했습니다.')
      return
    }

    setIsSubmitting(true)

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
        toast.error(result.error ?? '파트너 저장에 실패했습니다.')
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
          : '파트너 저장에 실패했습니다.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!item) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/client-brands/${item.id}`, {
        method: 'DELETE',
      })
      const result = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !result.success) {
        toast.error(result.error ?? '파트너 삭제에 실패했습니다.')
        return
      }

      onDeleteSuccess(item.id)
    } catch {
      toast.error('파트너 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const previewAlt = form.name || '파트너 로고 미리보기'

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-[24px] border border-black/6 bg-white p-5">
        <p className="text-sm font-medium text-foreground">기본 정보</p>

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
            <Label htmlFor="client-active">활성 파트너</Label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-black/6 bg-[#fbfdfb] p-5">
        <p className="text-sm font-medium text-foreground">로고 업로드</p>

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
              ? '파트너 등록'
              : '파트너 저장'}
        </Button>

        {mode === 'edit' ? (
          <Button
            type="button"
            size="lg"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? '삭제 중...' : '파트너 삭제'}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
