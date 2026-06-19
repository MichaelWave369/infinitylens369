const SYSTEM_HEALTH_VERSION = 'v1.14.1';

type HealthState = 'ready' | 'limited' | 'missing';

type HealthCheck = {
  label: string;
  state: HealthState;
  detail: string;
};

type RuntimeClipboard = {
  writeText?: (text: string) => Promise<void>;
};

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Roadmap Console/i.test(element.textContent ?? ''));

const setStatus = (message: string) => {
  const status = document.querySelector<HTMLElement>('.system-health-status');
  if (status) status.textContent = message;
};

const getRuntimeClipboard = () => {
  const runtimeNavigator = navigator as Navigator & { clipboard?: RuntimeClipboard };
  return runtimeNavigator.clipboard;
};

const canUseClipboard = () => typeof getRuntimeClipboard()?.writeText === 'function';

const canUseLocalStorage = () => {
  try {
    const key = 'infinitylens369:health-check';
    window.localStorage.setItem(key, 'ok');
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const canUseWebGL2 = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
};

const canUseAudioContext = () => {
  const audioWindow = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  return Boolean(audioWindow.AudioContext || audioWindow.webkitAudioContext);
};

const getHealthChecks = (): HealthCheck[] => {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas');
  const captureStreamSupported = typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype;
  const clipboardSupported = canUseClipboard();

  return [
    {
      label: 'WebGL2 renderer',
      state: canUseWebGL2() ? 'ready' : 'missing',
      detail: canUseWebGL2() ? 'GPU visual stage is available.' : 'Browser/GPU may not support the main shader stage.',
    },
    {
      label: 'Live canvas',
      state: canvas ? 'ready' : 'limited',
      detail: canvas ? 'Visualizer canvas is mounted.' : 'Canvas has not mounted yet. Wait a moment or refresh.',
    },
    {
      label: 'Audio engine',
      state: canUseAudioContext() ? 'ready' : 'missing',
      detail: canUseAudioContext() ? 'Browser supports Web Audio analysis.' : 'Browser blocked or lacks Web Audio support.',
    },
    {
      label: 'Local storage',
      state: canUseLocalStorage() ? 'ready' : 'limited',
      detail: canUseLocalStorage() ? 'Preset and studio metadata can stay local.' : 'Storage is blocked; presets may not persist.',
    },
    {
      label: 'Canvas recording',
      state: captureStreamSupported && 'MediaRecorder' in window ? 'ready' : captureStreamSupported ? 'limited' : 'missing',
      detail:
        captureStreamSupported && 'MediaRecorder' in window
          ? 'WebM recording should be available.'
          : captureStreamSupported
            ? 'Canvas stream exists, but MediaRecorder is unavailable.'
            : 'Canvas captureStream is unavailable in this browser.',
    },
    {
      label: 'Clipboard helper',
      state: clipboardSupported ? 'ready' : 'limited',
      detail: clipboardSupported ? 'Copy buttons can write directly.' : 'Copy buttons may fall back to prompt windows.',
    },
    {
      label: 'Fullscreen',
      state: document.fullscreenEnabled ? 'ready' : 'limited',
      detail: document.fullscreenEnabled ? 'Fullscreen performance mode is available.' : 'Fullscreen may be blocked by this browser or context.',
    },
  ];
};

const stateLabel = (state: HealthState) => {
  if (state === 'ready') return 'ready';
  if (state === 'limited') return 'limited';
  return 'missing';
};

const copyText = async (label: string, text: string) => {
  try {
    const clipboard = getRuntimeClipboard();
    if (typeof clipboard?.writeText !== 'function') throw new Error('Clipboard writeText is unavailable.');
    await clipboard.writeText(text);
    setStatus(`${label} copied to clipboard.`);
  } catch {
    window.prompt(`Copy this ${label}:`, text);
    setStatus(`Clipboard permission was blocked, so ${label} opened in a copy prompt.`);
  }
};

const copyDiagnostics = () => {
  const checks = getHealthChecks();
  const note = [
    `InfinityLens369 ${SYSTEM_HEALTH_VERSION} diagnostics`,
    `URL: ${window.location.href}`,
    `User agent: ${navigator.userAgent}`,
    '',
    ...checks.map((check) => `- ${check.label}: ${stateLabel(check.state)} — ${check.detail}`),
  ].join('\n');

  void copyText('diagnostics report', note);
};

const refreshHealth = () => {
  const card = document.querySelector<HTMLElement>('.system-health-console');
  if (!card) return;

  const list = card.querySelector<HTMLElement>('.system-health-grid');
  if (!list) return;

  list.innerHTML = renderHealthCards();
  setStatus('Health checks refreshed from this browser session.');
};

const openIssueTracker = () => {
  window.open('https://github.com/MichaelWave369/infinitylens369/issues/new/choose', '_blank', 'noopener,noreferrer');
  setStatus('Issue tracker opened. Paste diagnostics there if something feels off.');
};

const runSoftReload = () => {
  setStatus('Refreshing the page in safe browser flow. Audio files stay local and will need to be selected again.');
  window.setTimeout(() => window.location.reload(), 350);
};

const renderHealthCards = () =>
  getHealthChecks()
    .map(
      (check) => `
        <article class="system-health-item ${check.state}">
          <div>
            <strong>${check.label}</strong>
            <span>${check.detail}</span>
          </div>
          <em>${stateLabel(check.state)}</em>
        </article>
      `,
    )
    .join('');

const buildSystemHealthConsole = () => {
  if (document.querySelector('.system-health-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card system-health-console';
  card.innerHTML = `
    <div class="eyebrow">System Health Console ${SYSTEM_HEALTH_VERSION}</div>
    <h2>runtime readiness</h2>
    <p class="studio-copy">A local browser health check for WebGL, audio analysis, storage, capture, recording, clipboard, and fullscreen support.</p>
    <div class="system-health-grid">${renderHealthCards()}</div>
    <div class="system-health-actions">
      <button type="button" data-health-refresh>Refresh checks</button>
      <button type="button" data-health-copy>Copy diagnostics</button>
      <button type="button" data-health-issues>Open issue tracker</button>
      <button type="button" data-health-reload>Soft reload</button>
    </div>
    <p class="system-health-status">Ready. These checks stay local in this browser.</p>
  `;

  const roadmapConsole = panel.querySelector<HTMLElement>('.roadmap-console');
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (roadmapConsole?.parentElement === panel && roadmapConsole.nextSibling) {
    panel.insertBefore(card, roadmapConsole.nextSibling);
  } else if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelector<HTMLButtonElement>('[data-health-refresh]')?.addEventListener('click', refreshHealth);
  card.querySelector<HTMLButtonElement>('[data-health-copy]')?.addEventListener('click', copyDiagnostics);
  card.querySelector<HTMLButtonElement>('[data-health-issues]')?.addEventListener('click', openIssueTracker);
  card.querySelector<HTMLButtonElement>('[data-health-reload]')?.addEventListener('click', runSoftReload);
};

const bootstrap = () => {
  buildSystemHealthConsole();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
