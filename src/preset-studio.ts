import type { FractalMode, PaletteName } from './types';

const PRESET_KEY = 'infinitylens369:preset-studio:v1';
const APP_VERSION = 'v1.6.1';

type AudioEngineSnapshot = {
  audioDrive: number;
  audioResponse: number;
  audioBassDrive: number;
  audioMidDrive: number;
  audioHighDrive: number;
  audioBeatDrive: number;
};

type VisualSnapshot = {
  mode: FractalMode;
  palette: PaletteName;
  zoomSpeed: number;
  glow: number;
  audioReactive: boolean;
  showPhi: boolean;
  showGrid369: boolean;
  showEquations: boolean;
};

type TransitionSnapshot = {
  style: string;
  durationMs: number;
};

type SavedPreset = {
  id: string;
  label: string;
  createdAt: string;
  appVersion: string;
  sourceTrip: string;
  visual: VisualSnapshot;
  audioEngine: AudioEngineSnapshot;
  transition: TransitionSnapshot;
};

const numberFrom = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const controlGroups = () => Array.from(document.querySelectorAll<HTMLElement>('.control-group'));

const findGroup = (heading: string) => controlGroups().find((group) => group.querySelector('h2')?.textContent?.trim() === heading) ?? null;

const dispatchControlEvents = (element: HTMLInputElement | HTMLSelectElement) => {
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

const setValue = (element: HTMLInputElement | HTMLSelectElement | undefined, value: string | number | boolean) => {
  if (!element) return;

  if (element instanceof HTMLInputElement && element.type === 'checkbox') {
    element.checked = Boolean(value);
  } else {
    element.value = String(value);
  }

  dispatchControlEvents(element);
};

const readPresets = (): SavedPreset[] => {
  try {
    const raw = window.localStorage.getItem(PRESET_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is SavedPreset => {
      return Boolean(
        item
        && typeof item === 'object'
        && 'id' in item
        && 'label' in item
        && 'visual' in item
        && 'audioEngine' in item,
      );
    });
  } catch {
    return [];
  }
};

const writePresets = (presets: SavedPreset[]) => {
  try {
    window.localStorage.setItem(PRESET_KEY, JSON.stringify(presets.slice(0, 24), null, 2));
  } catch {
    announce('Preset Studio could not write to local storage in this browser.');
  }
};

const capturePreset = (label: string): SavedPreset | null => {
  const visualGroup = findGroup('Visual mode');
  const transitionGroup = findGroup('Transition Engine');
  const audioGroup = findGroup('Audio Engine v2');
  const controlsGroup = findGroup('Visual Controls');

  const visualSelects = Array.from(visualGroup?.querySelectorAll<HTMLSelectElement>('select') ?? []);
  const transitionSelects = Array.from(transitionGroup?.querySelectorAll<HTMLSelectElement>('select') ?? []);
  const transitionRanges = Array.from(transitionGroup?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);
  const audioRanges = Array.from(audioGroup?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);
  const visualRanges = Array.from(controlsGroup?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);
  const visualChecks = Array.from(controlsGroup?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? []);

  if (visualSelects.length < 2 || audioRanges.length < 6 || visualRanges.length < 2 || visualChecks.length < 4) return null;

  const sourceTrip = document.querySelector('.stage-badge span')?.textContent?.trim() || 'Custom scene';

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: label.trim() || sourceTrip,
    createdAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    sourceTrip,
    visual: {
      mode: visualSelects[0].value as FractalMode,
      palette: visualSelects[1].value as PaletteName,
      zoomSpeed: numberFrom(visualRanges[0].value, 0.22),
      glow: numberFrom(visualRanges[1].value, 0.72),
      audioReactive: visualChecks[0].checked,
      showPhi: visualChecks[1].checked,
      showGrid369: visualChecks[2].checked,
      showEquations: visualChecks[3].checked,
    },
    audioEngine: {
      audioDrive: numberFrom(audioRanges[0].value, 0.16),
      audioResponse: numberFrom(audioRanges[1].value, 0.16),
      audioBassDrive: numberFrom(audioRanges[2].value, 0.38),
      audioMidDrive: numberFrom(audioRanges[3].value, 0.58),
      audioHighDrive: numberFrom(audioRanges[4].value, 0.46),
      audioBeatDrive: numberFrom(audioRanges[5].value, 0.24),
    },
    transition: {
      style: transitionSelects[0]?.value ?? 'fade',
      durationMs: numberFrom(transitionRanges[0]?.value, 1200),
    },
  };
};

