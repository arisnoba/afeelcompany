import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoginForm } from '@/app/(admin-auth)/admin/login/_components/LoginForm'
import { isAdminAuthenticated } from '@/lib/auth'
import { createNoIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = createNoIndexMetadata('운영 로그인')

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#d6d3d1,transparent_42%),linear-gradient(180deg,#fafaf9,#e7e5e4)] px-4 py-16">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-[0_24px_80px_rgba(28,25,23,0.14)] ring-1 ring-stone-950/8">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
          AFEEL Admin
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
          운영 로그인
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          등록된 관리자 이메일과 비밀번호가 일치할 때만 운영 메뉴 접근 권한이 열립니다.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
