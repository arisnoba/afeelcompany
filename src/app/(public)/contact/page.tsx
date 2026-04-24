import { ContactPageView, getContactMetadata } from '@/views/site/contact-page';

export const metadata = getContactMetadata('ko');

export default function ContactPage() {
	return <ContactPageView locale="ko" />;
}
