import { getPartnerMetadata, PartnerPageView } from '@/views/site/partner-page';

export const metadata = getPartnerMetadata('ko');

export default function PartnerPage() {
	return <PartnerPageView locale="ko" />;
}
