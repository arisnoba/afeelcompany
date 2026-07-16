'use client';

import type { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';

import { useReducedPublicMotion } from '@/hooks/use-reduced-public-motion';

interface PublicSmoothScrollProps {
	children: ReactNode;
}

const lenisOptions = {
	lerp: 0.08,
	anchors: true,
};

export function PublicSmoothScroll({ children }: PublicSmoothScrollProps) {
	const shouldReduceMotion = useReducedPublicMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<ReactLenis root options={lenisOptions}>
			{children}
		</ReactLenis>
	);
}
