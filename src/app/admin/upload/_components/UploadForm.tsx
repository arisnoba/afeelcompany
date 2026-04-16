'use client';

import Image from 'next/image';
import { DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { ClientBrandAdminItem } from '@/types/client-brand';
import { resizePortfolioImage } from '@/lib/image';
import {
	getPortfolioImageAlt,
	serializePortfolioCategories,
	type PortfolioAdminItem,
} from '@/types/portfolio';
import { PortfolioMetadataFields, type PortfolioMetadataValue } from '@/components/admin/PortfolioMetadataFields';

interface UploadResponse {
	success: boolean;
	data?: PortfolioAdminItem;
	error?: string;
}

const INITIAL_FORM: PortfolioMetadataValue = {
	brandMode: 'managed',
	clientBrandId: null,
	brandName: '',
	celebrityName: '',
	category: [],
	instagramUrl: '',
	showOnWeb: true,
	showOnPdf: true,
};

interface UploadFormProps {
	availableBrands: ClientBrandAdminItem[];
	onSuccess?: (item: PortfolioAdminItem) => void;
}

type UploadImageKey = 'normal' | 'hover';

const EMPTY_SELECTED_FILES: Record<UploadImageKey, File | null> = {
	normal: null,
	hover: null,
};

const EMPTY_PREVIEW_URLS: Record<UploadImageKey, string | null> = {
	normal: null,
	hover: null,
};

interface ImageDropZoneProps {
	label: string;
	kind: UploadImageKey;
	previewUrl: string | null;
	previewAlt: string;
	disabled: boolean;
	onFile: (kind: UploadImageKey, file: File) => void;
	onClear: (kind: UploadImageKey) => void;
}

function ImageDropZone({ label, kind, previewUrl, previewAlt, disabled, onFile, onClear }: ImageDropZoneProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	function handleDragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		if (!disabled) setIsDragging(true);
	}

	function handleDragLeave(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
	}

	function handleDrop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragging(false);
		if (disabled) return;
		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith('image/')) {
			onFile(kind, file);
		}
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) onFile(kind, file);
		e.target.value = '';
	}

	return (
		<div className="grid gap-2">
			<div className="flex items-center justify-between gap-3">
				<p className="text-sm font-medium text-foreground">{label}</p>
				<span className="text-xs text-muted-foreground">JPEG, PNG, WEBP</span>
			</div>

			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				aria-label={`${label} 업로드`}
				onClick={() => !disabled && inputRef.current?.click()}
				onKeyDown={e => {
					if (!disabled && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click();
				}}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={[
					'relative flex aspect-square w-full cursor-pointer select-none flex-col items-center justify-center overflow-hidden rounded-[20px] border-2 transition-all',
					previewUrl ? 'border-transparent' : isDragging ? 'border-[#18e299] bg-[#18e299]/8' : 'border-dashed border-black/15 bg-[#f7fbf8] hover:border-[#18e299]/60 hover:bg-[#f0fdf6]',
					disabled ? 'pointer-events-none opacity-60' : '',
				].join(' ')}>
				{previewUrl ? (
					<>
						<Image src={previewUrl} alt={`${previewAlt} ${kind}`} fill unoptimized className="object-cover" sizes="220px" />
						<div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent p-3 opacity-0 transition-opacity hover:opacity-100">
							<span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground">클릭하여 변경</span>
						</div>
						<button
							type="button"
							aria-label="이미지 제거"
							onClick={e => {
								e.stopPropagation();
								onClear(kind);
							}}
							className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70">
							<X size={12} />
						</button>
					</>
				) : (
					<div className="flex flex-col items-center gap-3 px-4 text-center">
						<div
							className={['flex h-10 w-10 items-center justify-center rounded-full transition-colors', isDragging ? 'bg-[#18e299]/20 text-[#0f7b54]' : 'bg-black/6 text-muted-foreground'].join(
								' '
							)}>
							<ImagePlus size={20} />
						</div>
						<div className="grid gap-1">
							<p className="text-xs font-medium text-foreground">{isDragging ? '여기에 놓으세요' : '드래그 앤 드롭 또는 클릭하여 파일 선택'}</p>
						</div>
					</div>
				)}
			</div>

			<input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} onChange={handleInputChange} disabled={disabled} />
		</div>
	);
}

