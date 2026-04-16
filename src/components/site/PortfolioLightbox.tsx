'use client';

import Image from 'next/image';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { getPortfolioDisplayName, getPortfolioImageAlt } from '@/types/portfolio';
import type { PublicPortfolioItem } from '@/types/site';

interface PortfolioLightboxProps {
	item: PublicPortfolioItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function PortfolioLightbox({ item, open, onOpenChange }: PortfolioLightboxProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] overflow-hidden border border-stone-900/10 bg-[#f5efe6] p-0 text-stone-950 sm:max-w-[min(960px,calc(100%-2rem))]">
				{item ? (
					<div className="grid gap-0 md:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
						<div className="relative min-h-[320px] bg-stone-200 md:min-h-[560px]">
							<Image
								src={item.imageUrl}
								alt={getPortfolioImageAlt(item)}
								fill
								className="object-cover object-center"
								sizes="(max-width: 768px) 100vw, 60vw"
							/>
						</div>

						<div className="grid content-start gap-6 px-6 py-6 sm:px-7 sm:py-7">
							<div className="grid gap-2">
								<DialogTitle className="text-3xl tracking-[-0.05em] text-stone-950">{getPortfolioDisplayName(item)}</DialogTitle>
								{getPortfolioDisplayName(item) !== item.brandName ? (
									<DialogDescription className="text-base leading-7 text-stone-700">{item.brandName}</DialogDescription>
								) : null}
							</div>

							{item.celebrityName ? (
								<div className="grid gap-1 text-sm text-stone-700">
									<span className="text-[0.7rem] uppercase tracking-[0.3em] text-stone-500">Celebrity</span>
									<span>{item.celebrityName}</span>
								</div>
							) : null}
						</div>
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
