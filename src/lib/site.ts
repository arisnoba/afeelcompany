import { sql } from '@/lib/db';
import { resolvePublicAboutCopy } from '@/lib/company-copy';
import { resolvePortfolioHoverImageUrl } from '@/lib/portfolio-brand'
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from '@/types/portfolio';
import type { PublicPortfolioInitialPage, PublicPortfolioItem, PublicPortfolioPageResult, SiteClientBrand, SiteCompanyProfile } from '@/types/site';

export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/a_feel_company/';
export const NAVER_BLOG_URL = 'https://blog.naver.com/afeelcompany';

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
	client_brand_id: string | null;
	client_brand_logo_url: string | null;
	brand_name: string;
	celebrity_name: string | null;
	category: string;
	instagram_url: string | null;
	image_url: string;
	thumbnail_url: string | null;
	sort_order: number;
	created_at: string;
}

interface PortfolioCategoryCountRow {
	category: PortfolioCategory;
	count: string;
}

interface PortfolioCursor {
	sortOrder: number;
	createdAt: string;
	id: string;
}

export const PUBLIC_PORTFOLIO_PAGE_SIZE = 12;
export const PUBLIC_PORTFOLIO_INITIAL_PAGE_SIZE = 24;

const MAX_PUBLIC_PORTFOLIO_PAGE_SIZE = 48;

function encodePortfolioCursor(item: PublicPortfolioItem): string {
	return Buffer.from(
		JSON.stringify({
			sortOrder: item.sortOrder,
			createdAt: item.createdAt,
			id: item.id,
		} satisfies PortfolioCursor)
	).toString('base64url');
}

export function decodePortfolioCursor(cursor: string | null | undefined): PortfolioCursor | null {
	if (!cursor) {
		return null;
	}

	try {
		const value = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as Partial<PortfolioCursor>;

		if (typeof value.sortOrder !== 'number' || typeof value.createdAt !== 'string' || typeof value.id !== 'string') {
			return null;
		}

		return {
			sortOrder: value.sortOrder,
			createdAt: value.createdAt,
			id: value.id,
		};
	} catch {
		return null;
	}
}

function getSafePortfolioPageSize(limit = PUBLIC_PORTFOLIO_PAGE_SIZE): number {
	if (!Number.isFinite(limit)) {
		return PUBLIC_PORTFOLIO_PAGE_SIZE;
	}

	return Math.min(MAX_PUBLIC_PORTFOLIO_PAGE_SIZE, Math.max(1, Math.trunc(limit)));
}

