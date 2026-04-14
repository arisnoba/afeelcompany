export type PdfSectionId = 'cover' | 'about' | 'work' | 'client' | 'contact'

export interface PdfContact {
  email: string
  phone: string
  address: string
}

export interface PdfPortfolioItem {
  id: string
  title: string
  clientBrandId: string | null
  brandName: string
  brandLogoUrl: string | null
  celebrityName: string | null
  category: string
  imageUrl: string
  thumbnailUrl: string | null
  showOnPdf: boolean
  sortOrder: number
}

export interface PdfClientBrand {
  id: string
  name: string
  logoUrl: string | null
  sortOrder: number
}

export interface PdfDocument {
  title: string
  issueDate: string
  heroImageUrl: string
  aboutText: string
  contact: PdfContact
  workItems: PdfPortfolioItem[]
  clientBrands: PdfClientBrand[]
  sectionOrder: PdfSectionId[]
}
