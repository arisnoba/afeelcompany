import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/portfolio', label: 'PORTFOLIO' },
  { href: '/feed', label: 'FEED' },
  { href: '/contact', label: 'CONTACT' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 py-4 sm:py-5">
      <div className="rounded-[1.75rem] border border-stone-900/10 bg-white/72 px-4 py-4 shadow-[0_16px_40px_rgba(56,36,19,0.08)] backdrop-blur-md sm:px-5 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-stone-950"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-stone-900/12 bg-stone-950 text-xs uppercase tracking-[0.35em] text-stone-50">
              AF
            </span>
            <span className="grid gap-1">
              <span className="text-lg tracking-[-0.04em]">AFEEL Company</span>
              <span className="text-[0.68rem] uppercase tracking-[0.34em] text-stone-500">
                Fashion PR Archive
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm text-stone-700">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center rounded-full border border-stone-900/10 px-4 transition hover:border-stone-900/20 hover:bg-stone-950 hover:text-stone-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
