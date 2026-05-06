import { headers } from 'next/headers';

import { NotFoundContent } from '@/components/site/NotFoundContent';
import { PublicShell } from '@/components/site/PublicShell';
import { resolveNotFoundLocale } from '@/lib/not-found-locale';

export default async function NotFound() {
	const headersList = await headers();
	const locale = resolveNotFoundLocale(headersList.get('x-afeel-locale'));

	return (
		<PublicShell locale={locale}>
			<NotFoundContent locale={locale} />
		</PublicShell>
	);
}
