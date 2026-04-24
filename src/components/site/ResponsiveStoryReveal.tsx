'use client';

import { useEffect, useState } from 'react';

import { TextRevealByWord } from '@/components/ui/text-reveal';

interface ResponsiveStoryRevealProps {
	desktopText: string;
	mobileText: string;
}

export function ResponsiveStoryReveal({ desktopText, mobileText }: ResponsiveStoryRevealProps) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 639px)');

		const update = () => {
			setIsMobile(mediaQuery.matches);
		};

		update();
		mediaQuery.addEventListener('change', update);

		return () => {
			mediaQuery.removeEventListener('change', update);
		};
	}, []);

	if (isMobile) {
		return <TextRevealByWord text={mobileText} className="h-[82vh]" textClassName="text-[clamp(1.25rem,4.2vw,4.5rem)] leading-[1.28]" />;
	}

	return <TextRevealByWord text={desktopText} className="h-[90vh]" />;
}
