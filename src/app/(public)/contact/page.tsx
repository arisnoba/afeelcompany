import { getSiteCompanyProfile } from '@/lib/site'

function renderValue(value: string) {
  return value || '정보를 준비 중입니다.'
}

function ContactDetail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-4">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">
        {label}
      </span>
      {children}
    </section>
  )
}

function ContactField({
  label,
  name,
  type = 'text',
  placeholder,
}: {
  label: string
  name: string
  type?: string
  placeholder: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
      />
    </label>
  )
}

export default async function ContactPage() {
  const profile = await getSiteCompanyProfile()
  const email = profile.contactEmail.trim()
  const phone = profile.contactPhone.trim()
  const address = profile.address.trim()
  const mailtoHref = email ? `mailto:${email}` : undefined

  return (
    <div className="grid gap-16 py-10 sm:gap-20 sm:py-14 lg:gap-24 lg:py-20">
      <header className="grid gap-5 border-b border-stone-900/10 pb-12 md:pb-16">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
          Connect With Us
        </p>
        <h1 className="text-5xl font-light leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]">
          Get In Touch.
        </h1>
        <p className="max-w-3xl text-base leading-8 text-stone-600 sm:text-lg">
          브랜드의 현재 상태와 필요한 협업 맥락을 남겨 주세요. 운영 중인 공개
          아카이브와 같은 톤으로, 문의 접점 역시 차분하고 명확한 에디토리얼
          구조로 정리했습니다.
        </p>
      </header>

      <section className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="grid gap-12 lg:col-span-5 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f0eded]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(39,65,51,0.16),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.55),transparent_70%)]" />
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(28,27,27,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(28,27,27,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute inset-x-0 bottom-0 grid gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 py-6 text-white sm:px-8 sm:py-8">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/70">
                Editorial Access
              </p>
              <p className="max-w-sm text-2xl leading-tight [font-family:var(--font-newsreader)] sm:text-3xl">
                Private conversations, curated precisely.
              </p>
            </div>
          </div>

          <div className="grid gap-12">
            <ContactDetail label="Atelier">
              <address className="not-italic text-3xl leading-tight text-stone-900 [font-family:var(--font-newsreader)]">
                {renderValue(address)}
              </address>
            </ContactDetail>

            <div className="grid gap-10 md:grid-cols-2 md:gap-12">
              <ContactDetail label="Inquiries">
                {email ? (
                  <a
                    href={mailtoHref}
                    className="border-b border-stone-300/60 pb-1 text-xl leading-tight text-stone-900 transition hover:text-[#274133] [font-family:var(--font-newsreader)]"
                  >
                    {email}
                  </a>
                ) : (
                  <p className="text-lg text-stone-500">정보를 준비 중입니다.</p>
                )}
              </ContactDetail>

              <ContactDetail label="Direct">
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="text-xl leading-tight text-stone-900 transition hover:text-[#274133] [font-family:var(--font-newsreader)]"
                  >
                    {phone}
                  </a>
                ) : (
                  <p className="text-lg text-stone-500">정보를 준비 중입니다.</p>
                )}
              </ContactDetail>
            </div>
          </div>
        </div>

        <div className="grid gap-8 border border-stone-900/10 bg-[#f6f3f2] p-8 sm:p-10 lg:col-span-7 lg:p-12">
          <div className="grid gap-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">
              Project Inquiry
            </p>
            <h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl">
              Start the conversation with the essentials.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-stone-600">
              현재 사이트에는 별도 문의 수집 API가 없어, 아래 구성은 기본 메일 앱으로
              연결됩니다. 브랜드명, 연락처, 요청 배경을 함께 적어주시면 초기 응답이
              더 빨라집니다.
            </p>
          </div>

          <form
            action={mailtoHref}
            method="post"
            encType="text/plain"
            className="grid gap-10"
          >
            <div className="grid gap-10 md:grid-cols-2 md:gap-12">
              <ContactField
                label="Name"
                name="name"
                placeholder="Your Full Name"
              />
              <ContactField
                label="Company"
                name="company"
                placeholder="Organization"
              />
            </div>

            <ContactField
              label="Email Address"
              name="email"
              type="email"
              placeholder="email@address.com"
            />

            <label className="grid gap-2">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">
                Message
              </span>
              <textarea
                name="message"
                rows={6}
                placeholder="Tell us about your project or inquiry"
                className="min-h-40 resize-none border-0 border-b border-stone-300/60 bg-transparent px-0 py-3 text-base text-stone-900 placeholder:text-stone-400/80 focus:border-stone-900 focus:outline-none"
              />
            </label>

            <div className="grid gap-4 pt-4">
              {mailtoHref ? (
                <button
                  type="submit"
                  className="group inline-flex w-fit items-center gap-6 bg-[#274133] px-10 py-5 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#ccead6] transition hover:bg-stone-950"
                >
                  Submit Inquiry
                  <span
                    aria-hidden="true"
                    className="text-sm transition group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </button>
              ) : (
                <p className="text-sm leading-7 text-stone-500">
                  문의 이메일이 아직 설정되지 않았습니다. 관리자에서 회사 프로필
                  이메일을 먼저 입력해 주세요.
                </p>
              )}

              <p className="text-sm leading-7 text-stone-500">
                제출 시 기본 메일 앱이 열리며, 입력한 내용은 메일 초안으로 전달됩니다.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
