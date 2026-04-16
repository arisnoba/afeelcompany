export const PORTFOLIO_CATEGORIES = ['남성', '여성', '악세서리', '슈즈'] as const

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number]

const PORTFOLIO_CATEGORY_SET = new Set<string>(PORTFOLIO_CATEGORIES)
const PORTFOLIO_CATEGORY_SEPARATOR = '|'
const PORTFOLIO_CATEGORY_ALIASES: Record<string, PortfolioCategory> = {
  신발: '슈즈',
}

function toCanonicalPortfolioCategory(value: string): string {
  return PORTFOLIO_CATEGORY_ALIASES[value] ?? value
}

export function isPortfolioCategory(value: string): value is PortfolioCategory {
  return PORTFOLIO_CATEGORY_SET.has(toCanonicalPortfolioCategory(value))
}

function splitPortfolioCategoryValue(value: string): string[] {
  if (value.includes(PORTFOLIO_CATEGORY_SEPARATOR)) {
    return value.split(PORTFOLIO_CATEGORY_SEPARATOR)
  }

  return value.split(',')
}

function normalizePortfolioCategories(values: readonly string[]): PortfolioCategory[] {
  const seen = new Set<PortfolioCategory>()

  return values.reduce<PortfolioCategory[]>((categories, value) => {
    const trimmed = toCanonicalPortfolioCategory(value.trim())

    if (!isPortfolioCategory(trimmed) || seen.has(trimmed)) {
      return categories
    }

    seen.add(trimmed)
    categories.push(trimmed)

    return categories
  }, [])
}

export function parsePortfolioCategories(value: string | null | undefined): PortfolioCategory[] {
  if (!value) {
    return []
  }

  return normalizePortfolioCategories(splitPortfolioCategoryValue(value))
}

export function serializePortfolioCategories(
  categories: readonly PortfolioCategory[]
): string {
  return normalizePortfolioCategories(categories).join(PORTFOLIO_CATEGORY_SEPARATOR)
}

export function isSerializedPortfolioCategories(value: string): boolean {
  const rawCategories = splitPortfolioCategoryValue(value)
    .map((category) => category.trim())
    .filter(Boolean)

  if (rawCategories.length === 0) {
    return false
  }

  return normalizePortfolioCategories(rawCategories).length === rawCategories.length
}

export function includesPortfolioCategory(
  value: string | readonly PortfolioCategory[],
  category: PortfolioCategory
): boolean {
  const categories =
    typeof value === 'string'
      ? parsePortfolioCategories(value)
      : normalizePortfolioCategories(value)

  return categories.includes(category)
}

export function formatPortfolioCategories(
  value: string | readonly PortfolioCategory[]
): string {
  const categories =
    typeof value === 'string'
      ? parsePortfolioCategories(value)
      : normalizePortfolioCategories(value)

  if (categories.length > 0) {
    return categories.join(' · ')
  }

  return typeof value === 'string' ? value.trim() : ''
}

interface PortfolioNamingSource {
  title?: string | null
  brandName?: string | null
  brand_name?: string | null
  celebrityName?: string | null
  celebrity_name?: string | null
}

function getNormalizedBrandName(source: PortfolioNamingSource): string {
  return (source.brandName ?? source.brand_name ?? '').trim()
}

function getNormalizedCelebrityName(source: PortfolioNamingSource): string {
  return (source.celebrityName ?? source.celebrity_name ?? '').trim()
}

function getNormalizedTitle(source: PortfolioNamingSource): string {
  return (source.title ?? '').trim()
}

export function buildPortfolioTitle(source: PortfolioNamingSource): string {
  const brandName = getNormalizedBrandName(source)
  const celebrityName = getNormalizedCelebrityName(source)

  if (brandName && celebrityName) {
    return `${brandName} / ${celebrityName}`
  }

  return celebrityName || brandName || getNormalizedTitle(source) || '포트폴리오'
}

export function getPortfolioDisplayName(source: PortfolioNamingSource): string {
  return (
    getNormalizedCelebrityName(source) ||
    getNormalizedBrandName(source) ||
    getNormalizedTitle(source) ||
    '포트폴리오'
  )
}

export function getPortfolioAdminLabel(source: PortfolioNamingSource): string {
  const brandName = getNormalizedBrandName(source)
  const displayName = getPortfolioDisplayName(source)

  if (brandName && displayName !== brandName) {
    return `${brandName} / ${displayName}`
  }

  return brandName || displayName
}

export function getPortfolioImageAlt(source: PortfolioNamingSource): string {
  const parts = [getNormalizedBrandName(source), getNormalizedCelebrityName(source)].filter(
    (value, index, values) => Boolean(value) && values.indexOf(value) === index
  )

  return parts.join(' ') || getPortfolioDisplayName(source)
}

export interface PortfolioItemRecord {
  id: string
  title: string
  client_brand_id: string | null
  client_brand_logo_url?: string | null
  brand_name: string
  celebrity_name: string | null
  category: PortfolioCategory | string
  instagram_url: string | null
  image_url: string
  thumbnail_url: string | null
  show_on_web: boolean
  show_on_pdf: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PortfolioAdminItem {
  id: string
  title: string
  clientBrandId: string | null
  clientBrandLogoUrl: string | null
  brandName: string
  celebrityName: string | null
  category: PortfolioCategory | string
  instagramUrl: string | null
  imageUrl: string
  thumbnailUrl: string | null
  hoverImageUrl: string | null
  showOnWeb: boolean
  showOnPdf: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}
