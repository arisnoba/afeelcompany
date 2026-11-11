'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button, type buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

export function LogoutButton({
  className,
  variant = 'secondary',
}: {
  className?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
}) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleLogout() {
    setIsPending(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Logout failed')
      router.replace('/admin/login')
      router.refresh()
    } catch {
      toast.error('로그아웃하지 못했습니다. 다시 시도해 주세요.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn(
        'self-start px-4',
        className
      )}
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? '로그아웃 중...' : '로그아웃'}
    </Button>
  )
}
