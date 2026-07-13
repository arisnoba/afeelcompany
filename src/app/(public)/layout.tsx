import { PublicShell } from '@/components/site/PublicShell';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <PublicShell locale="ko">{children}</PublicShell>;
}
