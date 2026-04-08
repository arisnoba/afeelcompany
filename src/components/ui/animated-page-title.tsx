'use client';

import { cn } from '@/lib/utils';

import { TextAnimate } from '@/components/ui/text-animate';
import type { Variants } from 'motion/react';

type TitleLine = {
	text: string;
	className?: string;
};

type AnimatedPageTitleProps = {
	lines: TitleLine[];
	className?: string;
	as?: 'h1' | 'h2';
	delay?: number;
	lineStagger?: number;
	duration?: number;
	offsetY?: number;
	blurAmount?: number;
};

function createTitleVariants(offsetY: number, blurAmount: number): Variants {
	return {
		hidden: { opacity: 0, filter: `blur(${blurAmount}px)`, y: offsetY },
		show: {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			transition: {
				y: { duration: 0.28, ease: 'easeOut' },
				opacity: { duration: 0.28, ease: 'easeOut' },
				filter: { duration: 0.32, ease: 'easeOut' },
			},
		},
		exit: {
			opacity: 0,
			filter: `blur(${blurAmount}px)`,
			y: offsetY,
			transition: {
				y: { duration: 0.22, ease: 'easeIn' },
				opacity: { duration: 0.22, ease: 'easeIn' },
				filter: { duration: 0.22, ease: 'easeIn' },
			},
		},
	};
}

export function AnimatedPageTitle({ lines, className, as = 'h1', delay = 0.03, lineStagger = 0.2, duration = 0.34, offsetY = 8, blurAmount = 10 }: AnimatedPageTitleProps) {
	const Component = as;
	// 기본 조정 지점: 더 살짝 들어오게 하려면 offsetY/blurAmount를 여기서 낮춘다.
	const titleVariants = createTitleVariants(offsetY, blurAmount);

	return (
		<Component className={className}>
			{lines.map((line, index) => (
				<TextAnimate
					key={`${line.text}-${index}`}
					as="span"
					by="character"
					variants={titleVariants}
					delay={delay + index * lineStagger}
					duration={duration}
					startOnView
					once
					className={cn('block', line.className)}>
					{line.text}
				</TextAnimate>
			))}
		</Component>
	);
}
