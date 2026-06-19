const RELEASE_VERSION = 'v1.13.0';

let scheduledSync: number | undefined;
let safetyPasses = 0;

const updateText = (element: HTMLElement, next: string) => {
  if (element.textContent !== next) element.textContent = next;
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

  if (
    /v1\.5 Machine Cathedral Pack is live/i.test(next) ||
    /v1\.9 Performance Console is live/i.test(next) ||
    /v1\.10 Layer Console is live/i.test(next) ||
    /v1\.11 Launch Console is live/i.test(next) ||
    /v1\.12 Gallery Console is live/i.test(next)
  ) {
    next = 'v1.13 Roadmap Console is live: public feedback notes, issue links, and the v2 runway map are now staged.';
  }

  if (/stable v1\.(5|11|12) default scene/i.test(next)) {
    next = next.replace(/stable v1\.(5|11|12) default scene/gi, 'stable v1.13 default scene');
  }

  if (next !== current) node.nodeValue = next;
};

const scanVisibleText = () => {
  if (!document.body) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = node.nodeValue ?? '';
      return /InfinityLens369\s+v\d+\.\d+\.\d+|Capture Studio\s+v\d+\.\d+\.\d+|Recording Studio\s+v\d+\.\d+\.\d+|Performance Console\s+v\d+\.\d+\.\d+|Layer Console\s+v\d+\.\d+\.\d+|Launch Console\s+v\d+\.\d+\.\d+|Gallery Console\s+v\d+\.\d+\.\d+|Roadmap Console\s+v\d+\.\d+\.\d+|v1\.5 Machine Cathedral Pack|v1\.9 Performance Console is live|v1\.10 Layer Console is live|v1\.11 Launch Console is live|v1\.12 Gallery Console is live|stable v1\.(5|11|12) default scene/i.test(value)
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

    if (/^Performance Console\s+v/i.test(current)) {
      updateText(label, `Performance Console ${RELEASE_VERSION}`);
    }

    if (/^Layer Console\s+v/i.test(current)) {
      updateText(label, `Layer Console ${RELEASE_VERSION}`);
    }

    if (/^Launch Console\s+v/i.test(current)) {
      updateText(label, `Launch Console ${RELEASE_VERSION}`);
    }

    if (/^Gallery Console\s+v/i.test(current)) {
      updateText(label, `Gallery Console ${RELEASE_VERSION}`);
    }

    if (/^Roadmap Console\s+v/i.test(current)) {
      updateText(label, `Roadmap Console ${RELEASE_VERSION}`);
    }
  });

  scanVisibleText();
};

const queueSync = () => {
  if (scheduledSync !== undefined) return;

  scheduledSync = window.setTimeout(() => {
    scheduledSync = undefined;
    syncVersionLabels();
  }, 80);
};

syncVersionLabels();

const safetySync = window.setInterval(() => {
  syncVersionLabels();
  safetyPasses += 1;

  if (safetyPasses >= 24) window.clearInterval(safetySync);
}, 250);

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
