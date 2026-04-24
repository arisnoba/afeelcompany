import type { Metadata } from 'next';

import ContactMap from '@/components/site/ContactMap';
import ContactInquiryForm from '@/components/site/ContactInquiryForm';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import { getLocalizedSiteAddress } from '@/lib/site-address';
import { createPageMetadata } from '@/lib/seo';
import { getSiteCompanyProfile } from '@/lib/site';

function renderValue(value: string, fallback: string) {
	return value || fallback;
}

function ContactDetail({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-start gap-4 md:gap-6">
			<span className="block text-[0.62rem] font-semibold uppercase leading-none tracking-[0.32em] text-stone-400">{label}</span>
			{children}
		</div>
	);
}

export function getContactMetadata(locale: Locale): Metadata {
	const copy = getSiteDictionary(locale).contact.metadata;

	return createPageMetadata({
		title: copy.title,
		description: copy.description,
		path: '/contact',
		keywords: copy.keywords,
		locale,
	});
}

export async function ContactPageView({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
	const copy = getSiteDictionary(locale).contact;
	const profile = await getSiteCompanyProfile();
	const email = profile.contactEmail.trim();
	const phone = profile.contactPhone.trim();
	const address = getLocalizedSiteAddress(locale, profile.address);
	const mailtoHref = email ? `mailto:${email}` : undefined;
	const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
	const canSubmitInquiry = Boolean(email) && Boolean(process.env.RESEND_API_KEY?.trim()) && Boolean(process.env.RESEND_FROM_EMAIL?.trim());

	return (
		<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
			<div className="grid gap-16 py-10 sm:gap-20 sm:py-14 lg:gap-24 lg:py-20">
				<header className="block space-y-6">
					<AnimatedPageTitle lines={[{ text: copy.title }]} className="text-5xl font-light leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]" />
				</header>

				<section className="flex flex-col gap-14 lg:flex-row lg:gap-20">
					<div className="flex flex-col gap-12 lg:w-[calc(41.666%-40px)] lg:gap-16">
						<ContactMap address={address} apiKey={googleMapsApiKey} />

						<div className="flex flex-col gap-6 md:gap-12">
							<ContactDetail label={copy.addressLabel}>
								<address className="not-italic text-xl leading-snug text-stone-900 [font-family:var(--font-newsreader)] sm:text-2xl">{renderValue(address, copy.pendingLabel)}</address>
							</ContactDetail>

							<div className="flex flex-col gap-6 md:flex-row md:gap-12">
								<div className="flex-1">
									<ContactDetail label={copy.emailLabel}>
										{email ? (
											<a href={mailtoHref} className="text-xl leading-tight text-stone-900 transition hover:text-[#274133] [font-family:var(--font-newsreader)]">
												{email}
											</a>
										) : (
											<p className="text-lg text-stone-500">{copy.pendingLabel}</p>
										)}
									</ContactDetail>
								</div>

								<div className="flex-1">
									<ContactDetail label={copy.directLabel}>
										{phone ? (
											<a href={`tel:${phone}`} className="text-xl leading-tight text-stone-900 transition hover:text-[#274133] [font-family:var(--font-newsreader)]">
												{phone}
											</a>
										) : (
											<p className="text-lg text-stone-500">{copy.pendingLabel}</p>
										)}
									</ContactDetail>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-1 flex-col gap-8 border border-stone-900/10 bg-[#f6f3f2] p-8 sm:p-10 lg:p-12">
						<div className="flex flex-col gap-4">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">{copy.panelEyebrow}</p>
							<AnimatedPageTitle
								as="h2"
								lines={[{ text: copy.panelTitle }]}
								delay={0.04}
								duration={0.42}
								lineStagger={0.1}
								className="text-4xl leading-tight tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl"
							/>
							<p className="max-w-2xl text-base leading-6 text-stone-600 text-balance">{copy.panelDescription}</p>
						</div>

						<ContactInquiryForm canSubmit={canSubmitInquiry} text={copy.form} />
					</div>
				</section>
			</div>
		</div>
	);
}
