import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { AudioFeatureAnalyzer } from './audio/analyser';
import { buildVisualAddress, downloadTextFile, formatVisualAddress } from './ledger/visualAddress';
import type { AudioFeatures, CameraState, PaletteName, VisualSettings } from './types';
import { FractalCanvas } from './visual/FractalCanvas';

const APP_VERSION = 'v1.2.0';

type TransitionStyle = 'bloom' | 'warp' | 'glitch' | 'fade' | 'pulse';

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

const defaultSettings: VisualSettings = {
  mode: 'black-hole-lens',
  palette: 'solar-ember',
  showPhi: false,
  showGrid369: false,
  showEquations: false,
  audioReactive: true,
  zoomSpeed: 0.42,
  audioDrive: 0.30,
  glow: 0.84,
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

const tripPresets: Array<{ label: string; settings: Partial<VisualSettings> }> = [
  {
    label: 'Black Hole Lens',
    settings: {
      mode: 'black-hole-lens',
      palette: 'solar-ember',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.42,
      audioDrive: 0.30,
      glow: 0.84,
    },
  },
  {
    label: 'Cosmic Drift',
    settings: {
      mode: 'cosmic-drift',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.44,
      audioDrive: 0.34,
      glow: 0.88,
    },
  },
  {
    label: 'Glass Nebula Slow',
    settings: {
      mode: 'cosmic-drift',
      palette: 'abyss-cyan',
      showPhi: true,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.24,
      audioDrive: 0.16,
      glow: 0.70,
    },
  },
  {
    label: 'Safe Mode',
    settings: safeModeSettings,
  },
  {
    label: 'Pixel Melt',
    settings: {
      mode: 'pixel-melt',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.40,
      audioDrive: 0.34,
      glow: 0.82,
    },
  },
  {
    label: 'Kaleido Flower',
    settings: {
      mode: 'kaleido-trip',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.34,
      audioDrive: 0.28,
      glow: 0.48,
    },
  },
  {
    label: 'Tunnel Bloom',
    settings: {
      mode: 'tunnel-bloom',
      palette: 'violet-gold-duality',
      showPhi: true,
      showGrid369: true,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.42,
      audioDrive: 0.30,
      glow: 0.88,
    },
  },
  {
    label: 'Acid Melt',
    settings: {
      mode: 'acid-melt',
      palette: 'aurora-phi',
      showPhi: false,
      showGrid369: false,
      showEquations: false,
      audioReactive: true,
      zoomSpeed: 0.34,
      audioDrive: 0.28,
      glow: 0.84,
    },
  },
  {
    label: 'Deep Fractal',
    settings: {
      mode: 'mandelbrot',
      palette: 'abyss-cyan',
      showPhi: true,
      showGrid369: false,
      showEquations: true,
      audioReactive: true,
      zoomSpeed: 0.26,
      audioDrive: 0.22,
      glow: 0.62,
    },
  },
];

type MotionProfile = {
  label: string;
  hint: string;
  zoomSpeed: number;
  audioDrive: number;
  glow: number;
};

const motionProfiles: MotionProfile[] = [
  { label: 'Dream', hint: 'slow ambient drift', zoomSpeed: 0.18, audioDrive: 0.10, glow: 0.58 },
  { label: 'Cruise', hint: 'smooth balanced motion', zoomSpeed: 0.34, audioDrive: 0.24, glow: 0.74 },
  { label: 'Live', hint: 'stage-ready energy', zoomSpeed: 0.52, audioDrive: 0.42, glow: 0.88 },
  { label: 'Warp', hint: 'maximum face-melt', zoomSpeed: 0.86, audioDrive: 0.72, glow: 0.98 },
];

const supportedAudioExtensions = new Set(['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'webm']);

const formatMetric = (value: number) => `${Math.round(value * 100).toString().padStart(2, '0')}%`;
const formatModeLabel = (mode: VisualSettings['mode']) => mode.replace(/-/g, ' ');
const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const pressureLabel = (mode: VisualSettings['mode']) => {
  if (mode === 'mandelbrot' || mode === 'julia') return 'Zoom pressure';
  if (mode === 'tunnel-bloom') return 'Tunnel pressure';
  if (mode === 'kaleido-trip') return 'Fold pressure';
  if (mode === 'pixel-melt') return 'Pixel pressure';
  if (mode === 'cosmic-drift') return 'Warp pressure';
  if (mode === 'black-hole-lens') return 'Gravity pressure';
  return 'Melt pressure';
};

const randomFloat = (min: number, max: number) => min + Math.random() * (max - min);

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

const shapeAudioFeatures = (features: AudioFeatures, audioDrive: number): AudioFeatures => {
  const drive = clampNumber(audioDrive, 0, 1.5);
  const softDrive = drive * (0.64 + drive * 0.24);
  const beatDrive = Math.min(1, drive * 0.78);

  return {
    bass: clampNumber(features.bass * softDrive, 0, 1),
    mid: clampNumber(features.mid * softDrive, 0, 1),
    high: clampNumber(features.high * softDrive, 0, 1),
    rms: clampNumber(features.rms * softDrive, 0, 1),
    beat: clampNumber(features.beat * beatDrive, 0, 1),
    waveform: clampNumber(features.waveform * softDrive, 0, 1),
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
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>('bloom');
  const [transitionMs, setTransitionMs] = useState(900);
  const [transitionState, setTransitionState] = useState<{ active: boolean; style: TransitionStyle; label: string }>({
    active: false,
    style: 'bloom',
    label: '',
  });
  const [latestAddress, setLatestAddress] = useState('Drop an audio file, press play, then save a visual address.');
  const [notice, setNotice] = useState(hasWebGL2
    ? 'v1.2 ready. Transition Engine is live: choose a bridge style, then use Next, Random, Auto, Safe, or Reset.'
    : 'WebGL2 is not available in this browser/device. Try Chrome, Edge, Firefox, or Safari on a GPU-enabled device.');

  const visualFeatures = useMemo(
    () => shapeAudioFeatures(features, settings.audioDrive),
    [features, settings.audioDrive],
  );

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

  const applyNextTripPreset = useCallback(() => {
    presetIndexRef.current = (presetIndexRef.current + 1) % tripPresets.length;
    const preset = tripPresets[presetIndexRef.current];

    triggerTransition(`Next trip · ${preset.label}`, () => {
      setSettings((current) => ({ ...current, ...preset.settings }));
      setActiveTripLabel(preset.label);
      setNotice(`Transitioned into trip preset: ${preset.label}`);
    });
  }, [triggerTransition]);

  const applyRandomTripPreset = useCallback(() => {
    const presetIndex = Math.floor(Math.random() * tripPresets.length);
    const preset = tripPresets[presetIndex];
    const palettes = Object.keys(paletteLabels) as PaletteName[];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    const randomLabel = `Random ${preset.label}`;

    presetIndexRef.current = presetIndex;
    triggerTransition(randomLabel, () => {
      setSettings((current) => ({
        ...current,
        ...preset.settings,
        palette,
        showPhi: Math.random() > 0.72,
        showGrid369: Math.random() > 0.68,
        showEquations: Math.random() > 0.84,
        zoomSpeed: randomFloat(0.18, 0.78),
        audioDrive: randomFloat(0.10, 0.64),
        glow: randomFloat(0.44, 0.96),
      }));
      setActiveTripLabel(randomLabel);
      setNotice(`Random trip generated from ${preset.label}`);
    }, 'glitch');
  }, [triggerTransition]);

  const applySafeMode = useCallback(() => {
    triggerTransition('Safe Mode bridge', () => {
      setSettings(safeModeSettings);
      setAutoTrip(false);
      setActiveTripLabel('Safe Mode');
      setNotice('Safe Mode enabled: slower motion, overlays off, audio reaction paused. Use this for older laptops or projectors.');
    }, 'fade');
  }, [triggerTransition]);

  const applySlowFlow = useCallback(() => {
    triggerTransition('Slow Flow bridge', () => {
      setSettings((current) => ({
        ...current,
        audioReactive: true,
        zoomSpeed: Math.min(current.zoomSpeed, 0.26),
        audioDrive: 0.12,
        glow: Math.max(0.40, Math.min(current.glow, 0.70)),
      }));
      setAutoTrip(false);
      setActiveTripLabel('Slow Flow');
      setNotice('Slow Flow enabled: audio stays reactive, but motion is softened.');
    }, 'pulse');
  }, [triggerTransition]);

  const resetVisuals = useCallback(() => {
    triggerTransition('Reset visuals', () => {
      setSettings(defaultSettings);
      setCamera(createDefaultCamera());
      setFeatures(defaultFeatures);
      setAutoTrip(false);
      setActiveTripLabel('Black Hole Lens');
      setLatestAddress('Visuals reset. Press play or save a fresh visual address.');
      setNotice('Visuals reset to the v1.2 default scene.');
    }, 'bloom');
  }, [triggerTransition]);

  const applyMotionProfile = useCallback((profile: MotionProfile) => {
    triggerTransition(`Motion ${profile.label}`, () => {
      setSettings((current) => ({
        ...current,
        audioReactive: true,
        zoomSpeed: profile.zoomSpeed,
        audioDrive: profile.audioDrive,
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

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setAudioUrl(url);
    setAudioName(file.name);
    setIsPlaying(false);
    setFeatures(defaultFeatures);
    setNotice(`Loaded ${file.name}. Press Play portal when ready.`);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files.item(0);
      if (file) ingestFile(file);
    },
    [ingestFile],
  );

  const connectAndPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audioUrl) {
      setNotice('Drop an audio file first, then press Play portal.');
      return;
    }
    if (!audio) return;

    try {
      if (!analyzerRef.current) {
        analyzerRef.current = new AudioFeatureAnalyzer();
      }

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
      transitionEngine: {
        style: transitionStyle,
        durationMs: transitionMs,
      },
      browserSupport: {
        webgl2: hasWebGL2,
      },
      controls: {
        pressure: settings.zoomSpeed,
        audioDrive: settings.audioDrive,
        glow: settings.glow,
      },
      notice,
      stance: 'Art/math/software visualization only. Not a physics, medical, or consciousness claim.',
    };
    downloadTextFile('infinitylens369-visual-address.json', JSON.stringify(receipt, null, 2));
  };

  const exportScreenshot = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('.fractal-canvas');
    if (!canvas) {
      setNotice('No WebGL frame is available to export on this device/browser.');
      return;
    }

    const link = document.createElement('a');
    link.download = 'infinitylens369-frame.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
    setNotice('The browser could not decode this audio file. Try another mp3, wav, ogg, m4a, aac, flac, or webm file.');
  };

  return (
    <main className={isCinematic ? 'app-shell is-cinematic' : 'app-shell'}>
      <audio
        hidden
        ref={audioRef}
        src={audioUrl ?? undefined}
        onEnded={() => {
          setIsPlaying(false);
          cancelAnimationFrame(animationRef.current);
          setNotice('Song ended. Load another track or replay the portal.');
        }}
        onError={handleAudioError}
      />

      <section className="stage" aria-label="InfinityLens369 visualization stage">
        {hasWebGL2 ? (
          <FractalCanvas features={visualFeatures} settings={settings} onCameraChange={setCamera} />
        ) : (
          <div className="stage-fallback glass" role="alert">
            <strong>WebGL2 is not available here.</strong>
            <span>InfinityLens369 needs WebGL2 for the shader engine. Try a current Chrome, Edge, Firefox, or Safari browser with GPU acceleration enabled.</span>
          </div>
        )}

        {hasWebGL2 && settings.showPhi && <PhiOverlay />}
        {hasWebGL2 && settings.showGrid369 && <Grid369Overlay />}
        {hasWebGL2 && settings.showEquations && <EquationOverlay features={visualFeatures} camera={camera} mode={settings.mode} />}

        {transitionState.active && (
          <div
            className={`stage-transition ${transitionState.style}`}
            style={{ '--transition-ms': `${transitionMs}ms` } as CSSProperties}
            aria-hidden="true"
          >
            <span>{transitionState.label}</span>
          </div>
        )}

        <div className="stage-badge glass" aria-label="InfinityLens369 status">
          <strong>InfinityLens369 {APP_VERSION}</strong>
          <span>{formatModeLabel(settings.mode)}</span>
          <span>{transitionOptions.find((option) => option.value === transitionStyle)?.label}</span>
          <span>drive {formatMetric(settings.audioDrive / 1.5)}</span>
          {settings.audioReactive ? <span>reactive</span> : <span>safe/static</span>}
          {autoTrip && <span>auto trip</span>}
        </div>

        {notice && (
          <div className="stage-notice glass" role="status">
            {notice}
          </div>
        )}

        {isCinematic && (
          <button className="stage-action glass" type="button" onClick={() => setIsCinematic(false)}>
            Show controls
          </button>
        )}
      </section>

      {!isCinematic && (
        <aside className="control-panel glass" aria-label="InfinityLens369 controls">
          <label
            className="dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.oga,.m4a,.aac,.flac,.webm"
              onChange={(event) => {
                const file = event.target.files?.item(0);
                if (file) ingestFile(file);
              }}
            />
            <span className="drop-icon">∞</span>
            <strong>Drop MP3/WAV/OGG/M4A</strong>
            <small>{audioName}</small>
          </label>

          <section className="trip-chip" aria-label="System status">
            <span>System status</span>
            <strong>{notice}</strong>
          </section>

          <div className="button-row">
            <button type="button" onClick={connectAndPlay} disabled={!audioUrl || isPlaying || !hasWebGL2}>
              Play portal
            </button>
            <button type="button" onClick={pause} disabled={!isPlaying}>
              Pause
            </button>
          </div>

          <div className="button-row">
            <button type="button" onClick={() => setIsCinematic(true)}>
              Cinematic
            </button>
            <button type="button" onClick={toggleFullscreen}>
              Fullscreen
            </button>
          </div>

          <div className="button-row">
            <button type="button" onClick={applyNextTripPreset}>
              Next trip
            </button>
            <button type="button" onClick={applyRandomTripPreset}>
              Random trip
            </button>
          </div>

          <div className="button-row">
            <button type="button" onClick={applySafeMode}>
              Safe mode
            </button>
            <button type="button" onClick={resetVisuals}>
              Reset visuals
            </button>
          </div>

          <button className="wide-button" type="button" onClick={applySlowFlow}>
            Slow flow
          </button>

          <section className="transition-card" aria-label="Transition engine controls">
            <span>Transition engine</span>
            <strong>{transitionOptions.find((option) => option.value === transitionStyle)?.label}</strong>
            <small>Bridges Next, Random, Auto, Safe, Reset, Motion, and manual mode changes.</small>
            <div className="transition-row">
              <select value={transitionStyle} onChange={(event) => setTransitionStyle(event.target.value as TransitionStyle)}>
                {transitionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button type="button" onClick={cycleTransitionStyle}>Cycle</button>
            </div>
            <label className="slider-row compact-slider">
              <span>Morph speed · {(transitionMs / 1000).toFixed(2)}s</span>
              <input
                type="range"
                min="450"
                max="1800"
                step="50"
                value={transitionMs}
                onChange={(event) => setTransitionMs(Number(event.target.value))}
              />
            </label>
          </section>

          <section className="motion-card" aria-label="Motion profiles">
            <span>Motion profiles</span>
            <div className="motion-grid">
              {motionProfiles.map((profile, index) => (
                <button key={profile.label} type="button" onClick={() => applyMotionProfile(profile)}>
                  <strong>{index + 1}. {profile.label}</strong>
                  <small>{profile.hint}</small>
                </button>
              ))}
            </div>
          </section>

          <button className="wide-button" type="button" onClick={() => setAutoTrip((current) => !current)}>
            {autoTrip ? 'Stop auto trip' : 'Auto trip'}
          </button>

          <div className="trip-chip" aria-label="Active trip preset">
            <span>Trip preset</span>
            <strong>{activeTripLabel}</strong>
          </div>

          <div className="trip-chip" aria-label="Keyboard shortcuts">
            <span>Keys</span>
            <strong>Space play · C cinema · F full · N next · R random · T transition · S slow · A auto · 0 safe · 1-4 motion</strong>
          </div>

          <div className="metrics" aria-label="Audio analysis metrics">
            <Metric label="Bass" value={features.bass} />
            <Metric label="Mids" value={features.mid} />
            <Metric label="Highs" value={features.high} />
            <Metric label="Energy" value={features.rms} />
            <Metric label="Drive" value={settings.audioDrive / 1.5} />
          </div>

          <label className="field-row">
            <span>Mode</span>
            <select
              value={settings.mode}
              onChange={(event) => {
                const mode = event.target.value as VisualSettings['mode'];
                triggerTransition(`Mode · ${formatModeLabel(mode)}`, () => {
                  setSettings((current) => ({ ...current, mode }));
                  setActiveTripLabel('Custom signal');
                  setNotice('Custom mode selected through the v1.2 transition engine.');
                });
              }}
            >
              <option value="black-hole-lens">Black Hole Lens</option>
              <option value="cosmic-drift">Cosmic Drift</option>
              <option value="pixel-melt">Pixel Melt</option>
              <option value="kaleido-trip">Kaleido Trip</option>
              <option value="tunnel-bloom">Tunnel Bloom</option>
              <option value="acid-melt">Acid Melt</option>
              <option value="mandelbrot">Mandelbrot</option>
              <option value="julia">Julia Mirror</option>
            </select>
          </label>

          <label className="field-row">
            <span>Palette</span>
            <select
              value={settings.palette}
              onChange={(event) => setSettings((current) => ({ ...current, palette: event.target.value as PaletteName }))}
            >
              {Object.entries(paletteLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="slider-row">
            <span>{pressureLabel(settings.mode)}</span>
            <input
              type="range"
              min="0"
              max="1.2"
              step="0.01"
              value={settings.zoomSpeed}
              onChange={(event) => setSettings((current) => ({ ...current, zoomSpeed: Number(event.target.value) }))}
            />
          </label>

          <label className="slider-row">
            <span>Audio speed / drive</span>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.01"
              value={settings.audioDrive}
              onChange={(event) => setSettings((current) => ({ ...current, audioDrive: Number(event.target.value) }))}
            />
          </label>

          <label className="slider-row">
            <span>Glow</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.glow}
              onChange={(event) => setSettings((current) => ({ ...current, glow: Number(event.target.value) }))}
            />
          </label>

          <div className="toggle-grid">
            <Toggle label="Audio reactive" checked={settings.audioReactive} onChange={(audioReactive) => setSettings((current) => ({ ...current, audioReactive }))} />
            <Toggle label="Phi spiral" checked={settings.showPhi} onChange={(showPhi) => setSettings((current) => ({ ...current, showPhi }))} />
            <Toggle label="369 grid" checked={settings.showGrid369} onChange={(showGrid369) => setSettings((current) => ({ ...current, showGrid369 }))} />
            <Toggle label="Equations" checked={settings.showEquations} onChange={(showEquations) => setSettings((current) => ({ ...current, showEquations }))} />
          </div>

          <div className="button-row stacked">
            <button type="button" onClick={saveAddress}>Save visual address</button>
            <button type="button" onClick={exportReceipt}>Export receipt JSON</button>
            <button type="button" onClick={exportScreenshot}>Export PNG frame</button>
          </div>

          <section className="address-card" aria-label="Latest visual address">
            <span>Latest address</span>
            <code>{latestAddress}</code>
          </section>
        </aside>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{formatMetric(value)}</strong>
      <i style={{ transform: `scaleX(${Math.max(0.02, value)})` }} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function PhiOverlay() {
  return (
    <svg className="phi-overlay" viewBox="0 0 1000 1000" aria-hidden="true">
      <path
        d="M500 500 C620 500 620 680 500 680 C280 680 280 360 500 360 C850 360 850 860 500 860 C-70 860 -70 140 500 140 C1250 140 1250 1040 500 1040"
      />
      <circle cx="500" cy="500" r="222" />
      <circle cx="500" cy="500" r="359" />
    </svg>
  );
}

function Grid369Overlay() {
  const points = [3, 6, 9];
  return (
    <svg className="grid369-overlay" viewBox="0 0 1000 1000" aria-hidden="true">
      <circle cx="500" cy="500" r="320" />
      <circle cx="500" cy="500" r="180" />
      <path d="M500 112 L836 694 L164 694 Z" />
      <path d="M500 888 L164 306 L836 306 Z" />
      {points.map((point, index) => {
        const angle = (-90 + index * 120) * (Math.PI / 180);
        const x = 500 + Math.cos(angle) * 320;
        const y = 500 + Math.sin(angle) * 320;
        return (
          <text key={point} x={x} y={y}>
            {point}
          </text>
        );
      })}
    </svg>
  );
}

function EquationOverlay({ features, camera, mode }: { features: AudioFeatures; camera: CameraState; mode: VisualSettings['mode'] }) {
  const modeFormula = mode === 'acid-melt'
    ? 'fbm(p) + swirl + audio'
    : mode === 'tunnel-bloom'
      ? '1/r tunnel + bloom + beat'
      : mode === 'kaleido-trip'
        ? 'radial fold + mirror + audio'
        : mode === 'pixel-melt'
          ? 'quantize(p) + feedback melt'
          : mode === 'cosmic-drift'
            ? 'starfield + nebula warp + beat'
            : mode === 'black-hole-lens'
              ? 'lens(r) + accretion + beat'
              : 'z ↦ z² + c';

  return (
    <div className="equation-overlay" aria-hidden="true">
      <span>{modeFormula}</span>
      <span>φ ≈ 1.6180339887</span>
      <span>3 · 6 · 9 pulse</span>
      <span>bass {formatMetric(features.bass)} / zoom {camera.zoom.toExponential(2)}</span>
    </div>
  );
}
