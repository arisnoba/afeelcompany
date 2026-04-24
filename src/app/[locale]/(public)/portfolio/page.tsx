import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getPortfolioMetadata, PortfolioPageView } from '@/views/site/portfolio-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/portfolio'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return getPortfolioMetadata(locale);
}

export default async function LocalizedPortfolioPage({ params }: PageProps<'/[locale]/portfolio'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return <PortfolioPageView locale={locale} />;
}
