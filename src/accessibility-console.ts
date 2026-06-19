const ACCESSIBILITY_CONSOLE_VERSION = 'v1.15.0';

type ComfortMode = 'default' | 'reduced-motion' | 'soft-glow' | 'high-readability';

type ComfortScene = {
  id: ComfortMode;
  title: string;
  detail: string;
  status: string;
};

const COMFORT_SCENES: ComfortScene[] = [
  {
    id: 'default',
    title: 'Default lens',
    detail: 'Restores the public visual balance and clears extra comfort filters.',
    status: 'normal',
  },
  {
    id: 'reduced-motion',
    title: 'Reduce motion',
    detail: 'Softens UI motion, requests Safe/Slow controls, and lowers visual intensity.',
    status: 'comfort',
  },
  {
    id: 'soft-glow',
    title: 'Soft glow',
    detail: 'Dims bloom-heavy presentation for long viewing sessions.',
    status: 'gentle',
  },
  {
    id: 'high-readability',
    title: 'High readability',
    detail: 'Boosts panel clarity and text contrast for demos and screen sharing.',
    status: 'readable',
  },
];

const MODE_CLASS_NAMES: Record<ComfortMode, string[]> = {
  default: [],
  'reduced-motion': ['infinity-comfort-reduced-motion'],
  'soft-glow': ['infinity-comfort-soft-glow'],
  'high-readability': ['infinity-comfort-high-readability'],
};

let activeMode: ComfortMode = 'default';

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|System Health Console/i.test(element.textContent ?? ''));

const setStatus = (message: string) => {
  const status = document.querySelector<HTMLElement>('.accessibility-console-status');
  if (status) status.textContent = message;
};

const setActiveButton = () => {
  document.querySelectorAll<HTMLButtonElement>('[data-comfort-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.comfortMode === activeMode);
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

const applyComfortClass = (mode: ComfortMode) => {
  const classNames = Object.values(MODE_CLASS_NAMES).reduce<string[]>((allClassNames, currentClassNames) => [...allClassNames, ...currentClassNames], []);

  classNames.forEach((className) => {
    document.documentElement.classList.remove(className);
  });

  MODE_CLASS_NAMES[mode].forEach((className) => {
    document.documentElement.classList.add(className);
  });
};

const applyComfortMode = (mode: ComfortMode) => {
  activeMode = mode;
  applyComfortClass(mode);
  setActiveButton();

  if (mode === 'default') {
    setStatus('Default lens restored. Extra comfort filters are off.');
    return;
  }

  if (mode === 'reduced-motion') {
    const safeClicked = clickExistingControl([/safe/i]);
    const slowClicked = clickExistingControl([/slow flow/i, /slow/i]);
    const actionNote = safeClicked || slowClicked ? ' Safe/Slow controls were requested when available.' : ' Use Safe Mode or Slow Flow if you want an even calmer scene.';
    setStatus(`Reduced motion comfort is active.${actionNote}`);
    return;
  }

  if (mode === 'soft-glow') {
    clickExistingControl([/slow flow/i, /slow/i]);
    setStatus('Soft glow comfort is active. Bloom and panel glare are visually softened.');
    return;
  }

  if (mode === 'high-readability') {
    setStatus('High readability is active. Panels and copy are boosted for demos, projection, and screen sharing.');
  }
};

const cycleComfortMode = () => {
  const modes = COMFORT_SCENES.map((scene) => scene.id);
  const nextIndex = (modes.indexOf(activeMode) + 1) % modes.length;
  applyComfortMode(modes[nextIndex]);
};

const copyComfortNote = async () => {
  const note = [
    `InfinityLens369 ${ACCESSIBILITY_CONSOLE_VERSION} comfort note`,
    '',
    `Active comfort mode: ${activeMode}`,
    'Available comfort modes: default lens, reduce motion, soft glow, high readability.',
    'Audio remains local in the browser. Comfort controls change presentation only; they are not medical or accessibility compliance claims.',
    '',
    `Page: ${window.location.href}`,
  ].join('\n');

  try {
    await navigator.clipboard.writeText(note);
    setStatus('Comfort note copied to clipboard.');
  } catch {
    window.prompt('Copy this comfort note:', note);
    setStatus('Clipboard permission was blocked, so the comfort note opened in a copy prompt.');
  }
};

const resetComfort = () => {
  applyComfortMode('default');
};

const openMotionSafety = () => {
  setStatus('Comfort boundary: these controls reduce visual intensity and improve readability. They do not diagnose, treat, or guarantee accessibility compliance.');
};

const buildAccessibilityConsole = () => {
  if (document.querySelector('.accessibility-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card accessibility-console';
  card.innerHTML = `
    <div class="eyebrow">Accessibility Console ${ACCESSIBILITY_CONSOLE_VERSION}</div>
    <h2>comfort controls</h2>
    <p class="studio-copy">Viewer comfort tools for public demos: reduce motion, soften glow, boost readability, and copy a clean comfort note. This is presentation support, not a medical claim.</p>
    <div class="accessibility-mode-grid">
      ${COMFORT_SCENES.map(
        (scene) => `
          <button type="button" data-comfort-mode="${scene.id}">
            <strong>${scene.title}</strong>
            <span>${scene.detail}</span>
            <em>${scene.status}</em>
          </button>
        `,
      ).join('')}
    </div>
    <div class="accessibility-actions">
      <button type="button" data-comfort-copy>Copy comfort note</button>
      <button type="button" data-comfort-boundary>Motion safety note</button>
      <button type="button" data-comfort-reset>Reset comfort</button>
    </div>
    <p class="accessibility-console-status">Ready. Use comfort modes when sharing InfinityLens369 with new viewers or sensitive environments.</p>
    <p class="accessibility-hint">Shortcut: Alt+M cycles comfort modes.</p>
  `;

  const healthConsole = panel.querySelector<HTMLElement>('.system-health-console');
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (healthConsole?.parentElement === panel && healthConsole.nextSibling) {
    panel.insertBefore(card, healthConsole.nextSibling);
  } else if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelectorAll<HTMLButtonElement>('[data-comfort-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.comfortMode as ComfortMode | undefined;
      if (mode) applyComfortMode(mode);
    });
  });

  card.querySelector<HTMLButtonElement>('[data-comfort-copy]')?.addEventListener('click', () => {
    void copyComfortNote();
  });
  card.querySelector<HTMLButtonElement>('[data-comfort-boundary]')?.addEventListener('click', openMotionSafety);
  card.querySelector<HTMLButtonElement>('[data-comfort-reset]')?.addEventListener('click', resetComfort);

  setActiveButton();
};

const handleComfortHotkey = (event: KeyboardEvent) => {
  if (!event.altKey || event.key.toLowerCase() !== 'm') return;
  const target = event.target as HTMLElement | null;
  if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;

  event.preventDefault();
  cycleComfortMode();
};

const bootstrap = () => {
  buildAccessibilityConsole();
  window.addEventListener('keydown', handleComfortHotkey);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
