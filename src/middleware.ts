import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getPathnameLocale } from '@/i18n/config';

const LEGACY_NOT_FOUND_PREFIXES = [
	'/member',
	'/product',
	'/myshop',
	'/order',
	'/cart',
	'/basket',
	'/shop',
	'/exec/front',
];

const LEGACY_NOT_FOUND_PATTERNS = [/^\/대분류-/u, /^\/중분류-/u, /^\/샘플상품-/u];

function legacyNotFoundHtml() {
	return `<!doctype html>
<html lang="ko">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="noindex, nofollow" />
	<title>페이지를 찾을 수 없습니다 | afeelcompany</title>
	<style>
		:root {
			color-scheme: light;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			color: #171717;
			background: #f7f7f4;
		}

		body {
			margin: 0;
			min-height: 100vh;
			display: grid;
			place-items: center;
			padding: 32px 20px;
		}

		main {
			width: min(100%, 520px);
		}

		p {
			margin: 0;
			color: #555;
			font-size: 15px;
			line-height: 1.7;
		}

		.eyebrow {
			margin-bottom: 16px;
			color: #8a8174;
			font-size: 12px;
			font-weight: 700;
			letter-spacing: 0;
			text-transform: uppercase;
		}

		h1 {
			margin: 0 0 14px;
			font-size: clamp(30px, 8vw, 48px);
			line-height: 1.08;
			font-weight: 700;
			letter-spacing: 0;
		}

		.actions {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 28px;
		}

		a {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-height: 44px;
			padding: 0 16px;
			border: 1px solid #171717;
			border-radius: 4px;
			color: #171717;
			font-size: 14px;
			font-weight: 600;
			text-decoration: none;
		}

		a.primary {
			background: #171717;
			color: #fff;
		}
	</style>
</head>
<body>
	<main>
		<p class="eyebrow">404 Not Found</p>
		<h1>페이지를 찾을 수 없습니다.</h1>
		<p>이 주소는 이전 쇼핑몰에서 사용하던 페이지로, 현재 사이트에서는 더 이상 제공하지 않습니다.</p>
		<div class="actions" aria-label="바로가기">
			<a class="primary" href="/">홈으로 이동</a>
			<a href="/portfolio">포트폴리오 보기</a>
			<a href="/contact">문의하기</a>
		</div>
	</main>
</body>
</html>`;
}

function decodePathname(pathname: string) {
	try {
		return decodeURIComponent(pathname);
	} catch {
		return pathname;
	}
}

function isLegacyNotFoundPath(pathname: string) {
	return (
		LEGACY_NOT_FOUND_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
		LEGACY_NOT_FOUND_PATTERNS.some(pattern => pattern.test(pathname))
	);
}

export function middleware(request: NextRequest) {
	const pathname = decodePathname(request.nextUrl.pathname);

	if (isLegacyNotFoundPath(pathname)) {
		return new Response(legacyNotFoundHtml(), {
			status: 404,
			headers: {
				'content-type': 'text/html; charset=utf-8',
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
