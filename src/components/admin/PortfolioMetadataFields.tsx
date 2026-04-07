import { Checkbox } from '@/components/ui/checkbox';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxItem,
	ComboboxList,
	useComboboxAnchor,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from '@/types/portfolio';

export interface PortfolioMetadataValue {
	title: string;
	brandName: string;
	celebrityName: string;
	category: PortfolioCategory[];
	instagramUrl: string;
	showOnWeb: boolean;
	showOnPdf: boolean;
}

interface PortfolioMetadataFieldsProps {
	value: PortfolioMetadataValue;
	idPrefix: string;
	disabled?: boolean;
	onChange: (patch: Partial<PortfolioMetadataValue>) => void;
}

export function PortfolioMetadataFields({ value, idPrefix, disabled = false, onChange }: PortfolioMetadataFieldsProps) {
	const categoryAnchor = useComboboxAnchor();

	return (
		<div className="grid gap-5">
			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-title`}>제목</Label>
				<Input id={`${idPrefix}-title`} value={value.title} onChange={event => onChange({ title: event.target.value })} placeholder="ROYNINE LOOK 01" required disabled={disabled} />
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="flex flex-col gap-2">
					<Label htmlFor={`${idPrefix}-brand`}>브랜드 명</Label>
					<Input id={`${idPrefix}-brand`} value={value.brandName} onChange={event => onChange({ brandName: event.target.value })} placeholder="ROYNINE" required disabled={disabled} />
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor={`${idPrefix}-celebrity`}>셀럽 명</Label>
					<Input id={`${idPrefix}-celebrity`} value={value.celebrityName} onChange={event => onChange({ celebrityName: event.target.value })} placeholder="선택 입력" disabled={disabled} />
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-category-input`}>카테고리</Label>
				<Combobox
					items={PORTFOLIO_CATEGORIES}
					value={value.category}
					multiple
					onValueChange={nextValue => {
						onChange({ category: Array.isArray(nextValue) ? (nextValue as PortfolioCategory[]) : nextValue ? [nextValue as PortfolioCategory] : [] });
					}}>
					<ComboboxChips ref={categoryAnchor} aria-disabled={disabled} className={disabled ? 'bg-input/50' : undefined}>
						{value.category.map(category => (
							<ComboboxChip key={category} showRemove={!disabled}>
								{category}
							</ComboboxChip>
						))}
						<ComboboxChipsInput
							id={`${idPrefix}-category-input`}
							placeholder={value.category.length === 0 ? '카테고리를 선택하세요' : ''}
							disabled={disabled}
						/>
					</ComboboxChips>
					<ComboboxContent anchor={categoryAnchor}>
						<ComboboxList>
							<ComboboxGroup>
								{PORTFOLIO_CATEGORIES.map(category => (
									<ComboboxItem key={category} value={category}>
										{category}
									</ComboboxItem>
								))}
							</ComboboxGroup>
							<ComboboxEmpty>검색 결과가 없습니다.</ComboboxEmpty>
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-instagram-url`}>인스타그램 게시물 URL</Label>
				<Input
					id={`${idPrefix}-instagram-url`}
					type="url"
					value={value.instagramUrl}
					onChange={event => onChange({ instagramUrl: event.target.value })}
					placeholder="https://www.instagram.com/p/..."
					disabled={disabled}
				/>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				<label htmlFor={`${idPrefix}-web`} className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3">
					<Checkbox id={`${idPrefix}-web`} checked={value.showOnWeb} onCheckedChange={checked => onChange({ showOnWeb: Boolean(checked) })} disabled={disabled} />
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-foreground">웹 공개 포트폴리오 페이지에 표시합니다.</span>
					</div>
				</label>

				<label htmlFor={`${idPrefix}-pdf`} className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3">
					<Checkbox id={`${idPrefix}-pdf`} checked={value.showOnPdf} onCheckedChange={checked => onChange({ showOnPdf: Boolean(checked) })} disabled={disabled} />
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-foreground">PDF 출력 자료에 포함합니다.</span>
					</div>
				</label>
			</div>
		</div>
	);
}
