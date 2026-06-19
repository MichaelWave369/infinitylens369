const GALLERY_CONSOLE_VERSION = 'v1.12.0';

type GallerySceneKey = 'liquid' | 'machine' | 'deep' | 'performance';

type GalleryScene = {
  key: GallerySceneKey;
  name: string;
  hint: string;
  buttonPatterns: RegExp[];
};

const GALLERY_SCENES: GalleryScene[] = [
  {
    key: 'liquid',
    name: 'Liquid Light',
    hint: 'soft aurora / dream pool starter lane',
    buttonPatterns: [/Aurora Veil/i, /Dream Pool/i],
  },
  {
    key: 'machine',
    name: 'Machine Cathedral',
    hint: 'cyber temple / vector shrine starter lane',
    buttonPatterns: [/Circuit Cathedral/i, /Vector Shrine/i],
  },
  {
    key: 'deep',
    name: 'Deep Portal',
    hint: 'black hole / fractal depth starter lane',
    buttonPatterns: [/Black Hole/i, /Deep Fractal/i, /Random trip/i],
  },
  {
    key: 'performance',
    name: 'Performance Ready',
    hint: 'safe, cinematic, then fullscreen-ready flow',
    buttonPatterns: [/Safe mode/i, /^Safe$/i],
  },
];

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Launch Console/i.test(element.textContent ?? ''));

const normalizedText = (element: HTMLElement) => (element.textContent ?? '').replace(/\s+/g, ' ').trim();

const findButton = (patterns: RegExp[]) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find((button) =>
    patterns.some((pattern) => pattern.test(normalizedText(button))),
  );

const clickButton = (patterns: RegExp[]) => {
  const button = findButton(patterns);
  if (!button || button.disabled) return false;
  button.click();
  return true;
};

const setStatus = (message: string) => {
  const status = document.querySelector<HTMLElement>('.gallery-console-status');
  if (status) status.textContent = message;
};

const launchScene = (scene: GalleryScene) => {
  const launched = clickButton(scene.buttonPatterns);

  if (scene.key === 'performance') {
    window.setTimeout(() => clickButton([/Cinematic/i]), 500);
    setStatus('Performance Ready launched: Safe mode requested, then Cinematic is cued for the stage. Use Fullscreen when ready.');
    return;
  }

  if (launched) {
    setStatus(`${scene.name} launched. Drop a song, press Play portal, then use Next/Random to explore nearby scenes.`);
  } else {
    setStatus(`${scene.name} requested, but its live preset button was not found yet. Try Random Trip or scroll to the preset pack.`);
  }
};

const copyGalleryNote = async () => {
  const note = `InfinityLens369 ${GALLERY_CONSOLE_VERSION}: drop a song, open a portal, then try Gallery Console scenes like Liquid Light, Machine Cathedral, Deep Portal, and Performance Ready.`;

  try {
    await navigator.clipboard.writeText(`${note}\n${window.location.href}`);
    setStatus('Gallery note copied with the public link.');
  } catch {
    window.prompt('Copy this InfinityLens369 gallery note:', `${note}\n${window.location.href}`);
    setStatus('Clipboard permission was blocked, so the gallery note opened in a copy prompt.');
  }
};

const openRoadmap = () => {
  setStatus('Roadmap: v2.0 runway is live — presets, capture, recording, performance, layers, launch help, and gallery discovery are now staged.');
};

const buildGalleryConsole = () => {
  if (document.querySelector('.gallery-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card gallery-console';
  card.innerHTML = `
    <div class="eyebrow">Gallery Console ${GALLERY_CONSOLE_VERSION}</div>
    <h2>Scene gallery</h2>
    <p class="studio-copy">Curated one-click entry points for new users, demos, and public sharing. These scenes reuse existing live controls and keep audio local.</p>
    <div class="gallery-scene-grid">
      ${GALLERY_SCENES.map(
        (scene) => `
          <button type="button" class="gallery-scene-button" data-gallery-scene="${scene.key}">
            <strong>${scene.name}</strong>
            <span>${scene.hint}</span>
          </button>
        `,
      ).join('')}
    </div>
    <div class="gallery-console-actions">
      <button type="button" data-gallery-copy>Copy gallery note</button>
      <button type="button" data-gallery-roadmap>v2 runway</button>
    </div>
    <p class="gallery-console-status">Ready to guide visitors through the best starting scenes.</p>
  `;

  const launchConsole = panel.querySelector<HTMLElement>('.launch-console');
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (launchConsole?.parentElement === panel && launchConsole.nextSibling) {
    panel.insertBefore(card, launchConsole.nextSibling);
  } else if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelectorAll<HTMLButtonElement>('[data-gallery-scene]').forEach((button) => {
    button.addEventListener('click', () => {
      const scene = GALLERY_SCENES.find((candidate) => candidate.key === button.dataset.galleryScene);
      if (scene) launchScene(scene);
    });
  });

  card.querySelector<HTMLButtonElement>('[data-gallery-copy]')?.addEventListener('click', () => {
    void copyGalleryNote();
  });

  card.querySelector<HTMLButtonElement>('[data-gallery-roadmap]')?.addEventListener('click', openRoadmap);
};

const bootstrap = () => {
  buildGalleryConsole();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
