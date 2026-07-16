'use client';

import { useEffect, useState } from 'react';

const REDUCED_PUBLIC_MOTION_QUERY = '(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)';

export function useReducedPublicMotion() {
	const [shouldReduceMotion, setShouldReduceMotion] = useState(true);

	useEffect(() => {
		const mediaQuery = window.matchMedia(REDUCED_PUBLIC_MOTION_QUERY);
		const updateMotionPreference = () => setShouldReduceMotion(mediaQuery.matches);

		updateMotionPreference();
		mediaQuery.addEventListener('change', updateMotionPreference);

		return () => mediaQuery.removeEventListener('change', updateMotionPreference);
	}, []);

	return shouldReduceMotion;
}
