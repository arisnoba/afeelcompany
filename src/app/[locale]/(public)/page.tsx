import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getHomeMetadata, HomePageView } from '@/views/site/home-page';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return getHomeMetadata(locale);
}

export default async function LocalizedHomePage({ params }: PageProps<'/[locale]'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return <HomePageView locale={locale} />;
}
