'use client'

import Image from 'next/image'
import { ChangeEvent, FormEvent, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resizePortfolioImage } from '@/lib/image'
import type { PortfolioAdminItem } from '@/types/portfolio'
import {
  PORTFOLIO_CATEGORIES,
} from '@/types/portfolio'
import {
  PortfolioMetadataFields,
  type PortfolioMetadataValue,
} from '@/components/admin/PortfolioMetadataFields'

interface UploadResponse {
  success: boolean
  data?: PortfolioAdminItem
  error?: string
}

const INITIAL_FORM: PortfolioMetadataValue = {
  title: '',
  brandName: '',
  celebrityName: '',
  category: PORTFOLIO_CATEGORIES[0],
  showOnWeb: true,
  showOnPdf: true,
}

interface UploadFormProps {
  onSuccess?: (item: PortfolioAdminItem) => void
}

export function UploadForm({ onSuccess }: UploadFormProps = {}) {
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

  function updateForm(patch: Partial<PortfolioMetadataValue>) {
    setForm((current) => ({ ...current, ...patch }))
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

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? '업로드에 실패했습니다.')
        return
      }

      setForm(INITIAL_FORM)
      setSelectedFile(null)
      updatePreview(null)

      if (onSuccess) {
        onSuccess(result.data)
        return
      }

      setSuccess('업로드가 완료되었습니다. 포트폴리오 관리 화면에서 바로 편집할 수 있습니다.')
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : '업로드에 실패했습니다.'
      setError(message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="upload-file" className="text-sm font-medium text-foreground">
            이미지 파일
          </Label>
          <span className="text-xs text-muted-foreground">JPEG, PNG, WEBP</span>
        </div>
        <Input
          id="upload-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          서버 업로드 한도 4.5MB, 클라이언트에서 2000px JPEG 0.8 품질로 리사이즈합니다.
        </p>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-black/6 bg-white p-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">미리보기</p>
          <p className="text-xs text-muted-foreground">
            선택한 이미지는 저장 전까지 로컬에서만 표시됩니다.
          </p>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-black/6 bg-[#f7fbf8]">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={previewAlt}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 560px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              이미지를 선택하면 여기에서 미리보기를 확인할 수 있습니다.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-black/6 bg-[#fbfdfb] p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">기본 정보</p>
          <p className="text-xs text-muted-foreground">
            목록 카드와 상세 정보 패널에 같은 데이터가 반영됩니다.
          </p>
        </div>
        <PortfolioMetadataFields
          value={form}
          idPrefix="upload"
          disabled={isPending}
          onChange={updateForm}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-[#18e299]/25 bg-[#18e299]/10 px-4 py-3 text-sm text-[#0f7b54]">
          {success}
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending || !selectedFile}>
        {isPending ? '업로드 중...' : '포트폴리오 생성'}
      </Button>
    </form>
  )
}
