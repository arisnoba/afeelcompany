interface BrandWithLogo {
  name: string
  logoUrl: string | null
}

export function normalizeBrandName(name: string) {
  return name
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, ' and ')
    .replace(/[-_/]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
}

export function getBrandsWithLogos<T extends BrandWithLogo>(brands: T[]) {
  return brands.filter((brand): brand is T & { logoUrl: string } => Boolean(brand.logoUrl?.trim()))
}

export function buildBrandLogoUrlMap<T extends BrandWithLogo>(brands: T[]) {
  const logoMap = new Map<string, string>()

  for (const brand of getBrandsWithLogos(brands)) {
    const normalizedName = normalizeBrandName(brand.name)

    if (!normalizedName || logoMap.has(normalizedName)) {
      continue
    }

    logoMap.set(normalizedName, brand.logoUrl)
  }

  return logoMap
}

export function findBrandLogoUrl(name: string, logoMap: Map<string, string>) {
  return logoMap.get(normalizeBrandName(name)) ?? null
}
