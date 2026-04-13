import type { ReactNode } from 'react'
import Link from 'next/link'

import { AdminPageIntro } from '@/components/admin/AdminPageIntro'
import { ADMIN_NAV_ITEMS } from '@/components/admin/admin-navigation'
import {
  Card,
  CardContent,
  CardDescription,
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
    title: '회사 프로필 관리',
    description: '소개 문구와 연락처를 관리해 PDF와 웹 공용 데이터를 갱신합니다.',
  },
  {
    href: '/admin/accounts',
    title: '관리자 계정 관리',
    description: '접근 가능한 관리자 이메일을 등록하고 활성 상태를 관리합니다.',
  },
  {
    href: '/admin/clients',
    title: '클라이언트 관리',
    description: '브랜드 리스트와 로고, URL, 활성 상태를 테이블과 우측 패널에서 관리합니다.',
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageIntro
        eyebrow="관리자"
        title="운영 화면"
        description="업로드부터 포트폴리오 정리, 회사 정보 반영, 클라이언트 관리까지 같은 데이터 레이어로 연결됩니다."
        aside={
          <div>활성 메뉴 {ADMIN_NAV_ITEMS.length}개</div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        {FEATURE_CARDS.map((card) => (
          <Card
              key={card.href}
              className="py-0"
            >
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 pb-6">
              <p className="text-sm text-muted-foreground">
                바로 이동해 작업을 시작할 수 있습니다.
              </p>
              <ButtonLink href={card.href}>열기</ButtonLink>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="py-0">
          <CardHeader>
            <CardTitle>운영 순서</CardTitle>
            <CardDescription>일반적인 작업 흐름입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-6 text-sm text-muted-foreground">
            <p>1. 업로드에서 자산과 메타데이터를 등록합니다.</p>
            <p>2. 포트폴리오에서 노출 여부와 정렬 순서를 조정합니다.</p>
            <p>3. 회사 정보와 관리자 계정, 클라이언트 리스트를 최신 상태로 맞춥니다.</p>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader>
            <CardTitle>공유 데이터</CardTitle>
            <CardDescription>서로 연결된 운영 데이터입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-6 text-sm text-muted-foreground">
            <p>포트폴리오 항목은 웹과 PDF에서 함께 사용됩니다.</p>
            <p>회사 정보와 클라이언트 로고는 외부 출력물과 사이트에서 함께 사용됩니다.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function ButtonLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </Link>
  )
}
