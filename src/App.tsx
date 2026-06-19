import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { AudioFeatureAnalyzer } from './audio/analyser';
import { buildVisualAddress, downloadTextFile, formatVisualAddress } from './ledger/visualAddress';
import type { AudioFeatures, CameraState, FractalMode, PaletteName, VisualSettings } from './types';
import { FractalCanvas } from './visual/FractalCanvas';

const APP_VERSION = 'v1.5.0';

type TransitionStyle = 'bloom' | 'warp' | 'glitch' | 'fade' | 'pulse';

type TripPreset = {
  label: string;
  family?: string;
  hint: string;
  settings: Partial<VisualSettings>;
};

type MotionProfile = {
  label: string;
  hint: string;
  zoomSpeed: number;
  audioDrive: number;
  audioResponse: number;
  glow: number;
};

const transitionOptions: Array<{ value: TransitionStyle; label: string; hint: string }> = [
  { value: 'bloom', label: 'Bloom flash', hint: 'bright portal flare' },
  { value: 'warp', label: 'Warp tunnel', hint: 'radial lens sweep' },
  { value: 'glitch', label: 'Glitch cut', hint: 'pixel tear jump' },
  { value: 'fade', label: 'Soft fade', hint: 'gentle crossfade veil' },
  { value: 'pulse', label: 'Beat pulse', hint: 'ring pulse bridge' },
];

const defaultFeatures: AudioFeatures = {
  bass: 0,
  mid: 0,
  high: 0,
  rms: 0,
  beat: 0,
  waveform: 0,
};

const defaultAudioEngine = {
  audioBassDrive: 0.76,
  audioMidDrive: 0.62,
  audioHighDrive: 0.56,
  audioBeatDrive: 0.58,
  audioResponse: 0.34,
};

const gentleAudioEngine = {
  audioBassDrive: 0.42,
  audioMidDrive: 0.34,
  audioHighDrive: 0.28,
  audioBeatDrive: 0.22,
  audioResponse: 0.12,
};

const liquidLightEngine = {
  audioBassDrive: 0.38,
  audioMidDrive: 0.58,
  audioHighDrive: 0.46,
  audioBeatDrive: 0.24,
  audioResponse: 0.16,
};

const machineCathedralEngine = {
  audioBassDrive: 0.54,
  audioMidDrive: 0.86,
  audioHighDrive: 0.92,
  audioBeatDrive: 0.42,
  audioResponse: 0.38,
};

const defaultSettings: VisualSettings = {
  mode: 'cosmic-drift',
  palette: 'aurora-phi',
  showPhi: true,
  showGrid369: false,
  showEquations: false,
  audioReactive: true,
  zoomSpeed: 0.22,
  audioDrive: 0.16,
  ...liquidLightEngine,
  glow: 0.72,
};

const safeModeSettings: VisualSettings = {
  mode: 'cosmic-drift',
  palette: 'abyss-cyan',
  showPhi: false,
  showGrid369: false,
  showEquations: false,
  audioReactive: false,
  zoomSpeed: 0.12,
  audioDrive: 0.06,
  ...gentleAudioEngine,
  glow: 0.42,
};

const createDefaultCamera = (): CameraState => ({
  centerX: -0.743643887037151,
  centerY: 0.13182590420533,
  zoom: 1,
  rotation: 0,
});

const paletteLabels: Record<PaletteName, string> = {
  'violet-gold-duality': 'Violet Gold Duality',
  'solar-ember': 'Solar Ember',
  'abyss-cyan': 'Abyss Cyan',
  'aurora-phi': 'Aurora Phi',
};

const modeLabels: Record<FractalMode, string> = {
  'black-hole-lens': 'Black Hole Lens',
  'cosmic-drift': 'Cosmic Drift',
  'pixel-melt': 'Pixel Melt',
  'kaleido-trip': 'Kaleido Trip',
  'tunnel-bloom': 'Tunnel Bloom',
  'acid-melt': 'Acid Melt',
  mandelbrot: 'Mandelbrot',
  julia: 'Julia Mirror',
};

const modeOptions = Object.entries(modeLabels).map(([value, label]) => ({ value: value as FractalMode, label }));

