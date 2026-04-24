import { NextRequest, NextResponse } from 'next/server';

import { DEFAULT_LOCALE, isLocale, type Locale, getLocalizedPath, stripLocaleFromPathname } from '@/i18n/config';

const LOCALE_COOKIE_NAME = 'afeel-locale';
const PUBLIC_PATHS = new Set(['/', '/about', '/partner', '/portfolio', '/contact', '/feed']);

function getLocaleFromHeader(request: NextRequest): Locale {
	const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';

	if (acceptLanguage.includes('zh')) {
		return 'zh';
	}

	if (acceptLanguage.includes('en')) {
		return 'en';
	}

	return DEFAULT_LOCALE;
}

function getPreferredLocale(request: NextRequest): Locale {
	const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

	if (cookieLocale && isLocale(cookieLocale)) {
		return cookieLocale;
	}

	return getLocaleFromHeader(request);
}

function isPublicPath(pathname: string) {
	return PUBLIC_PATHS.has(stripLocaleFromPathname(pathname));
}

function withLocaleCookie(response: NextResponse, locale: Locale) {
	response.cookies.set(LOCALE_COOKIE_NAME, locale, {
		path: '/',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 365,
	});

	return response;
}

export function proxy(request: NextRequest) {
	const { nextUrl } = request;
	const pathname = nextUrl.pathname;
	const selectedLocale = nextUrl.searchParams.get('locale');

	if (!isPublicPath(pathname)) {
		return NextResponse.next();
	}

	if (selectedLocale && isLocale(selectedLocale)) {
		const redirectUrl = nextUrl.clone();
		redirectUrl.searchParams.delete('locale');
		redirectUrl.pathname = getLocalizedPath(selectedLocale, stripLocaleFromPathname(pathname));

		return withLocaleCookie(NextResponse.redirect(redirectUrl), selectedLocale);
	}

	if (pathname === '/en' || pathname.startsWith('/en/')) {
		return withLocaleCookie(NextResponse.next(), 'en');
	}

	if (pathname === '/zh' || pathname.startsWith('/zh/')) {
		return withLocaleCookie(NextResponse.next(), 'zh');
	}

	const preferredLocale = getPreferredLocale(request);

	if (preferredLocale !== DEFAULT_LOCALE) {
		const redirectUrl = nextUrl.clone();
		redirectUrl.pathname = getLocalizedPath(preferredLocale, pathname);
		return withLocaleCookie(NextResponse.redirect(redirectUrl), preferredLocale);
	}

	return withLocaleCookie(NextResponse.next(), DEFAULT_LOCALE);
}

export const config = {
	matcher: ['/((?!api|admin|_next/static|_next/image|favicon.ico|favicon|images|fonts|.*\\..*).*)'],
};
