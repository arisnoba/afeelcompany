import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { AboutPageView, getAboutMetadata } from '@/views/site/about-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return getAboutMetadata(locale);
}

export default async function LocalizedAboutPage({ params }: PageProps<'/[locale]/about'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return <AboutPageView locale={locale} />;
}
