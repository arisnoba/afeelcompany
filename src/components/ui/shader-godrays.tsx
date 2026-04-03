'use client';

import { GodRays } from '@paper-design/shaders-react';

export function ShaderGodrays({ className }: { className?: string; intensity?: number }) {
	return (
		<div className={`absolute inset-0 pointer-events-none ${className}`}>
			<GodRays
				colorBack="#00000000"
				colors={['#ffffffb3', '#e4c09066', '#ffffff66', '#ffffff4d']} // 아까의 선명도와 방금 전의 맑은 느낌의 중간
				colorBloom="#ffffff"
				offsetX={0.8}
				offsetY={-1.0} // 원점을 화면 밖으로 빼되 너무 멀지 않게 조정
				intensity={1.1} // 폭발적이지 않되 존재감은 확실하게
				spotty={0.3} // 질감이 살짝 있으면서도 빛의 뻗음이 유지되는 중간점
				midSize={12}
				midIntensity={0}
				density={0.7} // 레이(Ray)들이 적당히 채워지면서 여백도 돌도록
				bloom={0.25} // 줄기가 뭉개지지 않으면서 뽀얀 느낌만 살리는 번짐 수치
				speed={0.4}
				scale={1.5} // 화면을 부드럽게 덮는 스케일
				frame={1000}
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