const tripPresets: TripPreset[] = [
  {
    label: 'Aurora Veil',
    family: 'Liquid Light',
    hint: 'soft aurora curtains with calm shimmer',
    settings: {
      mode: 'cosmic-drift',
      palette: 'aurora-phi',
      showPhi: true,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.18,
      audioDrive: 0.13,
      audioBassDrive: 0.30,
      audioMidDrive: 0.52,
      audioHighDrive: 0.64,
      audioBeatDrive: 0.18,
      audioResponse: 0.12,
      glow: 0.78,
    },
  },
  {
    label: 'Liquid Glass',
    family: 'Liquid Light',
    hint: 'refractive glass flow and watery ribbons',
    settings: {
      mode: 'acid-melt',
      palette: 'abyss-cyan',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.20,
      audioDrive: 0.15,
      audioBassDrive: 0.36,
      audioMidDrive: 0.72,
      audioHighDrive: 0.50,
      audioBeatDrive: 0.20,
      audioResponse: 0.14,
      glow: 0.74,
    },
  },
  {
    label: 'Plasma Garden',
    family: 'Liquid Light',
    hint: 'organic mandala blooms with gentle pulse',
    settings: {
      mode: 'kaleido-trip',
      palette: 'aurora-phi',
      showPhi: true,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.22,
      audioDrive: 0.18,
      audioBassDrive: 0.40,
      audioMidDrive: 0.82,
      audioHighDrive: 0.58,
      audioBeatDrive: 0.30,
      audioResponse: 0.18,
      glow: 0.66,
    },
  },
  {
    label: 'Dream Pool',
    family: 'Liquid Light',
    hint: 'slow reflective cosmic pool',
    settings: {
      mode: 'cosmic-drift',
      palette: 'abyss-cyan',
      showPhi: false,
      showGrid369: true,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.14,
      audioDrive: 0.10,
      audioBassDrive: 0.28,
      audioMidDrive: 0.42,
      audioHighDrive: 0.36,
      audioBeatDrive: 0.16,
      audioResponse: 0.10,
      glow: 0.60,
    },
  },
  {
    label: 'Circuit Cathedral',
    family: 'Machine Cathedral',
    hint: 'glowing circuit-temple geometry with grid discipline',
    settings: {
      mode: 'tunnel-bloom',
      palette: 'abyss-cyan',
      showPhi: false,
      showGrid369: true,
      showEquations: true,
      audioReactive: true,
      zoomSpeed: 0.30,
      audioDrive: 0.22,
      audioBassDrive: 0.50,
      audioMidDrive: 0.90,
      audioHighDrive: 0.84,
      audioBeatDrive: 0.36,
      audioResponse: 0.32,
      glow: 0.76,
    },
  },
  {
    label: 'Glyph Rain',
    family: 'Machine Cathedral',
    hint: 'symbolic data rain with pixel-glitch energy',
    settings: {
      mode: 'pixel-melt',
      palette: 'abyss-cyan',
      showPhi: false,
      showGrid369: true,
      showEquations: true,
      audioReactive: true,
      zoomSpeed: 0.34,
      audioDrive: 0.28,
      audioBassDrive: 0.44,
      audioMidDrive: 0.74,
      audioHighDrive: 1.04,
      audioBeatDrive: 0.48,
      audioResponse: 0.52,
      glow: 0.86,
    },
  },
  {
    label: 'Neon Lattice',
    family: 'Machine Cathedral',
    hint: 'wireframe tunnel lattice and node-field pulse',
    settings: {
      mode: 'tunnel-bloom',
      palette: 'violet-gold-duality',
      showPhi: true,
      showGrid369: true,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.46,
      audioDrive: 0.32,
      audioBassDrive: 0.70,
      audioMidDrive: 0.76,
      audioHighDrive: 0.78,
      audioBeatDrive: 0.72,
      audioResponse: 0.46,
      glow: 0.92,
    },
  },
  {
    label: 'Vector Shrine',
    family: 'Machine Cathedral',
    hint: 'retro vector altar with equations and mirror recursion',
    settings: {
      mode: 'julia',
      palette: 'solar-ember',
      showPhi: true,
      showGrid369: true,
      showEquations: true,
      audioReactive: true,
      zoomSpeed: 0.24,
      audioDrive: 0.20,
      audioBassDrive: 0.52,
      audioMidDrive: 0.62,
      audioHighDrive: 0.72,
      audioBeatDrive: 0.30,
      audioResponse: 0.26,
      glow: 0.68,
    },
  },
  {
    label: 'Black Hole Lens',
    hint: 'gravity pressure, photon ring, and cosmic punch',
    settings: {
      mode: 'black-hole-lens',
      palette: 'solar-ember',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.42,
      audioDrive: 0.30,
      audioBassDrive: 0.78,
      audioMidDrive: 0.52,
      audioHighDrive: 0.44,
      audioBeatDrive: 0.66,
      audioResponse: 0.30,
      glow: 0.84,
    },
  },
  {
    label: 'Cosmic Drift',
    hint: 'star-warp nebula flight',
    settings: {
      mode: 'cosmic-drift',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.44,
      audioDrive: 0.34,
      audioBassDrive: 0.64,
      audioMidDrive: 0.70,
      audioHighDrive: 0.72,
      audioBeatDrive: 0.48,
      audioResponse: 0.28,
      glow: 0.88,
    },
  },
  {
    label: 'Glass Nebula Slow',
    hint: 'soft slow-flow cosmic safe groove',
    settings: {
      mode: 'cosmic-drift',
      palette: 'abyss-cyan',
      showPhi: true,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.24,
      audioDrive: 0.16,
      ...gentleAudioEngine,
      glow: 0.70,
    },
  },
  {
    label: 'Safe Mode',
    hint: 'stable public demo mode',
    settings: safeModeSettings,
  },
  {
    label: 'Pixel Melt',
    hint: 'retro DOS-style block melt',
    settings: {
      mode: 'pixel-melt',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.40,
      audioDrive: 0.34,
      audioBassDrive: 0.68,
      audioMidDrive: 0.72,
      audioHighDrive: 0.82,
      audioBeatDrive: 0.46,
      audioResponse: 0.58,
      glow: 0.82,
    },
  },
  {
    label: 'Kaleido Flower',
    hint: 'mandala symmetry and radial bloom',
    settings: {
      mode: 'kaleido-trip',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.34,
      audioDrive: 0.28,
      audioBassDrive: 0.50,
      audioMidDrive: 0.82,
      audioHighDrive: 0.74,
      audioBeatDrive: 0.52,
      audioResponse: 0.36,
      glow: 0.48,
    },
  },
  {
    label: 'Tunnel Bloom',
    hint: 'portal tunnel pulses',
    settings: {
      mode: 'tunnel-bloom',
      palette: 'violet-gold-duality',
      showPhi: true,
      showGrid369: true,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.42,
      audioDrive: 0.30,
      audioBassDrive: 0.72,
      audioMidDrive: 0.56,
      audioHighDrive: 0.50,
      audioBeatDrive: 0.78,
      audioResponse: 0.42,
      glow: 0.88,
    },
  },
  {
    label: 'Acid Melt',
    hint: 'liquid wall color melt',
    settings: {
      mode: 'acid-melt',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.34,
      audioDrive: 0.28,
      audioBassDrive: 0.58,
      audioMidDrive: 0.80,
      audioHighDrive: 0.70,
      audioBeatDrive: 0.42,
      audioResponse: 0.48,
      glow: 0.84,
    },
  },
  {
    label: 'Deep Fractal',
    hint: 'classic Mandelbrot atlas dive',
    settings: {
      mode: 'mandelbrot',
      palette: 'abyss-cyan',
      showPhi: true,
      showGrid369: false,
      showEquations: true,
      audioReactive: true,
      zoomSpeed: 0.26,
      audioDrive: 0.22,
      audioBassDrive: 0.66,
      audioMidDrive: 0.46,
      audioHighDrive: 0.38,
      audioBeatDrive: 0.28,
      audioResponse: 0.20,
      glow: 0.62,
    },
  },
];

