'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PortfolioLightbox } from '@/components/site/PortfolioLightbox';
import { BlurFade } from '@/components/ui/blur-fade';
import {
	PORTFOLIO_CATEGORIES,
	getPortfolioDisplayName,
	getPortfolioImageAlt,
	includesPortfolioCategory,
	type PortfolioCategory,
} from '@/types/portfolio';
import type { PublicPortfolioItem } from '@/types/site';

const FILTER_ALL = '전체';
const ITEMS_PER_PAGE = 12;

interface PortfolioGalleryClientProps {
	items: PublicPortfolioItem[];
}

export function PortfolioGalleryClient({ items }: PortfolioGalleryClientProps) {
	const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL);
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const filters = [FILTER_ALL, ...PORTFOLIO_CATEGORIES.filter(category => items.some(item => includesPortfolioCategory(item.category, category)))];

	const filteredItems = selectedCategory === FILTER_ALL ? items : items.filter(item => includesPortfolioCategory(item.category, selectedCategory as PortfolioCategory));

	const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
	const activePage = Math.min(currentPage, pageCount || 1);
	const pageStartIndex = (activePage - 1) * ITEMS_PER_PAGE;
	const visibleItems = filteredItems.slice(pageStartIndex, pageStartIndex + ITEMS_PER_PAGE);
	const activeItem = filteredItems.find(item => item.id === activeItemId) ?? null;

	function handleItemClick(item: PublicPortfolioItem) {
		if (item.instagramUrl) {
			window.open(item.instagramUrl, '_blank', 'noopener,noreferrer');
			return;
		}

		setActiveItemId(item.id);
	}

	return (
		<section className="grid gap-10">
			<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
				{filters.map(filter => {
					const isActive = filter === selectedCategory;

					return (
						<button
							key={filter}
							type="button"
							onClick={() => {
								setSelectedCategory(filter);
								setActiveItemId(null);
								setCurrentPage(1);
							}}
							className={`border-b pb-1 text-sm font-semibold uppercase tracking-[0.26em] transition ${
								isActive ? 'border-stone-950 text-stone-950' : 'border-transparent text-stone-400 hover:text-stone-950'
							}`}>
							{filter}
						</button>
					);
				})}
			</div>

			{filteredItems.length === 0 ? (
				<div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">선택한 카테고리에 해당하는 작업이 없습니다.</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
					{visibleItems.map((item, index) => {
						const hoverImageUrl = item.hoverImageUrl ?? item.imageUrl;
						const displayName = getPortfolioDisplayName(item);

						return (
							<BlurFade key={item.id} delay={Math.min(index * 0.05, 0.25)} className="w-full">
								<button
									type="button"
									onClick={() => handleItemClick(item)}
									className="group relative block aspect-square w-full cursor-pointer overflow-hidden bg-stone-200 text-left">
									<div className="relative h-full w-full overflow-hidden">
										<Image
											src={item.imageUrl}
											alt={getPortfolioImageAlt(item)}
											fill
											className="object-cover object-center transition duration-300 group-hover:scale-[1.05] group-active:scale-[1.05]"
											loading={index < 3 ? 'eager' : 'lazy'}
											sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
										/>
										{item.hoverImageUrl ? (
											<div className="absolute inset-0 bg-white p-5 opacity-0 transition duration-300 group-hover:opacity-100 group-active:opacity-100 sm:p-6">
												<div className="relative h-full w-full">
													<Image
														src={hoverImageUrl}
														alt={`${getPortfolioImageAlt(item)} hover`}
														fill
														unoptimized
														className="object-contain object-center"
														sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
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
								</button>
							</BlurFade>
						);
					})}
				</div>
			)}

			{pageCount > 1 ? (
				<div className="flex flex-wrap justify-center gap-2 pt-2" aria-label="포트폴리오 페이지">
					{Array.from({ length: pageCount }, (_, index) => {
						const page = index + 1;
						const isActive = page === activePage;

						return (
							<button
								key={page}
								type="button"
								onClick={() => {
									setCurrentPage(page);
									setActiveItemId(null);
								}}
								aria-current={isActive ? 'page' : undefined}
								className={`flex size-10 items-center justify-center border text-sm font-semibold transition ${
									isActive ? 'border-[#274133] bg-[#274133] text-[#e8f1ec]' : 'border-stone-200 bg-white text-stone-500 hover:border-stone-400 hover:text-stone-950'
								}`}>
								{page}
							</button>
						);
					})}
				</div>
			) : null}

			<PortfolioLightbox
				item={activeItem}
				open={activeItem !== null}
				onOpenChange={open => {
					if (!open) {
						setActiveItemId(null);
					}
				}}
			/>
		</section>
	);
}
