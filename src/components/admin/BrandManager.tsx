'use client'

import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface BrandItem {
  id: string
  name: string
  logoUrl: string | null
  sortOrder: number
  isActive: boolean
}

interface BrandManagerProps {
  initialBrands: BrandItem[]
}

const INITIAL_BRAND_FORM = {
  name: '',
  sortOrder: '0',
  isActive: true,
}

export function BrandManager({ initialBrands }: BrandManagerProps) {
  const [brands, setBrands] = useState(initialBrands)
  const [form, setForm] = useState(INITIAL_BRAND_FORM)
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  function updateBrand(id: string, patch: Partial<BrandItem>) {
    setBrands((current) =>
      current.map((brand) => (brand.id === id ? { ...brand, ...patch } : brand))
    )
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedLogo(event.target.files?.[0] ?? null)
  }

  async function handleCreateBrand() {
    if (!selectedLogo) {
      setError('브랜드 로고 파일을 선택해 주세요.')
      return
    }

    setIsCreating(true)
    setFeedback(null)
    setError(null)

    try {
      const payload = new FormData()
      payload.set('name', form.name)
      payload.set('sortOrder', form.sortOrder)
      payload.set('isActive', String(form.isActive))
      payload.set('logo', selectedLogo)

      const response = await fetch('/api/client-brands', {
        method: 'POST',
        body: payload,
      })
      const result = (await response.json()) as {
        success: boolean
        data?: BrandItem
        error?: string
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? '브랜드 생성에 실패했습니다.')
        return
      }

      const newBrand = result.data

      setBrands((current) =>
        [...current, newBrand].sort((left, right) => left.sortOrder - right.sortOrder)
      )
      setForm(INITIAL_BRAND_FORM)
      setSelectedLogo(null)
      setFeedback('브랜드가 추가되었습니다.')
    } catch {
      setError('브랜드 생성에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleSaveBrand(id: string) {
    const brand = brands.find((item) => item.id === id)

    if (!brand) {
      return
    }

    setActiveId(id)
    setFeedback(null)
    setError(null)

    try {
      const response = await fetch(`/api/client-brands/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: brand.name,
          sortOrder: brand.sortOrder,
          isActive: brand.isActive,
        }),
      })
      const result = (await response.json()) as {
        success: boolean
        data?: BrandItem
        error?: string
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? '브랜드 저장에 실패했습니다.')
        return
      }

      updateBrand(id, result.data)
      setFeedback('브랜드가 저장되었습니다.')
    } catch {
      setError('브랜드 저장에 실패했습니다.')
    } finally {
      setActiveId(null)
    }
  }

  async function handleDeleteBrand(id: string) {
    setActiveId(id)
    setFeedback(null)
    setError(null)

    try {
      const response = await fetch(`/api/client-brands/${id}`, {
        method: 'DELETE',
      })
      const result = (await response.json()) as { success: boolean; error?: string }

      if (!response.ok || !result.success) {
        setError(result.error ?? '브랜드 삭제에 실패했습니다.')
        return
      }

      setBrands((current) => current.filter((brand) => brand.id !== id))
      setFeedback('브랜드가 삭제되었습니다.')
    } catch {
      setError('브랜드 삭제에 실패했습니다.')
    } finally {
      setActiveId(null)
    }
  }

  return (
    <Card className="rounded-[32px] border-0 bg-white shadow-sm ring-1 ring-stone-950/8">
      <CardHeader>
        <CardTitle>BrandManager</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="grid gap-5 rounded-[28px] border border-stone-200 bg-stone-50 p-5 lg:grid-cols-[minmax(0,1.2fr)_180px_160px_auto]">
          <label className="grid gap-2 text-sm font-medium text-stone-800">
            브랜드명
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="h-11 rounded-2xl border-stone-300 bg-white px-4"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-800">
            sortOrder
            <Input
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({ ...current, sortOrder: event.target.value }))
              }
              type="number"
              className="h-11 rounded-2xl border-stone-300 bg-white px-4"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-800">
            로고
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleLogoChange}
              className="h-11 rounded-2xl border-stone-300 bg-white px-4 file:mr-3"
            />
          </label>

          <label className="flex items-end gap-3 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm((current) => ({ ...current, isActive: event.target.checked }))
              }
            />
            활성 브랜드
          </label>

          <Button
            type="button"
            onClick={handleCreateBrand}
            disabled={isCreating}
            className="h-11 rounded-full bg-stone-950 text-white hover:bg-stone-800 lg:col-span-4"
          >
            {isCreating ? '브랜드 생성 중...' : '브랜드 추가'}
          </Button>
        </div>

        {feedback ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="grid gap-4">
          {brands.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center text-sm text-stone-500">
              등록된 브랜드가 없습니다.
            </div>
          ) : (
            brands.map((brand) => {
              const isPending = activeId === brand.id

              return (
                <div
                  key={brand.id}
                  className="grid gap-4 rounded-[28px] border border-stone-200 bg-stone-50 p-5 lg:grid-cols-[120px_minmax(0,1fr)_160px_140px_auto]"
                >
                  <div className="relative h-24 overflow-hidden rounded-2xl bg-white">
                    {brand.logoUrl ? (
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        className="object-contain p-4"
                        sizes="120px"
                      />
                    ) : null}
                  </div>

                  <label className="grid gap-2 text-sm font-medium text-stone-800">
                    이름
                    <Input
                      value={brand.name}
                      onChange={(event) => updateBrand(brand.id, { name: event.target.value })}
                      className="h-11 rounded-2xl border-stone-300 bg-white px-4"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-stone-800">
                    sortOrder
                    <Input
                      type="number"
                      value={String(brand.sortOrder)}
                      onChange={(event) =>
                        updateBrand(brand.id, {
                          sortOrder: Number(event.target.value) || 0,
                        })
                      }
                      className="h-11 rounded-2xl border-stone-300 bg-white px-4"
                    />
                  </label>

                  <label className="flex items-end gap-3 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={brand.isActive}
                      onChange={(event) =>
                        updateBrand(brand.id, { isActive: event.target.checked })
                      }
                    />
                    활성
                  </label>

                  <div className="grid gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveBrand(brand.id)}
                      disabled={isPending}
                      className="rounded-full bg-stone-950 text-white hover:bg-stone-800"
                    >
                      {isPending ? '저장 중...' : '저장'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteBrand(brand.id)}
                      disabled={isPending}
                      className="rounded-full"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
