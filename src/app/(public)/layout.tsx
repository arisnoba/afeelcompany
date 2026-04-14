import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { PublicSmoothScroll } from '@/components/site/PublicSmoothScroll';
import { getSiteCompanyProfile } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const profile = await getSiteCompanyProfile();

	return (
		<PublicSmoothScroll>
			<div className="min-h-screen bg-[#fcf9f8] text-stone-950 [font-family:var(--font-manrope)]">
				<div className="relative flex min-h-screen flex-col">
					<SiteHeader />
					<main className="flex-1 pb-16">{children}</main>
					<SiteFooter profile={profile} />
				</div>
			</div>
		</PublicSmoothScroll>
	);
}
