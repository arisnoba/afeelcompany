import Image from 'next/image'
import { useMemo } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ClientBrandAdminItem } from '@/types/client-brand'
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from '@/types/portfolio'

export interface PortfolioMetadataValue {
  brandMode: 'managed' | 'custom'
  clientBrandId: string | null
  brandName: string
  celebrityName: string
  category: PortfolioCategory[]
  instagramUrl: string
  showOnWeb: boolean
  showOnPdf: boolean
}

interface PortfolioMetadataFieldsProps {
  value: PortfolioMetadataValue
  idPrefix: string
  availableBrands: ClientBrandAdminItem[]
  disabled?: boolean
  onChange: (patch: Partial<PortfolioMetadataValue>) => void
}

interface BrandComboboxItem {
  value: string
  label: string
  isActive: boolean
  hasLogo: boolean
}

export function PortfolioMetadataFields({
  value,
  idPrefix,
  availableBrands,
  disabled = false,
  onChange,
}: PortfolioMetadataFieldsProps) {
  const selectedBrand =
    availableBrands.find((brand) => brand.id === value.clientBrandId) ?? null
  const categoryAnchor = useComboboxAnchor()
  const brandOptions = useMemo<BrandComboboxItem[]>(
    () =>
      availableBrands.map((brand) => ({
        value: brand.id,
        label: brand.name,
        isActive: brand.isActive,
        hasLogo: Boolean(brand.logoUrl),
      })),
    [availableBrands]
  )
  const selectedBrandOption =
    brandOptions.find((brand) => brand.value === value.clientBrandId) ?? null

  return (
    <div className="grid gap-5">
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label>브랜드 연결</Label>
          <span className="text-xs text-muted-foreground">
            등록된 브랜드는 로고를 hover 이미지로 자동 사용합니다.
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange({
                brandMode: 'managed',
                clientBrandId:
                  value.clientBrandId ?? availableBrands.find((brand) => brand.isActive)?.id ?? null,
                brandName:
                  value.clientBrandId
                    ? value.brandName
                    : availableBrands.find((brand) => brand.isActive)?.name ?? '',
              })
            }
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              value.brandMode === 'managed'
                ? 'border-[#274133] bg-[#f3fbf7] text-[#274133]'
                : 'border-black/8 bg-white text-foreground hover:border-[#274133]/35'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <p className="text-sm font-medium">리스트에서 선택</p>
            <p className="mt-1 text-xs text-muted-foreground">
              브랜드 로고를 hover 이미지로 자동 연결합니다.
            </p>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange({
                brandMode: 'custom',
                clientBrandId: null,
                brandName: value.brandMode === 'custom' ? value.brandName : '',
              })
            }
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              value.brandMode === 'custom'
                ? 'border-[#715a3e] bg-[#fbf7f2] text-[#715a3e]'
                : 'border-black/8 bg-white text-foreground hover:border-[#715a3e]/35'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <p className="text-sm font-medium">예외 브랜드 직접 입력</p>
            <p className="mt-1 text-xs text-muted-foreground">
              리스트에 없는 브랜드는 hover 이미지를 별도로 등록합니다.
            </p>
          </button>
        </div>
      </div>

      {value.brandMode === 'managed' ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
          <div className="flex flex-col gap-2">
            <Label>등록된 브랜드</Label>
            <Combobox
              items={brandOptions}
              value={selectedBrandOption}
              itemToStringLabel={(item) => item.label}
              itemToStringValue={(item) => item.value}
              isItemEqualToValue={(item, selected) => item.value === selected.value}
              onValueChange={(nextBrand) => {
                onChange({
                  clientBrandId: nextBrand?.value ?? null,
                  brandName: nextBrand?.label ?? '',
                })
              }}
            >
              <ComboboxInput
                placeholder="브랜드를 검색하거나 선택하세요"
                disabled={disabled}
                showClear
                className="h-11 w-full rounded-xl [&_[data-slot=input-group]]:h-11 [&_[data-slot=input-group-input]]:h-11"
              />
              <ComboboxContent className="w-[var(--anchor-width)]">
                <ComboboxList>
                  <ComboboxGroup>
                    {brandOptions.map((brand) => (
                      <ComboboxItem key={brand.value} value={brand}>
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate">{brand.label}</span>
                          {!brand.isActive ? (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              비활성
                            </span>
                          ) : null}
                          {!brand.hasLogo ? (
                            <span className="shrink-0 text-xs text-muted-foreground">
                              로고 없음
                            </span>
                          ) : null}
                        </div>
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                  <ComboboxEmpty>검색 결과가 없습니다.</ComboboxEmpty>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="grid gap-2">
            <Label>연결 로고</Label>
            <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-[#f7fbf8]">
              {selectedBrand?.logoUrl ? (
                <Image
                  src={selectedBrand.logoUrl}
                  alt={selectedBrand.name}
                  fill
                  className="object-contain p-4"
                  sizes="120px"
                />
              ) : (
                <span className="px-3 text-center text-xs text-muted-foreground">
                  로고가 없는 브랜드입니다.
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-custom-brand`}>예외 브랜드 명</Label>
          <Input
            id={`${idPrefix}-custom-brand`}
            value={value.brandName}
            onChange={(event) => onChange({ brandName: event.target.value })}
            placeholder="리스트에 없는 브랜드 이름을 입력하세요"
            required
            disabled={disabled}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-celebrity`}>셀럽 명</Label>
          <Input
            id={`${idPrefix}-celebrity`}
            value={value.celebrityName}
            onChange={(event) => onChange({ celebrityName: event.target.value })}
            placeholder="선택 입력"
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-category-input`}>카테고리</Label>
          <Combobox
            items={PORTFOLIO_CATEGORIES}
            value={value.category}
            multiple
            onValueChange={(nextValue) => {
              onChange({
                category: Array.isArray(nextValue)
                  ? (nextValue as PortfolioCategory[])
                  : nextValue
                    ? [nextValue as PortfolioCategory]
                    : [],
              })
            }}
          >
            <ComboboxChips
              ref={categoryAnchor}
              aria-disabled={disabled}
              className={disabled ? 'bg-input/50' : undefined}
            >
              {value.category.map((category) => (
                <ComboboxChip key={category} showRemove={!disabled}>
                  {category}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                id={`${idPrefix}-category-input`}
                placeholder={value.category.length === 0 ? '카테고리를 선택하세요' : ''}
                disabled={disabled}
              />
            </ComboboxChips>
            <ComboboxContent anchor={categoryAnchor}>
              <ComboboxList>
                <ComboboxGroup>
                  {PORTFOLIO_CATEGORIES.map((category) => (
                    <ComboboxItem key={category} value={category}>
                      {category}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
                <ComboboxEmpty>검색 결과가 없습니다.</ComboboxEmpty>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${idPrefix}-instagram-url`}>인스타그램 게시물 URL</Label>
        <Input
          id={`${idPrefix}-instagram-url`}
          type="url"
          value={value.instagramUrl}
          onChange={(event) => onChange({ instagramUrl: event.target.value })}
          placeholder="https://www.instagram.com/p/..."
          disabled={disabled}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label
          htmlFor={`${idPrefix}-web`}
          className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3"
        >
          <Checkbox
            id={`${idPrefix}-web`}
            checked={value.showOnWeb}
            onCheckedChange={(checked) => onChange({ showOnWeb: Boolean(checked) })}
            disabled={disabled}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              웹 공개 포트폴리오 페이지에 표시합니다.
            </span>
          </div>
        </label>

        <label
          htmlFor={`${idPrefix}-pdf`}
          className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3"
        >
          <Checkbox
            id={`${idPrefix}-pdf`}
            checked={value.showOnPdf}
            onCheckedChange={(checked) => onChange({ showOnPdf: Boolean(checked) })}
            disabled={disabled}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              PDF 출력 자료에 포함합니다.
            </span>
          </div>
        </label>
      </div>
    </div>
  )
}
