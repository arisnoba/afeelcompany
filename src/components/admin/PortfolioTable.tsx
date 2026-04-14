'use client';

import Image from 'next/image';
import { useMemo, useState, type DragEvent } from 'react';
import { GripVertical, Plus, RotateCcw } from 'lucide-react';

import { UploadForm } from '@/app/admin/upload/_components/UploadForm';
import { PortfolioEditorForm } from '@/components/admin/PortfolioEditorForm';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { ClientBrandAdminItem } from '@/types/client-brand';
import { formatPortfolioCategories } from '@/types/portfolio';
import type { PortfolioAdminItem } from '@/types/portfolio';

interface PortfolioTableProps {
	initialItems: PortfolioAdminItem[];
	clientBrands: ClientBrandAdminItem[];
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

export function PortfolioTable({ initialItems, clientBrands }: PortfolioTableProps) {
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
			{/* 페이지 타이틀 + 액션 */}
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">포트폴리오 라이브러리</h1>
				<span className="text-sm text-muted-foreground tabular-nums">{items.length}개</span>
				<div className="ml-auto flex items-center gap-2">
					{hasPendingOrderChanges ? (
						<span className="text-xs font-medium text-[#0f7b54]">저장 필요</span>
					) : null}
					<Button type="button" variant="outline" size="sm" onClick={openCreateSheet}>
						<Plus data-icon="inline-start" />새 항목
					</Button>
					{hasPendingOrderChanges ? (
						<Button type="button" variant="ghost" size="sm" onClick={handleRestoreSavedOrder}>
							<RotateCcw data-icon="inline-start" />
							되돌리기
						</Button>
					) : null}
					<Button type="button" size="sm" onClick={handleSaveOrder} disabled={isSavingOrder || items.length === 0 || !hasPendingOrderChanges}>
						{isSavingOrder ? '저장 중...' : '순서 저장'}
					</Button>
				</div>
			</div>

			{/* 피드백 */}
			{feedback ? <div className="rounded-lg border border-[#18e299]/20 bg-[#18e299]/8 px-4 py-2.5 text-sm text-[#0f7b54]">{feedback}</div> : null}
			{error ? <div className="rounded-lg border border-destructive/20 bg-destructive/8 px-4 py-2.5 text-sm text-destructive">{error}</div> : null}

			{/* 테이블 */}
			<div className="overflow-hidden rounded-xl border border-black/6 bg-white shadow-[0_1px_6px_rgba(15,23,42,0.04)]">
				{items.length === 0 ? (
					<div className="px-6 py-16 text-center text-sm text-muted-foreground">
						아직 업로드된 포트폴리오 항목이 없습니다.{' '}
						<button type="button" onClick={openCreateSheet} className="font-medium text-foreground underline-offset-4 hover:underline">
							첫 항목을 등록하세요
						</button>
					</div>
				) : (
					<>
						{/* 테이블 헤더 */}
						<div className="grid grid-cols-[32px_56px_minmax(0,1fr)_120px_80px_32px] items-center gap-3 border-b border-black/6 bg-[#fafafa] px-4 py-2.5 text-xs font-medium text-muted-foreground">
							<span />
							<span />
							<span>제목 / 브랜드</span>
							<span>카테고리</span>
							<span className="text-center">웹 · PDF</span>
							<span className="text-center">#</span>
						</div>

						{/* 테이블 행 */}
						{items.map((item, index) => (
							<div
								key={item.id}
								onDragOver={handleDragOver}
								onDragEnter={() => handleDragEnter(item.id)}
								onDrop={event => handleDrop(event, item.id)}
								className={cn(
									'group grid grid-cols-[32px_56px_minmax(0,1fr)_120px_80px_32px] items-center gap-3 border-b border-black/4 px-4 py-3 transition-colors last:border-b-0',
									dragState?.draggedId === item.id ? 'opacity-40' : 'hover:bg-[#f7fdf9]',
									dragState?.overId === item.id && dragState.draggedId !== item.id
										? 'bg-[#f0fdf8] shadow-[inset_0_2px_0_#18e299,inset_0_-1px_0_#18e299/20]'
										: null
								)}>
								{/* 드래그 핸들 */}
								<div
									role="button"
									tabIndex={0}
									aria-label={`${item.title} 순서 이동`}
									draggable={items.length > 1}
									onDragStart={event => handleDragStart(event, item.id)}
									onDragEnd={() => setDragState(null)}
									className={cn(
										'flex size-8 cursor-grab items-center justify-center rounded-lg text-black/20 transition-colors',
										items.length > 1 ? 'group-hover:text-black/40 hover:bg-black/4 hover:text-[#0f7b54]!' : 'cursor-default',
										dragState?.draggedId === item.id ? 'cursor-grabbing text-[#0f7b54]' : null
									)}>
									<GripVertical className="size-3.5" />
								</div>

								{/* 썸네일 */}
								<button
									type="button"
									onClick={() => openEditSheet(item.id)}
									className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/6 bg-[#f7fbf8] transition-opacity hover:opacity-80">
									<Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
								</button>

								{/* 제목 / 브랜드 */}
								<button
									type="button"
									onClick={() => openEditSheet(item.id)}
									className="min-w-0 text-left">
									<p className="truncate text-sm font-medium leading-5 text-foreground">{item.title}</p>
									<p className="truncate text-xs leading-4 text-muted-foreground">
										{item.brandName}{item.celebrityName ? ` · ${item.celebrityName}` : ''}
									</p>
								</button>

								{/* 카테고리 */}
								<div className="flex items-center">
									<span className="truncate rounded-md bg-black/4 px-2 py-1 text-xs text-foreground/70">
										{formatPortfolioCategories(item.category) || '—'}
									</span>
								</div>

								{/* 웹 · PDF 상태 */}
								<div className="flex items-center justify-center gap-2">
									<div className="flex items-center gap-1">
										<span className={cn('size-2 rounded-full', item.showOnWeb ? 'bg-[#18e299]' : 'bg-black/15')} />
										<span className="text-[10px] text-muted-foreground">웹</span>
									</div>
									<div className="flex items-center gap-1">
										<span className={cn('size-2 rounded-full', item.showOnPdf ? 'bg-[#18e299]' : 'bg-black/15')} />
										<span className="text-[10px] text-muted-foreground">PDF</span>
									</div>
								</div>

								{/* 순서 번호 */}
								<div className="flex items-center justify-center">
									<span className="text-xs tabular-nums text-black/30">{index + 1}</span>
								</div>
							</div>
						))}

						{draggedItem ? (
							<div className="border-t border-black/4 bg-[#f7fdf9] px-4 py-2 text-xs text-[#0f7b54]">
								이동 중: <span className="font-medium">{draggedItem.title}</span>
							</div>
						) : null}
					</>
				)}
			</div>

			<Sheet open={sheetState !== null} onOpenChange={open => !open && setSheetState(null)}>
				<SheetContent
					side="right"
					className="data-[side=right]:w-full data-[side=right]:max-w-none border-black/6 bg-[#fcfffd] p-0 sm:data-[side=right]:w-[min(56rem,44vw)] sm:data-[side=right]:max-w-[min(56rem,44vw)]">
					<SheetHeader className="border-b border-black/6 bg-white px-6 py-5">
						<SheetTitle>{sheetState?.mode === 'create' ? '새 포트폴리오 등록' : '포트폴리오 수정'}</SheetTitle>
					</SheetHeader>

					<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
						{sheetState?.mode === 'create' ? (
							<UploadForm availableBrands={clientBrands} onSuccess={handleCreateSuccess} />
						) : selectedItem ? (
							<PortfolioEditorForm
								item={selectedItem}
								availableBrands={clientBrands}
								onSaveSuccess={handleSaveSuccess}
								onDeleteSuccess={handleDeleteSuccess}
							/>
						) : null}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
