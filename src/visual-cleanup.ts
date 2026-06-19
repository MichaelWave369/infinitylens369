const CIRCUIT_RETUNE_DELAY_MS = 360;

let initialCircuitRetuneApplied = false;

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

const applyCircuitCathedralIdentity = () => {
  document.body.dataset.infinitylensScene = 'circuit-cathedral-retuned';

  setSelectValue('Visual mode', 0, 'kaleido-trip');
  setSelectValue('Visual mode', 1, 'abyss-cyan');
  setCheckbox('Audio reactive', true);
  setCheckbox('Phi spiral', false);
  setCheckbox('3-6-9 grid', true);
  setCheckbox('Equation overlay', true);
  setRange('Audio speed / drive', 0.18);
  setRange('Response', 0.34);
  setRange('Bass impact', 0.32);
  setRange('Mids motion', 0.78);
  setRange('High sparkle', 0.68);
  setRange('Beat punch', 0.22);
  setRange('Fold pressure', 0.26);
  setRange('Glow', 0.46);

  window.dispatchEvent(new CustomEvent('infinitylens369:visual-cleanup-applied', {
    detail: { scene: 'Circuit Cathedral', identity: 'retuned' },
  }));
};

const shouldRetuneCurrentStage = () => {
  const stageBadge = normalize(document.querySelector<HTMLElement>('.stage-badge')?.textContent);
  if (stageBadge.includes('circuit cathedral')) return true;

  return Array.from(document.querySelectorAll<HTMLButtonElement>('button')).some((button) => {
    const strong = normalize(button.querySelector('strong')?.textContent);
    if (strong !== 'circuit cathedral') return false;

    const state = normalize(`${button.className} ${button.getAttribute('aria-pressed')} ${button.getAttribute('aria-current')}`);
    return state.includes('active') || state.includes('selected') || state.includes('true') || state.includes('page');
  });
};

const applyCurrentSceneIfNeeded = () => {
  if (initialCircuitRetuneApplied || !shouldRetuneCurrentStage()) return;
  initialCircuitRetuneApplied = true;
  window.setTimeout(applyCircuitCathedralIdentity, CIRCUIT_RETUNE_DELAY_MS);
};

const wireCircuitCathedralButton = (button: HTMLButtonElement) => {
  if (button.dataset.visualCleanupWired === 'true') return;
  const strong = normalize(button.querySelector('strong')?.textContent);
  if (strong !== 'circuit cathedral') return;

  button.dataset.visualCleanupWired = 'true';
  button.addEventListener('click', () => {
    window.setTimeout(applyCircuitCathedralIdentity, CIRCUIT_RETUNE_DELAY_MS);
  });
};

const wireButtons = () => {
  document.querySelectorAll<HTMLButtonElement>('button').forEach(wireCircuitCathedralButton);
};

const bootstrap = () => {
  updateStageCleanupState();
  wireButtons();
  applyCurrentSceneIfNeeded();

  const root = document.getElementById('root');
  if (!root) return;

  const observer = new MutationObserver(() => {
    updateStageCleanupState();
    wireButtons();
    applyCurrentSceneIfNeeded();
  });

  observer.observe(root, { childList: true, subtree: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  window.setTimeout(bootstrap, 0);
}

export {};
