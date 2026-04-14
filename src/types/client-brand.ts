export interface ClientBrandAdminItem {
  id: string
  name: string
  logoUrl: string | null
  brandUrl: string | null
  sortOrder: number
  isActive: boolean
}

export interface ClientBrandOption {
  id: string
  name: string
  logoUrl: string | null
  isActive: boolean
}