const applyPreset = (preset: SavedPreset) => {
  const visualGroup = findGroup('Visual mode');
  const transitionGroup = findGroup('Transition Engine');
  const audioGroup = findGroup('Audio Engine v2');
  const controlsGroup = findGroup('Visual Controls');

  const visualSelects = Array.from(visualGroup?.querySelectorAll<HTMLSelectElement>('select') ?? []);
  const transitionSelects = Array.from(transitionGroup?.querySelectorAll<HTMLSelectElement>('select') ?? []);
  const transitionRanges = Array.from(transitionGroup?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);

  setValue(transitionSelects[0], preset.transition.style);
  setValue(transitionRanges[0], preset.transition.durationMs);
  setValue(visualSelects[0], preset.visual.mode);
  setValue(visualSelects[1], preset.visual.palette);

  window.setTimeout(() => {
    const audioRanges = Array.from(audioGroup?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);
    const visualRanges = Array.from(controlsGroup?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);
    const visualChecks = Array.from(controlsGroup?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? []);

    setValue(audioRanges[0], preset.audioEngine.audioDrive);
    setValue(audioRanges[1], preset.audioEngine.audioResponse);
    setValue(audioRanges[2], preset.audioEngine.audioBassDrive);
    setValue(audioRanges[3], preset.audioEngine.audioMidDrive);
    setValue(audioRanges[4], preset.audioEngine.audioHighDrive);
    setValue(audioRanges[5], preset.audioEngine.audioBeatDrive);

    setValue(visualRanges[0], preset.visual.zoomSpeed);
    setValue(visualRanges[1], preset.visual.glow);
    setValue(visualChecks[0], preset.visual.audioReactive);
    setValue(visualChecks[1], preset.visual.showPhi);
    setValue(visualChecks[2], preset.visual.showGrid369);
    setValue(visualChecks[3], preset.visual.showEquations);
  }, 320);

  announce(`Loaded preset: ${preset.label}`);
};

const downloadJson = (filename: string, payload: unknown) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = url;
  anchor.click();
  URL.revokeObjectURL(url);
};

const announce = (message: string) => {
  const notice = document.querySelector<HTMLElement>('.stage-notice');
  if (notice) notice.textContent = message;
};

const refreshBadgeVersion = () => {
  const badge = document.querySelector<HTMLElement>('.stage-badge strong');
  if (badge) badge.textContent = badge.textContent.replace(/v\d+\.\d+\.\d+/, APP_VERSION);
};

const renderLibrary = (root: HTMLElement) => {
  const list = root.querySelector<HTMLElement>('[data-preset-list]');
  if (!list) return;

  const presets = readPresets();
  list.innerHTML = '';

  if (presets.length === 0) {
    list.innerHTML = '<p class="preset-empty">No saved presets yet. Tune a scene and save it.</p>';
    return;
  }

  presets.slice(0, 8).forEach((preset) => {
    const row = document.createElement('div');
    row.className = 'preset-row';

    const loadButton = document.createElement('button');
    loadButton.type = 'button';
    loadButton.className = 'preset-load';
    loadButton.innerHTML = `<strong>${preset.label}</strong><span>${preset.visual.mode} · ${preset.visual.palette}</span>`;
    loadButton.addEventListener('click', () => applyPreset(preset));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'preset-delete';
    deleteButton.textContent = '×';
    deleteButton.title = `Delete ${preset.label}`;
    deleteButton.addEventListener('click', () => {
      writePresets(readPresets().filter((item) => item.id !== preset.id));
      renderLibrary(root);
      announce(`Deleted preset: ${preset.label}`);
    });

    row.append(loadButton, deleteButton);
    list.append(row);
  });
};

