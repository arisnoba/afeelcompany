'use client';

import type { ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';

interface PublicSmoothScrollProps {
	children: ReactNode;
}

const lenisOptions = {
	lerp: 0.08,
	anchors: true,
};

export function PublicSmoothScroll({ children }: PublicSmoothScrollProps) {
	return (
		<ReactLenis root options={lenisOptions}>
			{children}
		</ReactLenis>
	);
}
