import type { ReactNode } from 'react'

interface BrochureSheetProps {
  sectionId: 'cover' | 'about' | 'work' | 'client' | 'contact'
  title?: string
  children: ReactNode
}

export function BrochureSheet({ sectionId, title, children }: BrochureSheetProps) {
  return (
    <section
      id={sectionId}
      data-section={sectionId}
      className={`pdf-sheet pdf-sheet--${sectionId} overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_18px_48px_rgba(17,17,17,0.08)]`}
    >
      <div className="flex min-h-full flex-col p-8">
        {title ? (
          <header className="mb-5 border-b border-black/10 pb-3">
            <p className="text-xs font-medium tracking-[0.32em] text-black/45">{title}</p>
          </header>
        ) : null}
        <div className="flex-1">{children}</div>
      </div>
    </section>
  )
}
