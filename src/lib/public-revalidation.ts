import { revalidatePath } from 'next/cache';

import { LOCALES, getLocalizedPath } from '@/i18n/config';

const SHARED_PUBLIC_PATHS = ['/', '/about', '/portfolio', '/partner', '/contact'] as const;
const ZH_ONLY_PUBLIC_PATHS = ['/kpop-celebrity-placement'] as const;

export function revalidatePublicContent() {
	const paths = new Set<string>();

	for (const locale of LOCALES) {
		for (const path of SHARED_PUBLIC_PATHS) {
			paths.add(getLocalizedPath(locale, path));
		}
	}

	for (const path of ZH_ONLY_PUBLIC_PATHS) {
		paths.add(getLocalizedPath('zh', path));
	}

	for (const path of paths) {
		revalidatePath(path);
	}
}
