import Link from 'next/link'

import { LogoutButton } from '@/app/admin/_components/LogoutButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const FEATURE_CARDS = [
  {
    href: '/admin/upload',
    title: '새 포트폴리오 업로드',
    description: '이미지와 메타데이터를 업로드해 웹, PDF, 인스타 운영 흐름의 시작점을 만듭니다.',
  },
  {
    href: '/admin/portfolio',
    title: '포트폴리오 정리',
    description: '노출 여부와 정렬 순서를 조정하고 기존 항목을 수정하거나 삭제합니다.',
  },
  {
    href: '/admin/profile',
    title: '회사 정보와 브랜드',
    description: '소개 문구, 연락처, 브랜드 로고를 관리해 PDF와 웹 공용 데이터를 갱신합니다.',
  },
  {
    href: '/admin/instagram',
    title: '인스타 큐',
    description: '게시 대기열 상태를 확인하고 수동 게시를 실행합니다.',
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[32px] bg-[linear-gradient(135deg,#1c1917,rgba(68,64,60,0.92))] p-8 text-stone-50 shadow-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-300">
          Protected
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              관리자 작업을 여기서 이어가면 됩니다.
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              업로드된 포트폴리오 데이터는 웹, PDF, 인스타 큐에서 같은 DB 레이어를 공유합니다.
            </p>
          </div>
          <LogoutButton />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {FEATURE_CARDS.map((card) => (
          <Card key={card.href} className="rounded-[28px] border-0 bg-white shadow-sm ring-1 ring-stone-950/8">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-stone-500">
                현재 Phase 03 데이터 레이어 기준으로 연결되는 운영 화면입니다.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-xs uppercase tracking-[0.24em] text-stone-400">
                admin
              </span>
              <Link
                href={card.href}
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
              >
                열기
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  )
}
