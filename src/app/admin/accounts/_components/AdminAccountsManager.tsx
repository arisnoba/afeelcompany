'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AdminUserMutationErrorCode, AdminUserSummary } from '@/types/admin'

const ERROR_MESSAGES: Record<AdminUserMutationErrorCode, string> = {
  ADMIN_NOT_FOUND: '대상 관리자 계정을 찾을 수 없습니다.',
  CANNOT_DEACTIVATE_SELF: '현재 로그인한 계정은 직접 비활성화할 수 없습니다.',
  EMAIL_ALREADY_EXISTS: '이미 등록된 관리자 이메일입니다.',
  INVALID_EMAIL: '유효한 이메일 주소를 입력해주세요.',
  LAST_ACTIVE_ADMIN: '마지막 활성 관리자 계정은 비활성화할 수 없습니다.',
  PASSWORD_TOO_SHORT: '비밀번호는 10자 이상으로 설정해주세요.',
  UNAUTHORIZED: '세션이 만료되었습니다. 다시 로그인해주세요.',
}

interface AdminAccountsManagerProps {
  initialAdmins: AdminUserSummary[]
  currentAdminId: string
}

export function AdminAccountsManager({
  initialAdmins,
  currentAdminId,
}: AdminAccountsManagerProps) {
  const [admins, setAdmins] = useState(initialAdmins)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [pendingAdminId, setPendingAdminId] = useState<string | null>(null)

  async function handleCreateAdmin() {
    setIsCreating(true)
    setFeedback(null)
    setError(null)

    try {
      const response = await fetch('/api/admin-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = (await response.json()) as
        | { success: true; admin: AdminUserSummary }
        | { success: false; error?: AdminUserMutationErrorCode }

      if (!response.ok || !result.success) {
        const code = result.success ? 'ADMIN_NOT_FOUND' : result.error
        setError(code ? ERROR_MESSAGES[code] : '관리자 계정 등록에 실패했습니다.')
        return
      }

      setAdmins((current) => [...current, result.admin])
      setEmail('')
      setPassword('')
      setFeedback('관리자 계정이 등록되었습니다.')
    } catch {
      setError('관리자 계정 등록에 실패했습니다.')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleToggleAdmin(admin: AdminUserSummary) {
    setPendingAdminId(admin.id)
    setFeedback(null)
    setError(null)

    try {
      const response = await fetch(`/api/admin-users/${admin.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !admin.isActive }),
      })

      const result = (await response.json()) as
        | { success: true; admin: AdminUserSummary }
        | { success: false; error?: AdminUserMutationErrorCode }

      if (!response.ok || !result.success) {
        const code = result.success ? 'ADMIN_NOT_FOUND' : result.error
        setError(code ? ERROR_MESSAGES[code] : '관리자 상태 변경에 실패했습니다.')
        return
      }

      setAdmins((current) =>
        current.map((item) => (item.id === result.admin.id ? result.admin : item))
      )
      setFeedback(
        result.admin.isActive
          ? '관리자 계정이 다시 활성화되었습니다.'
          : '관리자 계정이 비활성화되었습니다.'
      )
    } catch {
      setError('관리자 상태 변경에 실패했습니다.')
    } finally {
      setPendingAdminId(null)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card className="py-0">
        <CardHeader>
          <CardTitle>관리자 계정 등록</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 pb-6">
          <div className="grid gap-2">
            <Label htmlFor="admin-email">이메일</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="manager@afeelcompany.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="admin-password">초기 비밀번호</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="10자 이상 비밀번호"
            />
            <p className="text-sm leading-6 text-muted-foreground">
              등록 즉시 해시로 저장되며, 평문 비밀번호는 DB에 남지 않습니다.
            </p>
          </div>

          {feedback ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button type="button" onClick={handleCreateAdmin} disabled={isCreating}>
            {isCreating ? '등록 중...' : '관리자 계정 추가'}
          </Button>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardHeader>
          <CardTitle>접근 가능 계정</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pb-6">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex flex-col gap-4 rounded-2xl border border-black/6 bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="grid gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{admin.email}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${
                      admin.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {admin.isActive ? 'active' : 'inactive'}
                  </span>
                  {admin.id === currentAdminId ? (
                    <span className="rounded-full bg-[#18e299]/12 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#0f7b54]">
                      current
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  등록일 {new Date(admin.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>

              <Button
                type="button"
                variant={admin.isActive ? 'outline' : 'default'}
                onClick={() => handleToggleAdmin(admin)}
                disabled={pendingAdminId === admin.id}
              >
                {pendingAdminId === admin.id
                  ? '처리 중...'
                  : admin.isActive
                    ? '비활성화'
                    : '다시 활성화'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
