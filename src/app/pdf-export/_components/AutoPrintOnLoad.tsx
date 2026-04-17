'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { waitForPdfRenderReady } from './wait-for-pdf-render'

export function AutoPrintOnLoad() {
  const searchParams = useSearchParams()
  const hasPrintedRef = useRef(false)

  useEffect(() => {
    if (searchParams.get('print') !== '1' || hasPrintedRef.current) {
      return
    }

    hasPrintedRef.current = true

    const printDocument = async () => {
      await waitForPdfRenderReady()

      window.print()
    }

    void printDocument()
  }, [searchParams])

  return null
}
