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
  brandName: string
  celebrityName: string | null
  category: string
  imageUrl: string
  thumbnailUrl: string | null
  hoverImageUrl: string | null
  sortOrder: number
}
