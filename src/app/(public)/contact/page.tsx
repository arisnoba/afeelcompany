import type { Metadata } from 'next';

import ContactMap from '@/components/site/ContactMap';
import ContactInquiryForm from '@/components/site/ContactInquiryForm';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { createPageMetadata } from '@/lib/seo';
import { getSiteCompanyProfile } from '@/lib/site';

function renderValue(value: string) {
	return value || '정보를 준비 중입니다.';
}

function ContactDetail({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-start gap-4 md:gap-6">
			<span className="block text-[0.62rem] font-semibold uppercase leading-none tracking-[0.32em] text-stone-400">{label}</span>
			{children}
		</div>
	);
}

export const metadata: Metadata = createPageMetadata({
	title: '문의하기',
	description: '브랜드 협업, 스타일링, 패션 PR 운영 문의를 AFEEL Company에 직접 남길 수 있는 연락 페이지입니다.',
	path: '/contact',
	keywords: ['문의하기', '패션 PR 문의', '브랜드 협업 문의'],
});

export default async function ContactPage() {
	const profile = await getSiteCompanyProfile();
	const email = profile.contactEmail.trim();
	const phone = profile.contactPhone.trim();
	const address = profile.address.trim();
	const mailtoHref = email ? `mailto:${email}` : undefined;
	const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
	const canSubmitInquiry = Boolean(email) && Boolean(process.env.RESEND_API_KEY?.trim()) && Boolean(process.env.RESEND_FROM_EMAIL?.trim());

	return (
		<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
			<div className="grid gap-16 py-10 sm:gap-20 sm:py-14 lg:gap-24 lg:py-20">
				<header className="block space-y-6">
					{/* <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Connect With Us</p> */}
					<AnimatedPageTitle lines={[{ text: 'Get In Touch.' }]} className="text-5xl font-light leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]" />
				</header>

				<section className="flex flex-col gap-14 lg:flex-row lg:gap-20">
					<div className="flex flex-col gap-12 lg:w-[calc(41.666%-40px)] lg:gap-16">
						<ContactMap address={address} apiKey={googleMapsApiKey} />

						<div className="flex flex-col gap-6 md:gap-12">
							<ContactDetail label="Address">
								<address className="not-italic text-xl leading-snug text-stone-900 [font-family:var(--font-newsreader)] sm:text-2xl">{renderValue(address)}</address>
							</ContactDetail>

							<div className="flex flex-col gap-6 md:flex-row md:gap-12">
								<div className="flex-1">
									<ContactDetail label="Email">
										{email ? (
											<a href={mailtoHref} className="text-xl leading-tight text-stone-900 transition hover:text-[#274133] [font-family:var(--font-newsreader)]">
												{email}
											</a>
										) : (
											<p className="text-lg text-stone-500">정보를 준비 중입니다.</p>
										)}
									</ContactDetail>
								</div>

								<div className="flex-1">
									<ContactDetail label="Direct">
										{phone ? (
											<a href={`tel:${phone}`} className="text-xl leading-tight text-stone-900 transition hover:text-[#274133] [font-family:var(--font-newsreader)]">
												{phone}
											</a>
										) : (
											<p className="text-lg text-stone-500">정보를 준비 중입니다.</p>
										)}
									</ContactDetail>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-1 flex-col gap-8 border border-stone-900/10 bg-[#f6f3f2] p-8 sm:p-10 lg:p-12">
						<div className="flex flex-col gap-4">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">Contact</p>
							<AnimatedPageTitle
								as="h2"
								lines={[{ text: 'Inquiry.' }]}
								delay={0.04}
								duration={0.42}
								lineStagger={0.1}
								className="text-4xl leading-tight tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl"
							/>
							<p className="max-w-2xl text-base leading-6 text-stone-600 text-balance">프로젝트 문의 내용을 남겨주시면 담당자가 검토 후 회신 드립니다.</p>
						</div>

						<ContactInquiryForm canSubmit={canSubmitInquiry} />
					</div>
				</section>
			</div>
		</div>
	);
}
