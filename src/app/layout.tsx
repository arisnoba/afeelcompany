import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_KEYWORDS, SITE_NAME, SITE_TITLE_SUFFIX, SITE_URL, organizationJsonLd, websiteJsonLd } from '@/lib/seo';

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope',
});

const newsreader = Newsreader({
	subsets: ['latin'],
	variable: '--font-newsreader',
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
				width: 1200,
				height: 630,
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
	icons: {
		icon: [
			{ url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
		],
		apple: '/favicon/apple-touch-icon.png',
	},
	manifest: '/favicon/site.webmanifest',
	verification: {
		other: {
			'naver-site-verification': '0b7a460c7278b8d5de8c79f806adf377d69e697c',
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const organizationJson = JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c');
	const websiteJson = JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c');

	return (
		<html lang="ko" className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}>
			<head>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJson }} />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJson }} />
				<Script src="https://www.googletagmanager.com/gtag/js?id=G-G6CC90RSQ0" strategy="afterInteractive" />
				<Script id="google-analytics" strategy="afterInteractive">
					{`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-G6CC90RSQ0');`}
				</Script>
			</head>
			<body className="flex min-h-full flex-col font-sans">
				{children}
				<Toaster />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
