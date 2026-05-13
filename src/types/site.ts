import type { PortfolioCategory } from '@/types/portfolio'

export interface SiteCompanyProfile {
  aboutText: string
  contactEmail: string
  contactPhone: string
  address: string
}

export interface SiteClientBrand {
  id: string
  name: string
  logoUrl: string | null
  sortOrder: number
}

export interface PublicPortfolioItem {
  id: string
  title: string
  clientBrandId: string | null
  brandName: string
  celebrityName: string | null
  category: string
  instagramUrl: string | null
  imageUrl: string
  clientBrandLogoUrl: string | null
  thumbnailUrl: string | null
  hoverImageUrl: string | null
  sortOrder: number
  createdAt: string
}

export interface PublicPortfolioPageResult {
  items: PublicPortfolioItem[]
  nextCursor: string | null
}

export interface PublicPortfolioInitialPage extends PublicPortfolioPageResult {
  categoryCounts: Record<PortfolioCategory, number>
}
