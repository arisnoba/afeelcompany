'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleLogout() {
    setIsPending(true)

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      router.replace('/admin/login')
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="self-start rounded-full bg-white/12 px-4 text-white hover:bg-white/20"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? '로그아웃 중...' : '로그아웃'}
    </Button>
  )
}
