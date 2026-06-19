const SHARE_CONSOLE_VERSION = 'v1.17.0';
const REPOSITORY_URL = 'https://github.com/MichaelWave369/infinitylens369';

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Showcase Console/i.test(element.textContent ?? ''));

const normalizePageUrl = () => {
  const url = new URL(window.location.href);
  url.hash = '';
  return url.toString();
};

const setStatus = (message: string) => {
  const status = document.querySelector<HTMLElement>('.share-console-status');
  if (status) status.textContent = message;
};

const copyText = async (text: string, successMessage: string) => {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(successMessage);
  } catch {
    window.prompt('Copy this InfinityLens369 note:', text);
    setStatus('Clipboard permission was blocked, so the note opened in a copy prompt.');
  }
};

const copyAppLink = () =>
  copyText(normalizePageUrl(), 'Public InfinityLens369 link copied.');

const copyQuickStart = () => {
  const note = [
    `InfinityLens369 ${SHARE_CONSOLE_VERSION} quick start`,
    '',
    '1. Open the page.',
    '2. Drop a local audio file. Your audio stays in your browser.',
    '3. Try Gallery Console for scene discovery, Showcase Console for demo staging, and Accessibility Console for comfort modes.',
    '4. Press ? for shortcuts, Alt+S for showcase modes, and Alt+M for comfort modes.',
    '',
    `Page: ${normalizePageUrl()}`,
    `Repo: ${REPOSITORY_URL}`,
  ].join('\n');

  void copyText(note, 'Quick start note copied.');
};

const copyShowcaseInvite = () => {
  const note = [
    'Drop a song. Open a portal.',
    '',
    `InfinityLens369 ${SHARE_CONSOLE_VERSION} is a local-first audio-reactive fractal visualizer with gallery scenes, showcase modes, capture, recording, and comfort controls.`,
    'No upload path: audio stays in the browser.',
    '',
    normalizePageUrl(),
  ].join('\n');

  void copyText(note, 'Showcase invite copied.');
};

const copySafetyNote = () => {
  const note = [
    `InfinityLens369 ${SHARE_CONSOLE_VERSION} safety note`,
    '',
    'InfinityLens369 is an art, math, and software visualization tool. It is not a medical tool, scientific proof engine, or consciousness/physics claim system.',
    'Use Accessibility Console for reduce motion, soft glow, high readability, and comfort staging when sharing publicly.',
    'Audio remains local in the browser unless the user chooses to download their own local captures or recordings.',
    '',
    `Page: ${normalizePageUrl()}`,
  ].join('\n');

  void copyText(note, 'Safety/share note copied.');
};

const openRepository = () => {
  window.open(REPOSITORY_URL, '_blank', 'noopener,noreferrer');
  setStatus('Repository opened in a new tab.');
};

const buildShareConsole = () => {
  if (document.querySelector('.share-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card share-console';
  card.innerHTML = `
    <div class="eyebrow">Share Console ${SHARE_CONSOLE_VERSION}</div>
    <h2>public handoff</h2>
    <p class="studio-copy">Copy clean links and notes for public demos, friends, testers, and collaborators. Keeps sharing claim-safe and reminds viewers that audio stays local.</p>
    <div class="share-action-grid">
      <button type="button" data-share-link>
        <strong>Copy app link</strong>
        <span>Clean page URL for quick sharing.</span>
      </button>
      <button type="button" data-share-start>
        <strong>Copy quick start</strong>
        <span>Short instructions for first-time users.</span>
      </button>
      <button type="button" data-share-invite>
        <strong>Copy showcase invite</strong>
        <span>Public-friendly invite text.</span>
      </button>
      <button type="button" data-share-safety>
        <strong>Copy safety note</strong>
        <span>Claim-safe sharing boundary.</span>
      </button>
    </div>
    <div class="share-actions">
      <button type="button" data-share-repo>Open repo</button>
      <button type="button" data-share-feedback>Copy feedback ask</button>
    </div>
    <p class="share-console-status">Ready. Share Console prepares clean public handoff notes without uploading audio or captures.</p>
  `;

  const showcaseConsole = panel.querySelector<HTMLElement>('.showcase-console');
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (showcaseConsole?.parentElement === panel && showcaseConsole.nextSibling) {
    panel.insertBefore(card, showcaseConsole.nextSibling);
  } else if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelector<HTMLButtonElement>('[data-share-link]')?.addEventListener('click', copyAppLink);
  card.querySelector<HTMLButtonElement>('[data-share-start]')?.addEventListener('click', copyQuickStart);
  card.querySelector<HTMLButtonElement>('[data-share-invite]')?.addEventListener('click', copyShowcaseInvite);
  card.querySelector<HTMLButtonElement>('[data-share-safety]')?.addEventListener('click', copySafetyNote);
  card.querySelector<HTMLButtonElement>('[data-share-repo]')?.addEventListener('click', openRepository);
  card.querySelector<HTMLButtonElement>('[data-share-feedback]')?.addEventListener('click', () => {
    const note = [
      `InfinityLens369 ${SHARE_CONSOLE_VERSION} feedback`,
      '',
      'What I tried:',
      'What looked amazing:',
      'What felt confusing:',
      'Browser/device:',
      '',
      `Page: ${normalizePageUrl()}`,
    ].join('\n');

    void copyText(note, 'Feedback ask copied.');
  });
};

const bootstrap = () => {
  buildShareConsole();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
