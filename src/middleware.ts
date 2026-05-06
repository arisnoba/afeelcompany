import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getPathnameLocale } from '@/i18n/config';

const LEGACY_GONE_PREFIXES = [
	'/member',
	'/product',
	'/category',
	'/myshop',
	'/order',
	'/cart',
	'/basket',
	'/shop',
	'/exec/front',
];

const LEGACY_GONE_PATTERNS = [/^\/대분류-/u, /^\/중분류-/u, /^\/샘플상품-/u];

function decodePathname(pathname: string) {
	try {
		return decodeURIComponent(pathname);
	} catch {
		return pathname;
	}
}

function isLegacyGonePath(pathname: string) {
	return (
		LEGACY_GONE_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
		LEGACY_GONE_PATTERNS.some(pattern => pattern.test(pathname))
	);
}

export function middleware(request: NextRequest) {
	const pathname = decodePathname(request.nextUrl.pathname);

	if (isLegacyGonePath(pathname)) {
		return new Response('Gone', {
			status: 410,
			headers: {
				'content-type': 'text/plain; charset=utf-8',
				'x-robots-tag': 'noindex, nofollow',
			},
		});
	}

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-afeel-locale', getPathnameLocale(pathname));

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico|favicon/|images/|pdf-fixtures/|robots.txt|sitemap.xml|llms.txt).*)'],
};