const motionProfiles: MotionProfile[] = [
  { label: 'Dream', hint: 'slow ambient drift', zoomSpeed: 0.18, audioDrive: 0.10, audioResponse: 0.10, glow: 0.58 },
  { label: 'Cruise', hint: 'smooth balanced motion', zoomSpeed: 0.34, audioDrive: 0.24, audioResponse: 0.28, glow: 0.74 },
  { label: 'Live', hint: 'stage-ready energy', zoomSpeed: 0.52, audioDrive: 0.42, audioResponse: 0.56, glow: 0.88 },
  { label: 'Warp', hint: 'maximum face-melt', zoomSpeed: 0.86, audioDrive: 0.72, audioResponse: 0.82, glow: 0.98 },
];

const supportedAudioExtensions = new Set(['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'webm']);
const formatMetric = (value: number) => `${Math.round(value * 100).toString().padStart(2, '0')}%`;
const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const randomFloat = (min: number, max: number) => min + Math.random() * (max - min);

const pressureLabel = (mode: VisualSettings['mode']) => {
  if (mode === 'mandelbrot' || mode === 'julia') return 'Zoom pressure';
  if (mode === 'tunnel-bloom') return 'Tunnel pressure';
  if (mode === 'kaleido-trip') return 'Fold pressure';
  if (mode === 'pixel-melt') return 'Pixel pressure';
  if (mode === 'cosmic-drift') return 'Warp pressure';
  if (mode === 'black-hole-lens') return 'Gravity pressure';
  return 'Melt pressure';
};

const presetTransitionStyle = (preset: TripPreset): TransitionStyle | undefined => {
  if (preset.family === 'Liquid Light') return 'fade';
  if (preset.family === 'Machine Cathedral') return 'warp';
  return undefined;
};

const checkWebGL2Support = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
};

const isSupportedAudioFile = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return file.type.startsWith('audio/') || supportedAudioExtensions.has(extension);
};

const smoothSignal = (previous: number, target: number, response: number) => {
  const attack = 0.045 + response * 0.62;
  const release = 0.020 + response * 0.20;
  const amount = target > previous ? attack : release;
  return clampNumber(previous + (target - previous) * amount, 0, 1);
};

