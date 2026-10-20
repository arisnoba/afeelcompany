// Keep this function self-contained: Puppeteer executes it in the page context.
export async function waitForPdfRenderReady() {
	const waitForAssets = async () => {
		await document.fonts.ready;

		// next/font's optional local fallback faces can fail on Linux without
		// Arial/Times New Roman even when the downloaded webfonts load correctly.
		const failedFonts = Array.from(document.fonts).filter(font => {
			const family = font.family.replace(/^["']|["']$/g, '');
			return font.status === 'error' && !family.endsWith(' Fallback');
		});
		if (failedFonts.length > 0) {
			throw new Error(`PDF font loading failed: ${failedFonts.map(font => font.family).join(', ')}`);
		}

		const images = Array.from(document.querySelectorAll<HTMLImageElement>('.pdf-document img'));
		await Promise.all(
			images.map(async image => {
				image.loading = 'eager';
				try {
					await image.decode();
					if (!image.naturalWidth) throw new Error('Empty image');
				} catch {
					// The contact map already has a visual fallback for unavailable maps.
					if (!image.closest('[data-pdf-contact-map]')) {
						throw new Error('PDF image loading failed');
					}
				}
			})
		);

		await new Promise<void>(resolve => {
			window.requestAnimationFrame(() => {
				window.requestAnimationFrame(() => resolve());
			});
		});
	};

	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	try {
		await Promise.race([
			waitForAssets(),
			new Promise<never>((_, reject) => {
				timeoutId = setTimeout(() => reject(new Error('PDF asset loading timed out')), 15_000);
			}),
		]);
	} finally {
		clearTimeout(timeoutId);
	}
}
