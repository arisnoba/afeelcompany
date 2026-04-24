import { notFound } from 'next/navigation';

import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { ContactPageView, getContactMetadata } from '@/views/site/contact-page';

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return getContactMetadata(locale);
}

export default async function LocalizedContactPage({ params }: PageProps<'/[locale]/contact'>) {
	const { locale } = await params;

	if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
		notFound();
	}

	return <ContactPageView locale={locale} />;
}