function mapCompanyProfile(row?: CompanyProfileRow): SiteCompanyProfile {
	return {
		aboutText: resolvePublicAboutCopy(row?.about_text),
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
		clientBrandId: row.client_brand_id,
		brandName: row.brand_name,
		celebrityName: row.celebrity_name,
		category: row.category,
		instagramUrl: row.instagram_url,
		imageUrl: row.image_url,
		clientBrandLogoUrl: row.client_brand_logo_url,
		thumbnailUrl: row.thumbnail_url,
		hoverImageUrl: resolvePortfolioHoverImageUrl(
			row.client_brand_logo_url,
			row.thumbnail_url
		),
		sortOrder: row.sort_order,
		createdAt: row.created_at,
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
      p.id,
      p.title,
      p.client_brand_id,
      cb.logo_url AS client_brand_logo_url,
      p.brand_name,
      p.celebrity_name,
      p.category,
      p.instagram_url,
      p.image_url,
      p.thumbnail_url,
      p.sort_order,
      p.created_at
    FROM portfolio_items AS p
    LEFT JOIN client_brands AS cb
      ON cb.id = p.client_brand_id
    WHERE show_on_web = true
    ORDER BY p.sort_order ASC, p.created_at DESC, p.id ASC
    LIMIT ${safeLimit}
  `;

	return result.rows.map(mapPortfolioItem);
}

async function getPublicPortfolioCategoryCounts(): Promise<Record<PortfolioCategory, number>> {
	const result = await sql<PortfolioCategoryCountRow>`
    SELECT btrim(category_value)::text AS category, COUNT(*)::text AS count
    FROM portfolio_items AS p
    CROSS JOIN LATERAL unnest(string_to_array(replace(p.category, ',', '|'), '|')) AS category_value
    WHERE p.show_on_web = true
    GROUP BY btrim(category_value)
  `;

	const counts = PORTFOLIO_CATEGORIES.reduce<Record<PortfolioCategory, number>>((resultCounts, category) => {
		resultCounts[category] = 0;
		return resultCounts;
	}, {} as Record<PortfolioCategory, number>);

	for (const row of result.rows) {
		const category = row.category.trim() as PortfolioCategory;

		if (category in counts) {
			counts[category] = Number.parseInt(row.count, 10) || 0;
		}
	}

	return counts;
}

export async function getPublicPortfolioPage({
	category,
	cursor,
	limit,
}: {
	category?: PortfolioCategory | null;
	cursor?: PortfolioCursor | null;
	limit?: number;
} = {}): Promise<PublicPortfolioPageResult> {
	const safeLimit = getSafePortfolioPageSize(limit);
	const queryLimit = safeLimit + 1;

	const params: Array<number | string> = [];
	const whereConditions = ['p.show_on_web = true'];

	if (category) {
		params.push(category);
		whereConditions.push(`EXISTS (
      SELECT 1
      FROM unnest(string_to_array(replace(p.category, ',', '|'), '|')) AS category_value
      WHERE btrim(category_value) = $${params.length}
    )`);
	}

	if (cursor) {
		params.push(cursor.sortOrder, cursor.createdAt, cursor.id);
		const sortOrderParam = params.length - 2;
		const createdAtParam = params.length - 1;
		const idParam = params.length;

		whereConditions.push(`(
      p.sort_order > $${sortOrderParam}
      OR (p.sort_order = $${sortOrderParam} AND p.created_at < $${createdAtParam})
      OR (p.sort_order = $${sortOrderParam} AND p.created_at = $${createdAtParam} AND p.id > $${idParam})
    )`);
	}

	params.push(queryLimit);

	const result = await sql.query<PortfolioItemRow>(`
    SELECT
      p.id,
      p.title,
      p.client_brand_id,
      cb.logo_url AS client_brand_logo_url,
      p.brand_name,
      p.celebrity_name,
      p.category,
      p.instagram_url,
      p.image_url,
      p.thumbnail_url,
      p.sort_order,
      p.created_at
    FROM portfolio_items AS p
    LEFT JOIN client_brands AS cb
      ON cb.id = p.client_brand_id
    WHERE ${whereConditions.join('\n      AND ')}
    ORDER BY p.sort_order ASC, p.created_at DESC, p.id ASC
    LIMIT $${params.length}
  `, params);

	const items = result.rows.map(mapPortfolioItem);
	const visibleItems = items.slice(0, safeLimit);
	const nextCursor = items.length > safeLimit ? encodePortfolioCursor(visibleItems[visibleItems.length - 1]) : null;

	return {
		items: visibleItems,
		nextCursor,
	};
}

export async function getPublicPortfolioInitialPage(limit = PUBLIC_PORTFOLIO_INITIAL_PAGE_SIZE): Promise<PublicPortfolioInitialPage> {
	const [page, categoryCounts] = await Promise.all([
		getPublicPortfolioPage({ limit }),
		getPublicPortfolioCategoryCounts(),
	]);

	return {
		...page,
		categoryCounts,
	};
}

export async function getPublicPortfolioItems(): Promise<PublicPortfolioItem[]> {
	const result = await sql<PortfolioItemRow>`
    SELECT
      p.id,
      p.title,
      p.client_brand_id,
      cb.logo_url AS client_brand_logo_url,
      p.brand_name,
      p.celebrity_name,
      p.category,
      p.instagram_url,
      p.image_url,
      p.thumbnail_url,
      p.sort_order,
      p.created_at
    FROM portfolio_items AS p
    LEFT JOIN client_brands AS cb
      ON cb.id = p.client_brand_id
    WHERE show_on_web = true
    ORDER BY p.sort_order ASC, p.created_at DESC, p.id ASC
  `;

	return result.rows.map(mapPortfolioItem);
}
