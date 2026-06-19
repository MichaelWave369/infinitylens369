const RELEASE_VERSION = 'v1.8.1';

let scheduledSync: number | undefined;

const updateText = (element: HTMLElement, next: string) => {
  if (element.textContent !== next) element.textContent = next;
};

const syncVersionLabels = () => {
  document.documentElement.dataset.infinitylensVersion = RELEASE_VERSION;
  document.title = `InfinityLens369 ${RELEASE_VERSION}`;

  document.querySelectorAll<HTMLElement>('.stage-badge strong').forEach((badge) => {
    const current = badge.textContent ?? '';
    if (/InfinityLens369/i.test(current)) {
      updateText(badge, `InfinityLens369 ${RELEASE_VERSION}`);
    }
  });

  document.querySelectorAll<HTMLElement>('.eyebrow').forEach((label) => {
    const current = label.textContent?.replace(/\s+/g, ' ').trim() ?? '';

    if (/^Capture Studio\s+v/i.test(current)) {
      updateText(label, `Capture Studio ${RELEASE_VERSION}`);
    }

    if (/^Recording Studio\s+v/i.test(current)) {
      updateText(label, `Recording Studio ${RELEASE_VERSION}`);
    }
  });
};

const queueSync = () => {
  if (scheduledSync !== undefined) return;

  scheduledSync = window.setTimeout(() => {
    scheduledSync = undefined;
    syncVersionLabels();
  }, 80);
};

syncVersionLabels();

const root = document.getElementById('root');

if (root) {
  const observer = new MutationObserver(queueSync);
  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

export {};
