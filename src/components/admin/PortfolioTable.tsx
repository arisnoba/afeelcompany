'use client';

import Image from 'next/image';
import { useMemo, useState, type DragEvent } from 'react';
import { GripVertical, MousePointer2, Plus, RotateCcw } from 'lucide-react';

import { UploadForm } from '@/app/admin/upload/_components/UploadForm';
import { PortfolioEditorForm } from '@/components/admin/PortfolioEditorForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { formatPortfolioCategories } from '@/types/portfolio';
import type { PortfolioAdminItem } from '@/types/portfolio';

interface PortfolioTableProps {
	initialItems: PortfolioAdminItem[];
}

type PortfolioSheetState = { mode: 'create' } | { mode: 'edit'; itemId: string } | null;
type PortfolioDragState = { draggedId: string; overId: string | null } | null;

function sortItems(items: PortfolioAdminItem[]) {
	return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

function normalizeSortOrder(items: PortfolioAdminItem[]) {
	return items.map((item, order) => ({
		...item,
		sortOrder: order,
	}));
}

function getItemIds(items: PortfolioAdminItem[]) {
	return items.map(item => item.id);
}

function hasSameOrder(left: string[], right: string[]) {
	return left.length === right.length && left.every((itemId, index) => itemId === right[index]);
}

function moveItem(items: PortfolioAdminItem[], fromIndex: number, toIndex: number) {
	if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
		return items;
	}

	const nextItems = [...items];
	const [moved] = nextItems.splice(fromIndex, 1);
	nextItems.splice(toIndex, 0, moved);

	return normalizeSortOrder(nextItems);
}

