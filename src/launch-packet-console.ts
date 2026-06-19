const LAUNCH_PACKET_VERSION = 'v1.18.0';
const REPOSITORY_URL = 'https://github.com/MichaelWave369/infinitylens369';

const findPanel = () =>
  document.querySelector<HTMLElement>('.control-panel') ??
  document.querySelector<HTMLElement>('aside') ??
  Array.from(document.querySelectorAll<HTMLElement>('section, div')).find((element) => /Drop a song|Open a portal|Share Console/i.test(element.textContent ?? ''));

const normalizePageUrl = () => {
  const url = new URL(window.location.href);
  url.hash = '';
  return url.toString();
};

const setStatus = (message: string) => {
  const status = document.querySelector<HTMLElement>('.launch-packet-console-status');
  if (status) status.textContent = message;
};

const copyText = async (text: string, successMessage: string) => {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(successMessage);
  } catch {
    window.prompt('Copy this InfinityLens369 launch packet:', text);
    setStatus('Clipboard permission was blocked, so the packet opened in a copy prompt.');
  }
};

const copyLaunchBlurb = () => {
  const note = [
    `InfinityLens369 ${LAUNCH_PACKET_VERSION}`,
    'Drop a song. Open a portal.',
    '',
    'A local-first browser visualizer that turns your own audio into live fractal, geometric, and cinematic visuals. It includes capture, short WebM recording, scene galleries, showcase modes, share notes, comfort controls, and browser health checks.',
    '',
    'Your audio stays in your browser. InfinityLens369 is an art, math, and software visualization tool — not a medical, physics, or consciousness proof system.',
    '',
    `Try it: ${normalizePageUrl()}`,
    `Repo: ${REPOSITORY_URL}`,
  ].join('\n');

  void copyText(note, 'Public launch blurb copied.');
};

const copyTesterChecklist = () => {
  const note = [
    `InfinityLens369 ${LAUNCH_PACKET_VERSION} tester checklist`,
    '',
    '1. Fresh-load the page and confirm the visualizer appears.',
    '2. Drop a local audio file and confirm playback/visual response.',
    '3. Try Gallery Console and Layer Console for scene discovery.',
    '4. Try Showcase Console for presentation mode.',
    '5. Try Accessibility Console if motion or glow feels too intense.',
    '6. Try Capture Studio or Recording Studio if supported by your browser.',
    '7. Use System Health Console and copy diagnostics if anything breaks.',
    '',
    'Feedback:',
    '- Browser/device:',
    '- What looked amazing:',
    '- What felt confusing:',
    '- Any errors or blank-screen moments:',
    '',
    `Page: ${normalizePageUrl()}`,
  ].join('\n');

  void copyText(note, 'Tester checklist copied.');
};

const copyCreatorHandoff = () => {
  const note = [
    `InfinityLens369 ${LAUNCH_PACKET_VERSION} creator handoff`,
    '',
    'Use this for:',
    '- Music video visual inspiration',
    '- Live projection tests',
    '- Short background clips',
    '- Fractal/geometry mood boards',
    '- Public demo links with local-first audio privacy',
    '',
    'Suggested flow:',
    '1. Drop a track locally.',
    '2. Start in Safe Showcase or Gallery Tour.',
    '3. Use Layer Console for geometry/symbolic overlays.',
    '4. Capture PNG frames or short local WebM clips.',
    '5. Share feedback with browser/device and what mode worked best.',
    '',
    `Page: ${normalizePageUrl()}`,
  ].join('\n');

  void copyText(note, 'Creator handoff copied.');
};

const copyV2Readiness = () => {
  const note = [
    `InfinityLens369 ${LAUNCH_PACKET_VERSION} v2.0 readiness packet`,
    '',
    'Ready now:',
    '- Stable local-first visualizer core',
    '- Transition, audio, Liquid Light, and Machine Cathedral packs',
    '- Preset, Capture, Recording, Performance, Layer, Launch, Gallery, Roadmap, Health, Accessibility, Showcase, and Share consoles',
    '- Boot-safe sidecar pattern with version-sync label cleanup',
    '',
    'Remaining v2.0 polish lane:',
    '- Keep build green',
    '- Reduce menu friction if the panel gets too long',
    '- Continue collecting tester feedback and browser diagnostics',
    '- Prepare a clean v2.0 release page / demo video packet',
    '',
    `Repo: ${REPOSITORY_URL}`,
  ].join('\n');

  void copyText(note, 'v2.0 readiness packet copied.');
};

const openRepository = () => {
  window.open(REPOSITORY_URL, '_blank', 'noopener,noreferrer');
  setStatus('Repository opened in a new tab.');
};

const buildLaunchPacketConsole = () => {
  if (document.querySelector('.launch-packet-console')) return;

  const panel = findPanel();
  if (!panel) return;

  const card = document.createElement('section');
  card.className = 'studio-card launch-packet-console';
  card.innerHTML = `
    <div class="eyebrow">Launch Packet Console ${LAUNCH_PACKET_VERSION}</div>
    <h2>launch packet</h2>
    <p class="studio-copy">Copy public-ready launch text, tester checklists, creator handoffs, and v2.0 readiness notes without changing the visualizer core.</p>
    <div class="launch-packet-grid">
      <button type="button" data-launch-blurb>
        <strong>Copy launch blurb</strong>
        <span>Public-friendly project summary.</span>
      </button>
      <button type="button" data-launch-checklist>
        <strong>Copy tester checklist</strong>
        <span>Structured feedback path.</span>
      </button>
      <button type="button" data-launch-creator>
        <strong>Copy creator handoff</strong>
        <span>Use cases for artists and video makers.</span>
      </button>
      <button type="button" data-launch-v2>
        <strong>Copy v2 readiness</strong>
        <span>Current stack and remaining runway.</span>
      </button>
    </div>
    <div class="launch-packet-actions">
      <button type="button" data-launch-repo>Open repo</button>
      <button type="button" data-launch-refresh>Refresh label sync</button>
    </div>
    <p class="launch-packet-console-status">Ready. Launch Packet Console prepares copyable public handoff packets while audio stays local.</p>
  `;

  const shareConsole = panel.querySelector<HTMLElement>('.share-console');
  const receiptCard = Array.from(panel.querySelectorAll<HTMLElement>('.studio-card, section, div')).find((element) => /^Receipts/i.test((element.textContent ?? '').trim()));

  if (shareConsole?.parentElement === panel && shareConsole.nextSibling) {
    panel.insertBefore(card, shareConsole.nextSibling);
  } else if (receiptCard?.parentElement === panel) {
    panel.insertBefore(card, receiptCard);
  } else {
    panel.appendChild(card);
  }

  card.querySelector<HTMLButtonElement>('[data-launch-blurb]')?.addEventListener('click', copyLaunchBlurb);
  card.querySelector<HTMLButtonElement>('[data-launch-checklist]')?.addEventListener('click', copyTesterChecklist);
  card.querySelector<HTMLButtonElement>('[data-launch-creator]')?.addEventListener('click', copyCreatorHandoff);
  card.querySelector<HTMLButtonElement>('[data-launch-v2]')?.addEventListener('click', copyV2Readiness);
  card.querySelector<HTMLButtonElement>('[data-launch-repo]')?.addEventListener('click', openRepository);
  card.querySelector<HTMLButtonElement>('[data-launch-refresh]')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('infinitylens369:version-sync-request'));
    setStatus('Version sync requested. Labels should settle on the current release.');
  });
};

const bootstrap = () => {
  buildLaunchPacketConsole();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
