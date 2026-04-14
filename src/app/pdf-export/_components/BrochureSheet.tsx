'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

// Content is authored at this canvas width (px).
// Matches $sheet-max-width in print.scss and approximates A4 landscape at 96 dpi.
const DESIGN_WIDTH = 1180
// A4 landscape: 297mm / 210mm
const A4_ASPECT = 297 / 210

interface BrochureSheetProps {
  sectionId: string
  children: ReactNode
}

export function BrochureSheet({ sectionId, children }: BrochureSheetProps) {
  const outerRef = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      if (outerRef.current) {
        setScale(outerRef.current.offsetWidth / DESIGN_WIDTH)
      }
    }

    update()

    const ro = new ResizeObserver(update)
    if (outerRef.current) {
      ro.observe(outerRef.current)
    }

    return () => ro.disconnect()
  }, [])

  return (
    <section
      ref={outerRef}
      id={sectionId}
      data-section={sectionId}
      className="pdf-sheet overflow-hidden bg-white"
    >
      <div
        className="pdf-sheet-canvas"
        style={{
          width: DESIGN_WIDTH,
          height: Math.round(DESIGN_WIDTH / A4_ASPECT),
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </section>
  )
}
