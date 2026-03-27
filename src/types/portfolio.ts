export const PORTFOLIO_CATEGORIES = ['상의', '하의', '신발', '악세서리', '기타'] as const

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number]

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
  showOnWeb: boolean
  showOnPdf: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}
