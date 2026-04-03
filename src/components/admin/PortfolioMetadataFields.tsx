import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
} from '@/types/portfolio'

export interface PortfolioMetadataValue {
  title: string
  brandName: string
  celebrityName: string
  category: PortfolioCategory
  showOnWeb: boolean
  showOnPdf: boolean
}

interface PortfolioMetadataFieldsProps {
  value: PortfolioMetadataValue
  idPrefix: string
  disabled?: boolean
  onChange: (patch: Partial<PortfolioMetadataValue>) => void
}

export function PortfolioMetadataFields({
  value,
  idPrefix,
  disabled = false,
  onChange,
}: PortfolioMetadataFieldsProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-title`}>제목</Label>
          <Input
            id={`${idPrefix}-title`}
            value={value.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="ROYNINE LOOK 01"
            required
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-brand`}>브랜드명</Label>
          <Input
            id={`${idPrefix}-brand`}
            value={value.brandName}
            onChange={(event) => onChange({ brandName: event.target.value })}
            placeholder="ROYNINE"
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-celebrity`}>셀럽명</Label>
          <Input
            id={`${idPrefix}-celebrity`}
            value={value.celebrityName}
            onChange={(event) => onChange({ celebrityName: event.target.value })}
            placeholder="선택 입력"
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idPrefix}-category`}>카테고리</Label>
          <Select
            value={value.category}
            onValueChange={(nextValue) => {
              if (!nextValue) {
                return
              }

              onChange({ category: nextValue as PortfolioCategory })
            }}
            disabled={disabled}
          >
            <SelectTrigger id={`${idPrefix}-category`} className="w-full">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {PORTFOLIO_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label
          htmlFor={`${idPrefix}-web`}
          className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3"
        >
          <Checkbox
            id={`${idPrefix}-web`}
            checked={value.showOnWeb}
            onCheckedChange={(checked) => onChange({ showOnWeb: Boolean(checked) })}
            disabled={disabled}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">웹 노출</span>
            <span className="text-xs text-muted-foreground">
              공개 포트폴리오 페이지에 표시합니다.
            </span>
          </div>
        </label>

        <label
          htmlFor={`${idPrefix}-pdf`}
          className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3"
        >
          <Checkbox
            id={`${idPrefix}-pdf`}
            checked={value.showOnPdf}
            onCheckedChange={(checked) => onChange({ showOnPdf: Boolean(checked) })}
            disabled={disabled}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">PDF 노출</span>
            <span className="text-xs text-muted-foreground">
              PDF 출력 자료에 포함합니다.
            </span>
          </div>
        </label>
      </div>
    </div>
  )
}
