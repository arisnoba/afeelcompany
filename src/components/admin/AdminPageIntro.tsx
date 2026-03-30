import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface AdminPageIntroProps {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
  aside?: ReactNode
  className?: string
}

export function AdminPageIntro({
  eyebrow,
  title,
  description,
  action,
  aside,
  className,
}: AdminPageIntroProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{eyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {aside ? (
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          {aside}
        </div>
      ) : null}
    </section>
  )
}
