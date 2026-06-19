const CIRCUIT_RETUNE_DELAY_MS = 360;
const ACTIVE_SCENE = 'circuit-cathedral-identity';

let circuitRetuneAppliedForSelection = false;
let retuneInProgress = false;
let scheduledSceneSync: number | undefined;

const setNativeValue = (input: HTMLInputElement | HTMLSelectElement, value: string) => {
  const prototype = input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

  if (descriptor?.set) descriptor.set.call(input, value);
  else input.value = value;

  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

const setNativeChecked = (input: HTMLInputElement, checked: boolean) => {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked');

  if (descriptor?.set) descriptor.set.call(input, checked);
  else input.checked = checked;

  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

const normalize = (value: string | null | undefined) => (value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

const findControlGroup = (title: string) => {
  const target = normalize(title);

  return Array.from(document.querySelectorAll<HTMLElement>('.control-group')).find((group) => {
    const heading = group.querySelector('h2');
    return normalize(heading?.textContent) === target;
  });
};

const setSelectValue = (groupTitle: string, index: number, value: string) => {
  const group = findControlGroup(groupTitle);
  const select = group?.querySelectorAll<HTMLSelectElement>('select').item(index);
  if (!select || select.value === value) return;
  setNativeValue(select, value);
};

const findLabel = (needle: string) => {
  const target = normalize(needle);
  return Array.from(document.querySelectorAll<HTMLLabelElement>('label')).find((label) => normalize(label.textContent).includes(target));
};

const setCheckbox = (labelText: string, checked: boolean) => {
  const input = findLabel(labelText)?.querySelector<HTMLInputElement>('input[type="checkbox"]');
  if (!input || input.checked === checked) return;
  setNativeChecked(input, checked);
};

const setRange = (labelText: string, value: number) => {
  const input = findLabel(labelText)?.querySelector<HTMLInputElement>('input[type="range"]');
  if (!input) return;
  setNativeValue(input, value.toFixed(2));
};

const updateStageCleanupState = () => {
  document.querySelectorAll<HTMLElement>('.stage-badge, .stage-notice').forEach((element) => {
    element.setAttribute('aria-hidden', 'true');
    element.hidden = true;
    element.style.display = 'none';
  });
};

const setCircuitCathedralScope = (active: boolean) => {
  if (active) {
    document.body.dataset.infinitylensScene = ACTIVE_SCENE;
    return;
  }

  if (document.body.dataset.infinitylensScene === ACTIVE_SCENE) {
    delete document.body.dataset.infinitylensScene;
  }
};

const isCircuitCathedralButton = (button: HTMLButtonElement) => {
  return normalize(button.querySelector('strong')?.textContent) === 'circuit cathedral';
};

const isButtonSelected = (button: HTMLButtonElement) => {
  const state = normalize(`${button.className} ${button.getAttribute('aria-pressed')} ${button.getAttribute('aria-current')}`);
  return state.includes('active') || state.includes('selected') || state.includes('true') || state.includes('page');
};

const isCircuitCathedralSelected = () => {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('button')).some((button) => {
    return isCircuitCathedralButton(button) && isButtonSelected(button);
  });
};

const applyCircuitCathedralIdentity = () => {
  if (!isCircuitCathedralSelected()) {
    setCircuitCathedralScope(false);
    return;
  }

  retuneInProgress = true;
  setCircuitCathedralScope(true);

  try {
    setSelectValue('Visual mode', 0, 'kaleido-trip');
    setSelectValue('Visual mode', 1, 'abyss-cyan');
    setCheckbox('Audio reactive', true);
    setCheckbox('Phi spiral', false);
    setCheckbox('3-6-9 grid', true);
    setCheckbox('Equation overlay', true);
    setRange('Audio speed / drive', 0.10);
    setRange('Response', 0.26);
    setRange('Bass impact', 0.18);
    setRange('Mids motion', 0.38);
    setRange('High sparkle', 0.30);
    setRange('Beat punch', 0.14);
    setRange('Fold pressure', 0.16);
    setRange('Glow', 0.26);
  } finally {
    window.setTimeout(() => {
      retuneInProgress = false;
      scheduleSceneSync();
    }, 120);
  }

  window.dispatchEvent(new CustomEvent('infinitylens369:visual-cleanup-applied', {
    detail: { scene: 'Circuit Cathedral', identity: 'darker-architectural-retune' },
  }));
};

const syncCircuitCathedralScope = () => {
  updateStageCleanupState();

  if (isCircuitCathedralSelected()) {
    if (!circuitRetuneAppliedForSelection) {
      circuitRetuneAppliedForSelection = true;
      window.setTimeout(applyCircuitCathedralIdentity, CIRCUIT_RETUNE_DELAY_MS);
      return;
    }

    setCircuitCathedralScope(true);
    return;
  }

  circuitRetuneAppliedForSelection = false;
  setCircuitCathedralScope(false);
};

const scheduleSceneSync = () => {
  if (scheduledSceneSync !== undefined) window.clearTimeout(scheduledSceneSync);
  scheduledSceneSync = window.setTimeout(() => {
    scheduledSceneSync = undefined;
    syncCircuitCathedralScope();
  }, 120);
};

const wireButton = (button: HTMLButtonElement) => {
  if (button.dataset.visualCleanupWired === 'true') return;

  button.dataset.visualCleanupWired = 'true';
  button.addEventListener('click', scheduleSceneSync);
};

const wireControl = (control: HTMLInputElement | HTMLSelectElement) => {
  if (control.dataset.visualCleanupWired === 'true') return;

  control.dataset.visualCleanupWired = 'true';
  control.addEventListener('change', () => {
    if (!retuneInProgress) scheduleSceneSync();
  });
};

const wireControls = () => {
  document.querySelectorAll<HTMLButtonElement>('button').forEach(wireButton);
  document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select').forEach(wireControl);
};

const bootstrap = () => {
  updateStageCleanupState();
  wireControls();
  syncCircuitCathedralScope();

  const root = document.getElementById('root');
  if (!root) return;

  const observer = new MutationObserver(() => {
    updateStageCleanupState();
    wireControls();
    scheduleSceneSync();
  });

  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed', 'aria-current'] });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
