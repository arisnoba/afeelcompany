import { FaqPageView, getFaqMetadata } from '@/views/site/faq-page';

export const metadata = getFaqMetadata('ko');

export default function FaqPage() {
	return <FaqPageView locale="ko" />;
}
