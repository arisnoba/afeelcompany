import { getHomeMetadata, HomePageView } from '@/views/site/home-page';

export const metadata = getHomeMetadata('ko');

export default function HomePage() {
	return <HomePageView locale="ko" />;
}
