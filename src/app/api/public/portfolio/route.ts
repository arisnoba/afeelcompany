import { decodePortfolioCursor, getPublicPortfolioPage, PUBLIC_PORTFOLIO_PAGE_SIZE } from '@/lib/site';
import { isPortfolioCategory } from '@/types/portfolio';

export async function GET(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url);
	const categoryParam = searchParams.get('category');
	const cursorParam = searchParams.get('cursor');
	const limitParam = searchParams.get('limit');
	const limit = limitParam ? Number.parseInt(limitParam, 10) : PUBLIC_PORTFOLIO_PAGE_SIZE;

	if (categoryParam && !isPortfolioCategory(categoryParam)) {
		return Response.json({ success: false, error: 'INVALID_CATEGORY' }, { status: 400 });
	}

	const cursor = decodePortfolioCursor(cursorParam);

	if (cursorParam && !cursor) {
		return Response.json({ success: false, error: 'INVALID_CURSOR' }, { status: 400 });
	}

	const page = await getPublicPortfolioPage({
		category: categoryParam && isPortfolioCategory(categoryParam) ? categoryParam : null,
		cursor,
		limit,
	});

	return Response.json({
		success: true,
		data: page,
	});
}
