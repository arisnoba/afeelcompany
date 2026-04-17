import { sql } from '@/lib/db';

export interface DashboardStats {
	portfolio: {
		total: number;
		webVisible: number;
		pdfVisible: number;
		recent: number; // last 7 days
	};
	clients: {
		total: number;
		active: number;
	};
}

export async function getDashboardStats(): Promise<DashboardStats> {
	const [portfolioCount, clientCount] = await Promise.all([
		sql`
      SELECT 
        count(*) as total,
        count(*) FILTER (WHERE show_on_web = true) as web_visible,
        count(*) FILTER (WHERE show_on_pdf = true) as pdf_visible,
        count(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent
      FROM portfolio_items
    `,
		sql`
      SELECT 
        count(*) as total,
        count(*) FILTER (WHERE is_active = true) as active
      FROM client_brands
    `,
	]);

	return {
		portfolio: {
			total: Number(portfolioCount.rows[0].total),
			webVisible: Number(portfolioCount.rows[0].web_visible),
			pdfVisible: Number(portfolioCount.rows[0].pdf_visible),
			recent: Number(portfolioCount.rows[0].recent),
		},
		clients: {
			total: Number(clientCount.rows[0].total),
			active: Number(clientCount.rows[0].active),
		},
	};
}
