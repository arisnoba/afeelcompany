import Image from 'next/image';
import Link from 'next/link';

import { DEFAULT_LOCALE, getLocalizedPath, type Locale } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';

export function CollaborationCta({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
	const copy = getSiteDictionary(locale).about;
	const contactHref = getLocalizedPath(locale, '/contact');

	return (
		<div className="relative grid gap-6 overflow-hidden bg-stone-950 px-8 py-10 text-white sm:px-10">
			<div className="pointer-events-none absolute right-0 top-0 h-full select-none opacity-5">
				<Image src="/images/symbol.svg" alt="" width={33} height={30} priority className="h-full w-auto object-contain brightness-0 invert" />
			</div>

			<div className="relative z-10 grid gap-6">
				<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">{copy.collaborationEyebrow}</p>
				<p className="max-w-4xl text-2xl leading-snug tracking-[-0.04em] [font-family:var(--font-newsreader)] sm:text-3xl">
					{copy.collaborationBody[0]}
					<br /> {copy.collaborationBody[1]}
				</p>
				<div>
					<Link
						href={contactHref}
						className="inline-flex items-center justify-center border border-white/16 bg-white/8 px-8 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/14">
						{copy.collaborationCta}
					</Link>
				</div>
			</div>
		</div>
	);
}
