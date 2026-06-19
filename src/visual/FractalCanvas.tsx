import { useEffect, useRef, type PointerEvent, type WheelEvent } from 'react';
import type { AudioFeatures, CameraState, PaletteName, VisualSettings } from '../types';

type FractalCanvasProps = {
  features: AudioFeatures;
  settings: VisualSettings;
  onCameraChange: (camera: CameraState) => void;
};

const SAFE_MAX_ZOOM = 95000;
const SAFE_MIN_ZOOM = 0.25;

const mandelbrotFlightAnchors = [
  { centerX: -0.743643887037151, centerY: 0.13182590420533, zoom: 1.1 },
  { centerX: -0.74529, centerY: 0.113075, zoom: 1.2 },
  { centerX: -0.761574, centerY: -0.0847596, zoom: 1.15 },
  { centerX: -0.10109636384562, centerY: 0.95628651080914, zoom: 1.05 },
  { centerX: -1.25066, centerY: 0.02012, zoom: 1.1 },
];

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uZoom;
uniform float uRotation;
uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uHigh;
uniform float uBeat;
uniform float uRms;
uniform float uGlow;
uniform float uPalette;
uniform float uMode;

const int MAX_ITER = 300;
const float TAU = 6.28318530718;

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;

  for (int i = 0; i < 5; i += 1) {
    v += a * noise2(p);
    p = p * 2.03 + vec2(17.1, -9.2);
    a *= 0.5;
  }

  return v;
}

vec3 paletteVioletGold(float t) {
  vec3 a = vec3(0.08, 0.03, 0.16);
  vec3 b = vec3(0.88, 0.65, 0.26);
  vec3 c = vec3(0.30, 0.12, 0.58);
  return mix(a, b, smoothstep(0.05, 1.0, t)) + c * pow(1.0 - t, 2.4);
}

vec3 paletteSolar(float t) {
  return vec3(
    0.10 + 1.10 * pow(t, 0.72),
    0.03 + 0.48 * pow(t, 1.35),
    0.02 + 0.13 * sin(t * TAU)
  );
}

vec3 paletteAbyss(float t) {
  return vec3(
    0.02 + 0.16 * t,
    0.06 + 0.90 * pow(t, 1.9),
    0.13 + 1.05 * pow(t, 0.68)
  );
}

vec3 paletteAurora(float t) {
  vec3 base = 0.5 + 0.5 * cos(TAU * (vec3(0.00, 0.33, 0.67) + t + uTime * 0.035));
  return mix(vec3(0.03, 0.04, 0.09), base, smoothstep(0.02, 0.95, t));
}

vec3 pickPalette(float t) {
  if (uPalette < 0.5) return paletteVioletGold(t);
  if (uPalette < 1.5) return paletteSolar(t);
  if (uPalette < 2.5) return paletteAbyss(t);
  return paletteAurora(t);
}

float mandelbrot(vec2 p) {
  vec2 z = vec2(0.0);
  vec2 c = p;

  for (int i = 0; i < MAX_ITER; i += 1) {
    float x = z.x * z.x - z.y * z.y + c.x;
    float y = 2.0 * z.x * z.y + c.y;
    z = vec2(x, y);

    if (dot(z, z) > 4.0) {
      float smoothIter = float(i) + 1.0 - log2(max(log(length(z)), 0.0001));
      return clamp(smoothIter / float(MAX_ITER), 0.0, 1.0);
    }
  }

  return 0.0;
}

float julia(vec2 z) {
  vec2 c = vec2(
    -0.77 + 0.07 * sin(uTime * 0.13 + uMid * 2.0),
    0.156 + 0.05 * cos(uTime * 0.17 + uHigh * 3.0)
  );

  for (int i = 0; i < MAX_ITER; i += 1) {
    float x = z.x * z.x - z.y * z.y + c.x;
    float y = 2.0 * z.x * z.y + c.y;
    z = vec2(x, y);

    if (dot(z, z) > 4.0) {
      float smoothIter = float(i) + 1.0 - log2(max(log(length(z)), 0.0001));
      return clamp(smoothIter / float(MAX_ITER), 0.0, 1.0);
    }
  }

  return 0.0;
}

