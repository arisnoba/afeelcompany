'use client';

import { type FC, type ReactNode, useRef } from 'react';
import { motion, type MotionValue, useScroll, useTransform } from 'framer-motion';

import { cn } from '@/lib/utils';

interface TextRevealByWordProps {
	text: string;
	className?: string;
	textClassName?: string;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className, textClassName }) => {
	const targetRef = useRef<HTMLDivElement | null>(null);

	const { scrollYProgress } = useScroll({
		target: targetRef,
		offset: ['start 0.74', 'end 0.66'],
	});

	const lines = text
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.length > 0);

	const indexedLines = lines
		.map(line => line.split(/\s+/).filter(Boolean))
		.reduce<{ word: string; index: number }[][]>((acc, lineWords) => {
			const currentIndex = acc.flat().length;
			acc.push(lineWords.map((word, index) => ({ word, index: currentIndex + index })));
			return acc;
		}, []);
	const totalWords = indexedLines.flat().length;

	return (
		<div ref={targetRef} className={cn('relative z-0 h-[115vh]', className)}>
			<div className="sticky top-0 mx-auto flex h-full items-center justify-center bg-transparent px-4 py-12">
				<p
					className={cn(
						'p-5 text-center text-[clamp(1.5rem,5vw,4.5rem)] font-light leading-[1.35] tracking-[-0.05em] text-stone-950/40 [font-family:var(--font-newsreader)] break-keep',
						textClassName
					)}>
					{indexedLines.map((line, lineIndex) => (
						<span key={`line-${lineIndex}`} className="block">
							{line.map(({ word, index }) => {
								const start = index / totalWords;
								const end = start + 1 / totalWords;

								return (
									<Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
										{word}
									</Word>
								);
							})}
						</span>
					))}
				</p>
			</div>
		</div>
	);
};

interface WordProps {
	children: ReactNode;
	progress: MotionValue<number>;
	range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
	const opacity = useTransform(progress, range, [0, 1]);

	return (
		<span className="relative mx-1.5 lg:mx-2.5">
			<span className="absolute opacity-16">{children}</span>
			<motion.span style={{ opacity }} className="text-stone-950">
				{children}
			</motion.span>
		</span>
	);
};

export { TextRevealByWord };
