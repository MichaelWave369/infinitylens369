/**
 * MBL Visual Bridge v1 (presentation commands only).
 * Strict sender check: a direct iframe child of the actual public MBL Pages path.
 * No audio, personal data, file operations, or arbitrary code execution.
 */
export const MBL_BRIDGE_CHANNEL = 'mbl-infinitylens-v1';
export const MBL_BRIDGE_VERSION = 1;
export const MBL_MODES = [
  'mandelbrot', 'julia', 'acid-melt', 'tunnel-bloom',
  'kaleido-trip', 'pixel-melt', 'cosmic-drift', 'black-hole-lens',
] as const;
export const MBL_PALETTES = ['violet-gold-duality', 'solar-ember', 'abyss-cyan', 'aurora-phi'] as const;
export const MBL_ACTIONS = ['mode', 'palette', 'safe', 'reset'] as const;

export type MblBridgeAction = typeof MBL_ACTIONS[number];
export type MblBridgeCommand = {
  channel: typeof MBL_BRIDGE_CHANNEL;
  kind: 'command';
  requestId: string;
  action: MblBridgeAction;
  value?: string;
};

export function trustedMblParentOrigin(referrer: string): string | null {
  try {
    const url = new URL(referrer);
    if (url.origin !== 'https://michaelwave369.github.io') return null;
    if (url.pathname !== '/MoreBounceLabs' && !url.pathname.startsWith('/MoreBounceLabs/')) return null;
    return url.origin;
  } catch { return null; }
}

export function isMblBridgeHello(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const value = data as Record<string, unknown>;
  return value.channel === MBL_BRIDGE_CHANNEL && value.kind === 'hello' && value.version === MBL_BRIDGE_VERSION;
}

export function isMblBridgeCommand(data: unknown): data is MblBridgeCommand {
  if (!data || typeof data !== 'object') return false;
  const value = data as Record<string, unknown>;
  if (value.channel !== MBL_BRIDGE_CHANNEL || value.kind !== 'command') return false;
  if (typeof value.requestId !== 'string' || !/^mbl-[0-9]{1,12}$/.test(value.requestId)) return false;
  if (value.action === 'mode') return MBL_MODES.includes(value.value as typeof MBL_MODES[number]);
  if (value.action === 'palette') return MBL_PALETTES.includes(value.value as typeof MBL_PALETTES[number]);
  return (value.action === 'safe' || value.action === 'reset') && value.value === undefined;
}
