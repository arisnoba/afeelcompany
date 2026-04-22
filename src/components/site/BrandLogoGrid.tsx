import Image from 'next/image';

import type { SiteClientBrand } from '@/types/site';

interface BrandLogoGridProps {
	brands: SiteClientBrand[];
}

export function BrandLogoGrid({ brands }: BrandLogoGridProps) {
	if (brands.length === 0) {
		return <div className="px-6 py-16 text-center text-sm text-stone-300">등록된 브랜드 로고가 아직 없습니다.</div>;
	}

	return (
		<div className="grid gap-4 bg-stone-950/90 p-4 sm:grid-cols-2 xl:grid-cols-4">
			{brands.map(brand => (
				<article key={brand.id} className="grid aspect-square place-items-center overflow-hidden bg-white">
					{brand.logoUrl ? (
						<div className="relative h-full w-full">
							<Image src={brand.logoUrl} alt={brand.name} fill unoptimized className="object-contain" sizes="(max-width: 768px) 100vw, 25vw" />
						</div>
					) : (
						<span className="text-sm text-stone-500">{brand.name}</span>
					)}
				</article>
			))}
		</div>
	);
}
