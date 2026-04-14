import type { ReactNode } from 'react'
import Link from 'next/link'

const FEATURE_CARDS = [
  { href: '/admin/upload', title: '새 포트폴리오 업로드' },
  { href: '/admin/portfolio', title: '포트폴리오 정리' },
  { href: '/admin/profile', title: '회사 프로필 관리' },
  { href: '/admin/accounts', title: '관리자 계정 관리' },
  { href: '/admin/clients', title: '클라이언트 관리' },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {FEATURE_CARDS.map((card) => (
          <ButtonLink key={card.href} href={card.href}>
            {card.title}
          </ButtonLink>
        ))}
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
      className="flex h-12 items-center rounded-xl border border-input bg-background px-5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </Link>
  )
}
