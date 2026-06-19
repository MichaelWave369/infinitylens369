const ROADMAP_CONSOLE_VERSION = 'v1.13.0';

const ROADMAP_ITEMS = [
  {
    title: 'Stable visual core',
    status: 'green lane',
    detail: 'WebGL stage, trip cycle, transition engine, and audio shaping are live.',
  },
  {
    title: 'Creator studios',
    status: 'live',
    detail: 'Preset, Capture, Recording, Performance, Layer, Launch, and Gallery consoles are staged.',
  },
  {
    title: 'Public feedback loop',
    status: 'new',
    detail: 'Copy a clean feedback note or open the issue tracker for visual ideas and bugs.',
  },
  {
    title: 'v2.0 runway',
    status: 'next',
    detail: 'Launch polish, sample/demo flows, richer layers, and public gallery language are the final runway.',
  },
];

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Gallery Console/i.test(element.textContent ?? ''));

const setStatus = (message: string) => {
  const status = document.querySelector<HTMLElement>('.roadmap-console-status');
  if (status) status.textContent = message;
};

const copyText = async (label: string, text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(`${label} copied to clipboard.`);
  } catch {
    window.prompt(`Copy this ${label}:`, text);
    setStatus(`Clipboard permission was blocked, so ${label} opened in a copy prompt.`);
  }
};

const copyFeedbackNote = () => {
  const note = [
    `InfinityLens369 ${ROADMAP_CONSOLE_VERSION} feedback`,
    '',
    'What I tried:',
    '- ',
    '',
    'What felt amazing:',
    '- ',
    '',
    'What felt confusing or broken:',
    '- ',
    '',
    'Visual idea / mode request:',
    '- ',
    '',
    `Page: ${window.location.href}`,
  ].join('\n');

  void copyText('feedback note', note);
};

const copyV2Runway = () => {
  const note = `InfinityLens369 ${ROADMAP_CONSOLE_VERSION}: v2.0 runway is active. The core visualizer, audio engine, transitions, Liquid Light, Machine Cathedral, Preset Studio, Capture Studio, Recording Studio, Performance Console, Layer Console, Launch Console, Gallery Console, and Roadmap Console are now staged as a public local-first visual instrument.`;
  void copyText('v2 runway note', `${note}\n${window.location.href}`);
};

const openIssueTracker = () => {
  window.open('https://github.com/MichaelWave369/infinitylens369/issues/new/choose', '_blank', 'noopener,noreferrer');
  setStatus('Issue tracker opened in a new tab. Use it for visual ideas, bugs, and feedback receipts.');
};

const openReleaseStack = () => {
  setStatus('Release stack: v1.0 core → v1.3 audio engine → v1.5 visual packs → v1.8 capture/recording → v1.13 roadmap feedback. v2.0 launch polish is next.');
};

const buildRoadmapConsole = () => {
  if (document.querySelector('.roadmap-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card roadmap-console';
  card.innerHTML = `
    <div class="eyebrow">Roadmap Console ${ROADMAP_CONSOLE_VERSION}</div>
    <h2>v2 runway</h2>
    <p class="studio-copy">A public-facing progress map and feedback bridge for people testing InfinityLens369. Audio stays local; feedback is user-controlled.</p>
    <div class="roadmap-stack">
      ${ROADMAP_ITEMS.map(
        (item) => `
          <article class="roadmap-item">
            <div>
              <strong>${item.title}</strong>
              <span>${item.detail}</span>
            </div>
            <em>${item.status}</em>
          </article>
        `,
      ).join('')}
    </div>
    <div class="roadmap-actions">
      <button type="button" data-roadmap-feedback>Copy feedback note</button>
      <button type="button" data-roadmap-runway>Copy v2 runway</button>
      <button type="button" data-roadmap-issues>Open issue tracker</button>
      <button type="button" data-roadmap-stack>Release stack</button>
    </div>
    <p class="roadmap-console-status">Ready to collect clean feedback and show where the instrument is headed.</p>
  `;

  const galleryConsole = panel.querySelector<HTMLElement>('.gallery-console');
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (galleryConsole?.parentElement === panel && galleryConsole.nextSibling) {
    panel.insertBefore(card, galleryConsole.nextSibling);
  } else if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelector<HTMLButtonElement>('[data-roadmap-feedback]')?.addEventListener('click', copyFeedbackNote);
  card.querySelector<HTMLButtonElement>('[data-roadmap-runway]')?.addEventListener('click', copyV2Runway);
  card.querySelector<HTMLButtonElement>('[data-roadmap-issues]')?.addEventListener('click', openIssueTracker);
  card.querySelector<HTMLButtonElement>('[data-roadmap-stack]')?.addEventListener('click', openReleaseStack);
};

const bootstrap = () => {
  buildRoadmapConsole();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};