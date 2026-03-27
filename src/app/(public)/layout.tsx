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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f5ef_0%,#efe9df_56%,#e7ded1_100%)] text-stone-950">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_52%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-8 sm:px-6 lg:px-10">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter profile={profile} />
      </div>
    </div>
  )
}
