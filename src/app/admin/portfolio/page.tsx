import { sql } from '@/lib/db';
import { resolvePortfolioHoverImageUrl } from '@/lib/portfolio-brand'
import type { ClientBrandAdminItem } from '@/types/client-brand';
import { PortfolioTable } from '@/components/admin/PortfolioTable';
import type { PortfolioAdminItem } from '@/types/portfolio';

interface PortfolioPageRow {
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
	show_on_web: boolean;
	show_on_pdf: boolean;
	sort_order: number;
}

interface ClientBrandRow {
	id: string;
	name: string;
	logo_url: string | null;
	brand_url: string | null;
	sort_order: number;
	is_active: boolean;
}

function mapPortfolioRow(row: PortfolioPageRow): PortfolioAdminItem {
	return {
		id: row.id,
		title: row.title,
		clientBrandId: row.client_brand_id,
		clientBrandLogoUrl: row.client_brand_logo_url,
		brandName: row.brand_name,
		celebrityName: row.celebrity_name,
		category: row.category,
		instagramUrl: row.instagram_url,
		imageUrl: row.image_url,
		thumbnailUrl: row.thumbnail_url,
		hoverImageUrl: resolvePortfolioHoverImageUrl(row.client_brand_logo_url, row.thumbnail_url),
		showOnWeb: row.show_on_web,
		showOnPdf: row.show_on_pdf,
		sortOrder: row.sort_order,
	};
}

function mapClientBrandRow(row: ClientBrandRow): ClientBrandAdminItem {
	return {
		id: row.id,
		name: row.name,
		logoUrl: row.logo_url,
		brandUrl: row.brand_url,
		sortOrder: row.sort_order,
		isActive: row.is_active,
	};
}

export default async function AdminPortfolioPage() {
	const [portfolioResult, clientBrandResult] = await Promise.all([
		sql<PortfolioPageRow>`
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
        p.show_on_web,
        p.show_on_pdf,
        p.sort_order
      FROM portfolio_items AS p
      LEFT JOIN client_brands AS cb
        ON cb.id = p.client_brand_id
      ORDER BY p.sort_order ASC, p.created_at DESC
    `,
		sql<ClientBrandRow>`
      SELECT id, name, logo_url, brand_url, sort_order, is_active
      FROM client_brands
      ORDER BY sort_order ASC, created_at ASC
    `,
	]);

	return (
		<div className="flex flex-col gap-4">
			<PortfolioTable
				initialItems={portfolioResult.rows.map(mapPortfolioRow)}
				clientBrands={clientBrandResult.rows.map(mapClientBrandRow)}
			/>
		</div>
	);
}
