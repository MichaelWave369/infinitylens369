import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { AudioFeatureAnalyzer } from './audio/analyser';
import { buildVisualAddress, downloadTextFile, formatVisualAddress } from './ledger/visualAddress';
import type { AudioFeatures, CameraState, PaletteName, VisualSettings } from './types';
import { FractalCanvas } from './visual/FractalCanvas';

const defaultFeatures: AudioFeatures = {
  bass: 0,
  mid: 0,
  high: 0,
  rms: 0,
  beat: 0,
  waveform: 0,
};

const defaultSettings: VisualSettings = {
  mode: 'acid-melt',
  palette: 'aurora-phi',
  showPhi: true,
  showGrid369: false,
  showEquations: false,
  audioReactive: true,
  zoomSpeed: 0.35,
  glow: 0.9,
};

const paletteLabels: Record<PaletteName, string> = {
  'violet-gold-duality': 'Violet Gold Duality',
  'solar-ember': 'Solar Ember',
  'abyss-cyan': 'Abyss Cyan',
  'aurora-phi': 'Aurora Phi',
};

const formatMetric = (value: number) => `${Math.round(value * 100).toString().padStart(2, '0')}%`;

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyzerRef = useRef<AudioFeatureAnalyzer | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const animationRef = useRef(0);

  const [features, setFeatures] = useState<AudioFeatures>(defaultFeatures);
  const [settings, setSettings] = useState<VisualSettings>(defaultSettings);
  const [audioName, setAudioName] = useState('No audio loaded yet');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [camera, setCamera] = useState<CameraState>({
    centerX: -0.743643887037151,
    centerY: 0.13182590420533,
    zoom: 1,
    rotation: 0,
  });
  const [latestAddress, setLatestAddress] = useState('Drop an audio file, press play, then save a visual address.');

  const visualAddress = useMemo(() => {
    const time = audioRef.current?.currentTime ?? 0;
    return buildVisualAddress(settings, camera, time);
  }, [camera, settings]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const ingestFile = useCallback((file: File) => {
    if (!file.type.startsWith('audio/')) {
      setAudioName('That file does not look like audio. Try mp3, wav, ogg, or m4a.');
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setAudioUrl(url);
    setAudioName(file.name);
    setIsPlaying(false);
    setFeatures(defaultFeatures);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files.item(0);
      if (file) ingestFile(file);
    },
    [ingestFile],
  );

  const connectAndPlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (!analyzerRef.current) {
      analyzerRef.current = new AudioFeatureAnalyzer();
    }

    await analyzerRef.current.connect(audio);
    await audio.play();
    setIsPlaying(true);

    const loop = () => {
      setFeatures(analyzerRef.current?.sample() ?? defaultFeatures);
      animationRef.current = requestAnimationFrame(loop);
    };

    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(loop);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
  };

  const saveAddress = async () => {
    const address = formatVisualAddress(visualAddress);
    setLatestAddress(address);
    await navigator.clipboard?.writeText(address).catch(() => undefined);
  };

  const exportReceipt = () => {
    const receipt = {
      address: visualAddress,
      formatted: formatVisualAddress(visualAddress),
      audioName,
      stance: 'Art/math/software visualization only. Not a physics, medical, or consciousness claim.',
    };
    downloadTextFile('infinitylens369-visual-address.json', JSON.stringify(receipt, null, 2));
  };

  const exportScreenshot = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('.fractal-canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'infinitylens369-frame.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="app-shell">
      <section className="stage" aria-label="InfinityLens369 visualization stage">
        <FractalCanvas features={features} settings={settings} onCameraChange={setCamera} />

        {settings.showPhi && <PhiOverlay />}
        {settings.showGrid369 && <Grid369Overlay />}
        {settings.showEquations && <EquationOverlay features={features} camera={camera} mode={settings.mode} />}

        <div className="brand-card glass">
          <p className="eyebrow">InfinityLens369 v0.2</p>
          <h1>Drop a song. Open a portal.</h1>
          <p>
            A local-first fractal atlas where audio, geometry, phi, 3-6-9, and acid-melt visual
            fields become one navigable performance space.
          </p>
        </div>
      </section>

      <aside className="control-panel glass" aria-label="InfinityLens369 controls">
        <label
          className="dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={(event) => {
              const file = event.target.files?.item(0);
              if (file) ingestFile(file);
            }}
          />
          <span className="drop-icon">∞</span>
          <strong>Drop MP3/WAV/OGG/M4A</strong>
          <small>{audioName}</small>
        </label>

        <audio ref={audioRef} src={audioUrl ?? undefined} onEnded={() => setIsPlaying(false)} />

        <div className="button-row">
          <button type="button" onClick={connectAndPlay} disabled={!audioUrl || isPlaying}>
            Play portal
          </button>
          <button type="button" onClick={pause} disabled={!isPlaying}>
            Pause
          </button>
        </div>

        <div className="metrics" aria-label="Audio analysis metrics">
          <Metric label="Bass" value={features.bass} />
          <Metric label="Mids" value={features.mid} />
          <Metric label="Highs" value={features.high} />
          <Metric label="Energy" value={features.rms} />
        </div>

        <label className="field-row">
          <span>Mode</span>
          <select
            value={settings.mode}
            onChange={(event) => setSettings((current) => ({ ...current, mode: event.target.value as VisualSettings['mode'] }))}
          >
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
          <span>{settings.mode === 'acid-melt' ? 'Melt pressure' : 'Zoom pressure'}</span>
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
  return (
    <div className="equation-overlay" aria-hidden="true">
      <span>{mode === 'acid-melt' ? 'fbm(p) + swirl + audio' : 'z ↦ z² + c'}</span>
      <span>φ ≈ 1.6180339887</span>
      <span>3 · 6 · 9 pulse</span>
      <span>bass {formatMetric(features.bass)} / zoom {camera.zoom.toExponential(2)}</span>
    </div>
  );
}
