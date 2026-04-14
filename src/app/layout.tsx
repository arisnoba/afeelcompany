import type { Metadata } from 'next';
import { Geist_Mono, Inter, Manrope, Newsreader } from 'next/font/google';

import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import {
	DEFAULT_OG_IMAGE,
	DEFAULT_SITE_DESCRIPTION,
	DEFAULT_SITE_KEYWORDS,
	SITE_NAME,
	SITE_TITLE_SUFFIX,
	SITE_URL,
	organizationJsonLd,
	websiteJsonLd,
} from '@/lib/seo';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope',
});

const newsreader = Newsreader({
	subsets: ['latin'],
	variable: '--font-newsreader',
});

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
});

export const metadata: Metadata = {
	metadataBase: SITE_URL,
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_TITLE_SUFFIX}`,
	},
	description: DEFAULT_SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: DEFAULT_SITE_KEYWORDS,
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: SITE_NAME,
		description: DEFAULT_SITE_DESCRIPTION,
		url: '/',
		siteName: SITE_NAME,
		locale: 'ko_KR',
		type: 'website',
		images: [
			{
				url: DEFAULT_OG_IMAGE,
				width: 1500,
				height: 1125,
				alt: `${SITE_NAME} 대표 이미지`,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_NAME,
		description: DEFAULT_SITE_DESCRIPTION,
		images: [DEFAULT_OG_IMAGE],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	icons: {
		icon: [
			{ url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
		apple: '/favicon/apple-touch-icon.png',
	},
	manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className={`${inter.variable} ${manrope.variable} ${newsreader.variable} ${geistMono.variable} h-full antialiased`}>
			<body className="flex min-h-full flex-col font-sans bg-[#fcf9f8]">
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
				/>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
