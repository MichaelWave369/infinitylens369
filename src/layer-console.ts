const LAYER_CONSOLE_VERSION = 'v1.10.0';

type LayerKey = 'phi' | 'grid' | 'equations';
type LayerSceneKey = 'clean' | 'geometry' | 'symbolic' | 'grid' | 'performer';

type LayerScene = {
  key: LayerSceneKey;
  name: string;
  hint: string;
  layers: Record<LayerKey, boolean>;
};

const STORAGE_KEY = 'infinitylens369:layer-console:v1';
const LAYER_SCENES: LayerScene[] = [
  {
    key: 'clean',
    name: 'Clean Lens',
    hint: 'stage-only view for pure color and motion',
    layers: { phi: false, grid: false, equations: false },
  },
  {
    key: 'geometry',
    name: 'Geometry Stack',
    hint: 'phi, 3-6-9 grid, and equations together',
    layers: { phi: true, grid: true, equations: true },
  },
  {
    key: 'symbolic',
    name: 'Symbolic Field',
    hint: 'phi spiral plus equations without the grid',
    layers: { phi: true, grid: false, equations: true },
  },
  {
    key: 'grid',
    name: 'Grid Beam',
    hint: '3-6-9 grid discipline over the live scene',
    layers: { phi: false, grid: true, equations: false },
  },
  {
    key: 'performer',
    name: 'Performer Stack',
    hint: 'readable geometry with minimal text clutter',
    layers: { phi: true, grid: true, equations: false },
  },
];

const layerMatchers: Record<LayerKey, RegExp[]> = {
  phi: [/phi/i, /spiral/i],
  grid: [/3\s*[-–]?\s*6\s*[-–]?\s*9/i, /369/i, /grid/i],
  equations: [/equation/i, /signal/i],
};

const readStoredScene = (): LayerSceneKey => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return LAYER_SCENES.some((scene) => scene.key === stored) ? (stored as LayerSceneKey) : 'geometry';
  } catch {
    return 'geometry';
  }
};

const writeStoredScene = (sceneKey: LayerSceneKey) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, sceneKey);
  } catch {
    // Local storage is convenience only. Never block the visualizer.
  }
};

const textFor = (element: Element | null) => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

const getCheckboxLabel = (input: HTMLInputElement) => {
  const label = input.closest('label') ?? document.querySelector(`label[for="${input.id}"]`);
  const field = input.closest('.field, .toggle, .control-group, .studio-card, .panel-card, section, div');
  return `${textFor(label)} ${textFor(field)}`;
};

const findLayerCheckbox = (layer: LayerKey): HTMLInputElement | undefined => {
  const checkboxes = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));

  return checkboxes.find((checkbox) => {
    const label = getCheckboxLabel(checkbox);
    return layerMatchers[layer].some((matcher) => matcher.test(label));
  });
};

const setLayer = (layer: LayerKey, enabled: boolean) => {
  const checkbox = findLayerCheckbox(layer);

  if (!checkbox) return false;
  if (checkbox.checked !== enabled) checkbox.click();
  return true;
};

const applyLayerScene = (scene: LayerScene, status?: HTMLElement) => {
  const results = Object.entries(scene.layers).map(([layer, enabled]) => ({
    layer: layer as LayerKey,
    found: setLayer(layer as LayerKey, enabled),
  }));

  writeStoredScene(scene.key);

  document.querySelectorAll<HTMLButtonElement>('[data-layer-scene]').forEach((button) => {
    button.classList.toggle('active', button.dataset.layerScene === scene.key);
  });

  if (status) {
    const missing = results.filter((result) => !result.found).map((result) => result.layer);
    status.textContent = missing.length
      ? `${scene.name} queued. Missing direct controls: ${missing.join(', ')}.`
      : `${scene.name} applied. ${scene.hint}.`;
  }
};

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Performance Console/i.test(element.textContent ?? ''));

const buildLayerConsole = () => {
  if (document.querySelector('.layer-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card layer-console';
  card.innerHTML = `
    <div class="eyebrow">Layer Console ${LAYER_CONSOLE_VERSION}</div>
    <h2>Live layer scenes</h2>
    <p class="studio-copy">One-click overlay stacks for clean stage views, geometry, 3-6-9 grid discipline, and symbolic field work.</p>
    <div class="layer-scene-grid">
      ${LAYER_SCENES.map(
        (scene) => `
          <button type="button" class="layer-scene-button" data-layer-scene="${scene.key}">
            <strong>${scene.name}</strong>
            <span>${scene.hint}</span>
          </button>
        `,
      ).join('')}
    </div>
    <p class="layer-console-status">Ready for live layer control. Press L to cycle scenes.</p>
  `;

  const status = card.querySelector<HTMLElement>('.layer-console-status') ?? undefined;
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelectorAll<HTMLButtonElement>('[data-layer-scene]').forEach((button) => {
    button.addEventListener('click', () => {
      const scene = LAYER_SCENES.find((candidate) => candidate.key === button.dataset.layerScene);
      if (scene) applyLayerScene(scene, status);
    });
  });

  const initialScene = LAYER_SCENES.find((scene) => scene.key === readStoredScene()) ?? LAYER_SCENES[1];
  card.querySelectorAll<HTMLButtonElement>('[data-layer-scene]').forEach((button) => {
    button.classList.toggle('active', button.dataset.layerScene === initialScene.key);
  });
};

const cycleLayerScene = () => {
  const current = readStoredScene();
  const index = Math.max(0, LAYER_SCENES.findIndex((scene) => scene.key === current));
  const next = LAYER_SCENES[(index + 1) % LAYER_SCENES.length];
  const status = document.querySelector<HTMLElement>('.layer-console-status') ?? undefined;
  applyLayerScene(next, status);
};

const bootstrap = () => {
  buildLayerConsole();

  window.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    const isTyping = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

    if (isTyping) return;
    if (event.key.toLowerCase() === 'l') {
      event.preventDefault();
      cycleLayerScene();
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};