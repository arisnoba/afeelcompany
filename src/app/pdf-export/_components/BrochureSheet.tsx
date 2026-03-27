import type { ReactNode } from 'react'

interface BrochureSheetProps {
  sectionId: 'cover' | 'about' | 'work' | 'client' | 'contact'
  title?: string
  children: ReactNode
}

export function BrochureSheet({ sectionId, title, children }: BrochureSheetProps) {
  return (
    <section
      data-section={sectionId}
      className={`pdf-sheet pdf-sheet--${sectionId} overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(17,17,17,0.08)]`}
    >
      <div className="flex min-h-full flex-col p-10">
        {title ? (
          <header className="mb-6 border-b border-black/10 pb-4">
            <p className="text-xs font-medium tracking-[0.32em] text-black/45">{title}</p>
          </header>
        ) : null}
        <div className="flex-1">{children}</div>
      </div>
    </section>
  )
}
