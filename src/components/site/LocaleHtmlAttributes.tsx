'use client';

import { useEffect } from 'react';

interface LocaleHtmlAttributesProps {
	lang: string;
}

export function LocaleHtmlAttributes({ lang }: LocaleHtmlAttributesProps) {
	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	return null;
}
