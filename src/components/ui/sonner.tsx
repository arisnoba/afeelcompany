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
					toast: 'font-sans',
					title: 'text-sm',
					description: 'text-sm',
				},
			}}
			{...props}
		/>
	);
}
