import fs from 'node:fs';
import path from 'node:path';

import { sql } from '@vercel/postgres';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const CLIENT_LOGO_DIR = path.join(process.cwd(), 'public', 'images', 'client-logos');

const PORTFOLIO_BRAND_ALIASES = [
	{ portfolioBrandName: 'effect de soleil', clientBrandName: 'Effet de Soleil' },
	{ portfolioBrandName: '마티레(MTTIRÉ)', clientBrandName: 'mttire' },
];

function loadEnvFile(filepath) {
	if (!fs.existsSync(filepath)) {
		return;
	}

	const source = fs.readFileSync(filepath, 'utf8');

	for (const rawLine of source.split('\n')) {
		const line = rawLine.trim();

		if (!line || line.startsWith('#')) {
			continue;
		}

		const separatorIndex = line.indexOf('=');

		if (separatorIndex < 0) {
			continue;
		}

		const key = line.slice(0, separatorIndex).trim();
		const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

		if (!(key in process.env)) {
			process.env[key] = value;
		}
	}
}

function getClientBrandsFromPublicDir() {
	return fs
		.readdirSync(CLIENT_LOGO_DIR, { withFileTypes: true })
		.filter(entry => entry.isFile())
		.map(entry => entry.name)
		.filter(filename => IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase()))
		.sort((left, right) => left.localeCompare(right, 'en', { sensitivity: 'base' }))
		.map((filename, index) => ({
			name: path.parse(filename).name,
			logoUrl: `/images/client-logos/${encodeURIComponent(filename)}`,
			brandUrl: null,
			sortOrder: index,
		}));
}

async function main() {
	loadEnvFile(path.join(process.cwd(), '.env.local'));

	if (!process.env.POSTGRES_URL) {
		throw new Error('POSTGRES_URL이 설정되어 있지 않습니다.');
	}

	const brands = getClientBrandsFromPublicDir();

	if (brands.length === 0) {
		throw new Error('public/images/client-logos 에 사용할 로고 파일이 없습니다.');
	}

	const client = await sql.connect();

	try {
		await client.query('BEGIN');

		await client.query(`
			UPDATE portfolio_items
			SET client_brand_id = NULL,
			    updated_at = NOW()
			WHERE client_brand_id IS NOT NULL
		`);

		await client.query('DELETE FROM client_brands');

		for (const brand of brands) {
			await client.query(
				`
					INSERT INTO client_brands (name, logo_url, brand_url, sort_order, is_active)
					VALUES ($1, $2, $3, $4, true)
				`,
				[brand.name, brand.logoUrl, brand.brandUrl, brand.sortOrder]
			);
		}

		await client.query(`
			UPDATE portfolio_items AS portfolio
			SET client_brand_id = brand.id,
			    updated_at = NOW()
			FROM client_brands AS brand
			WHERE LOWER(BTRIM(portfolio.brand_name)) = LOWER(BTRIM(brand.name))
		`);

		for (const alias of PORTFOLIO_BRAND_ALIASES) {
			await client.query(
				`
					UPDATE portfolio_items AS portfolio
					SET client_brand_id = brand.id,
					    updated_at = NOW()
					FROM client_brands AS brand
					WHERE portfolio.client_brand_id IS NULL
					  AND LOWER(BTRIM(portfolio.brand_name)) = LOWER(BTRIM($1))
					  AND LOWER(BTRIM(brand.name)) = LOWER(BTRIM($2))
				`,
				[alias.portfolioBrandName, alias.clientBrandName]
			);
		}

		await client.query('COMMIT');

		const brandCountResult = await client.query('SELECT COUNT(*)::int AS count FROM client_brands');
		const linkedCountResult = await client.query(`
			SELECT
				COUNT(*) FILTER (WHERE client_brand_id IS NOT NULL)::int AS linked_count,
				COUNT(*)::int AS total_count
			FROM portfolio_items
		`);

		const brandCount = brandCountResult.rows[0]?.count ?? 0;
		const linkedSummary = linkedCountResult.rows[0] ?? { linked_count: 0, total_count: 0 };

		console.log(
			JSON.stringify(
				{
					brandCount,
					linkedPortfolioCount: linkedSummary.linked_count,
					totalPortfolioCount: linkedSummary.total_count,
				},
				null,
				2
			)
		);
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

main().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
