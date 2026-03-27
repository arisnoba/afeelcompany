import Link from 'next/link'

import { requireAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const ADMIN_LINKS = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/upload', label: '업로드' },
  { href: '/admin/portfolio', label: '포트폴리오' },
  { href: '/admin/profile', label: '회사 정보' },
  { href: '/admin/instagram', label: '인스타 큐' },
]

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAdminSession()

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="rounded-[28px] bg-stone-900 p-5 text-stone-100 lg:w-72">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
              AFEEL Admin
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              운영 콘솔
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              업로드, PDF 반영 데이터, 인스타 큐를 한 화면에서 관리합니다.
            </p>
          </div>

          <nav className="grid gap-2">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-stone-100 transition hover:border-white/20 hover:bg-white/8"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
