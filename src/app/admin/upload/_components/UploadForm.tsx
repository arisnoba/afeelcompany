'use client'

import Image from 'next/image'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'

import { resizePortfolioImage } from '@/lib/image'
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from '@/types/portfolio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <Card className="rounded-[32px] border-0 bg-white shadow-sm ring-1 ring-stone-950/8">
        <CardHeader>
          <CardTitle>업로드 메타데이터</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <label className="grid gap-2 text-sm font-medium text-stone-800">
              이미지 파일
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4 file:mr-3"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-stone-800">
                제목
                <Input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="ROYNINE LOOK 01"
                  required
                  className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-stone-800">
                브랜드명
                <Input
                  value={form.brandName}
                  onChange={(event) => setForm((current) => ({ ...current, brandName: event.target.value }))}
                  placeholder="ROYNINE"
                  required
                  className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="grid gap-2 text-sm font-medium text-stone-800">
                셀럽명
                <Input
                  value={form.celebrityName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, celebrityName: event.target.value }))
                  }
                  placeholder="선택 입력"
                  className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-stone-800">
                카테고리
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value as PortfolioCategory,
                    }))
                  }
                  className="h-11 rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm text-stone-900 outline-none focus:border-stone-500"
                >
                  {PORTFOLIO_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.showOnWeb}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, showOnWeb: event.target.checked }))
                  }
                  className="size-4 rounded border-stone-300"
                />
                웹 노출 사용 (`showOnWeb`)
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.showOnPdf}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, showOnPdf: event.target.checked }))
                  }
                  className="size-4 rounded border-stone-300"
                />
                PDF 노출 사용 (`showOnPdf`)
              </label>
            </div>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            ) : null}

            {success ? (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-full bg-stone-950 text-white hover:bg-stone-800"
              disabled={isPending}
            >
              {isPending ? '업로드 중...' : '포트폴리오 생성'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-0 bg-stone-900 text-stone-50 shadow-sm ring-1 ring-stone-950/12">
        <CardHeader>
          <CardTitle>미리보기</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white/6">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={previewAlt}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 32vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-stone-300">
                이미지를 선택하면 여기에서 업로드 전 미리보기를 확인할 수 있습니다.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 text-sm leading-6 text-stone-300">
            <p className="font-medium text-stone-100">업로드 체크</p>
            <p className="mt-2">서버 업로드 한도는 4.5MB입니다.</p>
            <p>클라이언트에서 2000px JPEG 0.8 품질로 리사이즈합니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
