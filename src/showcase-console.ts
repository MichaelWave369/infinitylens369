const SHOWCASE_CONSOLE_VERSION = 'v1.16.0';

type ShowcaseMode = 'safe-showcase' | 'gallery-tour' | 'performance-showcase' | 'exit-showcase';

type ShowcaseScene = {
  id: ShowcaseMode;
  title: string;
  detail: string;
  status: string;
};

const SHOWCASE_SCENES: ShowcaseScene[] = [
  {
    id: 'safe-showcase',
    title: 'Safe showcase',
    detail: 'Starts a calmer public demo path with Safe and Slow Flow requests when available.',
    status: 'calm',
  },
  {
    id: 'gallery-tour',
    title: 'Gallery tour',
    detail: 'Requests Auto Trip, Next, and Random controls for a hands-off public scene tour.',
    status: 'guided',
  },
  {
    id: 'performance-showcase',
    title: 'Performance showcase',
    detail: 'Requests cinematic/fullscreen staging and live movement controls for projection.',
    status: 'stage',
  },
  {
    id: 'exit-showcase',
    title: 'Exit showcase',
    detail: 'Clears showcase styling and exits browser fullscreen when the browser allows it.',
    status: 'reset',
  },
];

const SHOWCASE_CLASSES = ['infinity-showcase-active', 'infinity-showcase-safe', 'infinity-showcase-gallery', 'infinity-showcase-performance'];

let activeShowcaseMode: ShowcaseMode = 'exit-showcase';

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Accessibility Console/i.test(element.textContent ?? ''));

const setStatus = (message: string) => {
  const status = document.querySelector<HTMLElement>('.showcase-console-status');
  if (status) status.textContent = message;
};

const setActiveButton = () => {
  document.querySelectorAll<HTMLButtonElement>('[data-showcase-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.showcaseMode === activeShowcaseMode);
  });
};

const findButtonByText = (patterns: RegExp[]) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find((button) => {
    const label = (button.textContent ?? '').replace(/\s+/g, ' ').trim();
    return patterns.some((pattern) => pattern.test(label));
  });

const clickExistingControl = (patterns: RegExp[]) => {
  const button = findButtonByText(patterns);
  if (button) button.click();
  return Boolean(button);
};

const clearShowcaseClasses = () => {
  SHOWCASE_CLASSES.forEach((className) => {
    document.documentElement.classList.remove(className);
  });
};

const setShowcaseClass = (className: string) => {
  clearShowcaseClasses();
  document.documentElement.classList.add('infinity-showcase-active', className);
};

const exitFullscreenIfAllowed = () => {
  if (!document.fullscreenElement) return;

  void document.exitFullscreen().catch(() => {
    setStatus('Showcase styling cleared. Press Esc if the browser did not allow fullscreen exit.');
  });
};

const applyShowcaseMode = (mode: ShowcaseMode) => {
  activeShowcaseMode = mode;
  setActiveButton();

  if (mode === 'exit-showcase') {
    clearShowcaseClasses();
    exitFullscreenIfAllowed();
    setStatus('Showcase styling cleared. Use normal controls or press Esc to leave browser fullscreen.');
    return;
  }

  if (mode === 'safe-showcase') {
    setShowcaseClass('infinity-showcase-safe');
    const safeClicked = clickExistingControl([/safe/i]);
    const slowClicked = clickExistingControl([/slow flow/i, /slow/i]);
    const comfortClicked = clickExistingControl([/reduce motion/i, /soft glow/i]);
    const note = safeClicked || slowClicked || comfortClicked ? ' Existing calm/comfort controls were requested.' : ' Use Safe Mode, Slow Flow, or Accessibility Console for extra comfort.';
    setStatus(`Safe showcase is active.${note}`);
    return;
  }

  if (mode === 'gallery-tour') {
    setShowcaseClass('infinity-showcase-gallery');
    const autoClicked = clickExistingControl([/auto trip/i, /trip/i]);
    const nextClicked = clickExistingControl([/^next$/i, /next/i]);
    const randomClicked = clickExistingControl([/random/i]);
    const note = autoClicked || nextClicked || randomClicked ? ' Gallery controls were requested for a guided scene path.' : ' Use Gallery Console entries to start a curated tour.';
    setStatus(`Gallery tour is active.${note}`);
    return;
  }

  if (mode === 'performance-showcase') {
    setShowcaseClass('infinity-showcase-performance');
    const cinematicClicked = clickExistingControl([/cinematic/i]);
    const fullscreenClicked = clickExistingControl([/full\s*screen/i, /fullscreen/i]);
    const autoClicked = clickExistingControl([/auto trip/i, /trip/i]);
    const note = cinematicClicked || fullscreenClicked || autoClicked ? ' Stage controls were requested when available.' : ' Use Cinematic or Fullscreen controls for the final stage view.';
    setStatus(`Performance showcase is active.${note}`);
  }
};

