type RecordingClip = {
  id: string;
  createdAt: string;
  label: string;
  width: number;
  height: number;
  durationMs: number;
  mimeType: string;
  sizeBytes: number;
  objectUrl: string;
};

type RecorderRuntime = {
  recorder?: MediaRecorder;
  stream?: MediaStream;
  chunks: Blob[];
  startedAt?: number;
  latest?: RecordingClip;
  durationTimer?: number;
  autoStopTimer?: number;
};

const RECORDING_STUDIO_VERSION = 'v1.8.0';
const TARGET_FPS = 30;
const MAX_RECORDING_MS = 30_000;
const runtime: RecorderRuntime = { chunks: [] };
let mounted = false;

const makeTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const getSceneLabel = () => {
  const badgeText = document.querySelector('.stage-badge')?.textContent?.replace(/\s+/g, ' ').trim();
  if (badgeText) return badgeText.slice(0, 96);

  const activeTrip = document.querySelector('[data-active-trip]')?.textContent?.replace(/\s+/g, ' ').trim();
  if (activeTrip) return activeTrip.slice(0, 96);

  return 'InfinityLens369 recording';
};

const getCanvas = () => document.querySelector<HTMLCanvasElement>('canvas.fractal-canvas, canvas');

const pickMimeType = () => {
  if (typeof MediaRecorder === 'undefined') return '';

  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];

  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? '';
};

const setStatus = (container: HTMLElement, message: string) => {
  const status = container.querySelector<HTMLElement>('[data-recording-status]');
  if (status) status.textContent = message;
};

const setDuration = (container: HTMLElement, elapsedMs = 0) => {
  const duration = container.querySelector<HTMLElement>('[data-recording-duration]');
  if (!duration) return;
  const seconds = Math.max(0, Math.floor(elapsedMs / 1000));
  duration.textContent = `${seconds}s / ${Math.floor(MAX_RECORDING_MS / 1000)}s max`;
};

const setRecordingUi = (container: HTMLElement, isRecording: boolean) => {
  container.classList.toggle('recording-studio--recording', isRecording);
  const start = container.querySelector<HTMLButtonElement>('[data-start-recording]');
  const stop = container.querySelector<HTMLButtonElement>('[data-stop-recording]');
  const download = container.querySelector<HTMLButtonElement>('[data-download-recording]');
  const manifest = container.querySelector<HTMLButtonElement>('[data-export-recording-manifest]');

  if (start) start.disabled = isRecording;
  if (stop) stop.disabled = !isRecording;
  if (download) download.disabled = isRecording || !runtime.latest;
  if (manifest) manifest.disabled = isRecording || !runtime.latest;
};

const updateLatest = (container: HTMLElement) => {
  const meta = container.querySelector<HTMLElement>('[data-recording-latest]');
  const download = container.querySelector<HTMLButtonElement>('[data-download-recording]');
  const manifest = container.querySelector<HTMLButtonElement>('[data-export-recording-manifest]');

  if (!meta || !download || !manifest) return;

  if (!runtime.latest) {
    meta.textContent = 'No clip recorded yet.';
    download.disabled = true;
    manifest.disabled = true;
    return;
  }

  const sizeMb = runtime.latest.sizeBytes / 1024 / 1024;
  const seconds = Math.max(1, Math.round(runtime.latest.durationMs / 1000));
  meta.textContent = `${seconds}s WebM • ${sizeMb.toFixed(1)} MB • ${runtime.latest.width}×${runtime.latest.height}`;
  download.disabled = false;
  manifest.disabled = false;
};

const clearRuntimeTimers = () => {
  if (runtime.durationTimer) window.clearInterval(runtime.durationTimer);
  if (runtime.autoStopTimer) window.clearTimeout(runtime.autoStopTimer);
  runtime.durationTimer = undefined;
  runtime.autoStopTimer = undefined;
};

const stopStreamTracks = () => {
  runtime.stream?.getTracks().forEach((track) => track.stop());
  runtime.stream = undefined;
};

const startRecording = (container: HTMLElement) => {
  if (runtime.recorder?.state === 'recording') return;

  const canvas = getCanvas();
  if (!canvas) {
    setStatus(container, 'No visual canvas found yet. Let the scene render, then try again.');
    return;
  }

  const captureStream = (canvas as HTMLCanvasElement & { captureStream?: (frameRate?: number) => MediaStream }).captureStream;
  if (!captureStream || typeof MediaRecorder === 'undefined') {
    setStatus(container, 'This browser does not support canvas WebM recording. Try Chrome, Edge, or Firefox.');
    return;
  }

  const mimeType = pickMimeType();
  if (!mimeType) {
    setStatus(container, 'This browser cannot find a supported WebM recording format.');
    return;
  }

  try {
    runtime.chunks = [];
    runtime.stream = captureStream.call(canvas, TARGET_FPS);
    runtime.startedAt = performance.now();
    runtime.recorder = new MediaRecorder(runtime.stream, { mimeType });

    runtime.recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) runtime.chunks.push(event.data);
    });

    runtime.recorder.addEventListener('stop', () => {
      const finishedAt = performance.now();
      const durationMs = Math.max(0, finishedAt - (runtime.startedAt ?? finishedAt));
      const blob = new Blob(runtime.chunks, { type: mimeType });

      if (runtime.latest?.objectUrl) URL.revokeObjectURL(runtime.latest.objectUrl);

      runtime.latest = {
        id: makeTimestamp(),
        createdAt: new Date().toISOString(),
        label: getSceneLabel(),
        width: canvas.width,
        height: canvas.height,
        durationMs,
        mimeType,
        sizeBytes: blob.size,
        objectUrl: URL.createObjectURL(blob),
      };

      runtime.recorder = undefined;
      runtime.chunks = [];
      runtime.startedAt = undefined;
      clearRuntimeTimers();
      stopStreamTracks();
      setDuration(container, durationMs);
      setRecordingUi(container, false);
      updateLatest(container);
      setStatus(container, 'Clip recorded locally. Download it before refreshing the page.');
    });

    runtime.recorder.start(500);
    setRecordingUi(container, true);
    setStatus(container, 'Recording canvas-only WebM. Audio is not embedded.');
    setDuration(container, 0);

    runtime.durationTimer = window.setInterval(() => {
      if (!runtime.startedAt) return;
      setDuration(container, performance.now() - runtime.startedAt);
    }, 250);

    runtime.autoStopTimer = window.setTimeout(() => {
      stopRecording(container, 'Auto-stopped at 30 seconds to keep the clip manageable.');
    }, MAX_RECORDING_MS);
  } catch (error) {
    console.warn('InfinityLens369 Recording Studio could not start.', error);
    clearRuntimeTimers();
    stopStreamTracks();
    runtime.recorder = undefined;
    runtime.chunks = [];
    setRecordingUi(container, false);
    setStatus(container, 'Recording failed in this browser/GPU path. Try a shorter scene or another browser.');
  }
};

