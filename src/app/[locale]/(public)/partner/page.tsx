import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getPartnerMetadata, PartnerPageView } from '@/views/site/partner-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/partner'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return getPartnerMetadata(locale);
}

export default async function LocalizedPartnerPage({ params }: PageProps<'/[locale]/partner'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return <PartnerPageView locale={locale} />;
}
