export async function waitForPdfRenderReady() {
	await document.fonts.ready;

	const images = Array.from(document.querySelectorAll('img[data-pdf-image]')) as HTMLImageElement[];

	await Promise.all(
		images.map(async image => {
			try {
				await image.decode();
			} catch {
				return;
			}
		})
	);

	const mapElement = document.querySelector<HTMLElement>('[data-pdf-contact-map]');

	if (!mapElement) {
		return;
	}

	const isMapSettled = () => {
		const status = mapElement.dataset.pdfMapStatus;
		return status === 'ready' || status === 'disabled' || status === 'error';
	};

	if (isMapSettled()) {
		return;
	}

	await new Promise<void>(resolve => {
		const observer = new MutationObserver(() => {
			if (!isMapSettled()) {
				return;
			}

			cleanup();
		});

		const timeoutId = window.setTimeout(() => {
			cleanup();
		}, 10000);

		const cleanup = () => {
			observer.disconnect();
			window.clearTimeout(timeoutId);
			window.requestAnimationFrame(() => {
				window.requestAnimationFrame(() => resolve());
			});
		};

		observer.observe(mapElement, {
			attributes: true,
			attributeFilter: ['data-pdf-map-status'],
		});
	});
}
