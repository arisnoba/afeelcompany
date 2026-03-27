'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type LoginErrorCode = 'INVALID_PASSWORD' | 'PASSWORD_NOT_CONFIGURED'

const ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  INVALID_PASSWORD: '비밀번호가 올바르지 않습니다.',
  PASSWORD_NOT_CONFIGURED: '서버에 ADMIN_PASSWORD가 설정되지 않았습니다.',
}

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const result = (await response.json()) as
        | { success: true }
        | { success: false; error?: LoginErrorCode }

      if (!response.ok || !result.success) {
        const code = result.success ? 'INVALID_PASSWORD' : result.error
        setError(code ? ERROR_MESSAGES[code] : '로그인 처리 중 오류가 발생했습니다.')
        return
      }

      router.replace('/admin')
      router.refresh()
    } catch {
      setError('로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium text-stone-800">
        관리자 비밀번호
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="ADMIN_PASSWORD"
          autoComplete="current-password"
          required
          className="h-11 rounded-2xl border-stone-300 bg-stone-50 px-4"
        />
      </label>

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="mt-2 h-11 rounded-full bg-stone-950 text-white hover:bg-stone-800"
        disabled={isPending}
      >
        {isPending ? '확인 중...' : '로그인'}
      </Button>
    </form>
  )
}
