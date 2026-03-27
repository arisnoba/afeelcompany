'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export function AutoPrintOnLoad() {
  const searchParams = useSearchParams()
  const hasPrintedRef = useRef(false)

  useEffect(() => {
    if (searchParams.get('print') !== '1' || hasPrintedRef.current) {
      return
    }

    hasPrintedRef.current = true

    const printDocument = async () => {
      await document.fonts.ready

      const images = Array.from(
        document.querySelectorAll('img[data-pdf-image]')
      ) as HTMLImageElement[]

      await Promise.all(
        images.map(async (image) => {
          try {
            await image.decode()
          } catch {
            return
          }
        })
      )

      window.print()
    }

    void printDocument()
  }, [searchParams])

  return null
}
