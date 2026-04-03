'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

type ShaderAnimationProps = {
	className?: string;
	intensity?: number;
};

const VERTEX_SHADER_SOURCE = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intensity;
uniform float u_motion;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float beam(vec2 uv, float xPos, float width, float angle, float lengthScale, float sweep) {
  vec2 p = uv - vec2(xPos, -0.08);
  p.x += p.y * angle;

  float coneWidth = mix(width * 0.28, width, smoothstep(0.0, 1.0, clamp(p.y / lengthScale, 0.0, 1.0)));
  float column = 1.0 - smoothstep(coneWidth * 0.18, coneWidth, abs(p.x));
  float reach = smoothstep(-0.04, 0.18, p.y) * (1.0 - smoothstep(lengthScale, lengthScale + 0.38, p.y));

  float striation = sin(p.y * 22.0 - p.x * 44.0 + sweep) * 0.5 + 0.5;
  float softNoise = noise(vec2(p.x * 8.0 + sweep * 0.08, p.y * 4.5 - sweep * 0.05));
  float texture = mix(0.74, 1.0, striation * 0.45 + softNoise * 0.55);

  return column * reach * texture;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 uv = vec2((st.x - 0.5) * aspect, 1.0 - st.y);

  float t = u_time * 0.32 * u_motion;

  float beamLeft = beam(uv, -0.34 + sin(t * 0.6) * 0.06, 0.34, -0.22, 1.08, 1.2 + t * 2.2);
  float beamCenter = beam(uv, 0.02 + cos(t * 0.48 + 1.3) * 0.07, 0.4, 0.12, 1.2, 3.7 + t * 1.7);
  float beamRight = beam(uv, 0.3 + sin(t * 0.42 + 2.2) * 0.05, 0.28, 0.2, 0.98, 5.4 + t * 1.9);

  float beamMix = beamLeft * 0.92 + beamCenter * 0.82 + beamRight * 0.56;

  float overheadGlow = exp(-18.0 * (pow(uv.x * 1.18, 2.0) + pow(max(uv.y - 0.05, 0.0) * 1.9, 2.0)));
  float fringeGlow = exp(-10.0 * (pow((uv.x + 0.18) * 1.65, 2.0) + pow((uv.y - 0.18) * 1.2, 2.0)));

  vec2 dustGrid = floor(gl_FragCoord.xy * 0.16 + vec2(t * 28.0, -t * 18.0));
  float dustSeed = hash(dustGrid);
  float dust = smoothstep(0.988, 1.0, dustSeed) * beamMix * 0.42;

  float lineAccent = smoothstep(0.78, 1.0, sin(uv.y * 110.0 - uv.x * 64.0 + t * 3.1) * 0.5 + 0.5);
  lineAccent *= beamCenter * 0.09;

  vec3 ivory = vec3(1.0, 0.988, 0.958);
  vec3 warm = vec3(0.91, 0.82, 0.66);
  vec3 mist = vec3(0.985, 0.95, 0.9);

  vec3 color = vec3(0.0);
  color += ivory * beamMix * 0.58;
  color += mist * overheadGlow * 0.52;
  color += warm * (beamLeft * 0.1 + beamCenter * 0.13 + fringeGlow * 0.08);
  color += vec3(1.0) * dust * 0.35;
  color += warm * lineAccent;

  float alpha = beamMix * 0.24 + overheadGlow * 0.21 + fringeGlow * 0.08 + dust * 0.16;
  alpha = clamp(alpha * u_intensity, 0.0, 0.42);

  gl_FragColor = vec4(color, alpha);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);

	if (!shader) {
		return null;
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	}

	gl.deleteShader(shader);
	return null;
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

	if (!vertexShader || !fragmentShader) {
		if (vertexShader) {
			gl.deleteShader(vertexShader);
		}

		if (fragmentShader) {
			gl.deleteShader(fragmentShader);
		}

		return null;
	}

	const program = gl.createProgram();

	if (!program) {
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		return null;
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);

	if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
		return program;
	}

	gl.deleteProgram(program);
	return null;
}

export function ShaderAnimation({ className, intensity = 1 }: ShaderAnimationProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const gl = canvas.getContext('webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: true,
		});

		if (!gl) {
			return;
		}

		const program = createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
		if (!program) {
			return;
		}

		const positionLocation = gl.getAttribLocation(program, 'position');
		const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
		const timeLocation = gl.getUniformLocation(program, 'u_time');
		const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
		const motionLocation = gl.getUniformLocation(program, 'u_motion');

		const positionBuffer = gl.createBuffer();
		if (!positionBuffer) {
			gl.deleteProgram(program);
			return;
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		let motionEnabled = !mediaQuery.matches;
		let animationFrame: number | null = null;

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const width = Math.max(1, Math.floor(rect.width * dpr));
			const height = Math.max(1, Math.floor(rect.height * dpr));

			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
			}

			gl.viewport(0, 0, width, height);
		};

		const render = (seconds: number) => {
			resize();
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.useProgram(program);
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
			gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
			gl.uniform1f(timeLocation, seconds);
			gl.uniform1f(intensityLocation, intensity);
			gl.uniform1f(motionLocation, motionEnabled ? 1 : 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		};

		const frame = (now: number) => {
			render(now * 0.001);

			if (motionEnabled) {
				animationFrame = window.requestAnimationFrame(frame);
			} else {
				animationFrame = null;
			}
		};

		const observer = new ResizeObserver(() => {
			const time = motionEnabled ? performance.now() * 0.001 : 0.85;
			render(time);
		});
		observer.observe(canvas);

		const handleMotionChange = (event: MediaQueryListEvent) => {
			motionEnabled = !event.matches;

			if (!motionEnabled && animationFrame !== null) {
				window.cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}

			if (motionEnabled && animationFrame === null) {
				animationFrame = window.requestAnimationFrame(frame);
				return;
			}

			render(0.85);
		};

		mediaQuery.addEventListener('change', handleMotionChange);
		animationFrame = window.requestAnimationFrame(frame);

		return () => {
			if (animationFrame !== null) {
				window.cancelAnimationFrame(animationFrame);
			}

			observer.disconnect();
			mediaQuery.removeEventListener('change', handleMotionChange);
			gl.deleteBuffer(positionBuffer);
			gl.deleteProgram(program);
		};
	}, [intensity]);

	return <canvas ref={canvasRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 h-full w-full', className)} />;
}
