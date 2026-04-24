import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';

export const INTERNATIONAL_SITE_ADDRESS = '3F, 10-2, Dosan-daero 49-gil, Gangnam-gu, Seoul, Republic of Korea';

export function getLocalizedSiteAddress(locale: Locale, address: string) {
	if (locale === DEFAULT_LOCALE) {
		return address.trim();
	}

	return INTERNATIONAL_SITE_ADDRESS;
}
