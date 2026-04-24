import { AboutPageView, getAboutMetadata } from '@/views/site/about-page';

export const metadata = getAboutMetadata('ko');

export default function AboutPage() {
	return <AboutPageView locale="ko" />;
}
