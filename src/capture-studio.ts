type CaptureRecord = {
  id: string;
  createdAt: string;
  label: string;
  width: number;
  height: number;
  dataUrl: string;
};

const CAPTURE_STUDIO_VERSION = 'v1.7.0';
const STORAGE_KEY = 'infinitylens369:capture-studio:v1';
const MAX_CAPTURES = 6;

let captures: CaptureRecord[] = [];
let mounted = false;

const readCaptures = (): CaptureRecord[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CaptureRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => typeof item?.id === 'string' && typeof item?.dataUrl === 'string')
      .slice(0, MAX_CAPTURES);
  } catch {
    return [];
  }
};

const writeCaptures = (next: CaptureRecord[]) => {
  captures = next.slice(0, MAX_CAPTURES);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captures));
    return;
  } catch {
    captures = captures.slice(0, 3);
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captures));
  } catch {
    // Keep the in-memory session gallery even if storage quota is unavailable.
  }
};

const getSceneLabel = () => {
  const badgeText = document.querySelector('.stage-badge')?.textContent?.replace(/\s+/g, ' ').trim();
  if (badgeText) return badgeText.slice(0, 96);

  const activeTrip = document.querySelector('[data-active-trip]')?.textContent?.replace(/\s+/g, ' ').trim();
  if (activeTrip) return activeTrip.slice(0, 96);

  return 'InfinityLens369 scene';
};

const downloadText = (content: string, filename: string, type = 'application/json') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

const makeTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const renderGallery = (container: HTMLElement) => {
  const gallery = container.querySelector<HTMLElement>('[data-capture-gallery]');
  const count = container.querySelector<HTMLElement>('[data-capture-count]');
  const latestButton = container.querySelector<HTMLButtonElement>('[data-download-latest]');
  const manifestButton = container.querySelector<HTMLButtonElement>('[data-export-manifest]');
  const clearButton = container.querySelector<HTMLButtonElement>('[data-clear-captures]');

  if (!gallery || !count || !latestButton || !manifestButton || !clearButton) return;

  count.textContent = `${captures.length}/${MAX_CAPTURES} saved this browser`;
  latestButton.disabled = captures.length === 0;
  manifestButton.disabled = captures.length === 0;
  clearButton.disabled = captures.length === 0;
  gallery.innerHTML = '';

  if (captures.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'capture-empty';
    empty.textContent = 'Capture a frame to build a local gallery.';
    gallery.appendChild(empty);
    return;
  }

  captures.forEach((capture) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'capture-thumb';
    item.title = `Download ${capture.label}`;

    const img = document.createElement('img');
    img.src = capture.dataUrl;
    img.alt = capture.label;

    const meta = document.createElement('span');
    meta.textContent = new Date(capture.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    item.append(img, meta);
    item.addEventListener('click', () => {
      downloadDataUrl(capture.dataUrl, `infinitylens369_${capture.id}.png`);
    });
    gallery.appendChild(item);
  });
};

const setStatus = (container: HTMLElement, message: string) => {
  const status = container.querySelector<HTMLElement>('[data-capture-status]');
  if (status) status.textContent = message;
};

const captureFrame = async (container: HTMLElement) => {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas.fractal-canvas, canvas');
  if (!canvas) {
    setStatus(container, 'No visual canvas found yet. Let the scene render, then try again.');
    return;
  }

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const createdAt = new Date().toISOString();
    const id = makeTimestamp();
    const record: CaptureRecord = {
      id,
      createdAt,
      label: getSceneLabel(),
      width: canvas.width,
      height: canvas.height,
      dataUrl,
    };

    writeCaptures([record, ...captures]);
    renderGallery(container);
    setStatus(container, 'Frame captured locally. Click a thumbnail to download it.');
  } catch (error) {
    console.warn('InfinityLens369 Capture Studio could not capture the canvas.', error);
    setStatus(container, 'Capture failed in this browser/GPU path. Try after the scene is fully visible.');
  }
};

const exportManifest = () => {
  const manifest = {
    app: 'InfinityLens369',
    captureStudioVersion: CAPTURE_STUDIO_VERSION,
    exportedAt: new Date().toISOString(),
    note: 'This manifest contains capture metadata only. It does not include audio files or image bytes.',
    captures: captures.map(({ dataUrl: _dataUrl, ...metadata }) => metadata),
  };

  downloadText(
    `${JSON.stringify(manifest, null, 2)}\n`,
    `infinitylens369_capture_manifest_${makeTimestamp()}.json`,
  );
};

const createPanel = () => {
  const section = document.createElement('section');
  section.className = 'capture-studio control-group';
  section.setAttribute('aria-label', 'Capture Studio');

  section.innerHTML = `
    <div class="capture-studio__header">
      <div>
        <p class="eyebrow">Capture Studio ${CAPTURE_STUDIO_VERSION}</p>
        <h2>Frame gallery</h2>
      </div>
      <span data-capture-count>0/${MAX_CAPTURES} saved this browser</span>
    </div>
    <p class="capture-studio__hint">Capture local PNG frames from the live canvas. Audio stays local and is never saved.</p>
    <div class="capture-studio__actions">
      <button type="button" data-capture-frame>Capture frame</button>
      <button type="button" data-download-latest>Download latest</button>
      <button type="button" data-export-manifest>Export manifest</button>
      <button type="button" data-clear-captures>Clear gallery</button>
    </div>
    <div class="capture-gallery" data-capture-gallery></div>
    <p class="capture-status" data-capture-status>Ready to capture the current scene.</p>
  `;

  section.querySelector<HTMLButtonElement>('[data-capture-frame]')?.addEventListener('click', () => {
    void captureFrame(section);
  });

  section.querySelector<HTMLButtonElement>('[data-download-latest]')?.addEventListener('click', () => {
    const latest = captures[0];
    if (!latest) return;
    downloadDataUrl(latest.dataUrl, `infinitylens369_${latest.id}.png`);
    setStatus(section, 'Latest capture downloaded.');
  });

  section.querySelector<HTMLButtonElement>('[data-export-manifest]')?.addEventListener('click', () => {
    exportManifest();
    setStatus(section, 'Capture manifest exported as JSON metadata.');
  });

  section.querySelector<HTMLButtonElement>('[data-clear-captures]')?.addEventListener('click', () => {
    writeCaptures([]);
    renderGallery(section);
    setStatus(section, 'Local capture gallery cleared.');
  });

  captures = readCaptures();
  renderGallery(section);
  return section;
};

const mountCaptureStudio = () => {
  if (mounted) return;

  const panel = document.querySelector<HTMLElement>('.control-panel, aside');
  if (!panel) return;

  if (panel.querySelector('.capture-studio')) {
    mounted = true;
    return;
  }

  const presetStudio = panel.querySelector('.preset-studio');
  const capturePanel = createPanel();

  if (presetStudio?.nextSibling) {
    panel.insertBefore(capturePanel, presetStudio.nextSibling);
  } else {
    panel.appendChild(capturePanel);
  }

  mounted = true;
};

const bootCaptureStudio = () => {
  let attempts = 0;
  const tryMount = () => {
    attempts += 1;
    mountCaptureStudio();
    if (!mounted && attempts < 30) window.setTimeout(tryMount, 250);
  };

  tryMount();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCaptureStudio, { once: true });
} else {
  window.setTimeout(bootCaptureStudio, 250);
}
