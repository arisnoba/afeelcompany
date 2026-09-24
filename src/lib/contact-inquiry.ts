import { LOCALES } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';

const templateLabels = new Set(
	LOCALES.flatMap(locale => getSiteDictionary(locale).contact.form.messageTemplate.split('\n'))
		.map(line => line.replace(/\s+/g, ''))
);

export function hasInquiryMessageContent(message: string) {
	return message.split('\n').some(line => {
		const normalized = line.replace(/\s+/g, '');
		return normalized.length > 0 && !templateLabels.has(normalized);
	});
}
