import { notFound } from 'next/navigation';

import { PublicShell } from '@/components/site/PublicShell';
import { DEFAULT_LOCALE, LOCALES, isLocale } from '@/i18n/config';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
	return LOCALES.filter(locale => locale !== DEFAULT_LOCALE).map(locale => ({ locale }));
}

export default async function LocalizedPublicLayout({
	children,
	params,
}: LayoutProps<'/[locale]'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return <PublicShell locale={locale}>{children}</PublicShell>;
}