const importPresetPack = (file: File, root: HTMLElement) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result)) as unknown;
      const incoming = Array.isArray(parsed)
        ? parsed
        : typeof parsed === 'object' && parsed !== null && 'presets' in parsed && Array.isArray((parsed as { presets?: unknown }).presets)
          ? (parsed as { presets: unknown[] }).presets
          : [];

      const cleaned = incoming.filter((item): item is SavedPreset => {
        return Boolean(item && typeof item === 'object' && 'label' in item && 'visual' in item && 'audioEngine' in item);
      });

      if (cleaned.length === 0) {
        announce('Preset import found no valid InfinityLens369 presets.');
        return;
      }

      writePresets([...cleaned, ...readPresets()]);
      renderLibrary(root);
      announce(`Imported ${cleaned.length} preset${cleaned.length === 1 ? '' : 's'}.`);
    } catch {
      announce('Preset import failed. Check that the file is valid JSON.');
    }
  };
  reader.readAsText(file);
};

const createStudio = () => {
  const panel = document.querySelector<HTMLElement>('.control-panel');
  if (!panel || panel.querySelector('[data-preset-studio]')) return;

  const studio = document.createElement('section');
  studio.className = 'control-group preset-studio';
  studio.dataset.presetStudio = 'true';
  studio.innerHTML = `
    <h2>Preset Studio</h2>
    <p class="preset-studio-copy">Save, reload, export, and import local trip recipes. Audio stays local.</p>
    <input class="preset-name-input" type="text" placeholder="Preset name" aria-label="Preset name" />
    <div class="button-row preset-studio-actions">
      <button type="button" data-save-preset>Save current</button>
      <button type="button" data-load-latest>Load latest</button>
      <button type="button" data-export-presets>Export pack</button>
      <button type="button" data-import-presets>Import pack</button>
    </div>
    <input data-import-preset-file type="file" accept="application/json,.json" hidden />
    <div class="preset-library" data-preset-list></div>
  `;

  const receipts = findGroup('Receipts');
  panel.insertBefore(studio, receipts ?? panel.querySelector('footer'));

  const nameInput = studio.querySelector<HTMLInputElement>('.preset-name-input');
  const importInput = studio.querySelector<HTMLInputElement>('[data-import-preset-file]');

  studio.querySelector('[data-save-preset]')?.addEventListener('click', () => {
    const fallback = document.querySelector('.stage-badge span')?.textContent?.trim() || 'Custom trip';
    const preset = capturePreset(nameInput?.value || fallback);
    if (!preset) {
      announce('Preset Studio could not read the current controls yet.');
      return;
    }

    writePresets([preset, ...readPresets()]);
    if (nameInput) nameInput.value = '';
    renderLibrary(studio);
    announce(`Saved preset: ${preset.label}`);
  });

  studio.querySelector('[data-load-latest]')?.addEventListener('click', () => {
    const [latest] = readPresets();
    if (!latest) {
      announce('No saved preset yet.');
      return;
    }
    applyPreset(latest);
  });

  studio.querySelector('[data-export-presets]')?.addEventListener('click', () => {
    const presets = readPresets();
    downloadJson(`infinitylens369-preset-pack-${Date.now()}.json`, {
      appVersion: APP_VERSION,
      exportedAt: new Date().toISOString(),
      claimBoundary: 'Creative visual presets only. Audio remains local and is not exported.',
      presets,
    });
    announce(`Exported ${presets.length} preset${presets.length === 1 ? '' : 's'}.`);
  });

  studio.querySelector('[data-import-presets]')?.addEventListener('click', () => importInput?.click());
  importInput?.addEventListener('change', () => {
    const file = importInput.files?.item(0);
    if (file) importPresetPack(file, studio);
    importInput.value = '';
  });

  renderLibrary(studio);
};

const guardedBootstrapPresetStudio = () => {
  try {
    refreshBadgeVersion();
    createStudio();
  } catch (error) {
    console.warn('InfinityLens369 Preset Studio bootstrap skipped safely.', error);
  }
};

let bootstrapTimer: number | undefined;

const scheduleBootstrap = () => {
  if (bootstrapTimer !== undefined) return;

  bootstrapTimer = window.setTimeout(() => {
    bootstrapTimer = undefined;
    guardedBootstrapPresetStudio();
  }, 180);
};

const startPresetStudio = () => {
  scheduleBootstrap();

  const root = document.getElementById('root');
  if (root) {
    const observer = new MutationObserver(() => scheduleBootstrap());
    observer.observe(root, { childList: true, subtree: true });
  }

  window.setInterval(() => {
    try {
      refreshBadgeVersion();
    } catch {
      // Badge refresh should never affect the core visualizer.
    }
  }, 5000);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startPresetStudio, { once: true });
} else {
  startPresetStudio();
}
