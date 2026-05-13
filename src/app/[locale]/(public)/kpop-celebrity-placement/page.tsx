import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { KpopPlacementPageView, getKpopPlacementMetadata } from '@/views/site/kpop-placement-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/kpop-celebrity-placement'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale !== 'zh') {
		notFound();
	}

	return getKpopPlacementMetadata(locale);
}

export default async function LocalizedKpopPlacementPage({ params }: PageProps<'/[locale]/kpop-celebrity-placement'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale !== 'zh') {
		notFound();
	}

	return <KpopPlacementPageView locale={locale} />;
}