const cycleShowcaseMode = () => {
  const modes = SHOWCASE_SCENES.map((scene) => scene.id);
  const nextIndex = (modes.indexOf(activeShowcaseMode) + 1) % modes.length;
  applyShowcaseMode(modes[nextIndex]);
};

const copyShowcaseNote = async () => {
  const note = [
    `InfinityLens369 ${SHOWCASE_CONSOLE_VERSION} showcase note`,
    '',
    `Active showcase mode: ${activeShowcaseMode}`,
    'Showcase modes: safe showcase, gallery tour, performance showcase, exit showcase.',
    'Audio remains local in the browser. Showcase controls stage the public presentation only; they do not alter source audio or make scientific/medical claims.',
    '',
    `Page: ${window.location.href}`,
  ].join('\n');

  try {
    await navigator.clipboard.writeText(note);
    setStatus('Showcase note copied to clipboard.');
  } catch {
    window.prompt('Copy this showcase note:', note);
    setStatus('Clipboard permission was blocked, so the showcase note opened in a copy prompt.');
  }
};

const buildShowcaseConsole = () => {
  if (document.querySelector('.showcase-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card showcase-console';
  card.innerHTML = `
    <div class="eyebrow">Showcase Console ${SHOWCASE_CONSOLE_VERSION}</div>
    <h2>public demo modes</h2>
    <p class="studio-copy">One-click presentation helpers for public sharing: calm entry, curated scene tour, projection staging, and clean exit. Uses existing controls and keeps audio local.</p>
    <div class="showcase-mode-grid">
      ${SHOWCASE_SCENES.map(
        (scene) => `
          <button type="button" data-showcase-mode="${scene.id}">
            <strong>${scene.title}</strong>
            <span>${scene.detail}</span>
            <em>${scene.status}</em>
          </button>
        `,
      ).join('')}
    </div>
    <div class="showcase-actions">
      <button type="button" data-showcase-copy>Copy showcase note</button>
      <button type="button" data-showcase-exit>Exit showcase</button>
    </div>
    <p class="showcase-console-status">Ready. Use Showcase Console when handing InfinityLens369 to a new viewer, projector, stream, or public demo.</p>
    <p class="showcase-hint">Shortcut: Alt+S cycles showcase modes.</p>
  `;

  const accessibilityConsole = panel.querySelector<HTMLElement>('.accessibility-console');
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (accessibilityConsole?.parentElement === panel && accessibilityConsole.nextSibling) {
    panel.insertBefore(card, accessibilityConsole.nextSibling);
  } else if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelectorAll<HTMLButtonElement>('[data-showcase-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.showcaseMode as ShowcaseMode | undefined;
      if (mode) applyShowcaseMode(mode);
    });
  });

  card.querySelector<HTMLButtonElement>('[data-showcase-copy]')?.addEventListener('click', () => {
    void copyShowcaseNote();
  });

  card.querySelector<HTMLButtonElement>('[data-showcase-exit]')?.addEventListener('click', () => {
    applyShowcaseMode('exit-showcase');
  });

  setActiveButton();
};

const handleShowcaseHotkey = (event: KeyboardEvent) => {
  if (!event.altKey || event.key.toLowerCase() !== 's') return;
  const target = event.target as HTMLElement | null;
  if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;

  event.preventDefault();
  cycleShowcaseMode();
};

const bootstrap = () => {
  buildShowcaseConsole();
  window.addEventListener('keydown', handleShowcaseHotkey);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
