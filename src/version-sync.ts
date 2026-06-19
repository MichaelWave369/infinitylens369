const RELEASE_VERSION = 'v1.18.4';

let scheduledSync: number | undefined;
let safetyPasses = 0;

const updateText = (element: HTMLElement, next: string) => {
  if (element.textContent !== next) element.textContent = next;
};

const hideStageChrome = () => {
  document.querySelectorAll<HTMLElement>('.stage-badge, .stage-notice').forEach((element) => {
    element.setAttribute('aria-hidden', 'true');
    element.hidden = true;
    element.style.display = 'none';
  });
};

const patchTextNode = (node: Text) => {
  const current = node.nodeValue ?? '';
  let next = current;

  next = next.replace(/InfinityLens369\s+v\d+\.\d+\.\d+/gi, `InfinityLens369 ${RELEASE_VERSION}`);
  next = next.replace(/Capture Studio\s+v\d+\.\d+\.\d+/gi, `Capture Studio ${RELEASE_VERSION}`);
  next = next.replace(/Recording Studio\s+v\d+\.\d+\.\d+/gi, `Recording Studio ${RELEASE_VERSION}`);
  next = next.replace(/Performance Console\s+v\d+\.\d+\.\d+/gi, `Performance Console ${RELEASE_VERSION}`);
  next = next.replace(/Layer Console\s+v\d+\.\d+\.\d+/gi, `Layer Console ${RELEASE_VERSION}`);
  next = next.replace(/Launch Console\s+v\d+\.\d+\.\d+/gi, `Launch Console ${RELEASE_VERSION}`);
  next = next.replace(/Gallery Console\s+v\d+\.\d+\.\d+/gi, `Gallery Console ${RELEASE_VERSION}`);
  next = next.replace(/Roadmap Console\s+v\d+\.\d+\.\d+/gi, `Roadmap Console ${RELEASE_VERSION}`);
  next = next.replace(/System Health Console\s+v\d+\.\d+\.\d+/gi, `System Health Console ${RELEASE_VERSION}`);
  next = next.replace(/Accessibility Console\s+v\d+\.\d+\.\d+/gi, `Accessibility Console ${RELEASE_VERSION}`);
  next = next.replace(/Showcase Console\s+v\d+\.\d+\.\d+/gi, `Showcase Console ${RELEASE_VERSION}`);
  next = next.replace(/Share Console\s+v\d+\.\d+\.\d+/gi, `Share Console ${RELEASE_VERSION}`);
  next = next.replace(/Launch Packet Console\s+v\d+\.\d+\.\d+/gi, `Launch Packet Console ${RELEASE_VERSION}`);

  if (
    /v1\.5 Machine Cathedral Pack is live/i.test(next) ||
    /v1\.9 Performance Console is live/i.test(next) ||
    /v1\.10 Layer Console is live/i.test(next) ||
    /v1\.11 Launch Console is live/i.test(next) ||
    /v1\.12 Gallery Console is live/i.test(next) ||
    /v1\.13 Roadmap Console is live/i.test(next) ||
    /v1\.14 System Health Console is live/i.test(next) ||
    /v1\.14\.1 System Health Console hotfix is live/i.test(next) ||
    /v1\.15 Accessibility Console is live/i.test(next) ||
    /v1\.16 Showcase Console is live/i.test(next) ||
    /v1\.17 Share Console is live/i.test(next) ||
    /v1\.18 Launch Packet Console is live/i.test(next) ||
    /v1\.18\.1 Visual Cleanup Hotfix is live/i.test(next) ||
    /v1\.18\.2 Circuit Cathedral Identity Pass is live/i.test(next) ||
    /v1\.18\.3 Visual Cleanup Scope Hotfix is live/i.test(next)
  ) {
    next = 'v1.18.4 Circuit Cathedral Lock Hotfix is live: Circuit Cathedral now re-locks its mode/palette and the transition strip artifact is suppressed.';
  }

  if (/stable v1\.(5|11|12|13|14|15|16|17|18) default scene/i.test(next)) {
    next = next.replace(/stable v1\.(5|11|12|13|14|15|16|17|18) default scene/gi, 'stable v1.18.4 default scene');
  }

  if (next !== current) node.nodeValue = next;
};