float ring(vec2 p, float radius, float width) {
  return 1.0 - smoothstep(width, width * 2.0, abs(length(p) - radius));
}

vec3 renderFractal(vec2 uv, vec2 p) {
  float scale = 2.85 / max(uZoom, 0.0001);
  vec2 field = uCenter + p * scale;

  float escaped = uMode < 0.5 ? mandelbrot(field) : julia(field);
  float edge = escaped <= 0.0 ? 0.0 : pow(escaped, 0.70);
  vec3 color = escaped <= 0.0 ? vec3(0.012, 0.016, 0.030) : pickPalette(edge + uHigh * 0.035);

  float boundarySpark = smoothstep(0.015, 0.18, escaped) * (1.0 - smoothstep(0.58, 0.95, escaped));
  color += pickPalette(fract(edge + 0.24 + uTime * 0.015)) * boundarySpark * (0.08 + uGlow * 0.16);

  float orbitGlow = ring(p, 0.24 + uBass * 0.08, 0.006 + uRms * 0.02);
  float centerGlow = exp(-length(p) * (3.2 - uMid));
  vec3 glow = vec3(1.0, 0.76, 0.38) * orbitGlow * (0.2 + uGlow * 0.9);
  glow += vec3(0.32, 0.64, 1.0) * centerGlow * (0.08 + uRms * 0.18);

  float vignette = smoothstep(1.35, 0.22, length(uv));
  color = color * (0.38 + 0.92 * vignette) + glow;
  color += vec3(uBeat * 0.08, uBeat * 0.045, uBeat * 0.13);

  return color;
}

vec2 acidWarp(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p * 1.15 + vec2(t * 0.18, -t * 0.12)),
    fbm(p * 1.15 + vec2(-t * 0.14, t * 0.16))
  );

  p += (q - 0.5) * (0.72 + uMid * 2.6 + uRms * 0.6);
  p += 0.18 * sin(vec2(p.y, p.x) * 3.5 + t * (1.2 + uBass * 4.4));
  p *= 1.0 + 0.15 * sin(t * 0.45 + length(p) * 2.0 + uHigh * 5.0);

  return p;
}

