import { LocaleHtmlAttributes } from '@/components/site/LocaleHtmlAttributes';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { PublicSmoothScroll } from '@/components/site/PublicSmoothScroll';
import { LOCALE_LANG_TAGS, type Locale } from '@/i18n/config';
import { getSiteCompanyProfile } from '@/lib/site';

interface PublicShellProps {
	children: React.ReactNode;
	locale: Locale;
}

export async function PublicShell({ children, locale }: PublicShellProps) {
	const profile = await getSiteCompanyProfile();

	return (
		<PublicSmoothScroll>
			<LocaleHtmlAttributes lang={LOCALE_LANG_TAGS[locale]} />
			<div className="min-h-screen text-stone-950 [font-family:var(--font-manrope)]">
				<div className="relative flex min-h-screen flex-col">
					<SiteHeader locale={locale} />
					<main className="flex-1 pb-16">{children}</main>
					<SiteFooter profile={profile} locale={locale} />
				</div>
			</div>
		</PublicSmoothScroll>
	);
}
