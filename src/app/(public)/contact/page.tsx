import ContactMap from '@/components/site/ContactMap';
import ContactInquiryForm from '@/components/site/ContactInquiryForm';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { getSiteCompanyProfile } from '@/lib/site';

function renderValue(value: string) {
	return value || '정보를 준비 중입니다.';
}

function ContactDetail({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<section className="grid gap-2">
			<span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">{label}</span>
			{children}
		</section>
	);
}

export default async function ContactPage() {
	const profile = await getSiteCompanyProfile();
	const email = profile.contactEmail.trim();
	const phone = profile.contactPhone.trim();
	const address = profile.address.trim();
	const mailtoHref = email ? `mailto:${email}` : undefined;
	const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
	const canSubmitInquiry = Boolean(email) && Boolean(process.env.RESEND_API_KEY?.trim()) && Boolean(process.env.RESEND_FROM_EMAIL?.trim());

	return (
		<div className="grid gap-16 py-10 sm:gap-20 sm:py-14 lg:gap-24 lg:py-20">
			<header className="grid gap-5 border-b border-stone-900/10 pb-12 md:pb-16">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Connect With Us</p>
				<AnimatedPageTitle
					lines={[{ text: 'Get In Touch.' }]}
					className="text-5xl font-light leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]"
				/>
			</header>

			<section className="grid gap-14 lg:grid-cols-12 lg:gap-20">
				<div className="grid gap-12 lg:col-span-5 lg:gap-16">
					<ContactMap address={address} apiKey={googleMapsApiKey} />

					<div className="grid gap-12">
						<ContactDetail label="Address">
							<address className="not-italic text-3xl leading-tight text-stone-900 [font-family:var(--font-newsreader)]">{renderValue(address)}</address>
						</ContactDetail>

						<div className="grid gap-10 md:grid-cols-2 md:gap-12">
							<ContactDetail label="Email">
								{email ? (
									<a href={mailtoHref} className="border-b border-stone-300/60 pb-1 text-xl leading-tight text-stone-900 transition hover:text-[#274133] [font-family:var(--font-newsreader)]">
										{email}
									</a>
								) : (
									<p className="text-lg text-stone-500">정보를 준비 중입니다.</p>
								)}
							</ContactDetail>

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

				<div className="grid gap-8 border border-stone-900/10 bg-[#f6f3f2] p-8 sm:p-10 lg:col-span-7 lg:p-12">
					<div className="grid gap-4">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">Inquiry</p>
						<AnimatedPageTitle
							as="h2"
							lines={[{ text: '다음 트렌드의 주인공이' }, { text: '당신의 브랜드가 되도록.' }]}
							delay={0.04}
							duration={0.42}
							lineStagger={0.1}
							className="text-4xl leading-tight tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl"
						/>
						<p className="max-w-2xl text-base leading-6 text-stone-600 text-balance">
							브랜드 협업, 스타일링 문의 모두 환영합니다. <br />
							보내주신 내용을 확인 후 연락드리겠습니다.
						</p>
					</div>

					<ContactInquiryForm canSubmit={canSubmitInquiry} />
				</div>
			</section>
		</div>
	);
}
