'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { ClientBrandAdminItem } from '@/types/client-brand';
import { resizePortfolioImage } from '@/lib/image';
import {
	getPortfolioImageAlt,
	parsePortfolioCategories,
	serializePortfolioCategories,
	type PortfolioAdminItem,
} from '@/types/portfolio';
import { PortfolioMetadataFields, type PortfolioMetadataValue } from '@/components/admin/PortfolioMetadataFields';

interface PortfolioMutationResponse {
	success: boolean;
	data?: PortfolioAdminItem;
	error?: string;
}

interface PortfolioEditorFormProps {
	item: PortfolioAdminItem;
	availableBrands: ClientBrandAdminItem[];
	onDeleteSuccess: (id: string) => void;
	onSaveSuccess: (item: PortfolioAdminItem) => void;
}

function toFormValue(item: PortfolioAdminItem): PortfolioMetadataValue {
	return {
		brandMode: item.clientBrandId ? 'managed' : 'custom',
		clientBrandId: item.clientBrandId,
		brandName: item.brandName,
		celebrityName: item.celebrityName ?? '',
		category: parsePortfolioCategories(item.category),
		instagramUrl: item.instagramUrl ?? '',
		showOnWeb: item.showOnWeb,
		showOnPdf: item.showOnPdf,
	};
}

export function PortfolioEditorForm({
	item,
	availableBrands,
	onDeleteSuccess,
	onSaveSuccess,
}: PortfolioEditorFormProps) {
	const [form, setForm] = useState<PortfolioMetadataValue>(() => toFormValue(item));
	const [selectedHoverFile, setSelectedHoverFile] = useState<File | null>(null);
	const [hoverPreviewUrl, setHoverPreviewUrl] = useState<string | null>(item.thumbnailUrl);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const selectedBrand = availableBrands.find(brand => brand.id === form.clientBrandId) ?? null;
	const requiresCustomHover = form.brandMode === 'custom';
	const resolvedHoverPreviewUrl = requiresCustomHover ? hoverPreviewUrl : selectedBrand?.logoUrl ?? null;
	const previewAlt = getPortfolioImageAlt({
		brandName: form.brandName || item.brandName,
		celebrityName: form.celebrityName || item.celebrityName,
		title: item.title,
	});

	useEffect(() => {
		setForm(toFormValue(item));
		setSelectedHoverFile(null);
		setHoverPreviewUrl(item.thumbnailUrl);
	}, [item]);

	useEffect(() => {
		return () => {
			if (hoverPreviewUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(hoverPreviewUrl);
			}
		};
	}, [hoverPreviewUrl]);

	function updateForm(patch: Partial<PortfolioMetadataValue>) {
		setForm(current => ({ ...current, ...patch }));
	}

	function handleHoverFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0] ?? null;

		setSelectedHoverFile(file);
		setHoverPreviewUrl(current => {
			if (current?.startsWith('blob:')) {
				URL.revokeObjectURL(current);
			}

			return file ? URL.createObjectURL(file) : item.thumbnailUrl;
		});
	}

	async function handleSave() {
		setIsSaving(true);

		try {
			const payload = new FormData();
			payload.set('clientBrandId', form.brandMode === 'managed' ? form.clientBrandId ?? '' : '');
			payload.set('brandName', form.brandMode === 'custom' ? form.brandName : '');
			payload.set('celebrityName', form.celebrityName || '');
			payload.set('category', serializePortfolioCategories(form.category));
			payload.set('instagramUrl', form.instagramUrl || '');
			payload.set('showOnWeb', String(form.showOnWeb));
			payload.set('showOnPdf', String(form.showOnPdf));
			payload.set('sortOrder', String(item.sortOrder));

			if (requiresCustomHover && selectedHoverFile) {
				payload.set('hoverFile', await resizePortfolioImage(selectedHoverFile));
			}

			const response = await fetch(`/api/portfolio/${item.id}`, {
				method: 'PATCH',
				body: payload,
			});

			const result = (await response.json()) as PortfolioMutationResponse;

			if (!response.ok || !result.success || !result.data) {
				toast.error(result.error ?? '저장에 실패했습니다.');
				return;
			}

			onSaveSuccess(result.data);
		} catch {
			toast.error('저장에 실패했습니다.');
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete() {
		setIsDeleting(true);

		try {
			const response = await fetch(`/api/portfolio/${item.id}`, {
				method: 'DELETE',
			});
			const result = (await response.json()) as { success: boolean; error?: string };

			if (!response.ok || !result.success) {
				toast.error(result.error ?? '삭제에 실패했습니다.');
				return;
			}

			onDeleteSuccess(item.id);
		} catch {
			toast.error('삭제에 실패했습니다.');
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<div className="grid gap-6">
			<div className="grid gap-4">
				<p className="text-sm font-medium text-foreground">콘텐츠 설정</p>
				<PortfolioMetadataFields
					value={form}
					idPrefix={`portfolio-${item.id}`}
					availableBrands={availableBrands}
					disabled={isSaving || isDeleting}
					onChange={updateForm}
				/>
			</div>

			<div className="grid gap-4 rounded-[24px] border border-black/6 bg-white p-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="grid gap-2">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Normal</p>
						<div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[20px] border border-black/6 bg-[#f7fbf8]">
							<Image src={item.imageUrl} alt={`${previewAlt} normal`} fill className="object-cover" sizes="180px" />
						</div>
					</div>
					<div className="grid gap-2">
						<p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
							{requiresCustomHover ? 'Hover 업로드' : '연결된 브랜드 로고'}
						</p>
						<div className="relative mx-auto flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] border border-black/6 bg-[#f7fbf8]">
							{resolvedHoverPreviewUrl ? (
								<Image src={resolvedHoverPreviewUrl} alt={`${previewAlt} hover`} fill className="object-contain p-6" sizes="180px" />
							) : (
								<div className="px-5 text-center text-sm text-muted-foreground">
									{requiresCustomHover ? '예외 브랜드용 hover 이미지를 등록해 주세요.' : '선택한 브랜드에 로고가 없습니다.'}
								</div>
							)}
						</div>
						{requiresCustomHover ? (
							<input
								type="file"
								accept="image/jpeg,image/png,image/webp"
								onChange={handleHoverFileChange}
								disabled={isSaving || isDeleting}
								className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-[#274133] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#3a5a48]"
							/>
						) : null}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
				<Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving || isDeleting}>
					{isDeleting ? '삭제 중...' : '항목 삭제'}
				</Button>
				<Button
					type="button"
					size="lg"
					onClick={handleSave}
					disabled={
						isSaving ||
						isDeleting ||
						(form.brandMode === 'managed' && !selectedBrand?.logoUrl) ||
						(requiresCustomHover && !resolvedHoverPreviewUrl)
					}
				>
					{isSaving ? '저장 중...' : '변경 저장'}
				</Button>
			</div>
		</div>
	);
}
