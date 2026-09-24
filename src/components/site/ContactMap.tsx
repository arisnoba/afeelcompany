'use client';

import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-javascript-api';
const GOOGLE_MAPS_CALLBACK = '__afeelGoogleMapsReady';

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

type GoogleMapsOverlay = {
	onAdd: () => void;
	draw: () => void;
	onRemove: () => void;
	setMap: (map: unknown | null) => void;
	getPanes: () => { overlayMouseTarget: HTMLElement } | null;
	getProjection: () => {
		fromLatLngToDivPixel: (location: GoogleMapsLocation) => { x: number; y: number } | null;
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
	OverlayView: new () => GoogleMapsOverlay;
};

declare global {
	interface Window {
		__afeelGoogleMapsReady?: () => void;
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

	if (googleMapsScriptPromise) {
		return googleMapsScriptPromise;
	}

	if (window.google?.maps?.Map && window.google.maps.OverlayView) {
		return Promise.resolve();
	}

	googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
		const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
		const script = existingScript ?? document.createElement('script');

		window[GOOGLE_MAPS_CALLBACK] = () => {
			delete window[GOOGLE_MAPS_CALLBACK];
			resolve();
		};
		script.onerror = () => {
			delete window[GOOGLE_MAPS_CALLBACK];
			script.remove();
			reject(new Error('Failed to load Google Maps.'));
		};

		if (existingScript) return;

		script.id = GOOGLE_MAPS_SCRIPT_ID;
		const params = new URLSearchParams({ key: apiKey, loading: 'async', callback: GOOGLE_MAPS_CALLBACK });
		script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
		script.async = true;
		document.head.appendChild(script);
	}).catch((error) => {
		googleMapsScriptPromise = null;
		throw error;
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
		let marker: GoogleMapsOverlay | null = null;

		loadGoogleMapsScript(apiKey)
			.then(() => {
				const maps = window.google?.maps;
				const mapElement = mapRef.current;

				if (cancelled || !mapElement || !maps) {
					return;
				}

				const geocoder = new maps.Geocoder();

				geocoder.geocode({ address }, (results, status) => {
					if (cancelled) {
						return;
					}

					const location = results?.[0]?.geometry?.location;
					if (status !== 'OK' || !location) {
						return;
					}

					const map = new maps.Map(mapElement, {
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

					// Advanced markers require a map ID, which disables WHITE_MAP_STYLES.
					// Use an overlay to preserve the styled map and the fixed-size location dot.
					const dot = document.createElement('div');
					dot.title = address;
					dot.setAttribute('role', 'img');
					dot.setAttribute('aria-label', address);
					dot.style.cssText = 'position:absolute;width:21px;height:21px;box-sizing:border-box;border:3px solid #fff;border-radius:50%;background:#171717;transform:translate(-50%,-50%)';
					const overlay = new maps.OverlayView();
					overlay.onAdd = () => overlay.getPanes()?.overlayMouseTarget.appendChild(dot);
					overlay.draw = () => {
						const point = overlay.getProjection().fromLatLngToDivPixel(location);
						if (point) {
							dot.style.left = `${point.x}px`;
							dot.style.top = `${point.y}px`;
						}
					};
					overlay.onRemove = () => dot.remove();
					overlay.setMap(map);
					marker = overlay;

					setLoadedAddress(address);
				});
			})
			.catch(() => {});

		return () => {
			cancelled = true;
			marker?.setMap(null);
		};
	}, [address, apiKey]);

	return (
		<div className="relative aspect-[4/3] overflow-hidden bg-[#f5f3ef]">
			<div ref={mapRef} className="absolute inset-0 h-full w-full" />
			{!isReady ? <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(237,232,225,0.95))]" /> : null}
		</div>
	);
}
