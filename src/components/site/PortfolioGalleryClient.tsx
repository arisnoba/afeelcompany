'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

import { PortfolioLightbox } from '@/components/site/PortfolioLightbox';
import { PORTFOLIO_CATEGORIES, includesPortfolioCategory, type PortfolioCategory } from '@/types/portfolio';
import type { PublicPortfolioItem } from '@/types/site';

const FILTER_ALL = '전체';
const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;

interface PortfolioGalleryClientProps {
	items: PublicPortfolioItem[];
}

export function PortfolioGalleryClient({ items }: PortfolioGalleryClientProps) {
	const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL);
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

	const filters = [FILTER_ALL, ...PORTFOLIO_CATEGORIES.filter(category => items.some(item => includesPortfolioCategory(item.category, category)))];

	const filteredItems = selectedCategory === FILTER_ALL ? items : items.filter(item => includesPortfolioCategory(item.category, selectedCategory as PortfolioCategory));

	const visibleItems = filteredItems.slice(0, visibleCount);
	const activeItem = filteredItems.find(item => item.id === activeItemId) ?? null;
	const canLoadMore = visibleCount < filteredItems.length;

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
								setVisibleCount(INITIAL_VISIBLE_COUNT);
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
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{visibleItems.map((item, index) => {
						const hoverImageUrl = item.hoverImageUrl ?? item.imageUrl;

						return (
							<button key={item.id} type="button" onClick={() => handleItemClick(item)} className="group relative aspect-square overflow-hidden bg-stone-200 text-left">
								<div className="relative h-full w-full overflow-hidden">
									<Image
										src={item.imageUrl}
										alt={item.title}
										fill
										className="object-cover transition duration-300 group-hover:scale-[1.05] group-active:scale-[1.05]"
										loading={index < 3 ? 'eager' : 'lazy'}
										sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
									/>
									{item.hoverImageUrl ? (
										<Image
											src={hoverImageUrl}
											alt={`${item.title} hover`}
											fill
											className="object-cover opacity-0 transition duration-300 group-hover:opacity-100 group-active:opacity-100"
											sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
										/>
									) : null}
								</div>

								<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.54)_100%)] transition duration-500 group-hover:opacity-0 group-active:opacity-0" />
								<div className="absolute inset-x-0 bottom-0 grid gap-1 px-5 py-5 text-white transition duration-500 group-hover:opacity-0 group-active:opacity-0 sm:px-6 sm:py-6">
									<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/72">{item.brandName}</p>
									<p className="text-lg tracking-[-0.04em] text-white [font-family:var(--font-newsreader)] sm:text-xl">{item.celebrityName ?? ''}</p>
								</div>
							</button>
						);
					})}
				</div>
			)}

			{canLoadMore ? (
				<div className="flex justify-center pt-2">
					<button
						type="button"
						onClick={() => setVisibleCount(current => current + LOAD_MORE_COUNT)}
						className="inline-flex items-center gap-3 bg-[#274133] px-8 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#e8f1ec] transition hover:bg-[#496455]">
						Load More Archives
						<ChevronRight className="size-4" />
					</button>
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
