import Link from 'next/link'

export function PrintToolbar() {
  return (
    <div className="screen-only sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/10 bg-[#f5f1ea]/95 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/70">PDF Export</p>
        <p className="text-sm text-black/55">브로셔 레이아웃을 확인한 뒤 인쇄 또는 저장할 수 있습니다.</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/pdf-export"
          className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-black transition hover:border-black/30"
        >
          인쇄 미리보기
        </Link>
        <Link
          href="/pdf-export?print=1"
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
        >
          다운로드
        </Link>
      </div>
    </div>
  )
}
