'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { parsePortfolioCategories, serializePortfolioCategories, type PortfolioAdminItem } from '@/types/portfolio';
import { PortfolioMetadataFields, type PortfolioMetadataValue } from '@/components/admin/PortfolioMetadataFields';

interface PortfolioMutationResponse {
	success: boolean;
	data?: PortfolioAdminItem;
	error?: string;
}

interface PortfolioEditorFormProps {
	item: PortfolioAdminItem;
	onDeleteSuccess: (id: string) => void;
	onSaveSuccess: (item: PortfolioAdminItem) => void;
}

function toFormValue(item: PortfolioAdminItem): PortfolioMetadataValue {
	return {
		title: item.title,
		brandName: item.brandName,
		celebrityName: item.celebrityName ?? '',
		category: parsePortfolioCategories(item.category),
		showOnWeb: item.showOnWeb,
		showOnPdf: item.showOnPdf,
	};
}

export function PortfolioEditorForm({ item, onDeleteSuccess, onSaveSuccess }: PortfolioEditorFormProps) {
	const [form, setForm] = useState<PortfolioMetadataValue>(() => toFormValue(item));
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<string | null>(null);

	useEffect(() => {
		setForm(toFormValue(item));
		setError(null);
		setFeedback(null);
	}, [item]);

	function updateForm(patch: Partial<PortfolioMetadataValue>) {
		setForm(current => ({ ...current, ...patch }));
	}

	async function handleSave() {
		setIsSaving(true);
		setError(null);
		setFeedback(null);

		try {
			const response = await fetch(`/api/portfolio/${item.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: form.title,
					brandName: form.brandName,
					celebrityName: form.celebrityName || null,
					category: serializePortfolioCategories(form.category),
					showOnWeb: form.showOnWeb,
					showOnPdf: form.showOnPdf,
					sortOrder: item.sortOrder,
				}),
			});

			const result = (await response.json()) as PortfolioMutationResponse;

			if (!response.ok || !result.success || !result.data) {
				setError(result.error ?? '저장에 실패했습니다.');
				return;
			}

			setFeedback('항목이 저장되었습니다.');
			onSaveSuccess(result.data);
		} catch {
			setError('저장에 실패했습니다.');
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete() {
		setIsDeleting(true);
		setError(null);
		setFeedback(null);

		try {
			const response = await fetch(`/api/portfolio/${item.id}`, {
				method: 'DELETE',
			});
			const result = (await response.json()) as { success: boolean; error?: string };

			if (!response.ok || !result.success) {
				setError(result.error ?? '삭제에 실패했습니다.');
				return;
			}

			onDeleteSuccess(item.id);
		} catch {
			setError('삭제에 실패했습니다.');
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<div className="grid gap-6">
			<div className="grid gap-4">
				<div className="flex flex-col gap-1">
					<p className="text-sm font-medium text-foreground">콘텐츠 설정</p>
					<p className="text-xs text-muted-foreground">선택한 항목의 노출 상태와 메타데이터를 이 패널에서 수정합니다.</p>
				</div>
				<PortfolioMetadataFields value={form} idPrefix={`portfolio-${item.id}`} disabled={isSaving || isDeleting} onChange={updateForm} />
			</div>

			<div className="grid gap-4 rounded-[24px] border border-black/6 bg-white p-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="grid gap-2">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Normal</p>
						<div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[20px] border border-black/6 bg-[#f7fbf8]">
							<Image src={item.imageUrl} alt={`${item.title} normal`} fill className="object-cover" sizes="180px" />
						</div>
					</div>
					<div className="grid gap-2">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Hover</p>
						<div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[20px] border border-black/6 bg-[#f7fbf8]">
							<Image src={item.hoverImageUrl ?? item.imageUrl} alt={`${item.title} hover`} fill className="object-cover" sizes="180px" />
						</div>
					</div>
				</div>
			</div>

			{error ? <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}

			{feedback ? <div className="rounded-2xl border border-[#18e299]/25 bg-[#18e299]/10 px-4 py-3 text-sm text-[#0f7b54]">{feedback}</div> : null}

			<div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
				<Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving || isDeleting}>
					{isDeleting ? '삭제 중...' : '항목 삭제'}
				</Button>
				<Button type="button" size="lg" onClick={handleSave} disabled={isSaving || isDeleting}>
					{isSaving ? '저장 중...' : '변경 저장'}
				</Button>
			</div>
		</div>
	);
}
