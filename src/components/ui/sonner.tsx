'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
	return (
		<Sonner
			closeButton
			richColors
			position="top-right"
			offset={16}
			toastOptions={{
				classNames: {
					toast: 'font-sans [--toast-close-button-start:auto] [--toast-close-button-end:0px] [--toast-close-button-transform:translate(35%,-35%)]',
					icon: 'self-start mt-0.5',
					title: 'text-sm',
					description: 'text-sm',
				},
			}}
			{...props}
		/>
	);
}