const shapeAudioFeatures = (
  features: AudioFeatures,
  settings: VisualSettings,
  previous: AudioFeatures,
): AudioFeatures => {
  if (!settings.audioReactive) return defaultFeatures;

  const drive = clampNumber(settings.audioDrive, 0, 1.5);
  const response = clampNumber(settings.audioResponse, 0, 1);
  const softDrive = drive * (0.64 + drive * 0.24);
  const band = (value: number, multiplier: number) => clampNumber(value * softDrive * multiplier, 0, 1);
  const onset = Math.max(0, features.bass - previous.bass, features.rms - previous.rms);

  const shaped: AudioFeatures = {
    bass: band(features.bass, settings.audioBassDrive),
    mid: band(features.mid, settings.audioMidDrive),
    high: band(features.high, settings.audioHighDrive),
    rms: band(features.rms, (settings.audioBassDrive + settings.audioMidDrive + settings.audioHighDrive) / 3),
    beat: clampNumber(Math.max(features.beat, onset * 1.7) * Math.min(1, drive * 0.86) * settings.audioBeatDrive, 0, 1),
    waveform: band(features.waveform, settings.audioMidDrive),
  };

  return {
    bass: smoothSignal(previous.bass, shaped.bass, response),
    mid: smoothSignal(previous.mid, shaped.mid, response),
    high: smoothSignal(previous.high, shaped.high, response),
    rms: smoothSignal(previous.rms, shaped.rms, response),
    beat: smoothSignal(previous.beat, shaped.beat, Math.min(1, response + 0.18)),
    waveform: smoothSignal(previous.waveform, shaped.waveform, response),
  };
};

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyzerRef = useRef<AudioFeatureAnalyzer | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const animationRef = useRef(0);
  const presetIndexRef = useRef(0);
  const transitionTimerRef = useRef<number | null>(null);
  const transitionActionTimerRef = useRef<number | null>(null);
  const smoothedFeaturesRef = useRef<AudioFeatures>(defaultFeatures);

  const [features, setFeatures] = useState<AudioFeatures>(defaultFeatures);
  const [settings, setSettings] = useState<VisualSettings>(defaultSettings);
  const [audioName, setAudioName] = useState('No audio loaded yet');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCinematic, setIsCinematic] = useState(false);
  const [autoTrip, setAutoTrip] = useState(false);
  const [hasWebGL2] = useState(checkWebGL2Support);
  const [activeTripLabel, setActiveTripLabel] = useState(tripPresets[0].label);
  const [camera, setCamera] = useState<CameraState>(createDefaultCamera);
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>('fade');
  const [transitionMs, setTransitionMs] = useState(1200);
  const [transitionState, setTransitionState] = useState<{ active: boolean; style: TransitionStyle; label: string }>({
    active: false,
    style: 'fade',
    label: '',
  });
  const [latestAddress, setLatestAddress] = useState('Drop an audio file, press play, then save a visual address.');
  const [notice, setNotice] = useState(hasWebGL2
    ? 'v1.5 Machine Cathedral Pack is live: Circuit Cathedral, Glyph Rain, Neon Lattice, and Vector Shrine are in the trip cycle.'
    : 'WebGL2 is not available in this browser/device. Try Chrome, Edge, Firefox, or Safari on a GPU-enabled device.');

  const visualFeatures = useMemo(() => {
    const next = shapeAudioFeatures(features, settings, smoothedFeaturesRef.current);
    smoothedFeaturesRef.current = next;
    return next;
  }, [features, settings]);

  const visualAddress = useMemo(() => {
    const time = audioRef.current?.currentTime ?? 0;
    return buildVisualAddress(settings, camera, time);
  }, [camera, settings]);

  const triggerTransition = useCallback((label: string, action: () => void, styleOverride?: TransitionStyle) => {
    const style = styleOverride ?? transitionStyle;
    const duration = clampNumber(transitionMs, 350, 2200);
    const actionDelay = Math.min(260, Math.max(80, duration * 0.28));

    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    if (transitionActionTimerRef.current !== null) window.clearTimeout(transitionActionTimerRef.current);

    setTransitionState({ active: true, style, label });

    transitionActionTimerRef.current = window.setTimeout(() => {
      action();
      transitionActionTimerRef.current = null;
    }, actionDelay);

    transitionTimerRef.current = window.setTimeout(() => {
      setTransitionState((current) => ({ ...current, active: false }));
      transitionTimerRef.current = null;
    }, duration);
  }, [transitionMs, transitionStyle]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      cancelAnimationFrame(animationRef.current);
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
      if (transitionActionTimerRef.current !== null) window.clearTimeout(transitionActionTimerRef.current);
    };
  }, []);

  const applyPreset = useCallback((preset: TripPreset, labelPrefix = 'Trip') => {
    triggerTransition(`${labelPrefix} · ${preset.label}`, () => {
      smoothedFeaturesRef.current = defaultFeatures;
      setSettings((current) => ({ ...current, ...preset.settings }));
      setActiveTripLabel(preset.label);
      setNotice(`${preset.label}: ${preset.hint}.`);
    }, presetTransitionStyle(preset));
  }, [triggerTransition]);

  const applyNextTripPreset = useCallback(() => {
    presetIndexRef.current = (presetIndexRef.current + 1) % tripPresets.length;
    applyPreset(tripPresets[presetIndexRef.current], 'Next trip');
  }, [applyPreset]);

  const applyRandomTripPreset = useCallback(() => {
    const presetIndex = Math.floor(Math.random() * tripPresets.length);
    const preset = tripPresets[presetIndex];
    const palettes = Object.keys(paletteLabels) as PaletteName[];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    const randomLabel = `Random ${preset.label}`;

    presetIndexRef.current = presetIndex;
    triggerTransition(randomLabel, () => {
      smoothedFeaturesRef.current = defaultFeatures;
      setSettings((current) => ({
        ...current,
        ...preset.settings,
        palette,
        showPhi: Math.random() > 0.72,
        showGrid369: Math.random() > 0.68,
        showEquations: Math.random() > 0.84,
        zoomSpeed: randomFloat(0.14, 0.78),
        audioDrive: randomFloat(0.08, 0.64),
        audioBassDrive: randomFloat(0.25, 1.12),
        audioMidDrive: randomFloat(0.30, 1.12),
        audioHighDrive: randomFloat(0.24, 1.18),
        audioBeatDrive: randomFloat(0.14, 1.05),
        audioResponse: randomFloat(0.08, 0.76),
        glow: randomFloat(0.44, 0.96),
      }));
      setActiveTripLabel(randomLabel);
      setNotice(`Random trip generated from ${preset.label}.`);
    }, preset.family === 'Liquid Light' ? 'fade' : preset.family === 'Machine Cathedral' ? 'warp' : 'glitch');
  }, [triggerTransition]);

  const applySafeMode = useCallback(() => {
    triggerTransition('Safe Mode bridge', () => {
      smoothedFeaturesRef.current = defaultFeatures;
      setSettings(safeModeSettings);
      setAutoTrip(false);
      setActiveTripLabel('Safe Mode');
      setNotice('Safe Mode enabled: slower motion, overlays off, audio reaction paused.');
    }, 'fade');
  }, [triggerTransition]);

  const applySlowFlow = useCallback(() => {
    triggerTransition('Slow Flow bridge', () => {
      smoothedFeaturesRef.current = defaultFeatures;
      setSettings((current) => ({
        ...current,
        audioReactive: true,
        zoomSpeed: Math.min(current.zoomSpeed, 0.26),
        audioDrive: 0.12,
        ...gentleAudioEngine,
        glow: Math.max(0.40, Math.min(current.glow, 0.70)),
      }));
      setAutoTrip(false);
      setActiveTripLabel('Slow Flow');
      setNotice('Slow Flow enabled: audio stays reactive, but Audio Engine v2 softens band response and beat punch.');
    }, 'pulse');
  }, [triggerTransition]);

  const resetVisuals = useCallback(() => {
    triggerTransition('Reset visuals', () => {
      smoothedFeaturesRef.current = defaultFeatures;
      setSettings(defaultSettings);
      setCamera(createDefaultCamera());
      setFeatures(defaultFeatures);
      setAutoTrip(false);
      setActiveTripLabel('Aurora Veil');
      setLatestAddress('Visuals reset. Press play or save a fresh visual address.');
      setNotice('Visuals reset to the stable v1.5 default scene. Machine Cathedral presets are ready in the control panel.');
    }, 'fade');
  }, [triggerTransition]);

  const applyMotionProfile = useCallback((profile: MotionProfile) => {
    triggerTransition(`Motion ${profile.label}`, () => {
      setSettings((current) => ({
        ...current,
        audioReactive: true,
        zoomSpeed: profile.zoomSpeed,
        audioDrive: profile.audioDrive,
        audioResponse: profile.audioResponse,
        glow: profile.glow,
      }));
      setAutoTrip(false);
      setActiveTripLabel(`Motion ${profile.label}`);
      setNotice(`Motion profile: ${profile.label} — ${profile.hint}.`);
    }, 'pulse');
  }, [triggerTransition]);

  const cycleTransitionStyle = useCallback(() => {
    const currentIndex = transitionOptions.findIndex((option) => option.value === transitionStyle);
    const next = transitionOptions[(currentIndex + 1) % transitionOptions.length];
    setTransitionStyle(next.value);
    triggerTransition(`Transition · ${next.label}`, () => {
      setNotice(`Transition style: ${next.label} — ${next.hint}.`);
    }, next.value);
  }, [transitionStyle, triggerTransition]);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }

    const target = document.querySelector<HTMLElement>('.stage') ?? document.documentElement;
    if (target.requestFullscreen) await target.requestFullscreen().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!autoTrip) return undefined;

    const interval = window.setInterval(() => {
      applyNextTripPreset();
    }, 18000);

    return () => window.clearInterval(interval);
  }, [applyNextTripPreset, autoTrip]);

  const ingestFile = useCallback((file: File) => {
    if (!isSupportedAudioFile(file)) {
      const message = 'Unsupported file. Try mp3, wav, ogg, m4a, aac, flac, or webm audio.';
      setAudioName(message);
      setNotice(message);
      return;
    }

    audioRef.current?.pause();
    cancelAnimationFrame(animationRef.current);

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    smoothedFeaturesRef.current = defaultFeatures;
    setAudioUrl(url);
    setAudioName(file.name);
    setIsPlaying(false);
    setFeatures(defaultFeatures);
    setNotice(`Loaded ${file.name}. Press Play portal when ready.`);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    if (file) ingestFile(file);
  }, [ingestFile]);

  const connectAndPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audioUrl) {
      setNotice('Drop an audio file first, then press Play portal.');
      return;
    }
    if (!audio) return;

    try {
      if (!analyzerRef.current) analyzerRef.current = new AudioFeatureAnalyzer();
      await analyzerRef.current.connect(audio);
      await audio.play();
      setIsPlaying(true);
      setNotice('Portal playing. Use N/R/T for transitions, C for Cinematic, F for Fullscreen, S for Slow Flow, or 0 for Safe Mode.');

      const loop = () => {
        setFeatures(analyzerRef.current?.sample() ?? defaultFeatures);
        animationRef.current = requestAnimationFrame(loop);
      };

      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(loop);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unknown browser playback error';
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
      setNotice(`Playback could not start or decode this file. ${detail}`);
    }
  }, [audioUrl]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
    setNotice('Playback paused.');
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') return;

      const key = event.key.toLowerCase();
      if (event.code === 'Space') {
        event.preventDefault();
        if (isPlaying) pause();
        else void connectAndPlay();
      }

      if (key === 'c') setIsCinematic((current) => !current);
      if (key === 'f') void toggleFullscreen();
      if (key === 'n') applyNextTripPreset();
      if (key === 'r') applyRandomTripPreset();
      if (key === 's') applySlowFlow();
      if (key === 't') cycleTransitionStyle();
      if (key === '0') applySafeMode();
      if (key === 'a') setAutoTrip((current) => !current);
      if (key >= '1' && key <= '4') applyMotionProfile(motionProfiles[Number(key) - 1]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applyMotionProfile, applyNextTripPreset, applyRandomTripPreset, applySafeMode, applySlowFlow, connectAndPlay, cycleTransitionStyle, isPlaying, pause, toggleFullscreen]);

  const saveAddress = async () => {
    const address = formatVisualAddress(visualAddress);
    setLatestAddress(address);
    setNotice('Visual address copied and saved in the latest-address panel.');
    await navigator.clipboard?.writeText(address).catch(() => undefined);
  };

  const exportReceipt = () => {
    const receipt = {
      appVersion: APP_VERSION,
      address: visualAddress,
      formatted: formatVisualAddress(visualAddress),
      audioName,
      activeTripLabel,
      transitionEngine: { style: transitionStyle, durationMs: transitionMs },
      audioEngineV2: {
        drive: settings.audioDrive,
        bassImpact: settings.audioBassDrive,
        midMotion: settings.audioMidDrive,
        highSparkle: settings.audioHighDrive,
        beatPunch: settings.audioBeatDrive,
        response: settings.audioResponse,
      },
      browserSupport: { webgl2: hasWebGL2 },
      controls: { pressure: settings.zoomSpeed, glow: settings.glow },
      claimBoundary: 'Creative visual receipt only. Not scientific, medical, spiritual, or physics evidence.',
    };

    downloadTextFile(`infinitylens369-${Date.now()}.json`, JSON.stringify(receipt, null, 2));
    setNotice('JSON receipt exported.');
  };

  const saveFrame = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('.stage canvas');
    if (!canvas) {
      setNotice('No canvas frame found yet.');
      return;
    }

    const anchor = document.createElement('a');
    anchor.download = `infinitylens369-frame-${Date.now()}.png`;
    anchor.href = canvas.toDataURL('image/png');
    anchor.click();
    setNotice('PNG frame export started.');
  };

  const setVisualSetting = <K extends keyof VisualSettings>(key: K, value: VisualSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const stageStyle = { '--transition-ms': `${transitionMs}ms` } as CSSProperties;
  const currentTransition = transitionOptions.find((option) => option.value === transitionStyle) ?? transitionOptions[0];

  return (
    <main className={`app-shell ${isCinematic ? 'cinematic' : ''}`}>
      <audio
        ref={audioRef}
        src={audioUrl ?? undefined}
        className="hidden-audio"
        onEnded={() => {
          setIsPlaying(false);
          cancelAnimationFrame(animationRef.current);
          setNotice('Playback ended.');
        }}
      />

      <section className="stage" style={stageStyle}>
        {hasWebGL2 ? (
          <FractalCanvas features={visualFeatures} settings={settings} onCameraChange={setCamera} />
        ) : (
          <div className="support-card">
            <p className="eyebrow">WebGL2 unavailable</p>
            <h1>InfinityLens369 needs a GPU-enabled WebGL2 browser.</h1>
            <p>Try Chrome, Edge, Firefox, or Safari on a newer device.</p>
          </div>
        )}

        {transitionState.active && (
          <div className={`transition-overlay transition-${transitionState.style}`}>
            <span>{transitionState.label}</span>
          </div>
        )}

        <div className="stage-badge">
          <strong>InfinityLens369 {APP_VERSION}</strong>
          <span>{activeTripLabel}</span>
          {autoTrip && <em>auto trip</em>}
        </div>

        <div className="stage-notice">{notice}</div>

        {isCinematic && (
          <button className="show-controls" type="button" onClick={() => setIsCinematic(false)}>
            Show controls
          </button>
        )}
      </section>

      {!isCinematic && (
        <aside className="control-panel">
          <header>
            <p className="eyebrow">Local-first visualizer</p>
            <h1>Drop a song. Open a portal.</h1>
            <p>{audioName}</p>
          </header>

          <label className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.oga,.m4a,.aac,.flac,.webm"
              onChange={(event) => {
                const file = event.currentTarget.files?.item(0);
                if (file) ingestFile(file);
              }}
            />
            <span>Drop audio or choose a file</span>
          </label>

          <div className="button-row">
            <button type="button" onClick={() => (isPlaying ? pause() : void connectAndPlay())}>
              {isPlaying ? 'Pause' : 'Play portal'}
            </button>
            <button type="button" onClick={() => setIsCinematic(true)}>Cinematic</button>
            <button type="button" onClick={() => void toggleFullscreen()}>Fullscreen</button>
          </div>

          <div className="button-row">
            <button type="button" onClick={applyNextTripPreset}>Next trip</button>
            <button type="button" onClick={applyRandomTripPreset}>Random trip</button>
            <button type="button" onClick={() => setAutoTrip((current) => !current)}>{autoTrip ? 'Auto trip on' : 'Auto trip'}</button>
          </div>

          <div className="button-row">
            <button type="button" onClick={applySlowFlow}>Slow flow</button>
            <button type="button" onClick={applySafeMode}>Safe mode</button>
            <button type="button" onClick={resetVisuals}>Reset visuals</button>
          </div>

          <section className="control-group">
            <h2>Liquid Light Pack</h2>
            <div className="trip-chip-grid">
              {tripPresets.slice(0, 4).map((preset) => (
                <button key={preset.label} type="button" className="trip-chip" onClick={() => applyPreset(preset, 'Liquid Light')}>
                  <strong>{preset.label}</strong>
                  <span>{preset.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="control-group">
            <h2>Machine Cathedral Pack</h2>
            <div className="trip-chip-grid">
              {tripPresets.slice(4, 8).map((preset) => (
                <button key={preset.label} type="button" className="trip-chip" onClick={() => applyPreset(preset, 'Machine Cathedral')}>
                  <strong>{preset.label}</strong>
                  <span>{preset.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="control-group">
            <h2>Visual mode</h2>
            <select
              value={settings.mode}
              onChange={(event) => {
                const mode = event.currentTarget.value as FractalMode;
                triggerTransition(`Mode · ${modeLabels[mode]}`, () => {
                  smoothedFeaturesRef.current = defaultFeatures;
                  setVisualSetting('mode', mode);
                  setActiveTripLabel(modeLabels[mode]);
                  setNotice(`Manual mode selected: ${modeLabels[mode]}.`);
                });
              }}
            >
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select value={settings.palette} onChange={(event) => setVisualSetting('palette', event.currentTarget.value as PaletteName)}>
              {(Object.keys(paletteLabels) as PaletteName[]).map((palette) => (
                <option key={palette} value={palette}>{paletteLabels[palette]}</option>
              ))}
            </select>
          </section>

          <section className="control-group">
            <h2>Transition Engine</h2>
            <select value={transitionStyle} onChange={(event) => setTransitionStyle(event.currentTarget.value as TransitionStyle)}>
              {transitionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <p>{currentTransition.hint}</p>
            <button type="button" onClick={cycleTransitionStyle}>Cycle transition</button>
            <label>
              Morph speed {transitionMs}ms
              <input type="range" min="350" max="2200" step="50" value={transitionMs} onChange={(event) => setTransitionMs(Number(event.currentTarget.value))} />
            </label>
          </section>

          <section className="control-group">
            <h2>Motion Profiles</h2>
            <div className="motion-grid">
              {motionProfiles.map((profile, index) => (
                <button key={profile.label} type="button" className="motion-card" onClick={() => applyMotionProfile(profile)}>
                  <strong>{index + 1}. {profile.label}</strong>
                  <span>{profile.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="control-group">
            <h2>Audio Engine v2</h2>
            <label>
              Audio speed / drive {formatMetric(settings.audioDrive)}
              <input type="range" min="0" max="1" step="0.01" value={settings.audioDrive} onChange={(event) => setVisualSetting('audioDrive', Number(event.currentTarget.value))} />
            </label>
            <label>
              Response {formatMetric(settings.audioResponse)}
              <input type="range" min="0" max="1" step="0.01" value={settings.audioResponse} onChange={(event) => setVisualSetting('audioResponse', Number(event.currentTarget.value))} />
            </label>
            <label>
              Bass impact {formatMetric(settings.audioBassDrive)}
              <input type="range" min="0" max="1.25" step="0.01" value={settings.audioBassDrive} onChange={(event) => setVisualSetting('audioBassDrive', Number(event.currentTarget.value))} />
            </label>
            <label>
              Mids motion {formatMetric(settings.audioMidDrive)}
              <input type="range" min="0" max="1.25" step="0.01" value={settings.audioMidDrive} onChange={(event) => setVisualSetting('audioMidDrive', Number(event.currentTarget.value))} />
            </label>
            <label>
              High sparkle {formatMetric(settings.audioHighDrive)}
              <input type="range" min="0" max="1.25" step="0.01" value={settings.audioHighDrive} onChange={(event) => setVisualSetting('audioHighDrive', Number(event.currentTarget.value))} />
            </label>
            <label>
              Beat punch {formatMetric(settings.audioBeatDrive)}
              <input type="range" min="0" max="1.25" step="0.01" value={settings.audioBeatDrive} onChange={(event) => setVisualSetting('audioBeatDrive', Number(event.currentTarget.value))} />
            </label>
          </section>

          <section className="control-group">
            <h2>Visual Controls</h2>
            <label>
              {pressureLabel(settings.mode)} {formatMetric(settings.zoomSpeed)}
              <input type="range" min="0" max="1" step="0.01" value={settings.zoomSpeed} onChange={(event) => setVisualSetting('zoomSpeed', Number(event.currentTarget.value))} />
            </label>
            <label>
              Glow {formatMetric(settings.glow)}
              <input type="range" min="0" max="1" step="0.01" value={settings.glow} onChange={(event) => setVisualSetting('glow', Number(event.currentTarget.value))} />
            </label>
            <label><input type="checkbox" checked={settings.audioReactive} onChange={(event) => setVisualSetting('audioReactive', event.currentTarget.checked)} /> Audio reactive</label>
            <label><input type="checkbox" checked={settings.showPhi} onChange={(event) => setVisualSetting('showPhi', event.currentTarget.checked)} /> Phi spiral</label>
            <label><input type="checkbox" checked={settings.showGrid369} onChange={(event) => setVisualSetting('showGrid369', event.currentTarget.checked)} /> 3-6-9 grid</label>
            <label><input type="checkbox" checked={settings.showEquations} onChange={(event) => setVisualSetting('showEquations', event.currentTarget.checked)} /> Equation overlay</label>
          </section>

          <section className="control-group meter-grid">
            <div>Bass <strong>{formatMetric(features.bass)}</strong></div>
            <div>Mids <strong>{formatMetric(features.mid)}</strong></div>
            <div>Highs <strong>{formatMetric(features.high)}</strong></div>
            <div>Beat <strong>{formatMetric(features.beat)}</strong></div>
          </section>

          <section className="control-group">
            <h2>Receipts</h2>
            <div className="button-row">
              <button type="button" onClick={() => void saveAddress()}>Save address</button>
              <button type="button" onClick={saveFrame}>Save frame</button>
              <button type="button" onClick={exportReceipt}>Export JSON</button>
            </div>
            <code>{latestAddress}</code>
          </section>

          <footer>
            <p>Shortcuts: Space play/pause · C cinematic · F fullscreen · N next · R random · T transition · S slow · A auto · 0 safe · 1-4 motion.</p>
            <p>Claim-safe creative software. Visual receipts are replay cues, not scientific proof.</p>
          </footer>
        </aside>
      )}
    </main>
  );
}