export function UploadForm({ availableBrands, onSuccess }: UploadFormProps) {
	const [form, setForm] = useState(INITIAL_FORM);
	const [selectedFiles, setSelectedFiles] = useState(EMPTY_SELECTED_FILES);
	const [previewUrls, setPreviewUrls] = useState(EMPTY_PREVIEW_URLS);
	const [isPending, setIsPending] = useState(false);
	const selectedBrand = availableBrands.find(brand => brand.id === form.clientBrandId) ?? null;
	const requiresCustomHover = form.brandMode === 'custom';

	const previewAlt = useMemo(() => getPortfolioImageAlt(form), [form]);

	useEffect(() => {
		return () => {
			Object.values(previewUrls).forEach(url => {
				if (url) URL.revokeObjectURL(url);
			});
		};
	}, [previewUrls]);

	useEffect(() => {
		if (availableBrands.length === 0) {
			return;
		}

		const defaultBrand = availableBrands.find(brand => brand.isActive) ?? availableBrands[0];

		setForm(current => {
			if (current.brandMode !== 'managed' || current.clientBrandId) {
				return current;
			}

			return {
				...current,
				clientBrandId: defaultBrand?.id ?? null,
				brandName: defaultBrand?.name ?? '',
			};
		});
	}, [availableBrands]);

	useEffect(() => {
		if (!requiresCustomHover && previewUrls.hover) {
			handleClear('hover');
		}
	}, [previewUrls.hover, requiresCustomHover]);

	function handleFile(kind: UploadImageKey, file: File) {
		setSelectedFiles(current => ({ ...current, [kind]: file }));
		setPreviewUrls(current => {
			if (current[kind]) URL.revokeObjectURL(current[kind]!);
			return { ...current, [kind]: URL.createObjectURL(file) };
		});
	}

	function handleClear(kind: UploadImageKey) {
		setSelectedFiles(current => ({ ...current, [kind]: null }));
		setPreviewUrls(current => {
			if (current[kind]) URL.revokeObjectURL(current[kind]!);
			return { ...current, [kind]: null };
		});
	}

	function updateForm(patch: Partial<PortfolioMetadataValue>) {
		setForm(current => ({ ...current, ...patch }));
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!selectedFiles.normal) {
			toast.error('normal 이미지를 선택해 주세요.');
			return;
		}

		if (requiresCustomHover && !selectedFiles.hover) {
			toast.error('예외 브랜드는 hover 이미지를 함께 등록해 주세요.');
			return;
		}

		if (form.brandMode === 'managed' && !form.clientBrandId) {
			toast.error('등록된 브랜드를 선택해 주세요.');
			return;
		}

		setIsPending(true);

		try {
			const resizedNormalFile = await resizePortfolioImage(selectedFiles.normal);
			const resizedHoverFile = requiresCustomHover && selectedFiles.hover ? await resizePortfolioImage(selectedFiles.hover) : null;
			const payload = new FormData();

			payload.set('normalFile', resizedNormalFile);
			payload.set('clientBrandId', form.brandMode === 'managed' ? (form.clientBrandId ?? '') : '');
			payload.set('brandName', form.brandMode === 'custom' ? form.brandName : '');
			payload.set('celebrityName', form.celebrityName);
			payload.set('category', serializePortfolioCategories(form.category));
			payload.set('instagramUrl', form.instagramUrl);
			payload.set('showOnWeb', String(form.showOnWeb));
			payload.set('showOnPdf', String(form.showOnPdf));
			if (resizedHoverFile) {
				payload.set('hoverFile', resizedHoverFile);
			}

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: payload,
			});
			const result = (await response.json()) as UploadResponse;

			if (!response.ok || !result.success || !result.data) {
				toast.error(result.error ?? '업로드에 실패했습니다.');
				return;
			}

			setForm(INITIAL_FORM);
			setSelectedFiles(EMPTY_SELECTED_FILES);
			handleClear('normal');
			handleClear('hover');

			if (onSuccess) {
				onSuccess(result.data);
				return;
			}

			toast.success('업로드가 완료되었습니다. 포트폴리오 관리 화면에서 바로 편집할 수 있습니다.');
		} catch (submitError) {
			const message = submitError instanceof Error ? submitError.message : '업로드에 실패했습니다.';
			toast.error(message);
		} finally {
			setIsPending(false);
		}
	}

	return (
		<form className="grid gap-6" onSubmit={handleSubmit} encType="multipart/form-data">
			<div className="grid gap-4">
				<div className="flex flex-col gap-1">
					<p className="text-sm font-medium text-foreground">기본 정보</p>
					<p className="text-xs text-muted-foreground">목록 카드와 상세 정보 패널에 같은 데이터가 반영됩니다.</p>
				</div>
				<PortfolioMetadataFields value={form} idPrefix="upload" availableBrands={availableBrands} disabled={isPending} onChange={updateForm} />
			</div>

			<div className={`grid gap-4 ${requiresCustomHover ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
				<ImageDropZone label="Normal 이미지" kind="normal" previewUrl={previewUrls.normal} previewAlt={previewAlt} disabled={isPending} onFile={handleFile} onClear={handleClear} />
				{requiresCustomHover ? (
					<ImageDropZone label="Hover 이미지" kind="hover" previewUrl={previewUrls.hover} previewAlt={previewAlt} disabled={isPending} onFile={handleFile} onClear={handleClear} />
				) : selectedBrand?.logoUrl ? (
					<div className="grid gap-2">
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-medium text-foreground">Hover 로고</p>
							<span className="text-xs text-muted-foreground">브랜드 리스트에서 자동 연결</span>
						</div>
						<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] border border-black/8 bg-[#f7fbf8]">
							<Image src={selectedBrand.logoUrl} alt={selectedBrand.name} fill className="object-contain p-8" sizes="220px" />
						</div>
					</div>
				) : (
					<div className="grid gap-2">
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-medium text-foreground">Hover 로고</p>
							<span className="text-xs text-muted-foreground">브랜드 로고 필요</span>
						</div>
						<div className="flex aspect-square items-center justify-center rounded-[20px] border border-dashed border-destructive/30 bg-destructive/5 px-6 text-center text-sm text-destructive">
							선택한 브랜드에 로고가 없습니다. 파트너 관리에서 로고를 먼저 등록해 주세요.
						</div>
					</div>
				)}
			</div>

			<p className="text-xs text-muted-foreground">Normal 이미지는 항상 업로드합니다. 예외 브랜드를 직접 입력한 경우에만 hover 이미지를 추가로 업로드합니다.</p>

			<Button type="submit" size="lg" disabled={isPending || !selectedFiles.normal || (requiresCustomHover && !selectedFiles.hover) || (form.brandMode === 'managed' && !selectedBrand?.logoUrl)}>
				{isPending ? '업로드 중...' : '포트폴리오 생성'}
			</Button>
		</form>
	);
}
