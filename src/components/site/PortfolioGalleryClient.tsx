'use client';

import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import { useCallback, useRef, useState, useEffect } from 'react';

import { PortfolioLightbox } from '@/components/site/PortfolioLightbox';
import { BlurFade } from '@/components/ui/blur-fade';
import {
	PORTFOLIO_CATEGORIES,
	getPortfolioDisplayName,
	getPortfolioImageAlt,
	type PortfolioCategory,
} from '@/types/portfolio';
import type { PublicPortfolioInitialPage, PublicPortfolioItem, PublicPortfolioPageResult } from '@/types/site';

const ITEMS_PER_PAGE = 12;

interface PortfolioGalleryClientProps {
	initialPage: PublicPortfolioInitialPage;
	filterAllLabel?: string;
	pageLabel?: string;
	emptySelectionLabel?: string;
	categoryLabels?: Record<string, string>;
	celebrityLabel?: string;
	defaultTitle?: string;
}

interface PortfolioPageResponse {
	success: boolean;
	data?: PublicPortfolioPageResult;
	error?: string;
}

async function fetchPortfolioPage({
	category,
	cursor,
}: {
	category: PortfolioCategory | null;
	cursor?: string | null;
}): Promise<PublicPortfolioPageResult> {
	const params = new URLSearchParams({
		limit: String(ITEMS_PER_PAGE),
	});

	if (category) {
		params.set('category', category);
	}

	if (cursor) {
		params.set('cursor', cursor);
	}

	const response = await fetch(`/api/public/portfolio?${params.toString()}`);
	const payload = (await response.json()) as PortfolioPageResponse;

	if (!response.ok || !payload.success || !payload.data) {
		throw new Error(payload.error ?? 'PORTFOLIO_LOAD_FAILED');
	}

	return payload.data;
}

export function PortfolioGalleryClient({
	initialPage,
	filterAllLabel = '전체',
	pageLabel = '포트폴리오 페이지',
	emptySelectionLabel = '선택한 카테고리에 해당하는 작업이 없습니다.',
	categoryLabels = {},
	celebrityLabel = 'Celebrity',
	defaultTitle = '포트폴리오',
}: PortfolioGalleryClientProps) {
	const [selectedCategory, setSelectedCategory] = useState(filterAllLabel);
	const [activeItemId, setActiveItemId] = useState<string | null>(null);
	const [items, setItems] = useState(initialPage.items);
	const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);
	const requestIdRef = useRef(0);

	const filters = [filterAllLabel, ...PORTFOLIO_CATEGORIES.filter(category => initialPage.categoryCounts[category] > 0)];

	const activeItem = items.find(item => item.id === activeItemId) ?? null;

	function handleItemClick(item: PublicPortfolioItem) {
		if (item.instagramUrl) {
			window.open(item.instagramUrl, '_blank', 'noopener,noreferrer');
			return;
		}

		setActiveItemId(item.id);
	}

	const handleCategorySelect = useCallback(
		async (filter: string, force = false) => {
			if (filter === selectedCategory && !force) {
				return;
			}

			const requestId = requestIdRef.current + 1;
			requestIdRef.current = requestId;
			setSelectedCategory(filter);
			setActiveItemId(null);
			setLoadError(false);

			if (filter === filterAllLabel) {
				setItems(initialPage.items);
				setNextCursor(initialPage.nextCursor);
				setIsLoading(false);
				return;
			}

			setItems([]);
			setNextCursor(null);
			setIsLoading(true);

			try {
				const page = await fetchPortfolioPage({
					category: filter as PortfolioCategory,
				});

				if (requestIdRef.current !== requestId) {
					return;
				}

				setItems(page.items);
				setNextCursor(page.nextCursor);
			} catch {
				if (requestIdRef.current === requestId) {
					setLoadError(true);
				}
			} finally {
				if (requestIdRef.current === requestId) {
					setIsLoading(false);
				}
			}
		},
		[filterAllLabel, initialPage.items, initialPage.nextCursor, selectedCategory]
	);

	const loadNextPage = useCallback(async () => {
		if (!nextCursor || isLoading) {
			return;
		}

		const category = selectedCategory === filterAllLabel ? null : (selectedCategory as PortfolioCategory);
		const requestId = requestIdRef.current + 1;
		requestIdRef.current = requestId;
		setIsLoading(true);
		setLoadError(false);

		try {
			const page = await fetchPortfolioPage({
				category,
				cursor: nextCursor,
			});

			if (requestIdRef.current !== requestId) {
				return;
			}

			setItems(currentItems => [...currentItems, ...page.items]);
			setNextCursor(page.nextCursor);
		} catch {
			if (requestIdRef.current === requestId) {
				setLoadError(true);
			}
		} finally {
			if (requestIdRef.current === requestId) {
				setIsLoading(false);
			}
		}
	}, [filterAllLabel, isLoading, nextCursor, selectedCategory]);

	useEffect(() => {
		const target = loadMoreRef.current;

		if (!target || !nextCursor || isLoading) {
			return;
		}

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0]?.isIntersecting) {
					void loadNextPage();
				}
			},
			{ rootMargin: '640px 0px' }
		);

		observer.observe(target);

		return () => {
			observer.disconnect();
		};
	}, [isLoading, loadNextPage, nextCursor]);

	return (
		<section className="grid gap-10">
			<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
				{filters.map(filter => {
					const isActive = filter === selectedCategory;

					return (
						<button
							key={filter}
							type="button"
							onClick={() => void handleCategorySelect(filter)}
							className={`border-b pb-1 text-sm font-semibold uppercase tracking-[0.26em] transition ${
								isActive ? 'border-stone-950 text-stone-950' : 'border-transparent text-stone-400 hover:text-stone-950'
							}`}>
							{categoryLabels[filter] ?? filter}
						</button>
					);
				})}
			</div>

			{items.length === 0 && !isLoading && !loadError ? (
				<div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">{emptySelectionLabel}</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
					{items.map((item, index) => {
						const hoverImageUrl = item.hoverImageUrl ?? item.imageUrl;
						const rawDisplayName = getPortfolioDisplayName(item);
						const displayName = rawDisplayName === '포트폴리오' ? defaultTitle : rawDisplayName;

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

			<div ref={loadMoreRef} className="flex min-h-12 items-center justify-center pt-2" aria-label={pageLabel}>
				{isLoading ? <div className="size-6 animate-spin rounded-full border border-stone-300 border-t-stone-950" /> : null}
				{loadError ? (
					<button
						type="button"
						onClick={() => void (items.length === 0 ? handleCategorySelect(selectedCategory, true) : loadNextPage())}
						className="flex size-10 items-center justify-center border border-stone-300 bg-white text-stone-950 transition hover:border-stone-950"
						aria-label="Retry">
						<RotateCcw className="size-4" aria-hidden="true" />
					</button>
				) : null}
			</div>

			<PortfolioLightbox
				item={activeItem}
				open={activeItem !== null}
				celebrityLabel={celebrityLabel}
				defaultTitle={defaultTitle}
				onOpenChange={open => {
					if (!open) {
						setActiveItemId(null);
					}
				}}
			/>
		</section>
	);
}
