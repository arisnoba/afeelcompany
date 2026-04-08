import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans_KR, Newsreader } from 'next/font/google';
import 'swiper/css';
import './print.scss';
import { createNoIndexMetadata } from '@/lib/seo';

const brochureSans = Noto_Sans_KR({
	weight: ['400', '500', '700'],
	display: 'swap',
	variable: '--font-brochure-sans',
});

const brochureSerif = Newsreader({
	weight: ['400', '500', '600'],
	style: ['italic'],
	display: 'swap',
	variable: '--font-brochure-serif',
});

export const metadata: Metadata = createNoIndexMetadata('PDF Export');

export default function PdfExportLayout({ children }: { children: ReactNode }) {
	return <div className={`${brochureSans.variable} ${brochureSerif.variable} min-h-full text-[#1c1917] font-[family:var(--font-brochure-sans)]`}>{children}</div>;
}
