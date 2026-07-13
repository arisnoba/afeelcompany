import Link from 'next/link';
import Image from 'next/image';

import { BlurFade } from '@/components/ui/blur-fade';
import { getPortfolioDisplayName, getPortfolioImageAlt } from '@/types/portfolio';
import { cn } from '@/lib/utils';
import type { PublicPortfolioItem } from '@/types/site';

interface PortfolioPreviewGridProps {
	items: PublicPortfolioItem[];
	href?: string;
	gridClassName?: string;
	emptyLabel?: string;
}

export function PortfolioPreviewGrid({
	items,
	href = '/portfolio',
	gridClassName,
	emptyLabel = '표시할 포트폴리오가 아직 없습니다.',
}: PortfolioPreviewGridProps) {
	if (items.length === 0) {
		return <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">{emptyLabel}</div>;
	}

	return (
		<div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4', gridClassName)}>
			{items.map((item, index) => {
				const displayName = getPortfolioDisplayName(item);
				const isInitialMobileRow = index < 2;
				const imageSizes = '(max-width: 639px) calc((100vw - 48px) / 2), (min-width: 1280px) 25vw, 33vw';

				return (
					<BlurFade key={item.id} delay={Math.min(index * 0.07, 0.35)} className="w-full">
						<Link href={href} className="group relative block aspect-square w-full cursor-pointer overflow-hidden bg-stone-200">
							<div className="relative h-full w-full overflow-hidden">
								<Image
									src={item.imageUrl}
									alt={getPortfolioImageAlt(item)}
									fill
									className="object-cover object-center transition duration-300 group-hover:scale-[1.05] group-active:scale-[1.05]"
									loading={isInitialMobileRow ? 'eager' : 'lazy'}
									fetchPriority={isInitialMobileRow ? 'high' : undefined}
									sizes={imageSizes}
								/>
								{item.hoverImageUrl ? (
									<div className="absolute inset-0 bg-white p-5 opacity-0 transition duration-300 group-hover:opacity-100 group-active:opacity-100 sm:p-6">
										<div className="relative h-full w-full">
											<Image
												src={item.hoverImageUrl}
												alt={`${getPortfolioImageAlt(item)} hover`}
												fill
												className="object-contain object-center"
												sizes={imageSizes}
											/>
										</div>
									</div>
								) : null}
							</div>
							<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.54)_100%)] transition duration-500 group-hover:opacity-0 group-active:opacity-0" />
							<div className="absolute inset-x-0 bottom-0 grid gap-1 px-5 py-5 text-white transition duration-500 group-hover:opacity-0 group-active:opacity-0 sm:px-6 sm:py-6">
								<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/72">{item.brandName}</p>
								{displayName !== item.brandName ? (
									<p className="text-lg tracking-[-0.04em] text-white [font-family:var(--font-newsreader)] sm:text-xl">{displayName}</p>
								) : null}
							</div>
						</Link>
					</BlurFade>
				);
			})}
		</div>
	);
}
