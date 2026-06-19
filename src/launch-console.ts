const LAUNCH_CONSOLE_VERSION = 'v1.11.0';

type LaunchActionKey = 'guide' | 'demo' | 'share' | 'shortcuts';

type LaunchAction = {
  key: LaunchActionKey;
  name: string;
  hint: string;
};

const LAUNCH_ACTIONS: LaunchAction[] = [
  {
    key: 'guide',
    name: 'First Run Guide',
    hint: 'show the shortest path from fresh page to first portal',
  },
  {
    key: 'demo',
    name: 'Demo Journey',
    hint: 'cycle a few safe live controls for public playback',
  },
  {
    key: 'share',
    name: 'Copy Share Link',
    hint: 'copy the current public page URL',
  },
  {
    key: 'shortcuts',
    name: 'Shortcut Map',
    hint: 'open the performance keyboard overlay',
  },
];

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Performance Console/i.test(element.textContent ?? ''));

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
  const status = document.querySelector<HTMLElement>('.launch-console-status');
  if (status) status.textContent = message;
};

const showGuide = () => {
  setStatus('Guide: 1) drop an audio file, 2) press Play portal, 3) try Next/Random, 4) use Cinematic or Fullscreen for public playback.');
};

const runDemoJourney = () => {
  const steps: Array<() => boolean> = [
    () => clickButton([/^Safe$/i, /Safe mode/i]),
    () => clickButton([/Next/i]),
    () => clickButton([/Random/i]),
    () => clickButton([/Slow flow/i]),
  ];

  setStatus('Demo journey started. Cycling Safe, Next, Random, and Slow Flow without touching audio files.');

  steps.forEach((step, index) => {
    window.setTimeout(() => {
      const ok = step();
      if (index === steps.length - 1) {
        setStatus(ok ? 'Demo journey complete. Drop a song and use Cinematic/Fullscreen when ready.' : 'Demo journey complete. Some live buttons were not found yet.');
      }
    }, index * 1200);
  });
};

const copyShareLink = async () => {
  const url = window.location.href;

  try {
    await navigator.clipboard.writeText(url);
    setStatus('Share link copied. Send it to someone and tell them: drop a song, open a portal.');
  } catch {
    window.prompt('Copy this InfinityLens369 link:', url);
    setStatus('Clipboard permission was blocked, so the share link opened in a copy prompt.');
  }
};

const openShortcutMap = () => {
  const opened = clickButton([/^\?$/i, /Shortcut/i, /help/i]);
  if (opened) {
    setStatus('Shortcut map opened. Press ? again or use the overlay close control to return.');
  } else {
    const event = new KeyboardEvent('keydown', { key: '?', bubbles: true });
    window.dispatchEvent(event);
    setStatus('Shortcut map requested with the ? hotkey.');
  }
};

const runAction = (key: LaunchActionKey) => {
  if (key === 'guide') showGuide();
  if (key === 'demo') runDemoJourney();
  if (key === 'share') void copyShareLink();
  if (key === 'shortcuts') openShortcutMap();
};

const buildLaunchConsole = () => {
  if (document.querySelector('.launch-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card launch-console';
  card.innerHTML = `
    <div class="eyebrow">Launch Console ${LAUNCH_CONSOLE_VERSION}</div>
    <h2>Public launch helper</h2>
    <p class="studio-copy">Quick onboarding for first-time users: guide them into audio, demo the portal, copy the public link, and show shortcuts.</p>
    <div class="launch-action-grid">
      ${LAUNCH_ACTIONS.map(
        (action) => `
          <button type="button" class="launch-action-button" data-launch-action="${action.key}">
            <strong>${action.name}</strong>
            <span>${action.hint}</span>
          </button>
        `,
      ).join('')}
    </div>
    <p class="launch-console-status">Ready for public onboarding. Good for demos, friends, and first-time visitors.</p>
  `;

  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelectorAll<HTMLButtonElement>('[data-launch-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = LAUNCH_ACTIONS.find((candidate) => candidate.key === button.dataset.launchAction);
      if (action) runAction(action.key);
    });
  });
};

const bootstrap = () => {
  buildLaunchConsole();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