vec3 renderAcidMelt(vec2 uv) {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float t = uTime * (0.45 + uRms * 0.28);

  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;
  p *= 1.85;

  float breath = 1.0 + 0.08 * sin(t * 2.5 + uBass * 8.0 + uBeat * 4.0);
  p *= breath;

  float spin = uRotation * 0.4 + sin(t * 0.25) * 0.35 + uMid * 0.25;
  mat2 rot = mat2(cos(spin), -sin(spin), sin(spin), cos(spin));
  p = rot * acidWarp(p, t);

  float r = length(p);
  float a = atan(p.y, p.x);

  float tunnel = sin(14.0 / max(r + 0.16, 0.05) - t * 5.0 + uBass * 8.0);
  float rings = sin(r * (9.0 + uBass * 8.0) - t * 4.4 - uBeat * 5.0);
  float swirl = sin(a * (7.0 + uMid * 5.0) + r * 6.0 - t * 3.2 + uMid * 4.0);
  float plasma = fbm(p * (2.25 + uHigh * 1.4) + vec2(t * 0.72, -t * 0.48));
  float secondPlasma = fbm(p * 5.2 - vec2(t * 0.22, t * 0.31));

  float pulse = 0.5 + 0.5 * sin(t * 5.0 + r * 8.0 + uBass * 10.0 + uBeat * 8.0);
  float coreGlow = exp(-2.75 * abs(rings + swirl * 0.55 + tunnel * 0.18 - plasma));
  float hotEdge = smoothstep(0.42, 1.0, coreGlow) + 0.45 * smoothstep(0.55, 1.0, secondPlasma);

  float hue = fract(
    0.54 +
    plasma * 0.22 +
    secondPlasma * 0.09 +
    swirl * 0.08 +
    tunnel * 0.035 +
    t * 0.035 +
    uHigh * 0.22
  );

  float sat = 0.74 + 0.24 * pulse;
  float val = 0.10 + 0.68 * coreGlow + 0.30 * plasma + 0.20 * hotEdge;

  vec3 color = hsv2rgb(vec3(hue, sat, val));
  color += 0.25 * hsv2rgb(vec3(fract(hue + 0.18), 0.95, coreGlow));
  color += 0.14 * hsv2rgb(vec3(fract(hue + 0.50), 0.82, pulse));

  vec2 shimmerOffset = vec2(sin(t * 1.7), cos(t * 1.3)) * (0.004 + uHigh * 0.006 + uBeat * 0.006);
  float redShift = fbm((p + shimmerOffset) * 3.4 + t * 0.18);
  float blueShift = fbm((p - shimmerOffset) * 3.4 - t * 0.18);
  color.r += redShift * 0.08 * (0.4 + uHigh);
  color.b += blueShift * 0.10 * (0.4 + uHigh);

  float centerPull = exp(-r * (1.8 + uBass));
  color += centerPull * vec3(0.24, 0.12, 0.44) * (0.35 + uGlow);
  color += vec3(uBeat * 0.11, uBeat * 0.035, uBeat * 0.16);

  float vignette = smoothstep(1.85, 0.16, length(uv * 2.0 - 1.0));
  color *= 0.42 + 0.94 * vignette;
  color *= 1.0 + uGlow * 0.78;

  return color;
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv * 2.0 - 1.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  centered.x *= aspect;

  float audioWarp = uBass * 0.035 + uBeat * 0.018;
  float angle = uRotation + audioWarp * sin(uTime * 0.8 + length(centered) * 3.0);
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 p = rot * centered;

  vec3 color = uMode < 1.5 ? renderFractal(centered, p) : renderAcidMelt(uv);

  outColor = vec4(color, 1.0);
}
`;

const paletteIndex = (palette: PaletteName) => {
  switch (palette) {
    case 'solar-ember':
      return 1;
    case 'abyss-cyan':
      return 2;
    case 'aurora-phi':
      return 3;
    case 'violet-gold-duality':
    default:
      return 0;
  }
};

const modeIndex = (mode: VisualSettings['mode']) => {
  switch (mode) {
    case 'julia':
      return 1;
    case 'acid-melt':
      return 2;
    case 'mandelbrot':
    default:
      return 0;
  }
};

const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader compile error.';
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
};

const createProgram = (gl: WebGL2RenderingContext) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  if (!program) throw new Error('Unable to create WebGL program.');

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? 'Unknown shader link error.';
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
};

const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.floor(canvas.clientWidth * dpr);
  const height = Math.floor(canvas.clientHeight * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
};

export function FractalCanvas({ features, settings, onCameraChange }: FractalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const featuresRef = useRef(features);
  const settingsRef = useRef(settings);
  const cameraRef = useRef<CameraState>({
    centerX: mandelbrotFlightAnchors[0].centerX,
    centerY: mandelbrotFlightAnchors[0].centerY,
    zoom: mandelbrotFlightAnchors[0].zoom,
    rotation: 0,
  });
  const draggingRef = useRef<{ x: number; y: number } | null>(null);
  const anchorIndexRef = useRef(0);

  useEffect(() => {
    featuresRef.current = features;
  }, [features]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      throw new Error('InfinityLens369 requires a browser with WebGL2 support.');
    }

    const program = createProgram(gl);
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      center: gl.getUniformLocation(program, 'uCenter'),
      zoom: gl.getUniformLocation(program, 'uZoom'),
      rotation: gl.getUniformLocation(program, 'uRotation'),
      time: gl.getUniformLocation(program, 'uTime'),
      bass: gl.getUniformLocation(program, 'uBass'),
      mid: gl.getUniformLocation(program, 'uMid'),
      high: gl.getUniformLocation(program, 'uHigh'),
      beat: gl.getUniformLocation(program, 'uBeat'),
      rms: gl.getUniformLocation(program, 'uRms'),
      glow: gl.getUniformLocation(program, 'uGlow'),
      palette: gl.getUniformLocation(program, 'uPalette'),
      mode: gl.getUniformLocation(program, 'uMode'),
    };

    let frame = 0;
    let lastTime = performance.now();
    let lastCameraEmit = 0;

    const render = (now: number) => {
      const seconds = now * 0.001;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      resizeCanvasToDisplaySize(canvas, gl);

      const currentFeatures = featuresRef.current;
      const currentSettings = settingsRef.current;
      const camera = cameraRef.current;
      const audioPower = currentSettings.audioReactive ? currentFeatures.bass : 0;
      const beatPower = currentSettings.audioReactive ? currentFeatures.beat : 0;
      const isExplorerMode = currentSettings.mode !== 'acid-melt';

      if (isExplorerMode) {
        const zoomPressure = 0.045 + audioPower * 0.24 + beatPower * 0.12;
        camera.zoom *= 1 + dt * currentSettings.zoomSpeed * zoomPressure;

        if (currentSettings.mode === 'mandelbrot' && camera.zoom > SAFE_MAX_ZOOM) {
          anchorIndexRef.current = (anchorIndexRef.current + 1) % mandelbrotFlightAnchors.length;
          const nextAnchor = mandelbrotFlightAnchors[anchorIndexRef.current];
          camera.centerX = nextAnchor.centerX;
          camera.centerY = nextAnchor.centerY;
          camera.zoom = nextAnchor.zoom;
          camera.rotation += 0.369;
        } else {
          camera.zoom = Math.min(camera.zoom, SAFE_MAX_ZOOM);
        }
      }

      camera.rotation += dt * (currentSettings.mode === 'acid-melt' ? 0.09 + currentFeatures.mid * 0.14 : 0.012 + currentFeatures.mid * 0.05);

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.center, camera.centerX, camera.centerY);
      gl.uniform1f(uniforms.zoom, currentSettings.mode === 'acid-melt' ? 1 : camera.zoom);
      gl.uniform1f(uniforms.rotation, camera.rotation);
      gl.uniform1f(uniforms.time, seconds);
      gl.uniform1f(uniforms.bass, currentSettings.audioReactive ? currentFeatures.bass : 0.18);
      gl.uniform1f(uniforms.mid, currentSettings.audioReactive ? currentFeatures.mid : 0.22);
      gl.uniform1f(uniforms.high, currentSettings.audioReactive ? currentFeatures.high : 0.25);
      gl.uniform1f(uniforms.beat, currentSettings.audioReactive ? currentFeatures.beat : 0.05);
      gl.uniform1f(uniforms.rms, currentSettings.audioReactive ? currentFeatures.rms : 0.18);
      gl.uniform1f(uniforms.glow, currentSettings.glow);
      gl.uniform1f(uniforms.palette, paletteIndex(currentSettings.palette));
      gl.uniform1f(uniforms.mode, modeIndex(currentSettings.mode));

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (now - lastCameraEmit > 100) {
        onCameraChange({ ...camera });
        lastCameraEmit = now;
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [onCameraChange]);

  const handleWheel = (event: WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 0.92 : 1.12;
    cameraRef.current.zoom = Math.max(
      SAFE_MIN_ZOOM,
      Math.min(SAFE_MAX_ZOOM, cameraRef.current.zoom * direction),
    );
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const previous = draggingRef.current;
    const canvas = canvasRef.current;
    if (!previous || !canvas) return;

    const camera = cameraRef.current;
    const rect = canvas.getBoundingClientRect();
    const aspect = rect.width / Math.max(rect.height, 1);
    const dx = (event.clientX - previous.x) / Math.max(rect.width, 1);
    const dy = (event.clientY - previous.y) / Math.max(rect.height, 1);
    const scale = 2.85 / camera.zoom;

    camera.centerX -= dx * scale * aspect * 2;
    camera.centerY += dy * scale * 2;
    draggingRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    draggingRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="fractal-canvas"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Audio reactive fractal visualization canvas"
    />
  );
}
