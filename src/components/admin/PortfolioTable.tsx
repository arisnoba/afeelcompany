'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';

import { UploadForm } from '@/app/admin/upload/_components/UploadForm';
import { PortfolioEditorForm } from '@/components/admin/PortfolioEditorForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { PortfolioAdminItem } from '@/types/portfolio';

interface PortfolioTableProps {
	initialItems: PortfolioAdminItem[];
}

type PortfolioSheetState = { mode: 'create' } | { mode: 'edit'; itemId: string } | null;

function sortItems(items: PortfolioAdminItem[]) {
	return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function PortfolioTable({ initialItems }: PortfolioTableProps) {
	const [items, setItems] = useState<PortfolioAdminItem[]>(sortItems(initialItems));
	const [feedback, setFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSavingOrder, setIsSavingOrder] = useState(false);
	const [sheetState, setSheetState] = useState<PortfolioSheetState>(null);

	const selectedItem = useMemo(() => {
		if (!sheetState || sheetState.mode !== 'edit') {
			return null;
		}

		return items.find(item => item.id === sheetState.itemId) ?? null;
	}, [items, sheetState]);

	function openCreateSheet() {
		setSheetState({ mode: 'create' });
		setError(null);
		setFeedback(null);
	}

	function openEditSheet(itemId: string) {
		setSheetState({ mode: 'edit', itemId });
		setError(null);
		setFeedback(null);
	}

	function updateItem(itemId: string, nextItem: PortfolioAdminItem) {
		setItems(current => sortItems(current.map(item => (item.id === itemId ? nextItem : item))));
	}

	function reorderLocally(itemId: string, direction: -1 | 1) {
		setItems(current => {
			const index = current.findIndex(item => item.id === itemId);
			const nextIndex = index + direction;

			if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
				return current;
			}

			const nextItems = [...current];
			const [moved] = nextItems.splice(index, 1);
			nextItems.splice(nextIndex, 0, moved);

			return nextItems.map((item, order) => ({
				...item,
				sortOrder: order,
			}));
		});
	}

	function handleCreateSuccess(item: PortfolioAdminItem) {
		setItems(current => sortItems([...current, item]));
		setSheetState({ mode: 'edit', itemId: item.id });
		setFeedback('새 포트폴리오 항목이 추가되었습니다.');
		setError(null);
	}

	function handleSaveSuccess(item: PortfolioAdminItem) {
		updateItem(item.id, item);
		setFeedback('항목이 저장되었습니다.');
		setError(null);
	}

	function handleDeleteSuccess(itemId: string) {
		setItems(current =>
			current
				.filter(item => item.id !== itemId)
				.map((item, index) => ({
					...item,
					sortOrder: index,
				}))
		);
		setSheetState(null);
		setFeedback('항목이 삭제되었습니다.');
		setError(null);
	}

	async function handleSaveOrder() {
		setIsSavingOrder(true);
		setError(null);
		setFeedback(null);

		try {
			const response = await fetch('/api/portfolio/reorder', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					items: items.map(item => ({
						id: item.id,
						sortOrder: item.sortOrder,
					})),
				}),
			});
			const result = (await response.json()) as { success: boolean; error?: string };

			if (!response.ok || !result.success) {
				setError(result.error ?? '정렬 저장에 실패했습니다.');
				return;
			}

			setFeedback('정렬 순서가 저장되었습니다.');
		} catch {
			setError('정렬 저장에 실패했습니다.');
		} finally {
			setIsSavingOrder(false);
		}
	}

	return (
		<>
			<Card className="overflow-hidden border-black/6 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
				<CardHeader className="flex flex-col gap-4 border-b border-black/6 bg-[linear-gradient(135deg,rgba(24,226,153,0.08),rgba(255,255,255,0.92)_48%,rgba(255,255,255,1))] px-6 py-6">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
						<div className="flex flex-col gap-2">
							<CardTitle className="text-2xl font-semibold tracking-[-0.03em]">포트폴리오 라이브러리</CardTitle>
							<CardDescription className="max-w-3xl text-sm leading-6">
								카드에서 항목을 선택하면 오른쪽 패널에서 상세 설정을 수정할 수 있습니다. 새 항목 등록도 같은 흐름으로 처리합니다.
							</CardDescription>
						</div>

						<div className="flex flex-col gap-2 sm:flex-row">
							<Button type="button" variant="outline" onClick={openCreateSheet}>
								<Plus data-icon="inline-start" />새 항목 등록
							</Button>
							<Button type="button" onClick={handleSaveOrder} disabled={isSavingOrder || items.length === 0}>
								{isSavingOrder ? '정렬 저장 중...' : '정렬 저장'}
							</Button>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<Badge variant="outline" className="rounded-full border-[#18e299]/30 bg-white">
							총 {items.length}개 항목
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="grid gap-4 px-6 py-6">
					{feedback ? <div className="rounded-2xl border border-[#18e299]/25 bg-[#18e299]/10 px-4 py-3 text-sm text-[#0f7b54]">{feedback}</div> : null}

					{error ? <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

					{items.length === 0 ? (
						<div className="rounded-[24px] border border-dashed border-black/10 bg-[#fbfdfb] px-6 py-14 text-center text-sm text-muted-foreground">
							아직 업로드된 포트폴리오 항목이 없습니다. 우측 패널에서 첫 항목을 등록하세요.
						</div>
					) : (
						<div className="grid gap-4">
							{items.map((item, index) => (
								<Card key={item.id} className="overflow-hidden border-black/6 bg-[#fdfefd] py-0 shadow-[0_1px_6px_rgba(15,23,42,0.03)]">
									<CardContent className="grid gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)]">
										<button
											type="button"
											onClick={() => openEditSheet(item.id)}
											className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-black/6 bg-[#f7fbf8] text-left transition-transform hover:scale-[1.01]">
											<Image src={item.thumbnailUrl ?? item.imageUrl} alt={item.title} fill className="object-cover" sizes="120px" />
										</button>

										<div className="flex min-w-0 flex-col gap-4">
											<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
												<div className="flex min-w-0 flex-col gap-2">
													<div className="flex flex-wrap items-center gap-2">
														<p className="truncate text-lg font-semibold tracking-[-0.02em] text-foreground">{item.title}</p>
														<Badge variant="outline" className="rounded-full border-black/6">
															순서 {index + 1}
														</Badge>
													</div>

													<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
														<span>{item.brandName}</span>
														{item.celebrityName ? <span>{item.celebrityName}</span> : null}
													</div>
												</div>

												<div className="flex flex-wrap items-center gap-2">
													<Badge variant="secondary" className="rounded-full bg-black/4 text-foreground">
														{item.category}
													</Badge>
													<Badge variant="outline" className={item.showOnWeb ? 'rounded-full border-[#18e299]/30 bg-[#18e299]/10 text-[#0f7b54]' : 'rounded-full border-black/6'}>
														웹 {item.showOnWeb ? 'ON' : 'OFF'}
													</Badge>
													<Badge variant="outline" className={item.showOnPdf ? 'rounded-full border-[#18e299]/30 bg-[#18e299]/10 text-[#0f7b54]' : 'rounded-full border-black/6'}>
														PDF {item.showOnPdf ? 'ON' : 'OFF'}
													</Badge>
												</div>
											</div>

											<div className="flex flex-wrap items-center gap-2">
												<Button type="button" size="sm" onClick={() => openEditSheet(item.id)}>
													선택
												</Button>
												<Button type="button" variant="outline" size="sm" onClick={() => reorderLocally(item.id, -1)} disabled={index === 0}>
													<ArrowUp data-icon="inline-start" />
													위로
												</Button>
												<Button type="button" variant="outline" size="sm" onClick={() => reorderLocally(item.id, 1)} disabled={index === items.length - 1}>
													<ArrowDown data-icon="inline-start" />
													아래로
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<Sheet open={sheetState !== null} onOpenChange={open => !open && setSheetState(null)}>
				<SheetContent
					side="right"
					className="data-[side=right]:w-full data-[side=right]:max-w-none border-black/6 bg-[#fcfffd] p-0 sm:data-[side=right]:w-[min(56rem,44vw)] sm:data-[side=right]:max-w-[min(56rem,44vw)]">
					<SheetHeader className="border-b border-black/6 bg-white px-6 py-5">
						<SheetTitle>{sheetState?.mode === 'create' ? '새 포트폴리오 등록' : '포트폴리오 상세 설정'}</SheetTitle>
						<SheetDescription>{sheetState?.mode === 'create' ? '이미지 업로드와 공개 설정을 한 패널에서 마무리합니다.' : '선택한 항목의 메타데이터와 노출 여부를 수정합니다.'}</SheetDescription>
					</SheetHeader>

					<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
						{sheetState?.mode === 'create' ? (
							<UploadForm onSuccess={handleCreateSuccess} />
						) : selectedItem ? (
							<PortfolioEditorForm item={selectedItem} onSaveSuccess={handleSaveSuccess} onDeleteSuccess={handleDeleteSuccess} />
						) : null}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
