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
    <section
      className={cn(
        'flex flex-col gap-4 rounded-[28px] border border-black/6 bg-[linear-gradient(135deg,rgba(24,226,153,0.08),rgba(255,255,255,0.94)_40%,rgba(255,255,255,1))] px-6 py-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)]',
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-[0.18em] text-[#0f7b54] uppercase">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {aside ? (
        <div className="rounded-[22px] border border-black/6 bg-white/85 p-4 text-sm text-muted-foreground">
          {aside}
        </div>
      ) : null}
    </section>
  )
}
