import type { ReactNode } from 'react';

interface BrochureSheetProps {
	sectionId: string;
	children: ReactNode;
}

export function BrochureSheet({ sectionId, children }: BrochureSheetProps) {
	return (
		<section id={sectionId} data-section={sectionId} className="pdf-sheet overflow-hidden bg-white shadow-[0_20px_56px_rgba(28,25,23,0.10)]">
			{children}
		</section>
	);
}
