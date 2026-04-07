import { sql } from '@/lib/db';
import type { PublicPortfolioItem, SiteClientBrand, SiteCompanyProfile } from '@/types/site';

export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/a_feel_company/';

interface CompanyProfileRow {
	about_text: string | null;
	contact_email: string | null;
	contact_phone: string | null;
	address: string | null;
}

interface ClientBrandRow {
	id: string;
	name: string;
	logo_url: string | null;
	sort_order: number;
}

interface PortfolioItemRow {
	id: string;
	title: string;
	brand_name: string;
	celebrity_name: string | null;
	category: string;
	instagram_url: string | null;
	image_url: string;
	thumbnail_url: string | null;
	sort_order: number;
}

function mapCompanyProfile(row?: CompanyProfileRow): SiteCompanyProfile {
	return {
		aboutText: row?.about_text ?? '',
		contactEmail: row?.contact_email ?? '',
		contactPhone: row?.contact_phone ?? '',
		address: row?.address ?? '',
	};
}

function mapClientBrand(row: ClientBrandRow): SiteClientBrand {
	return {
		id: row.id,
		name: row.name,
		logoUrl: row.logo_url,
		sortOrder: row.sort_order,
	};
}

function mapPortfolioItem(row: PortfolioItemRow): PublicPortfolioItem {
	return {
		id: row.id,
		title: row.title,
		brandName: row.brand_name,
		celebrityName: row.celebrity_name,
		category: row.category,
		instagramUrl: row.instagram_url,
		imageUrl: row.image_url,
		thumbnailUrl: row.thumbnail_url,
		hoverImageUrl: row.thumbnail_url,
		sortOrder: row.sort_order,
	};
}

export async function getSiteCompanyProfile(): Promise<SiteCompanyProfile> {
	const result = await sql<CompanyProfileRow>`
    SELECT about_text, contact_email, contact_phone, address
    FROM company_profile
    ORDER BY updated_at DESC
    LIMIT 1
  `;

	return mapCompanyProfile(result.rows[0]);
}

export async function getSiteClientBrands(): Promise<SiteClientBrand[]> {
	const result = await sql<ClientBrandRow>`
    SELECT id, name, logo_url, sort_order
    FROM client_brands
    WHERE is_active = true
    ORDER BY sort_order ASC, created_at ASC
  `;

	return result.rows.map(mapClientBrand);
}

export async function getFeaturedPortfolio(limit = 6): Promise<PublicPortfolioItem[]> {
	const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.trunc(limit)) : 6;

	const result = await sql<PortfolioItemRow>`
    SELECT
      id,
      title,
      brand_name,
      celebrity_name,
      category,
      instagram_url,
      image_url,
      thumbnail_url,
      sort_order
    FROM portfolio_items
    WHERE show_on_web = true
    ORDER BY sort_order ASC, created_at DESC
    LIMIT ${safeLimit}
  `;

	return result.rows.map(mapPortfolioItem);
}

export async function getPublicPortfolioItems(): Promise<PublicPortfolioItem[]> {
	const result = await sql<PortfolioItemRow>`
    SELECT
      id,
      title,
      brand_name,
      celebrity_name,
      category,
      instagram_url,
      image_url,
      thumbnail_url,
      sort_order
    FROM portfolio_items
    WHERE show_on_web = true
    ORDER BY sort_order ASC, created_at DESC
  `;

	return result.rows.map(mapPortfolioItem);
}