const scanVisibleText = () => {
  if (!document.body) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = node.nodeValue ?? '';
      return /InfinityLens369\s+v\d+\.\d+\.\d+|Capture Studio\s+v\d+\.\d+\.\d+|Recording Studio\s+v\d+\.\d+\.\d+|Performance Console\s+v\d+\.\d+\.\d+|Layer Console\s+v\d+\.\d+\.\d+|Launch Console\s+v\d+\.\d+\.\d+|Gallery Console\s+v\d+\.\d+\.\d+|Roadmap Console\s+v\d+\.\d+\.\d+|System Health Console\s+v\d+\.\d+\.\d+|Accessibility Console\s+v\d+\.\d+\.\d+|Showcase Console\s+v\d+\.\d+\.\d+|Share Console\s+v\d+\.\d+\.\d+|Launch Packet Console\s+v\d+\.\d+\.\d+|v1\.5 Machine Cathedral Pack|v1\.9 Performance Console is live|v1\.10 Layer Console is live|v1\.11 Launch Console is live|v1\.12 Gallery Console is live|v1\.13 Roadmap Console is live|v1\.14 System Health Console is live|v1\.14\.1 System Health Console hotfix is live|v1\.15 Accessibility Console is live|v1\.16 Showcase Console is live|v1\.17 Share Console is live|v1\.18 Launch Packet Console is live|v1\.18\.1 Visual Cleanup Hotfix is live|v1\.18\.2 Circuit Cathedral Identity Pass is live|v1\.18\.3 Visual Cleanup Scope Hotfix is live|stable v1\.(5|11|12|13|14|15|16|17|18) default scene/i.test(value)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });

  let node = walker.nextNode();
  while (node) {
    patchTextNode(node as Text);
    node = walker.nextNode();
  }
};

const syncVersionLabels = () => {
  document.documentElement.dataset.infinitylensVersion = RELEASE_VERSION;
  document.title = `InfinityLens369 ${RELEASE_VERSION}`;
  hideStageChrome();

  document.querySelectorAll<HTMLElement>('.eyebrow').forEach((label) => {
    const current = label.textContent?.replace(/\s+/g, ' ').trim() ?? '';

    if (/^Capture Studio\s+v/i.test(current)) updateText(label, `Capture Studio ${RELEASE_VERSION}`);
    if (/^Recording Studio\s+v/i.test(current)) updateText(label, `Recording Studio ${RELEASE_VERSION}`);
    if (/^Performance Console\s+v/i.test(current)) updateText(label, `Performance Console ${RELEASE_VERSION}`);
    if (/^Layer Console\s+v/i.test(current)) updateText(label, `Layer Console ${RELEASE_VERSION}`);
    if (/^Launch Console\s+v/i.test(current)) updateText(label, `Launch Console ${RELEASE_VERSION}`);
    if (/^Gallery Console\s+v/i.test(current)) updateText(label, `Gallery Console ${RELEASE_VERSION}`);
    if (/^Roadmap Console\s+v/i.test(current)) updateText(label, `Roadmap Console ${RELEASE_VERSION}`);
    if (/^System Health Console\s+v/i.test(current)) updateText(label, `System Health Console ${RELEASE_VERSION}`);
    if (/^Accessibility Console\s+v/i.test(current)) updateText(label, `Accessibility Console ${RELEASE_VERSION}`);
    if (/^Showcase Console\s+v/i.test(current)) updateText(label, `Showcase Console ${RELEASE_VERSION}`);
    if (/^Share Console\s+v/i.test(current)) updateText(label, `Share Console ${RELEASE_VERSION}`);
    if (/^Launch Packet Console\s+v/i.test(current)) updateText(label, `Launch Packet Console ${RELEASE_VERSION}`);
  });

  scanVisibleText();
};

const scheduleSync = () => {
  if (scheduledSync !== undefined) window.clearTimeout(scheduledSync);
  scheduledSync = window.setTimeout(() => {
    scheduledSync = undefined;
    syncVersionLabels();
  }, 80);
};

const runSafetyLoop = () => {
  syncVersionLabels();
  safetyPasses += 1;

  if (safetyPasses < 10) {
    window.setTimeout(runSafetyLoop, 350);
  }
};

const bootstrap = () => {
  runSafetyLoop();
  document.addEventListener('infinitylens369:version-sync-request', scheduleSync);

  const root = document.getElementById('root');
  if (!root) return;

  const observer = new MutationObserver(scheduleSync);
  observer.observe(root, { childList: true, subtree: true, characterData: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
