import { getSiteCompanyProfile } from '@/lib/site'

function ContactValue({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href?: string
}) {
  return (
    <article className="grid gap-3 rounded-[1.5rem] border border-stone-900/10 bg-white px-5 py-5 shadow-[0_18px_48px_rgba(56,36,19,0.06)]">
      <p className="text-xs uppercase tracking-[0.34em] text-stone-500">{label}</p>
      {value ? (
        href ? (
          <a
            href={href}
            className="text-lg tracking-[-0.03em] text-stone-950 underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-950"
          >
            {value}
          </a>
        ) : (
          <p className="text-lg tracking-[-0.03em] text-stone-950">{value}</p>
        )
      ) : (
        <p className="text-base text-stone-500">정보를 준비 중입니다.</p>
      )}
    </article>
  )
}

export default async function ContactPage() {
  const profile = await getSiteCompanyProfile()

  return (
    <div className="grid gap-8 py-8 sm:gap-10 sm:py-10 lg:gap-14 lg:py-14">
      <section className="grid gap-8 rounded-[2rem] border border-stone-900/10 bg-white/74 px-6 py-8 shadow-[0_22px_60px_rgba(56,36,19,0.08)] backdrop-blur-sm lg:grid-cols-[minmax(0,1.1fr)_320px] lg:px-10 lg:py-10">
        <div>
          <p className="text-xs uppercase tracking-[0.36em] text-stone-500">
            Contact
          </p>
          <h1 className="mt-4 text-4xl tracking-[-0.05em] text-stone-950 sm:text-5xl">
            CONTACT
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
            프로젝트 문의, 브랜드 협업, 스타일링 제안은 아래 채널로 연결해 주세요.
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-stone-500">
            프로젝트 문의
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] border border-stone-900/10 bg-stone-950 px-5 py-6 text-sm leading-7 text-stone-300">
          <p className="text-[0.7rem] uppercase tracking-[0.36em] text-stone-500">
            Response Window
          </p>
          <p>브랜드 캠페인, 셀럽 협업, 룩북/포트폴리오 정리 요청을 같은 흐름 안에서 정리합니다.</p>
          <p>운영 데이터는 관리자 화면과 연결된 동일한 프로필 정보를 기준으로 노출됩니다.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ContactValue
          label="Email"
          value={profile.contactEmail}
          href={profile.contactEmail ? `mailto:${profile.contactEmail}` : undefined}
        />
        <ContactValue
          label="Phone"
          value={profile.contactPhone}
          href={profile.contactPhone ? `tel:${profile.contactPhone}` : undefined}
        />
        <ContactValue
          label="Address"
          value={profile.address}
        />
      </section>
    </div>
  )
}
