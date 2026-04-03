import Link from 'next/link'

import { AdminPageIntro } from '@/components/admin/AdminPageIntro'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function AdminExportPage() {
  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="익스포트"
        title="포트폴리오 PDF 익스포트"
        description="브로셔 PDF 전용 화면으로 이동해 현재 포트폴리오와 회사 정보를 인쇄 미리보기 또는 저장 흐름으로 확인합니다."
        aside={
          <div>
            PDF 페이지는 별도 레이아웃으로 열리며, 최종 출력 전 이미지 누락과 페이지 구성을 함께 확인하는 용도입니다.
          </div>
        }
      />

      <Card className="border-black/6 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <CardHeader className="gap-2 border-b border-black/6 px-6 py-6">
          <CardTitle className="text-xl font-semibold tracking-[-0.03em]">
            출력 실행
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            먼저 미리보기로 브로셔 레이아웃을 확인한 뒤, 필요하면 바로 인쇄 대화상자를 열어 PDF로 저장합니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 px-6 py-6 sm:grid-cols-2">
          <div className="rounded-[24px] border border-black/6 bg-[#fbfdfb] p-5">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">미리보기</p>
              <p className="text-sm leading-6 text-muted-foreground">
                현재 데이터로 구성된 브로셔 화면을 먼저 확인합니다.
              </p>
            </div>
            <Link
              href="/pdf-export"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: 'lg' }), 'mt-5 w-full sm:w-auto')}
            >
              브로셔 미리보기 열기
            </Link>
          </div>

          <div className="rounded-[24px] border border-black/6 bg-[#fbfdfb] p-5">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">PDF 저장</p>
              <p className="text-sm leading-6 text-muted-foreground">
                인쇄 대화상자를 바로 열어 PDF 저장 또는 프린터 출력으로 이어집니다.
              </p>
            </div>
            <Link
              href="/pdf-export?print=1"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'mt-5 w-full sm:w-auto'
              )}
            >
              PDF 저장 화면 열기
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
