import { getPortfolioMetadata, PortfolioPageView } from '@/views/site/portfolio-page';

export const metadata = getPortfolioMetadata('ko');

export default function PortfolioPage() {
	return <PortfolioPageView locale="ko" />;
}
