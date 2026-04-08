import { ClientBrandTable } from '@/components/admin/ClientBrandTable';
import { sql } from '@/lib/db';
import type { ClientBrandAdminItem } from '@/types/client-brand';

interface ClientBrandRow {
	id: string;
	name: string;
	logo_url: string | null;
	brand_url: string | null;
	sort_order: number;
	is_active: boolean;
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

export default async function AdminClientsPage() {
	const result = await sql<ClientBrandRow>`
    SELECT id, name, logo_url, brand_url, sort_order, is_active
    FROM client_brands
    ORDER BY sort_order ASC, created_at ASC
  `;

	return (
		<div className="grid gap-6">
			<ClientBrandTable initialItems={result.rows.map(mapClientBrandRow)} />
		</div>
	);
}
