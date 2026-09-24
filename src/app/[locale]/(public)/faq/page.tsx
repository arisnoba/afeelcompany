import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { FaqPageView, getFaqMetadata } from '@/views/site/faq-page';

type FaqPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: FaqPageProps) {
	const { locale } = await params;
	if (!isLocale(locale) || locale === DEFAULT_LOCALE) notFound();
	return getFaqMetadata(locale);
}

export default async function LocalizedFaqPage({ params }: FaqPageProps) {
	const { locale } = await params;
	if (!isLocale(locale) || locale === DEFAULT_LOCALE) notFound();
	return <FaqPageView locale={locale} />;
}
