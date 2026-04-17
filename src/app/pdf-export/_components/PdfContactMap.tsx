/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';

interface PdfContactMapProps {
	address: string;
	apiKey: string | undefined;
}

function buildStaticMapUrl(address: string, apiKey: string) {
	const params = new URLSearchParams({
		center: address,
		zoom: '15',
		size: '640x420',
		scale: '2',
		maptype: 'roadmap',
		key: apiKey,
	});

	params.append('markers', `size:small|color:0x171717|${address}`);
	params.append('style', 'feature:all|element:labels.icon|visibility:off');
	params.append('style', 'element:geometry|color:0xf5f3ef');
	params.append('style', 'feature:road|element:geometry|color:0xffffff');
	params.append('style', 'feature:road|element:geometry.stroke|color:0xe4dfd8');
	params.append('style', 'feature:water|element:geometry.fill|color:0xf3f1ec');
	params.append('style', 'feature:poi|element:geometry.fill|color:0xece7e0');
	params.append('style', 'feature:transit|visibility:off');

	return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

export function PdfContactMap({ address, apiKey }: PdfContactMapProps) {
	const [status, setStatus] = useState<'idle' | 'ready' | 'disabled' | 'error'>(() => {
		if (!address || !apiKey) {
			return 'disabled';
		}

		return 'idle';
	});

	const mapUrl = useMemo(() => {
		if (!address || !apiKey) {
			return null;
		}

		return buildStaticMapUrl(address, apiKey);
	}, [address, apiKey]);

	return (
		<div data-pdf-contact-map data-pdf-map-status={status} className="absolute inset-0 h-full w-full overflow-hidden bg-[#f5f3ef]">
			{mapUrl ? (
				<img
					src={mapUrl}
					alt={`${address} 지도`}
					data-pdf-image
					className="h-full w-full object-cover"
					referrerPolicy="no-referrer-when-downgrade"
					onLoad={() => setStatus('ready')}
					onError={() => setStatus('error')}
				/>
			) : null}
			{status !== 'ready' ? <div aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(237,232,225,0.95))]" /> : null}
		</div>
	);
}
