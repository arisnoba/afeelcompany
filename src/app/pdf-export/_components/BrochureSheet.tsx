import type { ReactNode } from 'react'

interface BrochureSheetProps {
  sectionId: 'cover' | 'about' | 'work' | 'client' | 'contact'
  children: ReactNode
}

export function BrochureSheet({ sectionId, children }: BrochureSheetProps) {
  return (
    <section
      id={sectionId}
      data-section={sectionId}
      className="pdf-sheet overflow-hidden rounded-[20px] bg-white shadow-[0_20px_56px_rgba(28,25,23,0.10)]"
    >
      {children}
    </section>
  )
}
