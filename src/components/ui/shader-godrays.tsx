'use client';

import dynamic from 'next/dynamic';

import { useReducedPublicMotion } from '@/hooks/use-reduced-public-motion';

const GodRays = dynamic(() => import('@paper-design/shaders-react').then(module => module.GodRays), {
	ssr: false,
});

export function ShaderGodrays({ className }: { className?: string; intensity?: number }) {
	const shouldReduceMotion = useReducedPublicMotion();

	if (shouldReduceMotion) {
		return null;
	}

	return (
		<div className={`hero-godrays-drift absolute inset-0 pointer-events-none ${className}`}>
			<GodRays
				colorBack="#00000000"
				// 밝기 대비를 조금 올려서 광막보다 빛줄기 움직임이 먼저 읽히도록 맞춘 값들이다.
				colors={['#fff7ebd9', '#ebcfa980', '#fffdf38c', '#ffffff52']}
				colorBloom="#ffffff"
				offsetX={0.74}
				offsetY={-0.94}
				intensity={0.92}
				spotty={0.5}
				midSize={0.18}
				midIntensity={0.06}
				density={0.58}
				bloom={0.34}
				speed={0.82}
				scale={1.42}
				style={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			/>
		</div>
	);
}
