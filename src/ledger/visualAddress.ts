import type { CameraState, VisualAddress, VisualSettings } from '../types';

export const buildVisualAddress = (
  settings: VisualSettings,
  camera: CameraState,
  audioTime: number,
): VisualAddress => {
  const overlays = [
    settings.showPhi ? 'phi' : null,
    settings.showGrid369 ? '369' : null,
    settings.showEquations ? 'equations' : null,
  ].filter(Boolean) as string[];

  return {
    protocol: 'INFINITYLENS369://scene',
    mode: settings.mode,
    center: [camera.centerX, camera.centerY],
    zoom: camera.zoom,
    rotation: camera.rotation,
    palette: settings.palette,
    overlays,
    audioMode: settings.audioReactive ? 'bass-reactive' : 'static',
    time: audioTime,
    createdAt: new Date().toISOString(),
  };
};

export const formatVisualAddress = (address: VisualAddress): string => {
  const params = new URLSearchParams({
    mode: address.mode,
    center: `${address.center[0]},${address.center[1]}`,
    zoom: address.zoom.toExponential(6),
    rotation: address.rotation.toFixed(6),
    palette: address.palette,
    overlays: address.overlays.join(','),
    audio: address.audioMode,
    time: address.time.toFixed(3),
    createdAt: address.createdAt,
  });

  return `${address.protocol}?${params.toString()}`;
};

export const downloadTextFile = (filename: string, text: string) => {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
