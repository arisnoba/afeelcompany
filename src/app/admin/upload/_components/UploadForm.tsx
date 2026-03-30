'use client'

import Image from 'next/image'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { resizePortfolioImage } from '@/lib/image'
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
} from '@/types/portfolio'

interface UploadResponse {
  success: boolean
  data?: {
    id: string
    imageUrl: string
  }
  error?: string
}

interface UploadFormState {
  title: string
  brandName: string
  celebrityName: string
  category: PortfolioCategory
  showOnWeb: boolean
  showOnPdf: boolean
}

const INITIAL_FORM: UploadFormState = {
  title: '',
  brandName: '',
  celebrityName: '',
  category: PORTFOLIO_CATEGORIES[0],
  showOnWeb: true,
  showOnPdf: true,
}

export function UploadForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const previewAlt = useMemo(
    () => form.title || form.brandName || '업로드 예정 이미지',
    [form.brandName, form.title]
  )

  function updatePreview(file: File | null) {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }

      return file ? URL.createObjectURL(file) : null
    })
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    updatePreview(file)
    setError(null)
    setSuccess(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedFile) {
      setError('업로드할 이미지를 먼저 선택해 주세요.')
      return
    }

    setIsPending(true)
    setError(null)
    setSuccess(null)

    try {
      const resizedFile = await resizePortfolioImage(selectedFile)
      const payload = new FormData()

      payload.set('file', resizedFile)
      payload.set('title', form.title)
      payload.set('brandName', form.brandName)
      payload.set('celebrityName', form.celebrityName)
      payload.set('category', form.category)
      payload.set('showOnWeb', String(form.showOnWeb))
      payload.set('showOnPdf', String(form.showOnPdf))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: payload,
      })
      const result = (await response.json()) as UploadResponse

      if (!response.ok || !result.success) {
        setError(result.error ?? '업로드에 실패했습니다.')
        return
      }

      setSuccess('업로드가 완료되었습니다. 포트폴리오 관리 화면에서 바로 편집할 수 있습니다.')
      setForm(INITIAL_FORM)
      setSelectedFile(null)
      updatePreview(null)
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : '업로드에 실패했습니다.'
      setError(message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
      <Card className="py-0">
        <CardHeader>
          <CardTitle>업로드 입력</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <form className="grid gap-6" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid gap-2">
              <Label htmlFor="upload-file">이미지 파일</Label>
              <Input
                id="upload-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="upload-title">제목</Label>
                <Input
                  id="upload-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="ROYNINE LOOK 01"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="upload-brand">브랜드명</Label>
                <Input
                  id="upload-brand"
                  value={form.brandName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, brandName: event.target.value }))
                  }
                  placeholder="ROYNINE"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="upload-celebrity">셀럽명</Label>
                <Input
                  id="upload-celebrity"
                  value={form.celebrityName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      celebrityName: event.target.value,
                    }))
                  }
                  placeholder="선택 입력"
                />
              </div>

              <div className="grid gap-2">
                <Label>카테고리</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => {
                    if (!value) {
                      return
                    }

                    setForm((current) => ({
                      ...current,
                      category: value as PortfolioCategory,
                    }))
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

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Checkbox
                  id="upload-web"
                  checked={form.showOnWeb}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, showOnWeb: Boolean(checked) }))
                  }
                />
                <Label htmlFor="upload-web">웹 노출 사용</Label>
              </div>

              <div className="flex items-center gap-2 rounded-md border p-3">
                <Checkbox
                  id="upload-pdf"
                  checked={form.showOnPdf}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, showOnPdf: Boolean(checked) }))
                  }
                />
                <Label htmlFor="upload-pdf">PDF 노출 사용</Label>
              </div>
            </div>

            {error ? (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <Button type="submit" disabled={isPending}>
              {isPending ? '업로드 중...' : '포트폴리오 생성'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardHeader>
          <CardTitle>미리보기</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pb-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md border bg-muted">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={previewAlt}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 360px"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                이미지를 선택하면 여기에서 미리보기를 확인할 수 있습니다.
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>서버 업로드 한도는 4.5MB입니다.</p>
            <p>클라이언트에서 2000px JPEG 0.8 품질로 리사이즈합니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
