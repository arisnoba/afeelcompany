export const PORTFOLIO_CATEGORIES = ['상의', '하의', '신발', '악세서리', '기타', '남성', '여성'] as const

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number]

const PORTFOLIO_CATEGORY_SET = new Set<string>(PORTFOLIO_CATEGORIES)
const PORTFOLIO_CATEGORY_SEPARATOR = '|'

export function isPortfolioCategory(value: string): value is PortfolioCategory {
  return PORTFOLIO_CATEGORY_SET.has(value)
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
    const trimmed = value.trim()

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
  const categories = Array.isArray(value)
    ? normalizePortfolioCategories(value)
    : parsePortfolioCategories(value)

  return categories.includes(category)
}

export function formatPortfolioCategories(
  value: string | readonly PortfolioCategory[]
): string {
  const categories = Array.isArray(value)
    ? normalizePortfolioCategories(value)
    : parsePortfolioCategories(value)

  if (categories.length > 0) {
    return categories.join(' · ')
  }

  return typeof value === 'string' ? value.trim() : ''
}

export interface PortfolioItemRecord {
  id: string
  title: string
  brand_name: string
  celebrity_name: string | null
  category: PortfolioCategory | string
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
  brandName: string
  celebrityName: string | null
  category: PortfolioCategory | string
  imageUrl: string
  thumbnailUrl: string | null
  hoverImageUrl: string | null
  showOnWeb: boolean
  showOnPdf: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}