export function PortfolioTable({ initialItems }: PortfolioTableProps) {
	const [items, setItems] = useState<PortfolioAdminItem[]>(sortItems(initialItems));
	const [savedOrderIds, setSavedOrderIds] = useState<string[]>(() => getItemIds(sortItems(initialItems)));
	const [feedback, setFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSavingOrder, setIsSavingOrder] = useState(false);
	const [sheetState, setSheetState] = useState<PortfolioSheetState>(null);
	const [dragState, setDragState] = useState<PortfolioDragState>(null);

	const selectedItem = useMemo(() => {
		if (!sheetState || sheetState.mode !== 'edit') {
			return null;
		}

		return items.find(item => item.id === sheetState.itemId) ?? null;
	}, [items, sheetState]);

	const draggedItem = useMemo(() => {
		if (!dragState) {
			return null;
		}

		return items.find(item => item.id === dragState.draggedId) ?? null;
	}, [dragState, items]);

	const hasPendingOrderChanges = !hasSameOrder(getItemIds(items), savedOrderIds);

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

	function reorderItems(draggedId: string, targetId: string) {
		setItems(current => {
			const fromIndex = current.findIndex(item => item.id === draggedId);
			const toIndex = current.findIndex(item => item.id === targetId);

			if (fromIndex < 0 || toIndex < 0) {
				return current;
			}

			return moveItem(current, fromIndex, toIndex);
		});
	}

	function handleCreateSuccess(item: PortfolioAdminItem) {
		const nextItems = sortItems([...items, item]);
		setItems(nextItems);
		setSavedOrderIds(getItemIds(nextItems));
		setSheetState(null);
		setFeedback('새 포트폴리오 항목이 추가되었습니다.');
		setError(null);
	}

	function handleSaveSuccess(item: PortfolioAdminItem) {
		updateItem(item.id, item);
		setFeedback('항목이 저장되었습니다.');
		setError(null);
	}

	function handleDeleteSuccess(itemId: string) {
		const nextItems = normalizeSortOrder(items.filter(item => item.id !== itemId));
		setItems(nextItems);
		setSavedOrderIds(getItemIds(nextItems));
		setSheetState(null);
		setFeedback('항목이 삭제되었습니다.');
		setError(null);
	}

	function handleDragStart(event: DragEvent<HTMLDivElement>, itemId: string) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', itemId);
		setDragState({ draggedId: itemId, overId: itemId });
		setFeedback(null);
		setError(null);
	}

	function handleDragEnter(itemId: string) {
		setDragState(current => {
			if (!current || current.draggedId === itemId) {
				return current;
			}

			return {
				...current,
				overId: itemId,
			};
		});
	}

	function handleDragOver(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}

	function handleDrop(event: DragEvent<HTMLDivElement>, itemId: string) {
		event.preventDefault();

		const draggedId = dragState?.draggedId ?? event.dataTransfer.getData('text/plain');

		if (!draggedId) {
			setDragState(null);
			return;
		}

		reorderItems(draggedId, itemId);
		setDragState(null);
		setFeedback('순서를 변경했습니다. 저장하면 웹과 PDF 노출 순서에 반영됩니다.');
		setError(null);
	}

	function handleRestoreSavedOrder() {
		const itemMap = new Map(items.map(item => [item.id, item]));
		const restoredItems = savedOrderIds
			.map(itemId => itemMap.get(itemId))
			.filter((item): item is PortfolioAdminItem => Boolean(item));

		setItems(normalizeSortOrder(restoredItems));
		setDragState(null);
		setFeedback('마지막 저장 순서로 되돌렸습니다.');
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

			setSavedOrderIds(getItemIds(items));
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
								드래그 핸들로 순서를 바꾼 뒤 저장하면 웹과 PDF 노출 순서에 함께 반영됩니다. 카드를 선택하면 오른쪽 패널에서 상세 설정을 수정할 수 있습니다.
							</CardDescription>
						</div>

						<div className="flex flex-col gap-2 sm:flex-row">
							<Button type="button" variant="outline" onClick={openCreateSheet}>
								<Plus data-icon="inline-start" />새 항목 등록
							</Button>
							{hasPendingOrderChanges ? (
								<Button type="button" variant="outline" onClick={handleRestoreSavedOrder}>
									<RotateCcw data-icon="inline-start" />
									되돌리기
								</Button>
							) : null}
							<Button type="button" onClick={handleSaveOrder} disabled={isSavingOrder || items.length === 0 || !hasPendingOrderChanges}>
								{isSavingOrder ? '정렬 저장 중...' : '정렬 저장'}
							</Button>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<Badge variant="outline" className="rounded-full border-[#18e299]/30 bg-white">
							총 {items.length}개 항목
						</Badge>
						<Badge variant="outline" className={cn('rounded-full border-black/6 bg-white', hasPendingOrderChanges ? 'border-[#18e299]/30 bg-[#18e299]/10 text-[#0f7b54]' : null)}>
							{hasPendingOrderChanges ? '저장 필요' : '정렬 저장됨'}
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
							<div className="flex flex-col gap-2 rounded-[24px] border border-black/6 bg-[#fbfdfb] px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-start gap-3">
									<div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-[#18e299]/20 bg-white text-[#0f7b54]">
										<MousePointer2 className="size-4" />
									</div>
									<div className="space-y-1">
										<p className="font-medium text-foreground">순서 조정은 드래그 방식으로 변경했습니다.</p>
										<p>왼쪽 핸들을 잡고 원하는 카드 위치로 이동한 뒤 저장하세요.</p>
									</div>
								</div>

								{draggedItem ? <p className="text-xs text-[#0f7b54]">이동 중: {draggedItem.title}</p> : null}
							</div>

							{items.map((item, index) => (
								<Card
									key={item.id}
									onDragOver={handleDragOver}
									onDragEnter={() => handleDragEnter(item.id)}
									onDrop={event => handleDrop(event, item.id)}
									className={cn(
										'overflow-hidden border-black/6 bg-[#fdfefd] py-0 shadow-[0_1px_6px_rgba(15,23,42,0.03)] transition-colors',
										dragState?.draggedId === item.id ? 'opacity-60' : null,
										dragState?.overId === item.id && dragState.draggedId !== item.id
											? 'border-[#18e299]/40 bg-[#f7fffb] shadow-[0_8px_24px_rgba(24,226,153,0.12)]'
											: null
									)}>
									<CardContent className="grid gap-4 p-4 sm:grid-cols-[auto_120px_minmax(0,1fr)]">
										<div className="flex items-start">
											<div
												role="button"
												tabIndex={0}
												aria-label={`${item.title} 순서 이동`}
												draggable={items.length > 1}
												onDragStart={event => handleDragStart(event, item.id)}
												onDragEnd={() => setDragState(null)}
												className={cn(
													'flex h-12 w-10 cursor-grab items-center justify-center rounded-[18px] border border-black/6 bg-white text-muted-foreground transition-colors',
													items.length > 1 ? 'hover:border-[#18e299]/30 hover:text-[#0f7b54]' : 'cursor-default opacity-60',
													dragState?.draggedId === item.id ? 'cursor-grabbing border-[#18e299]/40 bg-[#18e299]/10 text-[#0f7b54]' : null
												)}>
												<GripVertical className="size-4" />
											</div>
										</div>

										<button
											type="button"
											onClick={() => openEditSheet(item.id)}
											className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-black/6 bg-[#f7fbf8] text-left transition-transform hover:scale-[1.01]">
											<Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="120px" />
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
														{formatPortfolioCategories(item.category)}
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
													상세 설정
												</Button>
												<span className="text-xs text-muted-foreground">왼쪽 핸들을 드래그해 순서를 바꿀 수 있습니다.</span>
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