const stopRecording = (container: HTMLElement, message = 'Stopping recording...') => {
  const recorder = runtime.recorder;
  if (!recorder || recorder.state === 'inactive') return;

  setStatus(container, message);
  clearRuntimeTimers();

  try {
    recorder.stop();
  } catch (error) {
    console.warn('InfinityLens369 Recording Studio could not stop cleanly.', error);
    runtime.recorder = undefined;
    stopStreamTracks();
    setRecordingUi(container, false);
    setStatus(container, 'Recording stop failed. Start a new clip and try again.');
  }
};

const downloadLatest = () => {
  const latest = runtime.latest;
  if (!latest) return;

  const anchor = document.createElement('a');
  anchor.href = latest.objectUrl;
  anchor.download = `infinitylens369_recording_${latest.id}.webm`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

const exportManifest = () => {
  const latest = runtime.latest;
  if (!latest) return;

  const { objectUrl: _objectUrl, ...metadata } = latest;
  const manifest = {
    app: 'InfinityLens369',
    recordingStudioVersion: RECORDING_STUDIO_VERSION,
    exportedAt: new Date().toISOString(),
    note: 'This manifest contains recording metadata only. It does not include audio files or video bytes.',
    recording: metadata,
  };

  const blob = new Blob([`${JSON.stringify(manifest, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `infinitylens369_recording_manifest_${makeTimestamp()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const createPanel = () => {
  const section = document.createElement('section');
  section.className = 'recording-studio control-group';
  section.setAttribute('aria-label', 'Recording Studio');

  section.innerHTML = `
    <div class="recording-studio__header">
      <div>
        <p class="eyebrow">Recording Studio ${RECORDING_STUDIO_VERSION}</p>
        <h2>WebM clip recorder</h2>
      </div>
      <span data-recording-duration>0s / ${Math.floor(MAX_RECORDING_MS / 1000)}s max</span>
    </div>
    <p class="recording-studio__hint">Record short canvas-only WebM clips from the live portal. Audio stays local and is not embedded.</p>
    <div class="recording-studio__actions">
      <button type="button" data-start-recording>Start clip</button>
      <button type="button" data-stop-recording disabled>Stop</button>
      <button type="button" data-download-recording disabled>Download latest</button>
      <button type="button" data-export-recording-manifest disabled>Export manifest</button>
    </div>
    <p class="recording-latest" data-recording-latest>No clip recorded yet.</p>
    <p class="recording-status" data-recording-status>Ready to record a short visual clip.</p>
  `;

  section.querySelector<HTMLButtonElement>('[data-start-recording]')?.addEventListener('click', () => {
    startRecording(section);
  });

  section.querySelector<HTMLButtonElement>('[data-stop-recording]')?.addEventListener('click', () => {
    stopRecording(section);
  });

  section.querySelector<HTMLButtonElement>('[data-download-recording]')?.addEventListener('click', () => {
    downloadLatest();
    setStatus(section, 'Latest WebM clip downloaded.');
  });

  section.querySelector<HTMLButtonElement>('[data-export-recording-manifest]')?.addEventListener('click', () => {
    exportManifest();
    setStatus(section, 'Recording manifest exported as JSON metadata.');
  });

  setRecordingUi(section, false);
  updateLatest(section);
  return section;
};

const mountRecordingStudio = () => {
  if (mounted) return;

  const panel = document.querySelector<HTMLElement>('.control-panel, aside');
  if (!panel) return;

  if (panel.querySelector('.recording-studio')) {
    mounted = true;
    return;
  }

  const captureStudio = panel.querySelector('.capture-studio');
  const recordingPanel = createPanel();

  if (captureStudio?.nextSibling) {
    panel.insertBefore(recordingPanel, captureStudio.nextSibling);
  } else {
    panel.appendChild(recordingPanel);
  }

  mounted = true;
};

const bootRecordingStudio = () => {
  let attempts = 0;
  const tryMount = () => {
    attempts += 1;
    mountRecordingStudio();
    if (!mounted && attempts < 30) window.setTimeout(tryMount, 250);
  };

  tryMount();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootRecordingStudio, { once: true });
} else {
  window.setTimeout(bootRecordingStudio, 250);
}

export {};
