import type { ReactNode } from 'react'
import { Noto_Sans_KR } from 'next/font/google'
import './print.css'

const brochureSans = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-brochure-sans',
})

export default function PdfExportLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${brochureSans.variable} min-h-full bg-[#f5f1ea] text-[#111111] font-[family:var(--font-brochure-sans)]`}
    >
      {children}
    </div>
  )
}
