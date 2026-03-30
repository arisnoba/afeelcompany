'use client'

import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

      setBrands((current) =>
        [...current, result.data!].sort((left, right) => left.sortOrder - right.sortOrder)
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
    <Card className="py-0">
      <CardHeader>
        <CardTitle>브랜드 자산</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 pb-6">
        <Card className="py-0">
          <CardContent className="grid gap-4 py-6 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)_auto]">
            <div className="grid gap-2">
              <Label htmlFor="brand-name">브랜드명</Label>
              <Input
                id="brand-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand-order">정렬 순서</Label>
              <Input
                id="brand-order"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({ ...current, sortOrder: event.target.value }))
                }
                type="number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand-logo">로고 파일</Label>
              <Input
                id="brand-logo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoChange}
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="brand-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, isActive: Boolean(checked) }))
                  }
                />
                <Label htmlFor="brand-active">활성 브랜드</Label>
              </div>
              <Button type="button" onClick={handleCreateBrand} disabled={isCreating}>
                {isCreating ? '브랜드 생성 중...' : '브랜드 추가'}
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {brands.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground">
            등록된 브랜드가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {brands.map((brand) => {
              const isPending = activeId === brand.id

              return (
                <Card key={brand.id} className="py-0">
                  <CardContent className="grid gap-6 py-6 lg:grid-cols-[120px_minmax(0,1fr)_auto]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
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

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`brand-name-${brand.id}`}>이름</Label>
                        <Input
                          id={`brand-name-${brand.id}`}
                          value={brand.name}
                          onChange={(event) =>
                            updateBrand(brand.id, { name: event.target.value })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`brand-order-${brand.id}`}>정렬 순서</Label>
                        <Input
                          id={`brand-order-${brand.id}`}
                          type="number"
                          value={String(brand.sortOrder)}
                          onChange={(event) =>
                            updateBrand(brand.id, {
                              sortOrder: Number(event.target.value) || 0,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center gap-2 md:col-span-2">
                        <Checkbox
                          id={`brand-active-${brand.id}`}
                          checked={brand.isActive}
                          onCheckedChange={(checked) =>
                            updateBrand(brand.id, { isActive: Boolean(checked) })
                          }
                        />
                        <Label htmlFor={`brand-active-${brand.id}`}>활성</Label>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-start gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveBrand(brand.id)}
                        disabled={isPending}
                      >
                        {isPending ? '저장 중...' : '저장'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBrand(brand.id)}
                        disabled={isPending}
                      >
                        삭제
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
