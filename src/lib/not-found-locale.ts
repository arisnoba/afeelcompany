import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/config';

export function resolveNotFoundLocale(value: string | null): Locale {
	return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
