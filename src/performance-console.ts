const PERFORMANCE_CONSOLE_VERSION = 'v1.9.0';
let mounted = false;
let overlay: HTMLElement | undefined;

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
};

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase();

const findButtonByText = (labels: string[]) => {
  const normalizedLabels = labels.map(normalize);
  return Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find((button) => {
    const text = normalize(button.textContent ?? '');
    return normalizedLabels.some((label) => text.includes(label));
  });
};

const runButton = (labels: string[], status: HTMLElement, message: string) => {
  const button = findButtonByText(labels);
  if (!button || button.disabled) {
    status.textContent = 'That live control is not available yet. Let the app finish loading, then try again.';
    return;
  }

  button.click();
  status.textContent = message;
};

const setPerformerMode = (enabled: boolean, status?: HTMLElement) => {
  document.body.classList.toggle('performance-console--performer', enabled);
  if (status) status.textContent = enabled ? 'Performer mode enabled. Interface contrast is boosted for live use.' : 'Performer mode disabled.';
};

const makeShortcutRows = () => [
  ['Space', 'Play / pause current audio'],
  ['C', 'Cinematic view'],
  ['F', 'Browser fullscreen'],
  ['N', 'Next trip'],
  ['R', 'Random trip'],
  ['A', 'Auto trip'],
  ['S', 'Slow flow'],
  ['0', 'Safe Mode'],
  ['1–4', 'Motion profiles: Dream, Cruise, Live, Warp'],
  ['T', 'Cycle transition style'],
  ['?', 'Show / hide this keyboard map'],
];

const closeOverlay = () => {
  overlay?.remove();
  overlay = undefined;
};

const openOverlay = () => {
  if (overlay) {
    closeOverlay();
    return;
  }

  const node = document.createElement('div');
  node.className = 'performance-overlay';
  node.setAttribute('role', 'dialog');
  node.setAttribute('aria-label', 'InfinityLens369 keyboard performance map');
  node.innerHTML = `
    <div class="performance-overlay__card">
      <div class="performance-overlay__header">
        <div>
          <p class="eyebrow">Performance Console ${PERFORMANCE_CONSOLE_VERSION}</p>
          <h2>Keyboard performance map</h2>
        </div>
        <button type="button" data-performance-close aria-label="Close keyboard map">Close</button>
      </div>
      <div class="performance-overlay__grid">
        ${makeShortcutRows().map(([key, action]) => `
          <div class="performance-overlay__row">
            <kbd>${key}</kbd>
            <span>${action}</span>
          </div>
        `).join('')}
      </div>
      <p class="performance-overlay__note">Tip: use Cinematic + Fullscreen for public playback, then press ? anytime to bring this map back.</p>
    </div>
  `;

  node.addEventListener('click', (event) => {
    if (event.target === node) closeOverlay();
  });

  node.querySelector('[data-performance-close]')?.addEventListener('click', closeOverlay);
  document.body.appendChild(node);
  overlay = node;
};

const createPanel = () => {
  const section = document.createElement('section');
  section.className = 'performance-console control-group';
  section.setAttribute('aria-label', 'Performance Console');

  section.innerHTML = `
    <div class="performance-console__header">
      <div>
        <p class="eyebrow">Performance Console ${PERFORMANCE_CONSOLE_VERSION}</p>
        <h2>Live control map</h2>
      </div>
      <button type="button" data-performance-help>?</button>
    </div>
    <p class="performance-console__hint">Fast stage controls for live demos and public playback. These buttons reuse the existing app controls.</p>
    <div class="performance-console__actions">
      <button type="button" data-performance-action="cinematic">Cinematic</button>
      <button type="button" data-performance-action="fullscreen">Fullscreen</button>
      <button type="button" data-performance-action="next">Next</button>
      <button type="button" data-performance-action="random">Random</button>
      <button type="button" data-performance-action="auto">Auto trip</button>
      <button type="button" data-performance-action="slow">Slow flow</button>
      <button type="button" data-performance-action="safe">Safe</button>
      <button type="button" data-performance-action="reset">Reset</button>
    </div>
    <div class="performance-console__toggles">
      <label>
        <input type="checkbox" data-performer-mode />
        Performer contrast
      </label>
      <span>Press <kbd>?</kbd> for shortcuts.</span>
    </div>
    <p class="performance-console__status" data-performance-status>Ready for live control.</p>
  `;

  const status = section.querySelector<HTMLElement>('[data-performance-status]');
  section.querySelector('[data-performance-help]')?.addEventListener('click', openOverlay);

  section.querySelector<HTMLInputElement>('[data-performer-mode]')?.addEventListener('change', (event) => {
    const checked = (event.currentTarget as HTMLInputElement).checked;
    setPerformerMode(checked, status ?? undefined);
  });

  section.querySelectorAll<HTMLButtonElement>('[data-performance-action]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!status) return;
      const action = button.dataset.performanceAction;

      if (action === 'cinematic') runButton(['cinematic'], status, 'Cinematic view toggled.');
      if (action === 'fullscreen') runButton(['fullscreen'], status, 'Fullscreen requested.');
      if (action === 'next') runButton(['next trip'], status, 'Next trip fired.');
      if (action === 'random') runButton(['random trip'], status, 'Random trip fired.');
      if (action === 'auto') runButton(['auto trip'], status, 'Auto trip toggled.');
      if (action === 'slow') runButton(['slow flow'], status, 'Slow Flow applied.');
      if (action === 'safe') runButton(['safe mode'], status, 'Safe Mode applied.');
      if (action === 'reset') runButton(['reset visuals'], status, 'Visuals reset.');
    });
  });

  return section;
};

const mountPerformanceConsole = () => {
  if (mounted) return;

  const panel = document.querySelector<HTMLElement>('.control-panel, aside');
  if (!panel) return;

  if (panel.querySelector('.performance-console')) {
    mounted = true;
    return;
  }

  const recordingStudio = panel.querySelector('.recording-studio');
  const performancePanel = createPanel();

  if (recordingStudio?.nextSibling) {
    panel.insertBefore(performancePanel, recordingStudio.nextSibling);
  } else {
    panel.appendChild(performancePanel);
  }

  mounted = true;
};

const bootPerformanceConsole = () => {
  let attempts = 0;
  const tryMount = () => {
    attempts += 1;
    mountPerformanceConsole();
    if (!mounted && attempts < 30) window.setTimeout(tryMount, 250);
  };

  tryMount();
};

window.addEventListener('keydown', (event) => {
  if (isTypingTarget(event.target)) return;

  if (event.key === 'Escape' && overlay) {
    event.preventDefault();
    closeOverlay();
    return;
  }

  if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
    event.preventDefault();
    openOverlay();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPerformanceConsole, { once: true });
} else {
  window.setTimeout(bootPerformanceConsole, 300);
}

export {};
