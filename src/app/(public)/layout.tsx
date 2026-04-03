import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getSiteCompanyProfile } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getSiteCompanyProfile()

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-stone-950 [font-family:var(--font-manrope)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(95,123,107,0.12),transparent_42%),radial-gradient(circle_at_top_right,rgba(17,24,39,0.06),transparent_36%)]" />
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-4 sm:px-6 lg:px-10">
          <main className="flex-1 pb-16">{children}</main>
        </div>
        <SiteFooter profile={profile} />
      </div>
    </div>
  )
}
