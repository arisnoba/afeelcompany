'use client';

import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-javascript-api';

const WHITE_MAP_STYLES = [
	{ elementType: 'geometry', stylers: [{ color: '#f5f3ef' }] },
	{ elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
	{ elementType: 'labels.text.fill', stylers: [{ color: '#7b776f' }] },
	{ elementType: 'labels.text.stroke', stylers: [{ color: '#f5f3ef' }] },
	{ featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#ded9d2' }] },
	{ featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
	{ featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#eeebe5' }] },
	{ featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ color: '#f8f6f2' }] },
	{ featureType: 'poi', elementType: 'geometry.fill', stylers: [{ color: '#ece7e0' }] },
	{ featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8c867d' }] },
	{ featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#f1eee7' }] },
	{ featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
	{ featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e4dfd8' }] },
	{ featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a857d' }] },
	{ featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#fdfcfa' }] },
	{ featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#ddd7cf' }] },
	{ featureType: 'transit', stylers: [{ visibility: 'off' }] },
	{ featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#f3f1ec' }] },
	{ featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9a958d' }] },
];

type GoogleMapsStyleRule = {
	elementType?: string;
	featureType?: string;
	stylers: Array<Record<string, string | number>>;
};

type GoogleMapsLocation = unknown;

type GoogleMapsGeocoderResult = {
	geometry?: {
		location?: GoogleMapsLocation;
	};
};

type GoogleMapsNamespace = {
	Geocoder: new () => {
		geocode: (
			request: { address: string },
			callback: (results: GoogleMapsGeocoderResult[] | null, status: string) => void
		) => void;
	};
	Map: new (
		element: HTMLElement,
		options: {
			backgroundColor: string;
			center: GoogleMapsLocation;
			disableDefaultUI: boolean;
			fullscreenControl: boolean;
			mapTypeControl: boolean;
			streetViewControl: boolean;
			styles: GoogleMapsStyleRule[];
			zoom: number;
			zoomControl: boolean;
		}
	) => unknown;
	Marker: new (options: {
		icon: {
			fillColor: string;
			fillOpacity: number;
			path: string;
			scale: number;
			strokeColor: string;
			strokeWeight: number;
		};
		map: unknown;
		position: GoogleMapsLocation;
		title: string;
	}) => unknown;
	SymbolPath: {
		CIRCLE: string;
	};
};

declare global {
	interface Window {
		google?: {
			maps?: GoogleMapsNamespace;
		};
	}
}

let googleMapsScriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string) {
	if (typeof window === 'undefined') {
		return Promise.reject(new Error('Google Maps can only load in the browser.'));
	}

	if (window.google?.maps) {
		return Promise.resolve();
	}

	if (googleMapsScriptPromise) {
		return googleMapsScriptPromise;
	}

	googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
		const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

		if (existingScript) {
			existingScript.addEventListener('load', () => resolve(), { once: true });
			existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps.')), { once: true });
			return;
		}

		const script = document.createElement('script');
		script.id = GOOGLE_MAPS_SCRIPT_ID;
		script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Failed to load Google Maps.'));
		document.head.appendChild(script);
	});

	return googleMapsScriptPromise;
}

type ContactMapProps = {
	address: string;
	apiKey?: string;
};

export default function ContactMap({ address, apiKey }: ContactMapProps) {
	const mapRef = useRef<HTMLDivElement | null>(null);
	const [loadedAddress, setLoadedAddress] = useState<string | null>(null);
	const isReady = loadedAddress === address && Boolean(address) && Boolean(apiKey);

	useEffect(() => {
		if (!address || !apiKey || !mapRef.current) {
			return;
		}

		let cancelled = false;

		loadGoogleMapsScript(apiKey)
			.then(() => {
				if (cancelled || !mapRef.current || !window.google?.maps) {
					return;
				}

				const google = window.google;
				const geocoder = new google.maps.Geocoder();

				geocoder.geocode({ address }, (results, status) => {
					if (cancelled) {
						return;
					}

					const location = results?.[0]?.geometry?.location;
					if (status !== 'OK' || !location) {
						return;
					}

					const map = new google.maps.Map(mapRef.current, {
						center: location,
						zoom: 16,
						backgroundColor: '#f5f3ef',
						disableDefaultUI: true,
						zoomControl: true,
						fullscreenControl: false,
						mapTypeControl: false,
						streetViewControl: false,
						styles: WHITE_MAP_STYLES,
					});

					new google.maps.Marker({
						map,
						position: location,
						title: address,
						icon: {
							path: google.maps.SymbolPath.CIRCLE,
							scale: 9,
							fillColor: '#171717',
							fillOpacity: 1,
							strokeColor: '#ffffff',
							strokeWeight: 3,
						},
					});

					setLoadedAddress(address);
				});
			})
			.catch(() => {});

		return () => {
			cancelled = true;
		};
	}, [address, apiKey]);

	return (
		<div className="relative aspect-[4/3] overflow-hidden bg-[#f5f3ef]">
			<div ref={mapRef} className="absolute inset-0 h-full w-full" />
			{!isReady ? <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(237,232,225,0.95))]" /> : null}
		</div>
	);
}
