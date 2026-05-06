import { headers } from 'next/headers';

import { NotFoundContent } from '@/components/site/NotFoundContent';
import { resolveNotFoundLocale } from '@/lib/not-found-locale';

export default async function LocalizedPublicNotFound() {
	const headersList = await headers();
	const locale = resolveNotFoundLocale(headersList.get('x-afeel-locale'));

	return <NotFoundContent locale={locale} />;
}
